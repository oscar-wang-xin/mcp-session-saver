import assert from 'assert';
import fs from 'fs/promises';
import path from 'path';
import {
  formatDate,
  formatTime,
  sanitizeFilename,
  validateAndNormalizePath,
  isPathSafe,
  limitFilenameLength,
  writeFileWithRetry,
  createError
} from '../utils.js';

/**
 * 边界情况和错误场景测试
 */
async function runEdgeCaseTests() {
  console.log('=== 边界情况测试 ===\n');
  
  let passed = 0;
  let failed = 0;
  
  // 测试 1: 超长文件名处理
  console.log('测试 1: 超长文件名处理...');
  try {
    const longName = 'a'.repeat(300) + '.md';
    const limited = limitFilenameLength(longName);
    assert.ok(limited.length <= 255, '文件名应被限制在255字符内');
    assert.ok(limited.endsWith('.md'), '应保留文件扩展名');
    console.log('✅ 超长文件名处理 通过');
    passed++;
  } catch (error) {
    console.log('❌ 超长文件名处理 失败:', error.message);
    failed++;
  }
  
  // 测试 2: 特殊字符文件名
  console.log('测试 2: 特殊字符文件名清理...');
  try {
    const specialChars = [
      'test<file>.md',
      'test:file.md',
      'test"file".md',
      'test/file.md',
      'test\\file.md',
      'test|file.md',
      'test?file.md',
      'test*file.md'
    ];
    
    for (const name of specialChars) {
      const sanitized = sanitizeFilename(name);
      assert.ok(!sanitized.match(/[<>:"/\\|?*]/), '不应包含非法字符');
    }
    console.log('✅ 特殊字符文件名清理 通过');
    passed++;
  } catch (error) {
    console.log('❌ 特殊字符文件名清理 失败:', error.message);
    failed++;
  }
  
  // 测试 3: 路径遍历攻击防护
  console.log('测试 3: 路径遍历攻击防护...');
  try {
    const dangerousPaths = [
      '../../../etc/passwd',
      '..\\..\\..\\windows\\system32',
      'normal/../../../danger',
    ];
    
    let blocked = 0;
    for (const badPath of dangerousPaths) {
      try {
        validateAndNormalizePath(badPath);
      } catch (error) {
        if (error.message.includes('路径遍历')) {
          blocked++;
        }
      }
    }
    
    assert.strictEqual(blocked, dangerousPaths.length, '应阻止所有路径遍历攻击');
    console.log('✅ 路径遍历攻击防护 通过');
    passed++;
  } catch (error) {
    console.log('❌ 路径遍历攻击防护 失败:', error.message);
    failed++;
  }
  
  // 测试 4: 空路径处理
  console.log('测试 4: 空路径处理...');
  try {
    let errorThrown = false;
    try {
      validateAndNormalizePath('');
    } catch (error) {
      if (error.message.includes('路径不能为空')) {
        errorThrown = true;
      }
    }
    
    assert.ok(errorThrown, '应拒绝空路径');
    console.log('✅ 空路径处理 通过');
    passed++;
  } catch (error) {
    console.log('❌ 空路径处理 失败:', error.message);
    failed++;
  }
  
  // 测试 5: 路径安全性检查
  console.log('测试 5: 路径安全性检查...');
  try {
    const basePath = 'D:\\test\\sessions';
    const safePath = 'D:\\test\\sessions\\subfolder';
    const unsafePath = 'D:\\other\\folder';
    const relativePath = 'D:\\test\\sessions\\..\\..\\other';
    
    assert.strictEqual(isPathSafe(basePath, safePath), true, '安全路径应通过');
    assert.strictEqual(isPathSafe(basePath, unsafePath), false, '不安全路径应被拒绝');
    assert.strictEqual(isPathSafe(basePath, relativePath), false, '相对路径逃逸应被拒绝');
    console.log('✅ 路径安全性检查 通过');
    passed++;
  } catch (error) {
    console.log('❌ 路径安全性检查 失败:', error.message);
    failed++;
  }
  
  // 测试 6: 日期边界值
  console.log('测试 6: 日期边界值处理...');
  try {
    const dates = [
      new Date('2000-01-01'),
      new Date('2099-12-31'),
      new Date('2024-02-29'), // 闰年
    ];
    
    for (const date of dates) {
      const formatted = formatDate(date);
      assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(formatted), '日期格式应正确');
    }
    console.log('✅ 日期边界值处理 通过');
    passed++;
  } catch (error) {
    console.log('❌ 日期边界值处理 失败:', error.message);
    failed++;
  }
  
  // 测试 7: 空文件名处理
  console.log('测试 7: 空文件名处理...');
  try {
    const emptyName = sanitizeFilename('');
    assert.strictEqual(emptyName, '', '空文件名应返回空字符串');
    console.log('✅ 空文件名处理 通过');
    passed++;
  } catch (error) {
    console.log('❌ 空文件名处理 失败:', error.message);
    failed++;
  }
  
  // 测试 8: Unicode 字符处理
  console.log('测试 8: Unicode 字符处理...');
  try {
    const unicodeNames = [
      '测试文件.md',
      '日本語ファイル.md',
      'файл.md',
      '😀emoji😀.md'
    ];
    
    for (const name of unicodeNames) {
      const sanitized = sanitizeFilename(name);
      assert.ok(sanitized.length > 0, 'Unicode字符应被保留');
    }
    console.log('✅ Unicode 字符处理 通过');
    passed++;
  } catch (error) {
    console.log('❌ Unicode 字符处理 失败:', error.message);
    failed++;
  }
  
  // 测试 9: 错误对象创建
  console.log('测试 9: 错误对象创建...');
  try {
    const error = createError('测试错误', 'TEST_ERROR', { key: 'value' });
    assert.strictEqual(error.message, '测试错误');
    assert.strictEqual(error.code, 'TEST_ERROR');
    assert.deepStrictEqual(error.details, { key: 'value' });
    console.log('✅ 错误对象创建 通过');
    passed++;
  } catch (error) {
    console.log('❌ 错误对象创建 失败:', error.message);
    failed++;
  }
  
  // 测试 10: 文件写入重试（模拟）
  console.log('测试 10: 文件写入重试机制...');
  try {
    const testDir = './test_edge_cases';
    const testFile = path.join(testDir, 'retry_test.txt');
    
    // 确保目录存在
    await fs.mkdir(testDir, { recursive: true });
    
    // 测试正常写入
    await writeFileWithRetry(testFile, '测试内容');
    const content = await fs.readFile(testFile, 'utf-8');
    assert.strictEqual(content, '测试内容', '内容应正确写入');
    
    // 清理
    await fs.unlink(testFile);
    await fs.rmdir(testDir);
    
    console.log('✅ 文件写入重试机制 通过');
    passed++;
  } catch (error) {
    console.log('❌ 文件写入重试机制 失败:', error.message);
    failed++;
  }
  
  // 测试总结
  console.log('\n=== 边界情况测试总结 ===');
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`总计: ${passed + failed}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runEdgeCaseTests().catch(console.error);
