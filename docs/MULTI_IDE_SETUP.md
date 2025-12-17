# 🌐 多 IDE 配置指南

MCP Session Saver 支持所有兼容 MCP 协议的 AI IDE。本指南提供各主流 IDE 的详细配置方法。

## 📋 支持的 IDE

- ✅ **Qoder** - AI 智能编程助手
- ✅ **Cursor** - AI 代码编辑器
- ✅ **Claude Desktop** - Anthropic 官方桌面应用
- ✅ **Windsurf** - AI 协作编程工具
- ✅ **Trae** - AI 编程辅助工具
- ✅ **Codebuddy** - AI 编程助手
- ✅ **Lingma** - 灵码 AI 编程助手
- ✅ **Continue** - VSCode AI 扩展
- ✅ **Aider** - AI 结对编程工具
- ✅ 其他所有支持 MCP 协议的 IDE

---

## 🎯 快速配置（所有 IDE 通用）

### 方式1：使用 npx（推荐 - 无需安装）

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

**优点**：
- ✅ 无需全局安装
- ✅ 自动使用最新版本
- ✅ 跨平台兼容

### 方式2：全局安装后使用

```bash
npm install -g mcp-session-saver
```

配置：
```json
{
  "mcpServers": {
    "session-saver": {
      "command": "mcp-session-saver"
    }
  }
}
```

---

## 📱 各 IDE 详细配置

### 1️⃣ Qoder

#### 配置文件位置
- Windows: `%APPDATA%\Qoder\mcp-settings.json`
- macOS: `~/Library/Application Support/Qoder/mcp-settings.json`
- Linux: `~/.config/qoder/mcp-settings.json`

#### 配置步骤
1. 打开 Qoder 设置
2. 找到 MCP 配置部分
3. 添加以下配置：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "D:\\Sessions\\Qoder"
      }
    }
  }
}
```

4. 完全重启 Qoder
5. 验证：在对话中问 "你有哪些可用的工具？"

#### 快速配置
直接复制 [`configs/qoder-mcp-config.json`](../configs/qoder-mcp-config.json) 的内容到配置文件。

---

### 2️⃣ Cursor

#### 配置文件位置
- **项目级别**（推荐）: `.cursor/mcp.json`（项目根目录）
- **全局级别**: `~/.cursor/mcp.json`

#### 配置步骤

**方式A：项目级别配置**
1. 在项目根目录创建 `.cursor/mcp.json`
2. 添加配置：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "~/Documents/cursor_sessions"
      }
    }
  }
}
```

3. 重启 Cursor
4. 工具会自动加载

**方式B：全局配置**
1. 创建 `~/.cursor/mcp.json`（用户主目录）
2. 添加相同配置
3. 所有 Cursor 项目都可使用

#### 快速配置
```bash
# 复制配置文件到项目
mkdir .cursor
cp configs/cursor-mcp-config.json .cursor/mcp.json

# 或全局配置
cp configs/cursor-mcp-config.json ~/.cursor/mcp.json
```

#### 使用提示
Cursor 会自动识别 MCP 工具：
- 💡 输入 `/` 可看到可用工具
- 🔍 搜索 "save" 找到保存工具
- ⚡ 或直接说 "保存当前会话"

---

### 3️⃣ Claude Desktop

#### 配置文件位置
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### 配置步骤
1. 打开 Claude Desktop
2. 进入 **Settings** → **Developer** → **Edit Config**
3. 添加配置：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "~/Documents/claude_sessions"
      }
    }
  }
}
```

4. 保存并关闭 Claude Desktop
5. 重新打开 Claude Desktop

#### macOS 快速配置
```bash
# 编辑配置文件
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 或直接复制
cp configs/claude-desktop-config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### Windows 快速配置
```cmd
# 打开配置文件
notepad %APPDATA%\Claude\claude_desktop_config.json

# 或使用 PowerShell 复制
Copy-Item configs\claude-desktop-config.json $env:APPDATA\Claude\claude_desktop_config.json
```

#### 使用提示
- Claude Desktop 会在聊天界面显示可用的 MCP 工具
- 首次使用时会请求授权
- 可以在设置中启用 "YOLO Mode" 跳过授权提示

---

### 4️⃣ Windsurf

#### 配置文件位置
类似 Cursor：
- **项目级别**: `.windsurf/mcp.json`
- **全局级别**: `~/.windsurf/mcp.json`

#### 配置步骤
1. 创建配置文件目录：
```bash
mkdir -p .windsurf
```

2. 创建配置文件：
```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "~/Documents/windsurf_sessions"
      }
    }
  }
}
```

3. 重启 Windsurf

#### 快速配置
```bash
mkdir -p .windsurf
cp configs/windsurf-mcp-config.json .windsurf/mcp.json
```

---

### 5️⃣ Trae

#### 配置文件位置
类似 Cursor：
- **项目级别**: `.trae/mcp.json`
- **全局级别**: `~/.trae/mcp.json`

#### 配置步骤
1. 创建配置文件目录：
```bash
mkdir -p .trae
```

2. 创建配置文件：
```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "~/Documents/trae_sessions"
      }
    }
  }
}
```

3. 重启 Trae

#### 快速配置
```bash
mkdir -p .trae
cp configs/trae-mcp-config.json .trae/mcp.json
```

---

### 6️⃣ Codebuddy

#### 配置文件位置
- **Windows**: `%APPDATA%\Codebuddy\mcp-settings.json`
- **macOS**: `~/Library/Application Support/Codebuddy/mcp-settings.json`
- **Linux**: `~/.config/codebuddy/mcp-settings.json`

#### 配置步骤
1. 打开 Codebuddy 设置
2. 找到 MCP 配置部分
3. 添加以下配置：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "~/Documents/codebuddy_sessions"
      }
    }
  }
}
```

4. 完全重启 Codebuddy
5. 验证：在对话中问 "你有哪些可用的工具？"

#### 快速配置
```bash
# macOS
cp configs/codebuddy-mcp-config.json ~/Library/Application\ Support/Codebuddy/mcp-settings.json

# Linux
cp configs/codebuddy-mcp-config.json ~/.config/codebuddy/mcp-settings.json
```

**Windows (PowerShell)**:
```powershell
Copy-Item configs\codebuddy-mcp-config.json $env:APPDATA\Codebuddy\mcp-settings.json
```

---

### 7️⃣ Lingma (灵码)

#### 配置文件位置
- **Windows**: `%APPDATA%\Lingma\mcp-config.json`
- **macOS**: `~/Library/Application Support/Lingma/mcp-config.json`
- **Linux**: `~/.config/lingma/mcp-config.json`

#### 配置步骤
1. 打开灵码设置
2. 进入 MCP 配置页面
3. 添加以下配置：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "~/Documents/lingma_sessions"
      }
    }
  }
}
```

4. 保存并重启灵码

#### 快速配置
```bash
# macOS
cp configs/lingma-mcp-config.json ~/Library/Application\ Support/Lingma/mcp-config.json

# Linux
cp configs/lingma-mcp-config.json ~/.config/lingma/mcp-config.json
```

**Windows (PowerShell)**:
```powershell
Copy-Item configs\lingma-mcp-config.json $env:APPDATA\Lingma\mcp-config.json
```

---

### 8️⃣ Continue (VSCode 扩展)

#### 配置文件位置
- **Windows**: `%USERPROFILE%\.continue\config.json`
- **macOS**: `~/.continue/config.json`
- **Linux**: `~/.continue/config.json`

#### 配置步骤
1. 在 VSCode 中打开 Continue 扩展设置
2. 找到 MCP 配置选项
3. 添加以下配置：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "~/Documents/continue_sessions"
      }
    }
  }
}
```

4. 重新加载 VSCode 窗口

#### 快速配置
```bash
# 所有系统
cp configs/continue-mcp-config.json ~/.continue/config.json
```

**Windows (PowerShell)**:
```powershell
Copy-Item configs\continue-mcp-config.json $env:USERPROFILE\.continue\config.json
```

#### 使用提示
- Continue 会在聊天界面显示可用的 MCP 工具
- 可以直接说 "保存当前会话"

---

### 9️⃣ Aider

#### 配置文件位置
- **所有系统**: `~/.aider/mcp.json`

#### 配置步骤
1. 创建配置目录：
```bash
mkdir -p ~/.aider
```

2. 创建配置文件：
```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "~/Documents/aider_sessions"
      }
    }
  }
}
```

3. 重启 Aider

#### 快速配置
```bash
mkdir -p ~/.aider
cp configs/aider-mcp-config.json ~/.aider/mcp.json
```

**Windows (PowerShell)**:
```powershell
New-Item -ItemType Directory -Force -Path $env:USERPROFILE\.aider
Copy-Item configs\aider-mcp-config.json $env:USERPROFILE\.aider\mcp.json
```

#### 使用提示
- Aider 会自动识别 MCP 工具
- 在命令行中直接说 "save session"

---

### 1️⃣0️⃣ 其他 MCP 兼容 IDE

对于其他支持 MCP 的 IDE，通用配置模板：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "~/Documents/[IDE_NAME]_sessions"
      }
    }
  }
}
```

**替换说明**：
- `[IDE_NAME]` - 替换为实际 IDE 名称

---

## 🔧 通用配置选项

### 环境变量配置

所有 IDE 都支持以下环境变量：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "自定义存储路径",
        "NODE_ENV": "production"
      }
    }
  }
}
```

### 路径配置示例

**Windows**：
```json
"env": {
  "MCP_SESSION_BASE_DIR": "D:\\MyProjects\\Sessions"
}
```

**macOS/Linux**：
```json
"env": {
  "MCP_SESSION_BASE_DIR": "~/Documents/ai_sessions"
}
```

### 使用本地安装版本

如果项目已安装 mcp-session-saver：

```json
{
  "mcpServers": {
    "session-saver": {
      "command": "node",
      "args": ["./node_modules/mcp-session-saver/index.js"]
    }
  }
}
```

---

## ✅ 验证配置

### 通用验证步骤

1. **重启 IDE**
   - 完全关闭 IDE
   - 重新打开
   - 等待几秒钟让 MCP 服务加载

2. **检查工具列表**
   在 IDE 对话中询问：
   ```
   你有哪些可用的工具？
   ```
   
   应该看到：
   - `mcp_session-saver_save_session`
   - `mcp_session-saver_list_sessions`
   - `mcp_session-saver_read_session`
   - `mcp_session-saver_delete_session`
   - `mcp_session-saver_search_sessions`

3. **测试保存功能**
   ```
   保存当前会话
   ```
   
   应该成功保存并返回文件路径

---

## ❌ 故障排除

### 问题1：看不到工具

**可能原因**：
- MCP 配置文件格式错误
- IDE 未完全重启
- Node.js 未安装

**解决方案**：
```bash
# 1. 验证 Node.js
node --version  # 应该 >= 16.0.0

# 2. 验证 JSON 格式
# 使用在线工具检查 JSON 语法

# 3. 手动测试 MCP 服务
npx -y mcp-session-saver
```

### 问题2：工具调用失败

**检查清单**：
- [ ] 配置文件路径正确
- [ ] JSON 格式无误（注意逗号、引号）
- [ ] 环境变量路径存在
- [ ] Node.js 版本符合要求

**调试方法**：
```bash
# 查看详细错误信息
# 大多数 IDE 都有 MCP 日志
# Cursor: 开发者工具 → Console
# Claude: Settings → Advanced → View Logs
```

### 问题3：路径权限问题

**Windows**：
```json
"MCP_SESSION_BASE_DIR": "D:\\Sessions"  // 使用双反斜杠
```

**macOS/Linux**：
```bash
# 确保目录存在且有写权限
mkdir -p ~/Documents/sessions
chmod 755 ~/Documents/sessions
```

---

## 🎯 最佳实践

### 1. 使用 npx 而非全局安装
✅ **推荐**：
```json
"command": "npx",
"args": ["-y", "mcp-session-saver"]
```

❌ **不推荐**：
```json
"command": "mcp-session-saver"  // 需要全局安装
```

### 2. 为不同 IDE 设置不同存储路径
```
~/Documents/
  ├── qoder_sessions/
  ├── cursor_sessions/
  ├── claude_sessions/
  └── windsurf_sessions/
```

### 3. 使用版本控制
将配置文件加入项目：
```bash
# .gitignore
!.cursor/mcp.json
!.windsurf/mcp.json
```

团队成员可直接使用相同配置。

### 4. 定期更新
```bash
# npx 会自动使用最新版本
# 或手动更新全局安装
npm update -g mcp-session-saver
```

---

## 📊 配置对比表

| IDE | 配置文件 | 推荐方式 | 自动加载 | 难度 |
|-----|---------|---------|---------|------|
| **Qoder** | 设置中配置 | npx | ✅ | ⭐ |
| **Cursor** | `.cursor/mcp.json` | npx | ✅ | ⭐ |
| **Claude Desktop** | `claude_desktop_config.json` | npx | ✅ | ⭐ |
| **Windsurf** | `.windsurf/mcp.json` | npx | ✅ | ⭐ |
| **Trae** | `.trae/mcp.json` | npx | ✅ | ⭐ |
| **Codebuddy** | `mcp-settings.json` | npx | ✅ | ⭐ |
| **Lingma** | `mcp-config.json` | npx | ✅ | ⭐ |
| **Continue** | `~/.continue/config.json` | npx | ✅ | ⭐ |
| **Aider** | `~/.aider/mcp.json` | npx | ✅ | ⭐ |

---

## 🚀 快速开始脚本

### 自动配置脚本（所有 IDE）

**macOS/Linux**：
```bash
#!/bin/bash
# quick-setup.sh

echo "选择您的 IDE:"
echo "1) Qoder"
echo "2) Cursor"
echo "3) Claude Desktop"
echo "4) Windsurf"
read -p "请输入数字: " choice

case $choice in
  1) cp configs/qoder-mcp-config.json ~/.qoder/mcp-settings.json ;;
  2) mkdir -p .cursor && cp configs/cursor-mcp-config.json .cursor/mcp.json ;;
  3) cp configs/claude-desktop-config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json ;;
  4) mkdir -p .windsurf && cp configs/windsurf-mcp-config.json .windsurf/mcp.json ;;
  *) echo "无效选择" ;;
esac

echo "配置完成！请重启 IDE。"
```

**Windows (PowerShell)**：
```powershell
# quick-setup.ps1

Write-Host "选择您的 IDE:"
Write-Host "1) Qoder"
Write-Host "2) Cursor"
Write-Host "3) Claude Desktop"
Write-Host "4) Windsurf"
$choice = Read-Host "请输入数字"

switch ($choice) {
  1 { Copy-Item configs\qoder-mcp-config.json $env:APPDATA\Qoder\mcp-settings.json }
  2 { New-Item -ItemType Directory -Force .cursor; Copy-Item configs\cursor-mcp-config.json .cursor\mcp.json }
  3 { Copy-Item configs\claude-desktop-config.json $env:APPDATA\Claude\claude_desktop_config.json }
  4 { New-Item -ItemType Directory -Force .windsurf; Copy-Item configs\windsurf-mcp-config.json .windsurf\mcp.json }
  default { Write-Host "无效选择" }
}

Write-Host "配置完成！请重启 IDE。"
```

---

## 📞 需要帮助？

如果配置遇到问题：

1. **查看详细文档**: [USAGE.md](./USAGE.md)
2. **查看 Qoder 专用指南**: [QODER_CONFIG_GUIDE.md](./QODER_CONFIG_GUIDE.md)
3. **提交 Issue**: [GitHub Issues](https://github.com/yourname/mcp-session-saver/issues)
4. **查看示例配置**: [`configs/`](./configs/) 目录

---

## 🎉 配置完成后

所有 IDE 都可以使用相同的命令：

```
保存当前会话
列出所有会话
搜索会话内容
读取会话文件
删除会话记录
```

享受跨 IDE 的统一会话管理体验！🚀
