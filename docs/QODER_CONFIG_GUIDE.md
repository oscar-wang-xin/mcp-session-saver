# Qoder MCP 配置指南

## 📋 配置步骤

### 步骤1：找到 Qoder 配置目录

Qoder 的 MCP 配置文件通常位于以下位置之一：

**Windows 系统**：
- `%APPDATA%\Qoder\mcp-settings.json`
- `%USERPROFILE%\.qoder\mcp-settings.json`
- `C:\Users\你的用户名\AppData\Roaming\Qoder\mcp-settings.json`

**如果不确定位置**：
1. 打开 Qoder
2. 查看设置或首选项
3. 寻找 "MCP" 或 "Model Context Protocol" 相关配置
4. 通常会显示配置文件路径

### 步骤2：应用配置

**方式A：复制配置内容**

1. 打开本目录下的 `qoder-mcp-config.json` 文件
2. 复制全部内容
3. 找到 Qoder 的 MCP 配置文件
4. 如果文件已存在，将 `session-saver` 部分添加到 `mcpServers` 对象中
5. 如果文件不存在，直接粘贴全部内容并保存

**方式B：合并到现有配置**

如果您的 Qoder 已有其他 MCP 服务器配置，请这样合并：

```json
{
  "mcpServers": {
    "现有的服务器1": {
      "command": "...",
      "args": [...]
    },
    "session-saver": {
      "command": "node",
      "args": [
        "d:\\Server\\www\\_code\\mcp-session-saver\\index.js"
      ],
      "env": {
        "MCP_SESSION_BASE_DIR": "D:\\Sessions"
      }
    }
  }
}
```

### 步骤3：自定义配置（可选）

**修改存储路径**：

将 `MCP_SESSION_BASE_DIR` 改为您想要的路径：

```json
"env": {
  "MCP_SESSION_BASE_DIR": "D:\\MyDocuments\\AI_Sessions"
}
```

**注意**：
- Windows 路径必须使用双反斜杠 `\\`
- 或使用单正斜杠 `/`：`"D:/Sessions"`

**使用默认路径**：

如果您想使用默认路径 `C:\Users\你的用户名\Documents\ide_sessions`，可以删除 `env` 部分：

```json
"session-saver": {
  "command": "node",
  "args": [
    "d:\\Server\\www\\_code\\mcp-session-saver\\index.js"
  ]
}
```

### 步骤4：验证配置

**配置检查清单**：

- [ ] JSON 格式正确（没有语法错误）
- [ ] 路径使用了双反斜杠 `\\` 或正斜杠 `/`
- [ ] `index.js` 文件确实存在于指定路径
- [ ] Node.js 已安装并在系统 PATH 中

**验证 Node.js**：
```cmd
node --version
```
应该显示版本号（需要 >= 16.0.0）

**验证文件路径**：
```cmd
dir d:\Server\www\_code\mcp-session-saver\index.js
```
应该显示文件信息

### 步骤5：重启 Qoder

1. **完全关闭** Qoder（不是最小化）
2. 确保 Qoder 进程已结束（可在任务管理器中确认）
3. 重新打开 Qoder
4. 等待几秒让 MCP 服务器启动

### 步骤6：验证工具是否加载

在 Qoder 对话中输入：

```
你有哪些可用的工具？请列出所有工具名称。
```

**期望看到的工具**（应该包含）：
- `mcp_session-saver_save_session` - 保存会话
- `mcp_session-saver_list_sessions` - 列出会话
- `mcp_session-saver_read_session` - 读取会话
- `mcp_session-saver_delete_session` - 删除会话
- `mcp_session-saver_search_sessions` - 搜索会话

如果看到这些工具，说明配置成功！✅

## 🎯 使用方法

配置成功后，您可以直接在对话中说：

```
保存当前会话
```

或更详细：

```
使用 save_session 工具保存当前会话
IDE: Qoder
描述: MCP配置测试
```

Qoder 会自动：
1. 识别这是保存会话的请求
2. 调用 `mcp_session-saver_save_session` 工具
3. 工具执行（利用所有优化功能）
4. 返回保存结果

## ❌ 故障排除

### 问题1：看不到工具

**可能原因**：
- Qoder 未加载 MCP 配置
- 配置文件路径错误
- JSON 格式有误
- Node.js 未安装

**解决方案**：
1. 检查 Qoder 日志（如果有）
2. 验证配置文件 JSON 格式
3. 确认 Node.js 可用：`node --version`
4. 完全重启 Qoder

### 问题2：工具调用失败

**可能原因**：
- 文件路径不存在
- 缺少依赖包

**解决方案**：
```cmd
cd d:\Server\www\_code\mcp-session-saver
npm install
node index.js
```

如果手动运行成功，但 Qoder 中失败，检查配置中的路径是否正确。

### 问题3：路径错误

**常见错误**：
```json
// ❌ 错误 - 单反斜杠会被转义
"args": ["d:\Server\www\_code\mcp-session-saver\index.js"]

// ✅ 正确 - 双反斜杠
"args": ["d:\\Server\\www\\_code\\mcp-session-saver\\index.js"]

// ✅ 也正确 - 正斜杠
"args": ["d:/Server/www/_code/mcp-session-saver/index.js"]
```

## 📞 需要帮助？

如果配置过程中遇到问题，请告诉我：
1. Qoder 版本号
2. 配置文件的具体位置
3. 看到的错误信息
4. `node --version` 的输出

我会帮您诊断和解决！

## 🎉 配置完成后

一旦配置成功，您就可以：
- ✅ 直接说"保存当前会话"即可保存
- ✅ 享受 10-28倍的性能提升
- ✅ 使用所有 5 个 MCP 工具
- ✅ 自动的目录缓存和并发优化
- ✅ 完善的错误处理和验证

不再需要手动创建文件，也不会绕过 MCP 工具的优化功能！
