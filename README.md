# MCP Session Saver

一个可以保存会话记录的MCP服务，会话内容能够保存到指定目录下，按照**IDE名称、日期、会话描述**存储为Markdown文件。

## 功能特性

- ✅ 保存会话记录到Markdown文件
- ✅ 按IDE名称、日期、会话描述自动组织目录结构
- ✅ 支持列出已保存的会话记录
- ✅ 自动清理文件名中的非法字符
- ✅ 支持自定义会话时间

## 目录结构

保存的会话文件按以下结构组织：

```
base_dir/
  ├── VSCode/
  │   ├── 2025-12-15/
  │   │   ├── 10-30-00_实现用户登录功能.md
  │   │   └── 14-20-15_修复用户注册Bug.md
  │   └── 2025-12-16/
  │       └── 09-00-00_代码审查总结.md
  └── Cursor/
      └── 2025-12-15/
          ├── 08-30-00_优化数据库查询.md
          └── 15-20-00_AI辅助代码生成.md
```

## 安装

```bash
npm install
```

## 快速测试

运行测试脚本来验证功能：

```bash
npm test
```

这将创建示例会话并展示保存和列表功能。

## 配置

在你的MCP客户端配置文件中添加此服务：

### Claude Desktop 配置

编辑配置文件（Windows: `%APPDATA%\Claude\claude_desktop_config.json`）：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "node",
      "args": ["d:\\Server\\www\\_code\\mcp_save_session\\index.js"]
    }
  }
}
```

### Cline/其他MCP客户端配置

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "node",
      "args": ["d:\\Server\\www\\_code\\mcp_save_session\\index.js"]
    }
  }
}
```

## 使用方法

### 1. 保存会话

```javascript
// 调用 save_session 工具
{
  "base_dir": "D:\\Administrator\\Documents\\ide_sessions",
  "ide_name": "VSCode",
  "session_description": "实现用户登录功能",
  "content": "# 今日工作\n\n- 完成了用户登录功能\n- 修复了3个bug\n- 代码审查"
}
```

可选参数：
- `session_time`: ISO 8601格式的时间字符串，如 "2025-12-15T10:30:00"

### 2. 列出会话

```javascript
// 列出所有会话
{
  "base_dir": "D:\\Administrator\\Documents\\ide_sessions"
}

// 列出特定IDE的会话
{
  "base_dir": "D:\\Administrator\\Documents\\ide_sessions",
  "ide_name": "VSCode"
}

// 列出特定日期的所有会话
{
  "base_dir": "D:\\Administrator\\Documents\\ide_sessions",
  "ide_name": "VSCode",
  "date_filter": "2025-12-15"
}
```

## 工具说明

### save_session

保存会话记录到Markdown文件。

**参数:**
- `base_dir` (必需): 保存会话的基础目录路径
- `ide_name` (必需): IDE名称（如: VSCode, Cursor, Windsurf等）
- `session_description` (必需): 会话描述（简短描述会话内容）
- `content` (必需): 会话内容（Markdown格式）
- `session_time` (可选): 会话时间（ISO 8601格式，默认为当前时间）

**返回:**
保存成功后返回文件路径。

### list_sessions

列出已保存的会话记录。

**参数:**
- `base_dir` (必需): 会话保存的基础目录路径
- `ide_name` (可选): IDE名称，用于筛选
- `date_filter` (可选): 日期筛选（格式: YYYY-MM-DD）

**返回:**
会话列表，包含IDE名称、日期、文件名、路径、创建时间和文件大小。

## 示例

### 保存一个VSCode的会话

```markdown
# 实现用户登录功能

**IDE:** VSCode  
**日期:** 2025-12-15  
**时间:** 2025/12/15 10:30:00

---

# 今日工作

## 完成内容
- 实现了用户登录功能
- 添加了JWT认证
- 完善了错误处理

## 遇到的问题
- 数据库连接池配置问题
- 跨域请求处理

## 解决方案
...
```

## 许可证

MIT

## 更多信息

详细的使用指南请查看 [USAGE.md](USAGE.md)

## 项目结构

```
mcp_save_session/
├── index.js              # MCP服务主程序
├── test.js               # 功能测试脚本
├── example.js            # 使用示例（需要MCP客户端）
├── package.json          # 项目配置
├── README.md             # 项目说明
├── USAGE.md              # 详细使用指南
├── config.example.json   # 配置示例
└── .gitignore            # Git忽略文件
```

## 特性亮点

- ✨ 自动组织目录结构（IDE/日期/会话描述）
- 🔒 自动清理文件名中的非法字符
- 📅 支持自定义会话时间
- 📝 生成格式化的Markdown文件
- 🔍 支持筛选和列出会话记录
- 🌐 完整支持中文路径和内容
- 🚀 简单易用的MCP工具接口
