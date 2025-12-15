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
    config = { ...config, ...userConfig };
  } catch (error) {
    // 配置文件不存在时使用默认配置
  }
}

// 从环境变量或MCP配置中获取base_dir（最高优先级）
function getBaseDirFromEnv() {
  return process.env.MCP_SESSION_BASE_DIR || null;
}

// 初始化时加载配置
await loadConfig();

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
 * 格式化日期为目录名
 * @param {Date} date 
 * @returns {string} YYYY-MM-DD 格式
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 格式化时间为文件名前缀
 * @param {Date} date 
 * @returns {string} HH-MM-SS 格式
 */
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${hours}-${minutes}-${seconds}`;
}

/**
 * 确保目录存在
 * @param {string} dirPath 
 */
async function ensureDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

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
  // 清理文件名中的非法字符
  const cleanIdeName = ideName.replace(/[<>:"/\\|?*]/g, '_');
  const cleanDescription = sessionDescription.replace(/[<>:"/\\|?*]/g, '_');
  
  // 格式化日期作为目录名
  const dateDir = formatDate(sessionTime);
  
  // 构建目录路径: baseDir/ideName/YYYY-MM-DD
  const sessionDir = path.join(baseDir, cleanIdeName, dateDir);
  await ensureDirectory(sessionDir);
  
  // 生成文件名: HH-MM-SS_会话描述.md
  const timeStr = formatTime(sessionTime);
  const fileName = `${timeStr}_${cleanDescription}.md`;
  const filePath = path.join(sessionDir, fileName);
  
  // 构建Markdown内容
  const mdContent = `# ${sessionDescription}

**IDE:** ${ideName}  
**日期:** ${formatDate(sessionTime)}  
**时间:** ${sessionTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

---

${content}
`;
  
  // 写入文件
  await fs.writeFile(filePath, mdContent, 'utf-8');
  
  return filePath;
}

/**
 * 列出指定目录下的所有会话
 * @param {string} baseDir 基础目录
 * @param {string} ideName IDE名称(可选)
 * @param {string} dateFilter 日期过滤(可选,格式: YYYY-MM-DD)
 * @returns {Promise<Array>} 会话列表
 */
async function listSessions(baseDir, ideName = null, dateFilter = null) {
  const sessions = [];
  
  try {
    // 检查基础目录是否存在
    await fs.access(baseDir);
  } catch {
    return sessions;
  }
  
  if (ideName && dateFilter) {
    // 列出特定IDE和日期的所有会话
    const dateDir = path.join(baseDir, ideName, dateFilter);
    try {
      const files = await fs.readdir(dateDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(dateDir, file);
          const stats = await fs.stat(filePath);
          sessions.push({
            ide: ideName,
            date: dateFilter,
            file: file,
            path: filePath,
            created: stats.birthtime,
            size: stats.size
          });
        }
      }
    } catch {
      return sessions;
    }
  } else if (ideName) {
    // 列出特定IDE下的所有会话
    const ideDir = path.join(baseDir, ideName);
    try {
      const dateDirs = await fs.readdir(ideDir);
      for (const date of dateDirs) {
        const dateDir = path.join(ideDir, date);
        const stat = await fs.stat(dateDir);
        if (stat.isDirectory()) {
          const files = await fs.readdir(dateDir);
          for (const file of files) {
            if (file.endsWith('.md')) {
              const filePath = path.join(dateDir, file);
              const stats = await fs.stat(filePath);
              sessions.push({
                ide: ideName,
                date: date,
                file: file,
                path: filePath,
                created: stats.birthtime,
                size: stats.size
              });
            }
          }
        }
      }
    } catch {
      return sessions;
    }
  } else {
    // 列出所有IDE和会话
    try {
      const ideDirs = await fs.readdir(baseDir);
      for (const ide of ideDirs) {
        const ideDir = path.join(baseDir, ide);
        const ideStat = await fs.stat(ideDir);
        if (ideStat.isDirectory()) {
          const dateDirs = await fs.readdir(ideDir);
          for (const date of dateDirs) {
            const dateDir = path.join(ideDir, date);
            const dateStat = await fs.stat(dateDir);
            if (dateStat.isDirectory()) {
              const files = await fs.readdir(dateDir);
              for (const file of files) {
                if (file.endsWith('.md')) {
                  const filePath = path.join(dateDir, file);
                  const stats = await fs.stat(filePath);
                  sessions.push({
                    ide: ide,
                    date: date,
                    file: file,
                    path: filePath,
                    created: stats.birthtime,
                    size: stats.size
                  });
                }
              }
            }
          }
        }
      }
    } catch {
      return sessions;
    }
  }
  
  return sessions;
}

// 注册工具列表处理器
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'save_session',
        description: '保存会话记录到指定目录，按照IDE名称、日期、会话描述组织为Markdown文件。路径优先级：base_dir参数 > 环境变量MCP_SESSION_BASE_DIR > config.json > 默认路径',
        inputSchema: {
          type: 'object',
          properties: {
            base_dir: {
              type: 'string',
              description: '保存会话的基础目录路径(可选,优先级最高。未指定时依次使用: 环境变量MCP_SESSION_BASE_DIR > config.json配置 > 默认路径~/Documents/ide_sessions)',
            },
            ide_name: {
              type: 'string',
              description: 'IDE名称(如: VSCode, Cursor, Windsurf等)',
            },
            session_description: {
              type: 'string',
              description: '会话描述(简短描述会话内容)',
            },
            content: {
              type: 'string',
              description: '会话内容(Markdown格式)',
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
        description: '列出已保存的会话记录。路径优先级：base_dir参数 > 环境变量MCP_SESSION_BASE_DIR > config.json > 默认路径',
        inputSchema: {
          type: 'object',
          properties: {
            base_dir: {
              type: 'string',
              description: '会话保存的基础目录路径(可选,优先级最高。未指定时依次使用: 环境变量MCP_SESSION_BASE_DIR > config.json配置 > 默认路径)',
            },
            ide_name: {
              type: 'string',
              description: 'IDE名称(可选,用于筛选)',
            },
            date_filter: {
              type: 'string',
              description: '日期过滤(可选,格式: YYYY-MM-DD)',
            },
          },
          required: [],
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
      
      // 优先级：参数 > 环境变量 > config.json > 默认路径
      const targetBaseDir = base_dir || getBaseDirFromEnv() || config.defaultBaseDir;
      
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
      
      // 优先级：参数 > 环境变量 > config.json > 默认路径
      const targetBaseDir = base_dir || getBaseDirFromEnv() || config.defaultBaseDir;
      
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
        output += `   大小: ${session.size} 字节\n\n`;
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
          text: `❌ 错误: ${error.message}`,
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
