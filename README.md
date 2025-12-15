# 🎉 MCP Session Saver

一个可以保存会话记录的MCP服务，会话内容能够保存到指定目录下，按照**IDE名称、日期、会话描述**存储为Markdown文件。

## ✨ 主要功能

- 📝 **保存会话记录** - 将 AI 对话保存为 Markdown 文件
- 📁 **智能组织** - 按 IDE/日期/描述自动分类
- 🔍 **会话列表** - 支持按 IDE 和日期筛选查看
- 🌐 **多 IDE 支持** - 兼容 Qoder、Claude、Cursor、Windsurf、Trae、Codebuddy 等支持mcp服务的ide

## 📦 安装使用
### 通过 npm 安装
```bash
npm install mcp-session-saver
# 或全局安装
npm install -g mcp-session-saver
# 或直接使用 npx（无需安装）
npx mcp-session-saver
```

## 📝 MCP客户端设置
运行npm安装后，在你的 AI IDE 配置文件中添加：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "mcp-session-saver"
    }
  }
}
```

#### 或者使用 npx（无需npm安装）

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["mcp-session-saver"]
    }
  }
}
```

## 📁 修改会话存储位置

#### 方法1：使用配置文件配置

在安装的npm包根目录创建 `config.json` 文件，配置默认会话保存路径：

**Windows:**
```json
{
  "defaultBaseDir": "D:\\Users\\YourName\\Documents\\ide_sessions"
}
```

**macOS:**
```json
{
  "defaultBaseDir": "/Users/yourname/Documents/ide_sessions"
}
```

**Linux:**
```json
{
  "defaultBaseDir": "/home/yourname/Documents/ide_sessions"
}
```

**也可以使用快捷路径（macOS/Linux）:**
```json
{
  "defaultBaseDir": "~/Documents/ide_sessions"
}
```

**注意事项：**
- ✅ Windows 路径需要使用双反斜杠 `\\` 转义
- ✅ macOS/Linux 使用正斜杠 `/`
- ✅ macOS/Linux 可以使用 `~` 代表用户主目录


#### 方法2：在MCP配置文件中设置

增加环境变量`MCP_SESSION_BASE_DIR`,设置默认会话保存目录。例如：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "mcp-session-saver",
      "env": {
        "MCP_SESSION_BASE_DIR": "D:\\Administrator\\Documents\\ide_sessions"
      }
    }
  }
}
```

其中：
- **MCP_SESSION_BASE_DIR** 用于指定会话保存的基础目录
- 如果同时传入 `base_dir` 参数，则以 `base_dir` 为准
- 如果未配置环境变量且没有 `config.json`，则使用默认路径 `~/Documents/ide_sessions`
- 生效优先级是 `base_dir`参数 > MCP_SESSION_BASE_IDR > config.json > 默认路径~/Documents/ide_sessions



## 🎯 使用方法
确认启动了MCP服务后，直接在IDE会话中输入相应指令：
```bash
> 存储当前会话 / 列出已保存会话 / 列出所有会话 / 列出cursor会话 ...
```

## 📚 文档
- [README.md](README.md) - 项目说明
- [USAGE.md](USAGE.md) - 详细使用指南
- [npm 包](https://www.npmjs.com/package/mcp-session-saver) - npm 主页

## 🛠️ 技术栈
- JavaScript (ES Module)
- @modelcontextprotocol/sdk
- Node.js >= 16.0.0

## 📊 包信息
- 包名: mcp-session-saver
- License: MIT

## 🙏 反馈与贡献
欢迎提交 Issues 和 Pull Requests！
完整更新日志请查看 CHANGELOG
