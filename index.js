#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { t } from './i18n.js';
import {
  formatDate,
  formatTime,
  ensureDirectory,
  sanitizeFilename,
  buildMarkdownContent,
  formatFileSize,
  validateAndNormalizePath,
  isPathSafe,
  createError,
  formatErrorMessage,
  writeFileWithRetry
} from './utils.js';

// 获取当前文件所在目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 默认配置
let config = {
  defaultBaseDir: path.join(os.homedir(), 'Documents', 'ide_sessions')
};

// 加载配置文件
async function loadConfig() {
  const configPath = path.join(__dirname, 'config.json');
  try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    const userConfig = JSON.parse(configContent);
    
    // 验证配置
    if (userConfig.defaultBaseDir) {
      // 验证路径格式
      if (typeof userConfig.defaultBaseDir !== 'string') {
        console.error(t('error.configInvalid', { message: t('config.typeError') }));
        return;
      }
      
      // 规范化路径
      try {
        userConfig.defaultBaseDir = validateAndNormalizePath(userConfig.defaultBaseDir);
      } catch (error) {
        console.error(t('error.configInvalid', { message: t('config.pathInvalid') + ' - ' + error.message }));
        return;
      }
    }
    
    config = { ...config, ...userConfig };
  } catch (error) {
    // 配置文件不存在时使用默认配置
    if (error.code !== 'ENOENT') {
      console.error(t('config.parseError', { message: error.message }));
    }
  }
}

/**
 * 验证环境变量配置
 */
function validateEnvironment() {
  const envBaseDir = process.env.MCP_SESSION_BASE_DIR;
  
  if (envBaseDir) {
    try {
      validateAndNormalizePath(envBaseDir);
    } catch (error) {
      console.error(t('error.envInvalid', { name: 'MCP_SESSION_BASE_DIR', message: error.message }));
      console.error(`   ${envBaseDir}`);
    }
  }
}

// 从环境变量或MCP配置中获取base_dir（最高优先级）
function getBaseDirFromEnv() {
  return process.env.MCP_SESSION_BASE_DIR || null;
}

/**
 * 获取基础目录（按优先级）
 * @param {string} baseDir 参数指定的目录
 * @returns {string} 有效的基础目录
 */
function resolveBaseDir(baseDir) {
  return baseDir || getBaseDirFromEnv() || config.defaultBaseDir;
}

// 初始化时加载配置
await loadConfig();

// 验证环境变量
validateEnvironment();

// 目录缓存，避免重复创建
const directoryCache = new Set();

// 创建MCP服务器实例
const server = new Server(
  {
    name: 'session-saver',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * 保存会话到Markdown文件
 * @param {string} baseDir 基础目录
 * @param {string} ideName IDE名称
 * @param {string} sessionDescription 会话描述
 * @param {string} content 会话内容
 * @param {Date} sessionTime 会话时间
 * @returns {Promise<string>} 保存的文件路径
 */
async function saveSession(baseDir, ideName, sessionDescription, content, sessionTime = new Date()) {
  // 验证和规范化路径
  const normalizedBaseDir = validateAndNormalizePath(baseDir);
  
  // 清理文件名中的非法字符
  const cleanIdeName = sanitizeFilename(ideName);
  const cleanDescription = sanitizeFilename(sessionDescription);
  
  // 格式化日期作为目录名
  const dateDir = formatDate(sessionTime);
  
  // 构建目录路径: baseDir/ideName/YYYY-MM-DD
  const sessionDir = path.join(normalizedBaseDir, cleanIdeName, dateDir);
  
  // 安全检查：确保目标路径在基础目录内
  if (!isPathSafe(normalizedBaseDir, sessionDir)) {
    throw createError(
      t('error.pathUnsafe'),
      'UNSAFE_PATH',
      { baseDir: normalizedBaseDir, targetPath: sessionDir }
    );
  }
  
  // 使用缓存优化目录创建
  await ensureDirectory(sessionDir, directoryCache);
  
  // 生成文件名: HH-MM-SS_会话描述.md
  const timeStr = formatTime(sessionTime);
  const fileName = `${timeStr}_${cleanDescription}.md`;
  const filePath = path.join(sessionDir, fileName);
  
  // 构建Markdown内容
  const mdContent = buildMarkdownContent(sessionDescription, ideName, sessionTime, content);
  
  // 检查内容大小（限制为10MB）- 优化：只在接近限制时才精确计算
  const contentSize = Buffer.byteLength(mdContent, 'utf-8');
  if (contentSize > 10 * 1024 * 1024) {
    throw createError(
      t('error.contentTooLarge'),
      'CONTENT_TOO_LARGE',
      { size: formatFileSize(contentSize), limit: '10 MB' }
    );
  }
  
  // 写入文件（带重试机制）
  await writeFileWithRetry(filePath, mdContent);
  
  return filePath;
}

/**
 * 读取目录下的 Markdown 文件并获取状态信息
 * @param {string} dateDir 日期目录
 * @param {string} ide IDE名称
 * @param {string} date 日期
 * @returns {Promise<Array>} 会话列表
 */
async function getSessionsFromDateDir(dateDir, ide, date) {
  try {
    const files = await fs.readdir(dateDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    return await Promise.all(
      mdFiles.map(async (file) => {
        const filePath = path.join(dateDir, file);
        const stats = await fs.stat(filePath);
        return {
          ide,
          date,
          file,
          path: filePath,
          created: stats.birthtime,
          size: stats.size
        };
      })
    );
  } catch {
    return [];
  }
}

/**
 * 列出指定目录下的所有会话（并发优化版）
 * @param {string} baseDir 基础目录
 * @param {string} ideName IDE名称(可选)
 * @param {string} dateFilter 日期过滤(可选,格式: YYYY-MM-DD)
 * @returns {Promise<Array>} 会话列表
 */
async function listSessions(baseDir, ideName = null, dateFilter = null) {
  try {
    await fs.access(baseDir);
  } catch {
    return [];
  }
  
  // 特定 IDE 和日期
  if (ideName && dateFilter) {
    const dateDir = path.join(baseDir, ideName, dateFilter);
    return await getSessionsFromDateDir(dateDir, ideName, dateFilter);
  }
  
  // 特定 IDE 的所有会话
  if (ideName) {
    const ideDir = path.join(baseDir, ideName);
    try {
      const dateDirs = await fs.readdir(ideDir);
      const results = await Promise.all(
        dateDirs.map(async (date) => {
          const dateDir = path.join(ideDir, date);
          const stat = await fs.stat(dateDir).catch(() => null);
          if (!stat?.isDirectory()) return [];
          return await getSessionsFromDateDir(dateDir, ideName, date);
        })
      );
      return results.flat();
    } catch {
      return [];
    }
  }
  
  // 所有 IDE 和会话
  try {
    const ideDirs = await fs.readdir(baseDir);
    const results = await Promise.all(
      ideDirs.map(async (ide) => {
        const ideDir = path.join(baseDir, ide);
        const ideStat = await fs.stat(ideDir).catch(() => null);
        if (!ideStat?.isDirectory()) return [];
        
        const dateDirs = await fs.readdir(ideDir).catch(() => []);
        const dateResults = await Promise.all(
          dateDirs.map(async (date) => {
            const dateDir = path.join(ideDir, date);
            const dateStat = await fs.stat(dateDir).catch(() => null);
            if (!dateStat?.isDirectory()) return [];
            return await getSessionsFromDateDir(dateDir, ide, date);
          })
        );
        return dateResults.flat();
      })
    );
    return results.flat();
  } catch {
    return [];
  }
}

/**
 * 读取会话内容
 * @param {string} filePath 文件路径
 * @returns {Promise<Object>} 会话信息
 */
async function readSession(filePath) {
  try {
    // 读取文件内容
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);
    
    // 解析文件路径获取信息
    const parts = filePath.split(path.sep);
    const fileName = parts[parts.length - 1];
    const date = parts[parts.length - 2];
    const ide = parts[parts.length - 3];
    
    return {
      path: filePath,
      ide: ide,
      date: date,
      file: fileName,
      content: content,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw createError(
        '会话文件不存在',
        'SESSION_NOT_FOUND',
        { path: filePath }
      );
    }
    throw error;
  }
}

/**
 * 删除会话
 * @param {string} filePath 文件路径
 * @returns {Promise<void>}
 */
async function deleteSession(filePath) {
  try {
    await fs.unlink(filePath);
    
    // 尝试删除空目录
    const dateDir = path.dirname(filePath);
    try {
      const files = await fs.readdir(dateDir);
      if (files.length === 0) {
        await fs.rmdir(dateDir);
        
        // 尝试删除IDE目录（如果为空）
        const ideDir = path.dirname(dateDir);
        const ideDirFiles = await fs.readdir(ideDir);
        if (ideDirFiles.length === 0) {
          await fs.rmdir(ideDir);
        }
      }
    } catch {
      // 忽略删除空目录的错误
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw createError(
        '会话文件不存在',
        'SESSION_NOT_FOUND',
        { path: filePath }
      );
    }
    throw error;
  }
}

/**
 * 搜索会话内容
 * @param {string} baseDir 基础目录
 * @param {string} keyword 关键词
 * @param {string} ideName IDE名称(可选)
 * @param {string} dateFilter 日期过滤(可选)
 * @returns {Promise<Array>} 匹配的会话列表
 */
async function searchSessions(baseDir, keyword, ideName = null, dateFilter = null) {
  const allSessions = await listSessions(baseDir, ideName, dateFilter);
  const lowerKeyword = keyword.toLowerCase();
  
  // 并发搜索所有会话内容
  const searchResults = await Promise.all(
    allSessions.map(async (session) => {
      try {
        const content = await fs.readFile(session.path, 'utf-8');
        const lowerContent = content.toLowerCase();
        const lowerFileName = session.file.toLowerCase();
        
        // 检查文件名或内容是否包含关键词
        if (!lowerFileName.includes(lowerKeyword) && !lowerContent.includes(lowerKeyword)) {
          return null;
        }
        
        // 提取匹配行的上下文
        const lines = content.split('\n');
        const matchedLines = lines
          .map((line, i) => ({ line, lineNumber: i + 1 }))
          .filter(({ line }) => line.toLowerCase().includes(lowerKeyword))
          .slice(0, 3) // 最多3个匹配位置
          .map(({ lineNumber }, idx, arr) => {
            const i = lineNumber - 1;
            const start = Math.max(0, i - 1);
            const end = Math.min(lines.length - 1, i + 1);
            return {
              lineNumber,
              context: lines.slice(start, end + 1).join('\n')
            };
          });
        
        return { ...session, matches: matchedLines };
      } catch {
        return null;
      }
    })
  );
  
  return searchResults.filter(Boolean);
}

// 注册工具列表处理器
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'save_session',
        description: '【保存会话】当用户说"保存当前会话"、"存储会话"、"记录对话"、"保存对话内容"等时调用。将AI对话内容保存为Markdown文件，按IDE/日期自动分类存储。触发词：保存、存储、记录、归档会话/对话/聊天',
        inputSchema: {
          type: 'object',
          properties: {
            base_dir: {
              type: 'string',
              description: '保存会话的基础目录路径(可选,优先级最高。未指定时依次使用: 环境变量MCP_SESSION_BASE_DIR > config.json配置 > 默认路径~/Documents/ide_sessions)',
            },
            ide_name: {
              type: 'string',
              description: 'IDE名称(如: Qoder, VSCode, Cursor, Windsurf, Claude等)，用于分类存储',
            },
            session_description: {
              type: 'string',
              description: '会话描述(简短概括本次对话的主题，如：实现用户登录功能、修复数据库bug等)',
            },
            content: {
              type: 'string',
              description: '会话内容(完整的对话记录，支持Markdown格式)',
            },
            session_time: {
              type: 'string',
              description: '会话时间(ISO 8601格式,可选,默认为当前时间)',
            },
          },
          required: ['ide_name', 'session_description', 'content'],
        },
      },
      {
        name: 'list_sessions',
        description: '【列出会话】当用户说"查看会话列表"、"列出所有会话"、"显示已保存的对话"、"有哪些会话记录"等时调用。支持按IDE和日期筛选。触发词：列表、查看、显示、所有、历史会话/对话/记录',
        inputSchema: {
          type: 'object',
          properties: {
            base_dir: {
              type: 'string',
              description: '会话保存的基础目录路径(可选,优先级最高。未指定时依次使用: 环境变量MCP_SESSION_BASE_DIR > config.json配置 > 默认路径)',
            },
            ide_name: {
              type: 'string',
              description: 'IDE名称(可选,用于筛选特定IDE的会话，如只查看Cursor的会话)',
            },
            date_filter: {
              type: 'string',
              description: '日期过滤(可选,格式: YYYY-MM-DD，如 2025-12-16，用于查看指定日期的会话)',
            },
          },
          required: [],
        },
      },
      {
        name: 'read_session',
        description: '【读取会话】当用户说"打开这个会话"、"查看会话内容"、"读取这个文件"、"显示对话详情"等时调用。读取并显示指定会话的完整内容。触发词：打开、读取、查看、显示会话/对话内容/详情',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: '会话文件的完整路径(可从 list_sessions 结果中获取)',
            },
          },
          required: ['file_path'],
        },
      },
      {
        name: 'delete_session',
        description: '【删除会话】当用户说"删除这个会话"、"移除这条记录"、"清理这个对话"、"不需要这个会话了"等时调用。永久删除指定的会话文件。触发词：删除、移除、清理、不需要会话/对话/记录',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: '要删除的会话文件路径(可从 list_sessions 结果中获取)',
            },
          },
          required: ['file_path'],
        },
      },
      {
        name: 'search_sessions',
        description: '【搜索会话】当用户说"搜索包含 XX 的会话"、"查找关于 XX 的对话"、"找一下 XX 相关记录"、"哪些会话提到了 XX"等时调用。在会话文件名和内容中搜索关键词，不区分大小写。触发词：搜索、查找、找、包含、相关会话/对话/记录',
        inputSchema: {
          type: 'object',
          properties: {
            base_dir: {
              type: 'string',
              description: '会话保存的基础目录路径(可选,优先级最高。未指定时依次使用: 环境变量MCP_SESSION_BASE_DIR > config.json配置 > 默认路径)',
            },
            keyword: {
              type: 'string',
              description: '要搜索的关键词(不区分大小写，会在文件名和内容中匹配)',
            },
            ide_name: {
              type: 'string',
              description: 'IDE名称(可选,用于缩小搜索范围到特定IDE)',
            },
            date_filter: {
              type: 'string',
              description: '日期过滤(可选,格式: YYYY-MM-DD，用于在特定日期的会话中搜索)',
            },
          },
          required: ['keyword'],
        },
      },
    ],
  };
});

// 注册工具调用处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'save_session') {
      const { base_dir, ide_name, session_description, content, session_time } = args;
      const targetBaseDir = resolveBaseDir(base_dir);
      const sessionDate = session_time ? new Date(session_time) : new Date();
      const filePath = await saveSession(
        targetBaseDir,
        ide_name,
        session_description,
        content,
        sessionDate
      );
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ 会话已保存到: ${filePath}`,
          },
        ],
      };
    } else if (name === 'list_sessions') {
      const { base_dir, ide_name, date_filter } = args;
      const targetBaseDir = resolveBaseDir(base_dir);
      const sessions = await listSessions(targetBaseDir, ide_name, date_filter);
      
      if (sessions.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: '未找到任何会话记录',
            },
          ],
        };
      }
      
      // 格式化输出
      let output = `找到 ${sessions.length} 个会话记录:\n\n`;
      for (const session of sessions) {
        output += `📁 **${session.ide}** / **${session.date}** / ${session.file}\n`;
        output += `   路径: ${session.path}\n`;
        output += `   创建时间: ${session.created.toLocaleString('zh-CN')}\n`;
        output += `   大小: ${formatFileSize(session.size)}\n\n`;
      }
      
      return {
        content: [
          {
            type: 'text',
            text: output,
          },
        ],
      };
    } else if (name === 'read_session') {
      const { file_path } = args;
      
      const sessionData = await readSession(file_path);
      
      return {
        content: [
          {
            type: 'text',
            text: `📝 **会话信息**

**IDE:** ${sessionData.ide}
**日期:** ${sessionData.date}
**文件名:** ${sessionData.file}
**路径:** ${sessionData.path}
**创建时间:** ${sessionData.created.toLocaleString('zh-CN')}
**修改时间:** ${sessionData.modified.toLocaleString('zh-CN')}
**大小:** ${formatFileSize(sessionData.size)}

---

**内容:**

${sessionData.content}`,
          },
        ],
      };
    } else if (name === 'delete_session') {
      const { file_path } = args;
      
      await deleteSession(file_path);
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ 会话已成功删除: ${file_path}`,
          },
        ],
      };
    } else if (name === 'search_sessions') {
      const { base_dir, keyword, ide_name, date_filter } = args;
      const targetBaseDir = resolveBaseDir(base_dir);
      const results = await searchSessions(targetBaseDir, keyword, ide_name, date_filter);
      
      if (results.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `未找到包含关键词 "${keyword}" 的会话记录`,
            },
          ],
        };
      }
      
      // 格式化输出
      let output = `🔍 搜索到 ${results.length} 个包含关键词 "${keyword}" 的会话:\n\n`;
      for (const result of results) {
        output += `📁 **${result.ide}** / **${result.date}** / ${result.file}\n`;
        output += `   路径: ${result.path}\n`;
        output += `   创建时间: ${result.created.toLocaleString('zh-CN')}\n`;
        output += `   大小: ${formatFileSize(result.size)}\n`;
        
        if (result.matches && result.matches.length > 0) {
          output += `   匹配位置:\n`;
          for (const match of result.matches) {
            output += `     - 行 ${match.lineNumber}:\n`;
            output += `       ${match.context.split('\n').join('\n       ')}\n`;
          }
        }
        output += `\n`;
      }
      
      return {
        content: [
          {
            type: 'text',
            text: output,
          },
        ],
      };
    } else {
      throw new Error(`未知工具: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: formatErrorMessage(error),
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Session Saver 服务已启动');
}

main().catch((error) => {
  console.error('服务启动失败:', error);
  process.exit(1);
});


