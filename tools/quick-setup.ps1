# MCP Session Saver 快速配置脚本 (Windows PowerShell)
# 支持 Qoder, Cursor, Claude Desktop, Windsurf

$ErrorActionPreference = "Stop"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  MCP Session Saver 快速配置" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 未检测到 Node.js" -ForegroundColor Red
    Write-Host "请先安装 Node.js (>= 16.0.0)"
    Write-Host "下载地址: https://nodejs.org/"
    exit 1
}

Write-Host ""

# 选择 IDE
Write-Host "请选择您的 IDE:" -ForegroundColor Yellow
Write-Host "1) Qoder"
Write-Host "2) Cursor"
Write-Host "3) Claude Desktop"
Write-Host "4) Windsurf"
Write-Host "5) Trae"
Write-Host "6) Codebuddy"
Write-Host "7) Lingma (灵码)"
Write-Host "8) Continue (VSCode扩展)"
Write-Host "9) Aider"
Write-Host "0) 所有 IDE（全部配置）"
Write-Host ""
$ideChoice = Read-Host "请输入数字 (0-9)"

# 询问存储路径
Write-Host ""
$customPath = Read-Host "会话存储路径 [留空使用默认路径 Documents\ide_sessions]"

if ([string]::IsNullOrWhiteSpace($customPath)) {
    $baseDir = "$env:USERPROFILE\Documents"
} else {
    $baseDir = $customPath
}

# 配置函数
function Configure-Qoder {
    Write-Host ""
    Write-Host "配置 Qoder..." -ForegroundColor Yellow
    
    $configDir = "$env:APPDATA\Qoder"
    $configFile = "$configDir\mcp-settings.json"
    
    New-Item -ItemType Directory -Force -Path $configDir | Out-Null
    
    $config = @{
        mcpServers = @{
            "session-saver" = @{
                command = "npx"
                args = @("-y", "mcp-session-saver")
                env = @{
                    MCP_SESSION_BASE_DIR = "$baseDir\qoder_sessions"
                }
            }
        }
    }
    
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $configFile -Encoding UTF8
    
    Write-Host "✅ Qoder 配置完成" -ForegroundColor Green
    Write-Host "配置文件: $configFile"
    Write-Host "存储路径: $baseDir\qoder_sessions"
}

function Configure-Cursor {
    Write-Host ""
    Write-Host "配置 Cursor..." -ForegroundColor Yellow
    
    # 项目级别配置
    New-Item -ItemType Directory -Force -Path ".cursor" | Out-Null
    $configFile = ".cursor\mcp.json"
    
    $config = @{
        mcpServers = @{
            "session-saver" = @{
                command = "npx"
                args = @("-y", "mcp-session-saver")
                env = @{
                    MCP_SESSION_BASE_DIR = "$baseDir\cursor_sessions"
                }
            }
        }
    }
    
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $configFile -Encoding UTF8
    
    Write-Host "✅ Cursor 配置完成（项目级别）" -ForegroundColor Green
    Write-Host "配置文件: $configFile"
    Write-Host "存储路径: $baseDir\cursor_sessions"
    
    # 询问是否配置全局
    $globalChoice = Read-Host "是否同时配置全局级别? (y/n)"
    if ($globalChoice -eq "y" -or $globalChoice -eq "Y") {
        $globalDir = "$env:USERPROFILE\.cursor"
        New-Item -ItemType Directory -Force -Path $globalDir | Out-Null
        Copy-Item $configFile "$globalDir\mcp.json"
        Write-Host "✅ 全局配置完成" -ForegroundColor Green
        Write-Host "全局配置文件: $globalDir\mcp.json"
    }
}

function Configure-Claude {
    Write-Host ""
    Write-Host "配置 Claude Desktop..." -ForegroundColor Yellow
    
    $configDir = "$env:APPDATA\Claude"
    $configFile = "$configDir\claude_desktop_config.json"
    
    New-Item -ItemType Directory -Force -Path $configDir | Out-Null
    
    $config = @{
        mcpServers = @{
            "session-saver" = @{
                command = "npx"
                args = @("-y", "mcp-session-saver")
                env = @{
                    MCP_SESSION_BASE_DIR = "$baseDir\claude_sessions"
                }
            }
        }
    }
    
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $configFile -Encoding UTF8
    
    Write-Host "✅ Claude Desktop 配置完成" -ForegroundColor Green
    Write-Host "配置文件: $configFile"
    Write-Host "存储路径: $baseDir\claude_sessions"
}

function Configure-Windsurf {
    Write-Host ""
    Write-Host "配置 Windsurf..." -ForegroundColor Yellow
    
    New-Item -ItemType Directory -Force -Path ".windsurf" | Out-Null
    $configFile = ".windsurf\mcp.json"
    
    $config = @{
        mcpServers = @{
            "session-saver" = @{
                command = "npx"
                args = @("-y", "mcp-session-saver")
                env = @{
                    MCP_SESSION_BASE_DIR = "$baseDir\windsurf_sessions"
                }
            }
        }
    }
    
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $configFile -Encoding UTF8
    
    Write-Host "✅ Windsurf 配置完成（项目级别）" -ForegroundColor Green
    Write-Host "配置文件: $configFile"
    Write-Host "存储路径: $baseDir\windsurf_sessions"
}

function Configure-Trae {
    Write-Host ""
    Write-Host "配置 Trae..." -ForegroundColor Yellow
    
    New-Item -ItemType Directory -Force -Path ".trae" | Out-Null
    $configFile = ".trae\mcp.json"
    
    $config = @{
        mcpServers = @{
            "session-saver" = @{
                command = "npx"
                args = @("-y", "mcp-session-saver")
                env = @{
                    MCP_SESSION_BASE_DIR = "$baseDir\trae_sessions"
                }
            }
        }
    }
    
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $configFile -Encoding UTF8
    
    Write-Host "✅ Trae 配置完成（项目级别）" -ForegroundColor Green
    Write-Host "配置文件: $configFile"
    Write-Host "存储路径: $baseDir\trae_sessions"
}

function Configure-Codebuddy {
    Write-Host ""
    Write-Host "配置 Codebuddy..." -ForegroundColor Yellow
    
    $configDir = "$env:APPDATA\Codebuddy"
    $configFile = "$configDir\mcp-settings.json"
    
    New-Item -ItemType Directory -Force -Path $configDir | Out-Null
    
    $config = @{
        mcpServers = @{
            "session-saver" = @{
                command = "npx"
                args = @("-y", "mcp-session-saver")
                env = @{
                    MCP_SESSION_BASE_DIR = "$baseDir\codebuddy_sessions"
                }
            }
        }
    }
    
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $configFile -Encoding UTF8
    
    Write-Host "✅ Codebuddy 配置完成" -ForegroundColor Green
    Write-Host "配置文件: $configFile"
    Write-Host "存储路径: $baseDir\codebuddy_sessions"
}

function Configure-Lingma {
    Write-Host ""
    Write-Host "配置 Lingma (灵码)..." -ForegroundColor Yellow
    
    $configDir = "$env:APPDATA\Lingma"
    $configFile = "$configDir\mcp-config.json"
    
    New-Item -ItemType Directory -Force -Path $configDir | Out-Null
    
    $config = @{
        mcpServers = @{
            "session-saver" = @{
                command = "npx"
                args = @("-y", "mcp-session-saver")
                env = @{
                    MCP_SESSION_BASE_DIR = "$baseDir\lingma_sessions"
                }
            }
        }
    }
    
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $configFile -Encoding UTF8
    
    Write-Host "✅ Lingma 配置完成" -ForegroundColor Green
    Write-Host "配置文件: $configFile"
    Write-Host "存储路径: $baseDir\lingma_sessions"
}

function Configure-Continue {
    Write-Host ""
    Write-Host "配置 Continue..." -ForegroundColor Yellow
    
    $configDir = "$env:USERPROFILE\.continue"
    $configFile = "$configDir\config.json"
    
    New-Item -ItemType Directory -Force -Path $configDir | Out-Null
    
    $config = @{
        mcpServers = @{
            "session-saver" = @{
                command = "npx"
                args = @("-y", "mcp-session-saver")
                env = @{
                    MCP_SESSION_BASE_DIR = "$baseDir\continue_sessions"
                }
            }
        }
    }
    
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $configFile -Encoding UTF8
    
    Write-Host "✅ Continue 配置完成" -ForegroundColor Green
    Write-Host "配置文件: $configFile"
    Write-Host "存储路径: $baseDir\continue_sessions"
}

function Configure-Aider {
    Write-Host ""
    Write-Host "配置 Aider..." -ForegroundColor Yellow
    
    $configDir = "$env:USERPROFILE\.aider"
    $configFile = "$configDir\mcp.json"
    
    New-Item -ItemType Directory -Force -Path $configDir | Out-Null
    
    $config = @{
        mcpServers = @{
            "session-saver" = @{
                command = "npx"
                args = @("-y", "mcp-session-saver")
                env = @{
                    MCP_SESSION_BASE_DIR = "$baseDir\aider_sessions"
                }
            }
        }
    }
    
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $configFile -Encoding UTF8
    
    Write-Host "✅ Aider 配置完成" -ForegroundColor Green
    Write-Host "配置文件: $configFile"
    Write-Host "存储路径: $baseDir\aider_sessions"
}

# 执行配置
switch ($ideChoice) {
    "1" { Configure-Qoder }
    "2" { Configure-Cursor }
    "3" { Configure-Claude }
    "4" { Configure-Windsurf }
    "5" { Configure-Trae }
    "6" { Configure-Codebuddy }
    "7" { Configure-Lingma }
    "8" { Configure-Continue }
    "9" { Configure-Aider }
    "0" {
        Configure-Qoder
        Configure-Cursor
        Configure-Claude
        Configure-Windsurf
        Configure-Trae
        Configure-Codebuddy
        Configure-Lingma
        Configure-Continue
        Configure-Aider
    }
    default {
        Write-Host "❌ 无效选择" -ForegroundColor Red
        exit 1
    }
}

# 完成提示
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎉 配置完成！" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步:"
Write-Host "1. 完全重启您的 IDE"
Write-Host "2. 在对话中询问: 你有哪些可用的工具?"
Write-Host "3. 应该能看到 mcp_session-saver_* 系列工具"
Write-Host "4. 测试保存: 保存当前会话"
Write-Host ""
Write-Host "如有问题，请查看文档:"
Write-Host "- MULTI_IDE_SETUP.md - 详细配置指南"
Write-Host "- USAGE.md - 使用说明"
Write-Host ""
