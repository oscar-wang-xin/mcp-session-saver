import assert from 'assert';
import {
  formatDate,
  formatTime,
  sanitizeFilename,
  validateAndNormalizePath,
  isPathSafe,
  formatFileSize,
  createError,
  formatErrorMessage,
  limitFilenameLength
} from '../utils.js';

/**
 * 单元测试
 */
async function runTests() {
  console.log('=== 运行单元测试 ===\n');
  
  let passed = 0;
  let failed = 0;
  
  // 测试 formatDate
  console.log('测试 formatDate...');
  try {
    const date = new Date('2025-12-16T10:30:00');
    const result = formatDate(date);
    assert.strictEqual(result, '2025-12-16');
    console.log('✅ formatDate 通过');
    passed++;
  } catch (error) {
    console.log('❌ formatDate 失败:', error.message);
    failed++;
  }
  
  // 测试 formatTime
  console.log('测试 formatTime...');
  try {
    const date = new Date('2025-12-16T10:30:45');
    const result = formatTime(date);
    assert.strictEqual(result, '10-30-45');
    console.log('✅ formatTime 通过');
    passed++;
  } catch (error) {
    console.log('❌ formatTime 失败:', error.message);
    failed++;
  }
  
  // 测试 sanitizeFilename
  console.log('测试 sanitizeFilename...');
  try {
    const filename = 'test<>:"/\\|?*file.md';
    const result = sanitizeFilename(filename);
    assert.strictEqual(result, 'test_________file.md');
    console.log('✅ sanitizeFilename 通过');
    passed++;
  } catch (error) {
    console.log('❌ sanitizeFilename 失败:', error.message);
    failed++;
  }
  
  // 测试 validateAndNormalizePath - 正常路径
  console.log('测试 validateAndNormalizePath (正常路径)...');
  try {
    const path = './test/path';
    const result = validateAndNormalizePath(path);
    assert.ok(result);
    console.log('✅ validateAndNormalizePath (正常路径) 通过');
    passed++;
  } catch (error) {
    console.log('❌ validateAndNormalizePath (正常路径) 失败:', error.message);
    failed++;
  }
  
  // 测试 validateAndNormalizePath - 路径遍历
  console.log('测试 validateAndNormalizePath (路径遍历)...');
  try {
    const path = '../../../etc/passwd';
    validateAndNormalizePath(path);
    console.log('❌ validateAndNormalizePath (路径遍历) 失败: 应该抛出错误');
    failed++;
  } catch (error) {
    if (error.message.includes('路径遍历')) {
      console.log('✅ validateAndNormalizePath (路径遍历) 通过');
      passed++;
    } else {
      console.log('❌ validateAndNormalizePath (路径遍历) 失败: 错误消息不正确');
      failed++;
    }
  }
  
  // 测试 isPathSafe
  console.log('测试 isPathSafe...');
  try {
    const basePath = 'D:\\test\\base';
    const safePath = 'D:\\test\\base\\subfolder';
    const unsafePath = 'D:\\test\\other';
    
    assert.strictEqual(isPathSafe(basePath, safePath), true);
    assert.strictEqual(isPathSafe(basePath, unsafePath), false);
    console.log('✅ isPathSafe 通过');
    passed++;
  } catch (error) {
    console.log('❌ isPathSafe 失败:', error.message);
    failed++;
  }
  
  // 测试 formatFileSize
  console.log('测试 formatFileSize...');
  try {
    assert.strictEqual(formatFileSize(0), '0 Bytes');
    assert.strictEqual(formatFileSize(1024), '1 KB');
    assert.strictEqual(formatFileSize(1024 * 1024), '1 MB');
    assert.strictEqual(formatFileSize(1024 * 1024 * 1024), '1 GB');
    console.log('✅ formatFileSize 通过');
    passed++;
  } catch (error) {
    console.log('❌ formatFileSize 失败:', error.message);
    failed++;
  }
  
  // 测试 limitFilenameLength
  console.log('测试 limitFilenameLength...');
  try {
    const shortName = 'short.md';
    const longName = 'a'.repeat(300) + '.md';
    
    assert.strictEqual(limitFilenameLength(shortName), shortName);
    assert.ok(limitFilenameLength(longName).length <= 255);
    assert.ok(limitFilenameLength(longName).endsWith('.md'));
    console.log('✅ limitFilenameLength 通过');
    passed++;
  } catch (error) {
    console.log('❌ limitFilenameLength 失败:', error.message);
    failed++;
  }
  
  // 测试 createError
  console.log('测试 createError...');
  try {
    const error = createError('测试错误', 'TEST_ERROR', { key: 'value' });
    assert.strictEqual(error.message, '测试错误');
    assert.strictEqual(error.code, 'TEST_ERROR');
    assert.deepStrictEqual(error.details, { key: 'value' });
    console.log('✅ createError 通过');
    passed++;
  } catch (error) {
    console.log('❌ createError 失败:', error.message);
    failed++;
  }
  
  // 测试 formatErrorMessage
  console.log('测试 formatErrorMessage...');
  try {
    const error = new Error('文件不存在');
    error.code = 'ENOENT';
    error.details = { path: '/test/path' };
    
    const message = formatErrorMessage(error);
    // 国际化后，直接返回翻译后的消息
    assert.ok(message.length > 0, '应该返回错误消息');
    console.log('✅ formatErrorMessage 通过');
    passed++;
  } catch (error) {
    console.log('❌ formatErrorMessage 失败:', error.message);
    failed++;
  }
  
  // 测试总结
  console.log('\n=== 测试总结 ===');
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`总计: ${passed + failed}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(console.error);
