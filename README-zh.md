# 🎉 MCP Session Saver

[English](README.md) | [简体中文](README-zh.md)

一个可以保存会话记录的MCP服务，会话内容能够保存到指定目录下，按照**IDE名称、日期、会话描述**存储为Markdown文件。

## ✨ 主要功能

- 📝 **保存会话记录** - 将 AI 对话保存为 Markdown 文件
- 📁 **智能组织** - 按 IDE/日期/描述自动分类
- 🔍 **会话管理** - 读取、搜索、删除会话
- 🌐 **多 IDE 支持** - 兼容 Qoder、Cursor、Claude Desktop、Windsurf、Trae、Codebuddy、Lingma、Continue、Aider 等

## 🚀 快速开始

### 方式1：使用 npx（推荐）

无需安装，直接在 IDE 的 MCP 配置中添加：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"]
    }
  }
}
```

### 方式2：全局安装

```bash
npm install -g mcp-session-saver
```

MCP 配置：
```json
{
  "mcpServers": {
    "session-saver": {
      "command": "mcp-session-saver"
    }
  }
}
```

### 方式3：本地安装

```bash
npm install mcp-session-saver
```

## 📁 自定义存储路径（可选）

在 MCP 配置中添加环境变量：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "D:\\MyProjects\\sessions"
      }
    }
  }
}
```

## 🎯 使用方法

配置完成后，在 IDE 中直接说：

```
保存当前会话
列出所有会话
搜索会话内容
```

## 📚 详细文档

- [**快速配置工具**](tools/) - 一键配置脚本
- [**详细使用指南**](docs/USAGE.md) - 完整使用说明
- [**多 IDE 配置**](docs/MULTI_IDE_SETUP.md) - Cursor、Claude 等 IDE 配置
- [**Qoder 配置**](docs/QODER_CONFIG_GUIDE.md) - Qoder 专用指南

## 🛠️ 技术栈

- JavaScript (ES Module)
- @modelcontextprotocol/sdk
- Node.js >= 16.0.0

## 📝 License

MIT

## 👏 贡献

欢迎提交 Issues 和 Pull Requests！
