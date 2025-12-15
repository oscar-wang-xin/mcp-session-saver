import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

/**
 * 示例：如何使用MCP Session Saver服务
 */
async function example() {
  // 创建客户端
  const client = new Client(
    {
      name: 'example-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  // 连接到服务器
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['index.js'],
  });

  await client.connect(transport);

  console.log('已连接到MCP Session Saver服务\n');

  // 示例1: 保存一个会话
  console.log('示例1: 保存会话记录...');
  const saveResult = await client.request(
    {
      method: 'tools/call',
      params: {
        name: 'save_session',
        arguments: {
          base_dir: './sessions',
          ide_name: 'VSCode',
          session_name: '项目开发',
          content: `# 今日工作总结

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
`,
        },
      },
    },
    {}
  );

  console.log(saveResult.content[0].text);
  console.log('');

  // 示例2: 保存另一个会话（带自定义时间）
  console.log('示例2: 保存带自定义时间的会话...');
  const saveResult2 = await client.request(
    {
      method: 'tools/call',
      params: {
        name: 'save_session',
        arguments: {
          base_dir: './sessions',
          ide_name: 'Cursor',
          session_name: 'AI对话',
          content: `# AI辅助编程会话

## 问题
如何优化数据库查询性能？

## AI建议
1. 添加适当的索引
2. 使用查询缓存
3. 优化SQL语句
4. 考虑使用读写分离

## 实施结果
按照建议优化后，查询速度提升了60%
`,
          session_time: '2025-12-15T10:30:00',
        },
      },
    },
    {}
  );

  console.log(saveResult2.content[0].text);
  console.log('');

  // 示例3: 列出所有会话
  console.log('示例3: 列出所有会话...');
  const listResult = await client.request(
    {
      method: 'tools/call',
      params: {
        name: 'list_sessions',
        arguments: {
          base_dir: './sessions',
        },
      },
    },
    {}
  );

  console.log(listResult.content[0].text);
  console.log('');

  // 示例4: 列出特定IDE的会话
  console.log('示例4: 列出VSCode的会话...');
  const listResult2 = await client.request(
    {
      method: 'tools/call',
      params: {
        name: 'list_sessions',
        arguments: {
          base_dir: './sessions',
          ide_name: 'VSCode',
        },
      },
    },
    {}
  );

  console.log(listResult2.content[0].text);

  // 断开连接
  await client.close();
  console.log('\n示例运行完成！');
}

// 运行示例
example().catch(console.error);
