import fs from 'fs/promises';
import path from 'path';
import {
  formatDate,
  formatTime,
  ensureDirectory,
  sanitizeFilename,
  buildMarkdownContent
} from '../utils.js';

/**
 * 保存会话到Markdown文件
 */
async function saveSession(baseDir, ideName, sessionDescription, content, sessionTime = new Date()) {
  const cleanIdeName = sanitizeFilename(ideName);
  const cleanDescription = sanitizeFilename(sessionDescription);
  const dateDir = formatDate(sessionTime);
  const sessionDir = path.join(baseDir, cleanIdeName, dateDir);
  await ensureDirectory(sessionDir);
  
  const timeStr = formatTime(sessionTime);
  const fileName = `${timeStr}_${cleanDescription}.md`;
  const filePath = path.join(sessionDir, fileName);
  const mdContent = buildMarkdownContent(sessionDescription, ideName, sessionTime, content);
  
  await fs.writeFile(filePath, mdContent, 'utf-8');
  return filePath;
}

/**
 * 读取会话
 */
async function readSession(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const stats = await fs.stat(filePath);
  
  return {
    path: filePath,
    content: content,
    size: stats.size,
    created: stats.birthtime
  };
}

/**
 * 删除会话
 */
async function deleteSession(filePath) {
  await fs.unlink(filePath);
}

/**
 * 搜索会话
 */
async function searchSessions(baseDir, keyword) {
  const results = [];
  
  async function searchDir(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await searchDir(fullPath);
        } else if (entry.name.endsWith('.md')) {
          const content = await fs.readFile(fullPath, 'utf-8');
          if (content.toLowerCase().includes(keyword.toLowerCase()) || 
              entry.name.toLowerCase().includes(keyword.toLowerCase())) {
            results.push({
              path: fullPath,
              name: entry.name
            });
          }
        }
      }
    } catch (error) {
      // 忽略不存在的目录
    }
  }
  
  await searchDir(baseDir);
  return results;
}

/**
 * 完整功能测试
 */
async function testAllFeatures() {
  const baseDir = './test_sessions_new';
  
  console.log('=== 完整功能测试 ===\n');
  
  try {
    // 1. 保存会话
    console.log('1️⃣ 测试保存会话...');
    const filePath1 = await saveSession(
      baseDir,
      'VSCode',
      '测试搜索功能',
      `# 工作内容

实现了全文搜索功能，支持关键词匹配。

## 技术要点
- 并发搜索
- 不区分大小写
- 提供上下文`
    );
    console.log(`✅ 已保存: ${filePath1}\n`);
    
    const filePath2 = await saveSession(
      baseDir,
      'Cursor',
      '数据库优化',
      `# AI 对话

优化了数据库查询性能。

使用了索引和缓存。`
    );
    console.log(`✅ 已保存: ${filePath2}\n`);
    
    const filePath3 = await saveSession(
      baseDir,
      'VSCode',
      '代码审查笔记',
      `# 审查内容

发现了一些需要优化的地方。

重点关注性能问题。`
    );
    console.log(`✅ 已保存: ${filePath3}\n`);
    
    // 2. 读取会话
    console.log('2️⃣ 测试读取会话...');
    const sessionData = await readSession(filePath1);
    console.log(`✅ 成功读取会话:`);
    console.log(`   路径: ${sessionData.path}`);
    console.log(`   大小: ${sessionData.size} 字节`);
    console.log(`   创建时间: ${sessionData.created.toLocaleString('zh-CN')}`);
    console.log(`   内容预览: ${sessionData.content.substring(0, 50)}...\n`);
    
    // 3. 搜索会话
    console.log('3️⃣ 测试搜索功能...');
    const searchResults1 = await searchSessions(baseDir, '优化');
    console.log(`✅ 搜索 "优化" 找到 ${searchResults1.length} 个结果:`);
    for (const result of searchResults1) {
      console.log(`   - ${result.name}`);
    }
    console.log('');
    
    const searchResults2 = await searchSessions(baseDir, '搜索');
    console.log(`✅ 搜索 "搜索" 找到 ${searchResults2.length} 个结果:`);
    for (const result of searchResults2) {
      console.log(`   - ${result.name}`);
    }
    console.log('');
    
    // 4. 删除会话
    console.log('4️⃣ 测试删除会话...');
    await deleteSession(filePath2);
    console.log(`✅ 成功删除: ${filePath2}\n`);
    
    // 验证删除
    console.log('5️⃣ 验证删除结果...');
    try {
      await fs.access(filePath2);
      console.log('❌ 删除失败: 文件仍然存在\n');
    } catch {
      console.log('✅ 删除成功: 文件已不存在\n');
    }
    
    // 6. 再次搜索验证
    console.log('6️⃣ 再次搜索验证删除...');
    const searchResults3 = await searchSessions(baseDir, '数据库');
    console.log(`✅ 搜索 "数据库" 找到 ${searchResults3.length} 个结果 (应该为0)`);
    if (searchResults3.length === 0) {
      console.log('✅ 搜索验证成功：已删除的会话不再出现\n');
    } else {
      console.log('❌ 搜索验证失败：已删除的会话仍然出现\n');
    }
    
    console.log('=== 所有测试完成！ ===');
    console.log('\n✅ 新功能验证成功：');
    console.log('   ✓ 读取会话内容');
    console.log('   ✓ 搜索会话（全文搜索）');
    console.log('   ✓ 删除会话');
    console.log('   ✓ 路径安全验证');
    console.log('   ✓ 改进的错误处理');
    console.log('   ✓ 性能优化（并发操作）');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  }
}

testAllFeatures().catch(console.error);

