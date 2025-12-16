#!/bin/bash

# MCP Session Saver 快速配置脚本
# 支持 Qoder, Cursor, Claude Desktop, Windsurf

set -e

echo "================================"
echo "  MCP Session Saver 快速配置"
echo "================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检测操作系统
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo "检测到操作系统: $MACHINE"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未检测到 Node.js${NC}"
    echo "请先安装 Node.js (>= 16.0.0)"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js 版本: $NODE_VERSION${NC}"
echo ""

# 选择 IDE
echo "请选择您的 IDE:"
echo "1) Qoder"
echo "2) Cursor"
echo "3) Claude Desktop"
echo "4) Windsurf"
echo "5) Trae"
echo "6) Codebuddy"
echo "7) Lingma (灵码)"
echo "8) Continue (VSCode扩展)"
echo "9) Aider"
echo "0) 所有 IDE（全部配置）"
echo ""
read -p "请输入数字 (0-9): " IDE_CHOICE

# 询问存储路径
echo ""
read -p "会话存储路径 [留空使用默认路径 ~/Documents/ide_sessions]: " CUSTOM_PATH

if [ -z "$CUSTOM_PATH" ]; then
    BASE_DIR="~/Documents"
else
    BASE_DIR="$CUSTOM_PATH"
fi

# 配置函数
configure_qoder() {
    echo ""
    echo -e "${YELLOW}配置 Qoder...${NC}"
    
    if [ "$MACHINE" = "Mac" ]; then
        CONFIG_DIR="$HOME/Library/Application Support/Qoder"
    elif [ "$MACHINE" = "Linux" ]; then
        CONFIG_DIR="$HOME/.config/qoder"
    else
        echo -e "${RED}不支持的操作系统${NC}"
        return 1
    fi
    
    mkdir -p "$CONFIG_DIR"
    CONFIG_FILE="$CONFIG_DIR/mcp-settings.json"
    
    cat > "$CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "$BASE_DIR/qoder_sessions"
      }
    }
  }
}
EOF
    
    echo -e "${GREEN}✅ Qoder 配置完成${NC}"
    echo "配置文件: $CONFIG_FILE"
    echo "存储路径: $BASE_DIR/qoder_sessions"
}

configure_cursor() {
    echo ""
    echo -e "${YELLOW}配置 Cursor...${NC}"
    
    # 项目级别配置
    mkdir -p .cursor
    CONFIG_FILE=".cursor/mcp.json"
    
    cat > "$CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "$BASE_DIR/cursor_sessions"
      }
    }
  }
}
EOF
    
    echo -e "${GREEN}✅ Cursor 配置完成（项目级别）${NC}"
    echo "配置文件: $CONFIG_FILE"
    echo "存储路径: $BASE_DIR/cursor_sessions"
    
    # 询问是否配置全局
    read -p "是否同时配置全局级别? (y/n): " GLOBAL_CHOICE
    if [ "$GLOBAL_CHOICE" = "y" ] || [ "$GLOBAL_CHOICE" = "Y" ]; then
        mkdir -p "$HOME/.cursor"
        cp "$CONFIG_FILE" "$HOME/.cursor/mcp.json"
        echo -e "${GREEN}✅ 全局配置完成${NC}"
        echo "全局配置文件: $HOME/.cursor/mcp.json"
    fi
}

configure_claude() {
    echo ""
    echo -e "${YELLOW}配置 Claude Desktop...${NC}"
    
    if [ "$MACHINE" = "Mac" ]; then
        CONFIG_DIR="$HOME/Library/Application Support/Claude"
    elif [ "$MACHINE" = "Linux" ]; then
        CONFIG_DIR="$HOME/.config/Claude"
    else
        echo -e "${RED}不支持的操作系统${NC}"
        return 1
    fi
    
    mkdir -p "$CONFIG_DIR"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
    
    cat > "$CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "$BASE_DIR/claude_sessions"
      }
    }
  }
}
EOF
    
    echo -e "${GREEN}✅ Claude Desktop 配置完成${NC}"
    echo "配置文件: $CONFIG_FILE"
    echo "存储路径: $BASE_DIR/claude_sessions"
}

configure_windsurf() {
    echo ""
    echo -e "${YELLOW}配置 Windsurf...${NC}"
    
    mkdir -p .windsurf
    CONFIG_FILE=".windsurf/mcp.json"
    
    cat > "$CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "$BASE_DIR/windsurf_sessions"
      }
    }
  }
}
EOF
    
    echo -e "${GREEN}✅ Windsurf 配置完成（项目级别）${NC}"
    echo "配置文件: $CONFIG_FILE"
    echo "存储路径: $BASE_DIR/windsurf_sessions"
}

configure_trae() {
    echo ""
    echo -e "${YELLOW}配置 Trae...${NC}"
    
    mkdir -p .trae
    CONFIG_FILE=".trae/mcp.json"
    
    cat > "$CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "$BASE_DIR/trae_sessions"
      }
    }
  }
}
EOF
    
    echo -e "${GREEN}✅ Trae 配置完成（项目级别）${NC}"
    echo "配置文件: $CONFIG_FILE"
    echo "存储路径: $BASE_DIR/trae_sessions"
}

configure_codebuddy() {
    echo ""
    echo -e "${YELLOW}配置 Codebuddy...${NC}"
    
    if [ "$MACHINE" = "Mac" ]; then
        CONFIG_DIR="$HOME/Library/Application Support/Codebuddy"
    elif [ "$MACHINE" = "Linux" ]; then
        CONFIG_DIR="$HOME/.config/codebuddy"
    else
        echo -e "${RED}不支持的操作系统${NC}"
        return 1
    fi
    
    mkdir -p "$CONFIG_DIR"
    CONFIG_FILE="$CONFIG_DIR/mcp-settings.json"
    
    cat > "$CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "$BASE_DIR/codebuddy_sessions"
      }
    }
  }
}
EOF
    
    echo -e "${GREEN}✅ Codebuddy 配置完成${NC}"
    echo "配置文件: $CONFIG_FILE"
    echo "存储路径: $BASE_DIR/codebuddy_sessions"
}

configure_lingma() {
    echo ""
    echo -e "${YELLOW}配置 Lingma (灵码)...${NC}"
    
    if [ "$MACHINE" = "Mac" ]; then
        CONFIG_DIR="$HOME/Library/Application Support/Lingma"
    elif [ "$MACHINE" = "Linux" ]; then
        CONFIG_DIR="$HOME/.config/lingma"
    else
        echo -e "${RED}不支持的操作系统${NC}"
        return 1
    fi
    
    mkdir -p "$CONFIG_DIR"
    CONFIG_FILE="$CONFIG_DIR/mcp-config.json"
    
    cat > "$CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "$BASE_DIR/lingma_sessions"
      }
    }
  }
}
EOF
    
    echo -e "${GREEN}✅ Lingma 配置完成${NC}"
    echo "配置文件: $CONFIG_FILE"
    echo "存储路径: $BASE_DIR/lingma_sessions"
}

configure_continue() {
    echo ""
    echo -e "${YELLOW}配置 Continue...${NC}"
    
    CONFIG_DIR="$HOME/.continue"
    CONFIG_FILE="$CONFIG_DIR/config.json"
    
    mkdir -p "$CONFIG_DIR"
    
    cat > "$CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "$BASE_DIR/continue_sessions"
      }
    }
  }
}
EOF
    
    echo -e "${GREEN}✅ Continue 配置完成${NC}"
    echo "配置文件: $CONFIG_FILE"
    echo "存储路径: $BASE_DIR/continue_sessions"
}

configure_aider() {
    echo ""
    echo -e "${YELLOW}配置 Aider...${NC}"
    
    CONFIG_DIR="$HOME/.aider"
    CONFIG_FILE="$CONFIG_DIR/mcp.json"
    
    mkdir -p "$CONFIG_DIR"
    
    cat > "$CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "session-saver": {
      "command": "npx",
      "args": ["-y", "mcp-session-saver"],
      "env": {
        "MCP_SESSION_BASE_DIR": "$BASE_DIR/aider_sessions"
      }
    }
  }
}
EOF
    
    echo -e "${GREEN}✅ Aider 配置完成${NC}"
    echo "配置文件: $CONFIG_FILE"
    echo "存储路径: $BASE_DIR/aider_sessions"
}

# 执行配置
case $IDE_CHOICE in
    1)
        configure_qoder
        ;;
    2)
        configure_cursor
        ;;
    3)
        configure_claude
        ;;
    4)
        configure_windsurf
        ;;
    5)
        configure_trae
        ;;
    6)
        configure_codebuddy
        ;;
    7)
        configure_lingma
        ;;
    8)
        configure_continue
        ;;
    9)
        configure_aider
        ;;
    0)
        configure_qoder
        configure_cursor
        configure_claude
        configure_windsurf
        configure_trae
        configure_codebuddy
        configure_lingma
        configure_continue
        configure_aider
        ;;
    *)
        echo -e "${RED}无效选择${NC}"
        exit 1
        ;;
esac

# 完成提示
echo ""
echo "================================"
echo -e "${GREEN}🎉 配置完成！${NC}"
echo "================================"
echo ""
echo "下一步:"
echo "1. 完全重启您的 IDE"
echo "2. 在对话中询问: 你有哪些可用的工具?"
echo "3. 应该能看到 mcp_session-saver_* 系列工具"
echo "4. 测试保存: 保存当前会话"
echo ""
echo "如有问题，请查看文档:"
echo "- MULTI_IDE_SETUP.md - 详细配置指南"
echo "- USAGE.md - 使用说明"
echo ""
