# 🎉 MCP Session Saver

[English](README.md) | [简体中文](README-zh.md)

An MCP service for saving session records. Session content can be saved to a specified directory and stored as Markdown files organized by **IDE name, date, and session description**.

## ✨ Key Features

- 📝 **Save Session Records** - Save AI conversations as Markdown files
- 📁 **Smart Organization** - Automatically categorized by IDE/date/description
- 🔍 **Session Management** - Read, search, and delete sessions
- 🌐 **Multi-IDE Support** - Compatible with Qoder, Cursor, Claude Desktop, Windsurf, Trae, Codebuddy, Lingma, Continue, Aider, and more

## 🚀 Quick Start

### Method 1: Using npx (Recommended)

No installation required. Simply add to your IDE's MCP configuration:

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

### Method 2: Global Installation

```bash
npm install -g mcp-session-saver
```

MCP Configuration:
```json
{
  "mcpServers": {
    "session-saver": {
      "command": "mcp-session-saver"
    }
  }
}
```

### Method 3: Local Installation

```bash
npm install mcp-session-saver
```

## 📁 Custom Storage Path (Optional)

Add environment variable in MCP configuration:

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

## 🎯 How to Use

After configuration, simply say in your IDE:

```
Save current session
List all sessions
Search session content
```

## 📚 Documentation

- [**Quick Setup Tools**](tools/) - One-click configuration scripts
- [**Detailed Usage Guide**](docs/USAGE.md) - Complete usage instructions
- [**Multi-IDE Setup**](docs/MULTI_IDE_SETUP.md) - Configuration for Cursor, Claude, and other IDEs
- [**Qoder Configuration**](docs/QODER_CONFIG_GUIDE.md) - Qoder-specific guide
- [**Internationalization**](docs/I18N.md) - Multi-language support guide

## 🛠️ Tech Stack

- JavaScript (ES Module)
- @modelcontextprotocol/sdk
- Node.js >= 16.0.0

## 📝 License

MIT

## 👏 Contributing

Issues and Pull Requests are welcome!
