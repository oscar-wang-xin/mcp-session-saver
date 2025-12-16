# 测试文件

本目录包含 MCP Session Saver 的所有测试文件。

## 测试文件列表

### test.js
基础功能测试，验证核心功能是否正常工作。

```bash
npm test
# 或
node test/test.js
```

### test-unit.js
单元测试，测试所有工具函数。

```bash
npm run test:unit
# 或
node test/test-unit.js
```

测试覆盖：
- formatDate
- formatTime
- sanitizeFilename
- validateAndNormalizePath
- isPathSafe
- formatFileSize
- limitFilenameLength
- createError
- formatErrorMessage

### test-integration.js
集成测试，测试完整的工作流程。

```bash
npm run test:integration
# 或
node test/test-integration.js
```

测试覆盖：
- 保存会话
- 读取会话
- 搜索会话
- 删除会话

### test-performance.js
性能测试，测试批量操作的性能。

```bash
npm run test:performance
# 或
node test/test-performance.js
```

测试场景：
- 连续保存 100 个会话
- 目录缓存效果
- 吞吐量测试

### test-mcp-connection.js
MCP 连接测试，验证 MCP 服务器是否正常运行。

```bash
npm run test:mcp
# 或
node test/test-mcp-connection.js
```

### example.js
使用示例，展示如何通过代码调用 MCP 工具。

```bash
node test/example.js
```

## 运行所有测试

```bash
# 基础测试
npm test

# 单元测试
npm run test:unit

# 集成测试
npm run test:integration

# 性能测试
npm run test:performance

# MCP 连接测试
npm run test:mcp
```

## 测试结果

所有测试应该都通过 ✅

如果测试失败，请检查：
1. Node.js 版本 >= 16.0.0
2. 已安装所有依赖 (`npm install`)
3. 文件路径正确
4. 有足够的磁盘空间
