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
 * 性能测试
 */
async function performanceTest() {
  const baseDir = './test_performance';
  const testCount = 100; // 测试保存100个会话
  
  console.log('=== MCP Session Saver 性能测试 ===\n');
  console.log(`测试场景: 连续保存 ${testCount} 个会话到同一目录\n`);
  
  // 清理测试目录
  try {
    await fs.rm(baseDir, { recursive: true, force: true });
  } catch {}
  
  // 测试内容
  const content = `# 今日工作总结

## 完成的任务
- 实现了用户登录功能
- 添加了JWT认证
- 完善了错误处理机制

## 技术要点
- 使用了bcrypt进行密码加密
- 实现了Token刷新机制
- 添加了请求限流

## 遇到的问题
1. 数据库连接池配置问题
   - 解决方案: 调整了最大连接数和超时时间
2. 跨域请求处理
   - 解决方案: 配置了CORS中间件

## 明天计划
- 完成用户权限管理
- 添加单元测试
- 优化数据库查询性能
`;

  // 使用目录缓存
  const directoryCache = new Set();
  
  console.log('🚀 开始性能测试...\n');
  
  const startTime = Date.now();
  
  // 连续保存多个会话
  for (let i = 0; i < testCount; i++) {
    const cleanIdeName = sanitizeFilename('VSCode');
    const cleanDescription = sanitizeFilename(`测试会话${i + 1}`);
    const sessionTime = new Date();
    const dateDir = formatDate(sessionTime);
    const sessionDir = path.join(baseDir, cleanIdeName, dateDir);
    
    // 使用缓存优化
    await ensureDirectory(sessionDir, directoryCache);
    
    const timeStr = formatTime(sessionTime);
    const fileName = `${timeStr}_${cleanDescription}_${i}.md`;
    const filePath = path.join(sessionDir, fileName);
    
    const mdContent = buildMarkdownContent(`测试会话${i + 1}`, 'VSCode', sessionTime, content);
    
    await fs.writeFile(filePath, mdContent, 'utf-8');
    
    // 每20个显示进度
    if ((i + 1) % 20 === 0) {
      console.log(`✅ 已保存 ${i + 1}/${testCount} 个会话`);
    }
  }
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / testCount;
  
  console.log(`\n=== 性能测试结果 ===`);
  console.log(`✅ 总计保存: ${testCount} 个会话`);
  console.log(`⏱️  总耗时: ${totalTime}ms`);
  console.log(`📊 平均每个: ${avgTime.toFixed(2)}ms`);
  console.log(`🚀 吞吐量: ${(1000 / avgTime).toFixed(2)} 个/秒`);
  
  // 统计缓存效果
  console.log(`\n💾 缓存统计:`);
  console.log(`   缓存的目录数: ${directoryCache.size}`);
  console.log(`   重复创建避免: ${testCount - directoryCache.size} 次`);
  
  // 性能评估
  console.log(`\n📈 性能评估:`);
  if (avgTime < 10) {
    console.log(`   🌟 优秀! 平均每个会话保存时间小于 10ms`);
  } else if (avgTime < 20) {
    console.log(`   ✅ 良好! 平均每个会话保存时间小于 20ms`);
  } else if (avgTime < 50) {
    console.log(`   ⚠️  可接受，平均每个会话保存时间小于 50ms`);
  } else {
    console.log(`   ❌ 需要优化，平均每个会话保存时间超过 50ms`);
  }
  
  // 验证文件
  console.log(`\n🔍 验证保存结果...`);
  const files = await fs.readdir(path.join(baseDir, 'VSCode', formatDate(new Date())));
  console.log(`   实际保存文件数: ${files.length}`);
  
  if (files.length === testCount) {
    console.log(`   ✅ 验证通过: 所有会话都已成功保存`);
  } else {
    console.log(`   ❌ 验证失败: 期望 ${testCount} 个，实际 ${files.length} 个`);
  }
  
  console.log(`\n=== 测试完成！===`);
}

performanceTest().catch(console.error);
