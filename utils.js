import fs from 'fs/promises';
import path from 'path';
import { t } from './i18n.js';

/**
 * 带重试机制的文件写入
 * @param {string} filePath 文件路径
 * @param {string} content 内容
 * @param {number} maxRetries 最大重试次数
 * @param {number} retryDelay 重试延迟(毫秒)
 * @returns {Promise<void>}
 */
export async function writeFileWithRetry(filePath, content, maxRetries = 3, retryDelay = 100) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await fs.writeFile(filePath, content, 'utf-8');
      return; // 成功写入，直接返回
    } catch (error) {
      lastError = error;
      
      // 如果是最后一次尝试，直接抛出错误
      if (attempt === maxRetries) {
        throw createError(
          t('error.fileWriteFailed', { retries: maxRetries }),
          'FILE_WRITE_FAILED',
          { path: filePath, originalError: error.message }
        );
      }
      
      // 对于某些错误，不需要重试
      if (error.code === 'EACCES' || error.code === 'EPERM') {
        throw error; // 权限错误，重试无意义
      }
      
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }
}

/**
 * 格式化日期为目录名
 * @param {Date} date 
 * @returns {string} YYYY-MM-DD 格式
 */
export function formatDate(date) {
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
export function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${hours}-${minutes}-${seconds}`;
}

/**
 * 确保目录存在（支持缓存）
 * @param {string} dirPath 
 * @param {Set} cache 可选的目录缓存
 */
export async function ensureDirectory(dirPath, cache = null) {
  // 如果使用缓存且目录已存在于缓存中，直接返回
  if (cache?.has(dirPath)) return;
  
  try {
    await fs.mkdir(dirPath, { recursive: true });
    cache?.add(dirPath);
  } catch (error) {
    // 即使 EEXIST 错误，也添加到缓存
    if (error.code === 'EEXIST') {
      cache?.add(dirPath);
    } else {
      throw error;
    }
  }
}

/**
 * 清理文件名中的非法字符
 * @param {string} filename 
 * @returns {string}
 */
export function sanitizeFilename(filename) {
  return filename.replace(/[<>:"/\\|?*]/g, '_');
}

/**
 * 验证路径安全性，防止路径遍历攻击
 * @param {string} basePath 基础路径
 * @param {string} targetPath 目标路径
 * @returns {boolean} 是否安全
 */
export function isPathSafe(basePath, targetPath) {
  const resolvedBase = path.resolve(basePath);
  const resolvedTarget = path.resolve(targetPath);
  return resolvedTarget.startsWith(resolvedBase);
}

/**
 * 验证并规范化路径（优化版）
 * @param {string} inputPath 
 * @returns {string} 规范化后的路径
 * @throws {Error} 如果路径包含非法字符
 */
export function validateAndNormalizePath(inputPath) {
  if (!inputPath) {
    throw new Error(t('error.pathRequired'));
  }
  
  // 快速检查：先检查常见的危险字符
  if (inputPath.includes('..')) {
    throw new Error(t('error.pathTraversal'));
  }
  
  // 规范化路径（只在需要时）
  return path.normalize(inputPath);
}

/**
 * 检查磁盘空间
 * @param {string} dirPath 
 * @param {number} requiredBytes 需要的字节数
 * @returns {Promise<boolean>} 是否有足够空间
 */
export async function checkDiskSpace(dirPath, requiredBytes = 1024 * 1024) {
  try {
    // 注意：这是一个简化实现，实际生产环境可能需要使用 check-disk-space 等库
    // 这里我们通过尝试写入来检查
    const testFile = path.join(dirPath, '.disk_check_temp');
    await fs.writeFile(testFile, 'test');
    await fs.unlink(testFile);
    return true;
  } catch (error) {
    if (error.code === 'ENOSPC') {
      return false;
    }
    return true; // 其他错误不影响空间检查
  }
}

/**
 * 限制文件名长度
 * @param {string} filename 
 * @param {number} maxLength 最大长度（默认255，大多数文件系统的限制）
 * @returns {string}
 */
export function limitFilenameLength(filename, maxLength = 255) {
  if (filename.length <= maxLength) return filename;
  
  const ext = path.extname(filename);
  const nameWithoutExt = filename.slice(0, -ext.length);
  const maxNameLength = maxLength - ext.length - 3; // 3 for '...'
  
  return nameWithoutExt.slice(0, maxNameLength) + '...' + ext;
}

/**
 * 构建 Markdown 会话内容（国际化版本）
 * @param {string} sessionDescription 会话描述
 * @param {string} ideName IDE名称
 * @param {Date} sessionTime 会话时间
 * @param {string} content 内容
 * @returns {string} Markdown 格式的内容
 */
export function buildMarkdownContent(sessionDescription, ideName, sessionTime, content) {
  // 使用数组拼接，对于大文本更高效
  const parts = [
    `# ${sessionDescription}\n\n`,
    `**${t('markdown.ide')}:** ${ideName}\n`,
    `**${t('markdown.date')}:** ${formatDate(sessionTime)}\n`,
    `**${t('markdown.time')}:** ${sessionTime.toLocaleString()}\n\n`,
    `---\n\n`,
    content
  ];
  
  return parts.join('');
}

/**
 * 格式化文件大小
 * @param {number} bytes 
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  
  return `${Math.round(value * 100) / 100} ${sizes[i]}`;
}

/**
 * 创建详细的错误对象
 * @param {string} message 错误消息
 * @param {string} code 错误代码
 * @param {Object} details 详细信息
 * @returns {Error}
 */
export function createError(message, code, details = {}) {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  return error;
}

/**
 * 格式化错误消息（国际化版本）
 * @param {Error} error 
 * @returns {string}
 */
export function formatErrorMessage(error) {
  const errorMap = {
    'ENOENT': t('error.fileNotFound'),
    'EACCES': t('error.permissionDenied'),
    'EPERM': t('error.permissionDenied'),
    'ENOSPC': t('error.diskFull'),
    'EEXIST': t('error.fileNotFound'),
    'EISDIR': t('error.fileNotFound'),
    'ENOTDIR': t('error.fileNotFound'),
    'EMFILE': t('error.unknown', { message: error.message }),
  };
  
  let message = t('error.unknown', { message: error.message });
  
  if (error.code && errorMap[error.code]) {
    message = errorMap[error.code];
  }
  
  if (error.details) {
    const detailsStr = Object.entries(error.details)
      .map(([key, value]) => `   - ${key}: ${value}`)
      .join('\n');
    if (detailsStr) {
      message += `\n\ud83d\udccb ${t('list.details') || 'Details'}:\n${detailsStr}`;
    }
  }
  
  return message;
}
