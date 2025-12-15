import fs from 'fs/promises';
import path from 'path';

/**
 * 格式化日期为目录名
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 格式化时间为文件名前缀
 */
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${hours}-${minutes}-${seconds}`;
}

/**
 * 确保目录存在
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
 * 列出会话
 */
async function listSessions(baseDir) {
  const sessions = [];
  
  try {
    await fs.access(baseDir);
  } catch {
    return sessions;
  }
  
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
  
  return sessions;
}

/**
 * 测试
 */
async function test() {
  const baseDir = './test_sessions';
  
  console.log('=== MCP Session Saver 功能测试 ===\n');
  
  // 测试1: 保存VSCode会话
  console.log('测试1: 保存VSCode会话...');
  const file1 = await saveSession(
    baseDir,
    'VSCode',
    '实现用户登录功能',
    `# 今日工作总结

## 完成的任务
- 实现了用户登录功能
- 添加了JWT认证
- 完善了错误处理机制

## 技术要点
- 使用了bcrypt进行密码加密
- 实现了Token刷新机制
- 添加了请求限流`
  );
  console.log(`✅ 已保存到: ${file1}\n`);
  
  // 测试2: 保存Cursor会话
  console.log('测试2: 保存Cursor会话...');
  const file2 = await saveSession(
    baseDir,
    'Cursor',
    '优化数据库查询性能',
    `# AI辅助编程会话

## 问题
如何优化数据库查询性能？

## AI建议
1. 添加适当的索引
2. 使用查询缓存
3. 优化SQL语句
4. 考虑使用读写分离`,
    new Date('2025-12-15T10:30:00')
  );
  console.log(`✅ 已保存到: ${file2}\n`);
  
  // 测试3: 保存Windsurf会话
  console.log('测试3: 保存Windsurf会话...');
  const file3 = await saveSession(
    baseDir,
    'Windsurf',
    '用户模块代码审查',
    `# 代码审查记录

## 审查内容
- 用户模块代码
- API接口设计
- 数据库结构

## 发现的问题
1. 缺少参数验证
2. 错误处理不完善
3. 日志记录不足

## 改进建议
- 添加输入验证中间件
- 统一错误处理机制
- 完善日志记录`
  );
  console.log(`✅ 已保存到: ${file3}\n`);
  
  // 测试4: 列出所有会话
  console.log('测试4: 列出所有会话...');
  const sessions = await listSessions(baseDir);
  console.log(`找到 ${sessions.length} 个会话记录:\n`);
  
  for (const session of sessions) {
    console.log(`📁 ${session.ide} / ${session.date} / ${session.file}`);
    console.log(`   路径: ${session.path}`);
    console.log(`   创建时间: ${session.created.toLocaleString('zh-CN')}`);
    console.log(`   大小: ${session.size} 字节\n`);
  }
  
  console.log('=== 测试完成！===');
  console.log(`\n所有会话已保存到: ${path.resolve(baseDir)}`);
}

test().catch(console.error);
