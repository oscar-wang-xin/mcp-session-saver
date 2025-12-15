# 使用指南

## 概述

MCP Session Saver 是一个模型上下文协议（MCP）服务，用于将会话记录保存为Markdown文件。它会自动按照**IDE名称、日期、会话描述**组织文件结构。

### 新特性！

- ✨ **配置文件支持**: 通过 `config.json` 一次配置默认路径，多次使用无需重复指定
- ✨ **智能默认值**: 未配置时自动使用 `~/Documents/ide_sessions`
- ✨ **参数可选**: `base_dir` 参数变为可选，使用更简单

## 快速开始

### 安装依赖

```bash
cd d:\Server\www\_code\mcp_save_session
npm install
```

### 测试功能

运行测试脚本验证服务是否正常工作：

```bash
npm test
```

测试脚本会：
- 创建示例会话文件
- 保存3个测试会话（VSCode、Cursor、Windsurf）
- 列出所有保存的会话
- 显示详细的会话信息

**预期输出：**
```
=== MCP Session Saver 功能测试 ===

测试1: 保存VSCode会话...
✅ 已保存到: test_sessions\VSCode\2025-12-15\10-30-00_实现用户登录功能.md

测试2: 保存Cursor会话...
✅ 已保存到: test_sessions\Cursor\2025-12-15\10-30-00_优化数据库查询性能.md

测试3: 保存Windsurf会话...
✅ 已保存到: test_sessions\Windsurf\2025-12-15\14-20-00_用户模块代码审查.md

测试4: 列出所有会话...
找到 3 个会话记录:
...
```

### 配置默认保存路径（可选但推荐）

有三种方式可以配置默认保存路径，按优先级从高到低：

#### 方法1：在MCP配置文件中设置环境变量（推荐）

在MCP客户端的配置文件中，通过 `env` 字段设置环境变量 `MCP_SESSION_BASE_DIR`。

**Windows 系统：**
```json
{
  "mcpServers": {
    "session-saver": {
      "command": "node",
      "args": ["d:\\Server\\www\\_code\\mcp_save_session\\index.js"],
      "env": {
        "MCP_SESSION_BASE_DIR": "D:\\Users\\YourName\\Documents\\ide_sessions"
      }
    }
  }
}
```

**macOS 系统：**
```json
{
  "mcpServers": {
    "session-saver": {
      "command": "node",
      "args": ["/path/to/mcp_save_session/index.js"],
      "env": {
        "MCP_SESSION_BASE_DIR": "/Users/yourname/Documents/ide_sessions"
      }
    }
  }
}
```
或者使用快捷路径：
```json
{
  "mcpServers": {
    "session-saver": {
      "command": "node",
      "args": ["/path/to/mcp_save_session/index.js"],
      "env": {
        "MCP_SESSION_BASE_DIR": "~/Documents/ide_sessions"
      }
    }
  }
}
```

**Linux 系统：**
```json
{
  "mcpServers": {
    "session-saver": {
      "command": "node",
      "args": ["/path/to/mcp_save_session/index.js"],
      "env": {
        "MCP_SESSION_BASE_DIR": "/home/yourname/Documents/ide_sessions"
      }
    }
  }
}
```
或者使用快捷路径：
```json
{
  "mcpServers": {
    "session-saver": {
      "command": "node",
      "args": ["/path/to/mcp_save_session/index.js"],
      "env": {
        "MCP_SESSION_BASE_DIR": "~/Documents/ide_sessions"
      }
    }
  }
}
```

**此方法的优势：**
- ✅ 配置集中管理，与MCP服务配置在一起
- ✅ 优先级高于config.json
- ✅ 不需要单独创建config.json文件
- ✅ 重启MCP客户端后立即生效

#### 方法2：使用config.json配置文件

在项目根目录创建 `config.json` 文件来配置默认会话保存路径。

**步骤1: 创建配置文件**

在项目根目录下创建 `config.json`，根据操作系统选择相应格式：

**Windows 系统:**
```json
{
  "defaultBaseDir": "D:\\Users\\YourName\\Documents\\ide_sessions"
}
```
⚠️ **注意**: Windows 路径必须使用双反斜杠 `\\` 转义

**macOS 系统:**
```json
{
  "defaultBaseDir": "/Users/yourname/Documents/ide_sessions"
}
```
或者使用快捷路径：
```json
{
  "defaultBaseDir": "~/Documents/ide_sessions"
}
```

**Linux 系统:**
```json
{
  "defaultBaseDir": "/home/yourname/Documents/ide_sessions"
}
```
或者使用快捷路径：
```json
{
  "defaultBaseDir": "~/Documents/ide_sessions"
}
```

**此方法的优势：**
- ✅ 不依赖MCP客户端配置
- ✅ 可以独立管理
- ✅ 适合开发和测试环境

**步骤2: 路径格式说明**

| 操作系统 | 路径分隔符 | 示例 | 支持 ~ |
|----------|----------|------|----------|
| Windows  | `\\` (双反斜杠) | `D:\\Users\\...` | ✗ |
| macOS    | `/` (正斜杠) | `/Users/...` | ✓ |
| Linux    | `/` (正斜杠) | `/home/...` | ✓ |

**配置优先级:**
```
调用时指定的 base_dir > 环境变量 MCP_SESSION_BASE_DIR > config.json 中的配置 > 默认路径 ~/Documents/ide_sessions
```

**配置方法对比：**

| 方法 | 优先级 | 配置位置 | 适用场景 |
|------|---------|----------|----------|
| base_dir参数 | 最高 | 调用时传入 | 临时指定不同路径 |
| 环境变量MCP_SESSION_BASE_DIR | 高 | MCP配置文件的env字段 | 生产环境推荐 |
| config.json | 中 | 项目根目录 | 开发测试环境 |
| 默认路径 | 最低 | ~/Documents/ide_sessions | 备用方案 |

**配置后的优势:**
- ✅ 使用工具时无需每次指定 `base_dir`
- ✅ 统一管理所有会话保存位置
- ✅ 更简洁的API调用
- ✅ 仍可在需要时临时指定其他路径

## 运行和部署

### 运行方式说明

MCP服务通过**标准输入/输出（stdio）**与客户端通信，不适合直接单独运行。必须通过支持MCP协议的客户端来使用。

#### ❌ 不推荐：直接运行

```bash
node index.js
```

直接运行只会启动服务并等待stdio输入，无法直接交互使用。

#### ✅ 推荐：通过MCP客户端运行

将服务配置到MCP客户端中，客户端会自动启动和管理服务进程。

### 部署到MCP客户端

#### 方法1：Claude Desktop（推荐）

**步骤1：找到配置文件**

- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
  - 完整路径示例: `C:\Users\你的用户名\AppData\Roaming\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

**步骤2：编辑配置文件**

如果文件不存在，创建一个新的JSON文件：

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

**注意事项：**
- 使用**绝对路径**指向 `index.js`
- Windows路径需要使用双反斜杠 `\\` 转义
- 确保Node.js在系统PATH中

**步骤3：重启Claude Desktop**

完全关闭Claude Desktop并重新打开，服务会自动加载。

**步骤4：验证服务**

在Claude对话中询问：
```
你有哪些可用的工具？
```

如果看到 `save_session` 和 `list_sessions` 工具，说明配置成功！

#### 方法2：Cline（VSCode插件）

**步骤1：安装Cline插件**

在VSCode扩展市场搜索并安装 `Cline`。

**步骤2：配置MCP服务器**

打开VSCode设置（Ctrl+,），搜索 `Cline`，找到MCP服务器配置项。

或者直接编辑 `settings.json`：

```json
{
  "cline.mcpServers": {
    "session-saver": {
      "command": "node",
      "args": ["d:\\Server\\www\\_code\\mcp_save_session\\index.js"]
    }
  }
}
```

**步骤3：重启VSCode**

重新加载窗口或重启VSCode。

#### 方法3：其他MCP客户端

对于其他支持MCP的客户端：

1. 查阅客户端的MCP配置文档
2. 添加服务器配置，指定：
   - 命令: `node`
   - 参数: `["d:\\Server\\www\\_code\\mcp_save_session\\index.js"]`
3. 重启客户端

### 使用示例

配置完成后，在MCP客户端中可以这样使用：

**保存会话：**
```
请帮我保存今天的开发记录：

基础目录: D:\Administrator\Documents\ide_sessions
IDE: Qoder
会话描述: 实现用户登录功能
内容:
# 今日工作
- 完成了用户登录功能
- 修复了3个bug
- 进行了代码审查
```

**查看会话：**
```
请列出我在D:\Administrator\Documents\ide_sessions目录下保存的所有Qoder会话
```

客户端会自动调用相应的MCP工具完成操作。

### 环境要求

- **Node.js**: v16.x 或更高版本
- **npm**: 7.x 或更高版本
- **操作系统**: Windows / macOS / Linux
- **MCP客户端**: Claude Desktop, Cline, 或其他支持MCP的客户端

### 验证部署

**检查清单：**

- [ ] Node.js已安装且在PATH中
- [ ] 已运行 `npm install` 安装依赖
- [ ] 已运行 `npm test` 验证功能正常
- [ ] MCP客户端配置文件已正确编辑
- [ ] 配置中使用了绝对路径
- [ ] 已重启MCP客户端
- [ ] 客户端中可以看到工具列表

**故障排查：**

1. **客户端看不到工具**
   - 检查配置文件语法是否正确（JSON格式）
   - 确认路径是否正确（使用绝对路径）
   - 查看客户端的错误日志
   - 完全重启客户端

2. **Node.js找不到**
   - 确认Node.js已安装：`node --version`
   - 确认Node.js在系统PATH中
   - 或使用Node.js的完整路径作为command

3. **依赖缺失**
   - 运行 `npm install` 安装依赖
   - 检查是否有错误信息

## 目录结构

会话文件按以下层次结构保存：

```
基础目录/
  └── IDE名称/
      └── 日期/
          └── 时间_会话描述.md
```

### 示例

```
D:/Administrator/Documents/ide_sessions/
  ├── VSCode/
  │   ├── 2025-12-15/
  │   │   ├── 10-30-00_实现用户登录功能.md
  │   │   ├── 14-20-15_修复用户注册Bug.md
  │   │   └── 16-45-30_完善错误处理.md
  │   ├── 2025-12-16/
  │   │   └── 09-00-00_代码审查总结.md
  │   └── 2025-12-17/
  │       └── 11-15-00_修复登录Bug.md
  ├── Cursor/
  │   └── 2025-12-15/
  │       ├── 08-30-00_优化数据库查询.md
  │       ├── 13-45-00_生成用户API.md
  │       └── 15-20-00_AI辅助代码重构.md
  └── Windsurf/
      └── 2025-12-15/
          └── 17-00-00_快速修复样式问题.md
```

## 配置MCP客户端

### 1. Claude Desktop

配置文件位置：
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

配置内容：
```json
{
  "mcpServers": {
    "session-saver": {
      "command": "node",
      "args": ["D:\\path\\to\\mcp_save_session\\index.js"],
      "env": {
        "MCP_SESSION_BASE_DIR": "D:\\Users\\YourName\\Documents\\ide_sessions"
      }
    }
  }
}
```

**说明：**
- `args`: 指定index.js的绝对路径
- `env.MCP_SESSION_BASE_DIR`: 设置会话保存的默认目录（可选）
- Windows路径需要使用双反斜杠 `\\` 转义

### 2. Cline (VSCode插件)

在Cline的设置中添加MCP服务器：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "node",
      "args": ["D:\\path\\to\\mcp_save_session\\index.js"],
      "env": {
        "MCP_SESSION_BASE_DIR": "D:\\Users\\YourName\\Documents\\ide_sessions"
      }
    }
  }
}
```

**说明：**
- `env.MCP_SESSION_BASE_DIR`: 可选，设置为你希望的默认保存目录

### 3. 其他MCP客户端

参考相应客户端的文档配置MCP服务器。

## 可用工具

### save_session - 保存会话记录

保存一个会话到Markdown文件。

**参数：**

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| base_dir | string | **否** | 保存会话的基础目录路径（可选，优先级最高。未指定时依次使用：环境变量MCP_SESSION_BASE_DIR > config.json配置 > 默认路径~/Documents/ide_sessions） |
| ide_name | string | **是** | IDE名称（如：VSCode, Cursor, Windsurf） |
| session_description | string | **是** | 会话描述（简短描述会话内容） |
| content | string | **是** | 会话内容（Markdown格式） |
| session_time | string | 否 | 会话时间（ISO 8601格式，默认当前时间） |

**示例调用：**

使用配置文件（简单）：
```json
{
  "ide_name": "VSCode",
  "session_description": "实现用户登录功能",
  "content": "# 今日工作\n\n- 完成用户登录功能\n- 修复3个bug"
}
```

指定特定路径：
```json
{
  "base_dir": "D:\\Administrator\\Documents\\ide_sessions",
  "ide_name": "VSCode",
  "session_description": "实现用户登录功能",
  "content": "# 今日工作\n\n- 完成用户登录功能\n- 修复3个bug"
}
```

**返回：**

```
✅ 会话已保存到: D:\Administrator\Documents\ide_sessions\VSCode\2025-12-15\10-30-00_实现用户登录功能.md
```

### list_sessions - 列出会话记录

列出已保存的会话记录。

**参数：**

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| base_dir | string | **否** | 会话保存的基础目录路径（可选，优先级最高。未指定时依次使用：环境变量MCP_SESSION_BASE_DIR > config.json配置 > 默认路径） |
| ide_name | string | 否 | 筛选指定IDE的会话 |
| date_filter | string | 否 | 筛选指定日期的会话（格式: YYYY-MM-DD） |

**示例调用：**

使用配置文件（简单）：

列出所有会话：
```json
{}
```

列出VSCode的所有会话：
```json
{
  "ide_name": "VSCode"
}
```

列出VSCode在 2025-12-15 的所有会话：
```json
{
  "ide_name": "VSCode",
  "date_filter": "2025-12-15"
}
```

指定特定路径：

列出所有会话：
```json
{
  "base_dir": "D:\\Administrator\\Documents\\ide_sessions"
}
```

列出VSCode的所有会话：
```json
{
  "base_dir": "D:\\Administrator\\Documents\\ide_sessions",
  "ide_name": "VSCode"
}
```

列出VSCode在 2025-12-15 的所有会话：
```json
{
  "base_dir": "D:\\Administrator\\Documents\\ide_sessions",
  "ide_name": "VSCode",
  "date_filter": "2025-12-15"
}
```

**返回示例：**

```
找到 3 个会话记录:

📁 **VSCode** / **2025-12-15** / 10-30-00_实现用户登录功能.md
   路径: D:\Administrator\Documents\ide_sessions\VSCode\2025-12-15\10-30-00_实现用户登录功能.md
   创建时间: 2025/12/15 10:30:00
   大小: 256 字节

📁 **VSCode** / **2025-12-15** / 14-20-15_修复用户注册Bug.md
   路径: D:\Administrator\Documents\ide_sessions\VSCode\2025-12-15\14-20-15_修复用户注册Bug.md
   创建时间: 2025/12/15 14:20:15
   大小: 312 字节

📁 **Cursor** / **2025-12-15** / 08-30-00_优化数据库查询.md
   路径: D:\Administrator\Documents\ide_sessions\Cursor\2025-12-15\08-30-00_优化数据库查询.md
   创建时间: 2025/12/15 08:30:00
   大小: 189 字节
```

## 使用场景

### 1. 保存开发日志

```markdown
# 今日开发工作

## 完成的功能
- 实现了用户注册接口
- 添加了邮箱验证功能
- 完善了错误处理

## 技术细节
- 使用了nodemailer发送邮件
- 实现了验证码过期机制
- 添加了防暴力破解限制

## 遇到的问题
1. SMTP配置问题
   - 解决方案：使用应用专用密码
2. 验证码存储
   - 解决方案：使用Redis存储，设置TTL

## 明天计划
- 完成密码重置功能
- 添加单元测试
```

### 2. 记录代码审查

```markdown
# 代码审查 - 用户模块

## 审查人员
- 主审: 张三
- 协审: 李四

## 审查内容
- controllers/user.js
- services/user.js
- models/user.js

## 发现的问题

### 严重
1. 缺少SQL注入防护
   - 位置：line 45
   - 建议：使用参数化查询

### 一般
1. 日志记录不完整
2. 错误信息暴露敏感信息

## 改进建议
- 统一错误处理
- 添加输入验证
- 完善日志记录
```

### 3. AI对话记录

```markdown
# AI辅助编程对话

## 问题
如何优化大量数据的查询性能？

## AI分析
当前问题：
- 查询涉及多个表联接
- 没有使用索引
- 每次都查询全量数据

## 优化方案
1. 添加复合索引
2. 实现分页查询
3. 使用缓存机制
4. 考虑数据库读写分离

## 实施结果
- 查询速度提升75%
- 内存使用降低40%
- 用户体验明显改善
```

### 4. 学习笔记

```markdown
# React Hooks 学习笔记

## useState
- 用于在函数组件中添加状态
- 返回当前状态和更新函数
- 可以使用多次

示例：
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect
- 处理副作用操作
- 可以模拟生命周期方法
- 清理函数防止内存泄漏

示例：
\`\`\`javascript
useEffect(() => {
  // 副作用代码
  return () => {
    // 清理代码
  };
}, [dependencies]);
\`\`\`

## 最佳实践
1. 遵循Hook规则
2. 合理拆分组件
3. 使用自定义Hook复用逻辑
```

## 文件名规范

### 时间戳格式

文件名使用 `YYYY-MM-DD_HH-MM-SS.md` 格式：
- `YYYY`: 四位年份
- `MM`: 两位月份（01-12）
- `DD`: 两位日期（01-31）
- `HH`: 两位小时（00-23）
- `MM`: 两位分钟（00-59）
- `SS`: 两位秒（00-59）

示例：`2025-12-15_14-30-45.md`

### 非法字符处理

IDE名称和会话名中的以下字符会被替换为下划线：
- `<` `>` `:` `"` `/` `\` `|` `?` `*`

示例：
- 输入：`Bug修复: #123`
- 输出：`Bug修复_ #123`

## Markdown文件格式

每个保存的会话文件包含：

```markdown
# [会话名称]

**IDE:** [IDE名称]  
**时间:** [格式化的时间]

---

[会话内容]
```

## 技巧和最佳实践

### 1. 组织会话

建议使用有意义的会话名称，例如：
- `项目开发` - 日常开发工作
- `Bug修复` - 问题修复记录
- `代码审查` - 代码审查笔记
- `AI对话` - 与AI的交互记录
- `学习笔记` - 学习和研究内容

### 2. 内容格式

建议使用Markdown格式组织内容：
- 使用标题分层
- 使用列表整理要点
- 使用代码块展示代码
- 使用表格组织数据

### 3. 定期整理

- 定期清理过期的会话记录
- 归档重要的会话
- 建立命名规范

### 4. 备份

- 定期备份会话目录
- 使用版本控制管理重要会话
- 考虑云端同步

## 故障排除

### 问题1：无法创建目录

**原因：** 权限不足或路径不存在

**解决方案：**
- 确保基础目录路径正确
- 检查目录访问权限
- 使用绝对路径

### 问题2：文件保存失败

**原因：** 磁盘空间不足或文件被占用

**解决方案：**
- 检查磁盘空间
- 确保文件没有被其他程序打开
- 检查文件系统权限

### 问题3：中文乱码

**原因：** 编码问题

**解决方案：**
- 确保使用UTF-8编码
- 使用支持UTF-8的文本编辑器

## 进阶使用

### 自定义时间

可以指定会话的时间，用于批量导入历史记录：

```json
{
  "base_dir": "D:\\Administrator\\Documents\\ide_sessions",
  "ide_name": "VSCode",
  "session_name": "历史记录",
  "content": "...",
  "session_time": "2025-12-01T10:00:00"
}
```

### 批量导入

可以编写脚本批量导入会话记录：

```javascript
const sessions = [
  { ide: 'VSCode', name: '会话1', content: '...', time: '2025-12-01T10:00:00' },
  { ide: 'VSCode', name: '会话2', content: '...', time: '2025-12-02T10:00:00' },
  // ...
];

for (const session of sessions) {
  // 调用save_session工具
}
```

## 常见问题

**Q: 可以修改已保存的会话吗？**
A: 可以，直接编辑对应的Markdown文件即可。

**Q: 如何搜索会话内容？**
A: 可以使用文本编辑器或IDE的全局搜索功能，在会话目录中搜索。

**Q: 可以导出会话吗？**
A: 会话已经是Markdown格式，可以直接使用或转换为其他格式（PDF、HTML等）。

**Q: 支持多个基础目录吗？**
A: 支持，每次调用时指定不同的base_dir即可。

**Q: 如何删除会话？**
A: 直接删除对应的Markdown文件或目录即可。

## 许可证

MIT License
