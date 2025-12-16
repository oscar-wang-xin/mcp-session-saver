#!/usr/bin/env node

/**
 * MCP 连接测试脚本
 * 用于验证 MCP Session Saver 服务是否正常运行
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== MCP Session Saver 连接测试 ===\n');

// 启动 MCP 服务器
const serverPath = join(__dirname, 'index.js');
console.log(`📡 启动 MCP 服务器: ${serverPath}`);

const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let responseReceived = false;
let timeout;

// 设置超时
timeout = setTimeout(() => {
  if (!responseReceived) {
    console.log('\n❌ 测试失败: 服务器响应超时（10秒）');
    console.log('\n可能的原因:');
    console.log('  1. index.js 文件有错误');
    console.log('  2. 缺少依赖包，请运行: npm install');
    console.log('  3. Node.js 版本过低，需要 >= 16.0.0');
    server.kill();
    process.exit(1);
  }
}, 10000);

// 监听服务器输出
server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`\n📤 服务器输出:\n${output}`);
  
  // 检查是否是 MCP 初始化消息
  if (output.includes('"jsonrpc"') || output.includes('"method"')) {
    responseReceived = true;
    clearTimeout(timeout);
    
    console.log('✅ MCP 服务器响应正常！');
    console.log('\n测试结果:');
    console.log('  ✅ 服务器启动成功');
    console.log('  ✅ JSON-RPC 通信正常');
    console.log('  ✅ 可以被 MCP 客户端连接');
    
    console.log('\n下一步:');
    console.log('  1. 将 qoder-mcp-config.json 的内容添加到 Qoder 配置中');
    console.log('  2. 重启 Qoder');
    console.log('  3. 在 Qoder 中询问"你有哪些可用的工具？"');
    console.log('  4. 应该能看到 mcp_session-saver_* 系列工具');
    
    server.kill();
    process.exit(0);
  }
});

server.stderr.on('data', (data) => {
  const error = data.toString();
  console.log(`\n⚠️  服务器错误输出:\n${error}`);
});

server.on('error', (error) => {
  console.log(`\n❌ 启动失败: ${error.message}`);
  console.log('\n请检查:');
  console.log('  1. Node.js 是否已安装: node --version');
  console.log('  2. 是否在正确的目录: ' + __dirname);
  console.log('  3. index.js 文件是否存在');
  clearTimeout(timeout);
  process.exit(1);
});

server.on('close', (code) => {
  if (!responseReceived && code !== 0) {
    console.log(`\n❌ 服务器异常退出，退出码: ${code}`);
    clearTimeout(timeout);
    process.exit(1);
  }
});

// 发送初始化请求
setTimeout(() => {
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };
  
  console.log('\n📨 发送初始化请求...');
  server.stdin.write(JSON.stringify(initRequest) + '\n');
}, 1000);

console.log('\n⏳ 等待服务器响应...');
