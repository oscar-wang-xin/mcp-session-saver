# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.2] - 2025-12-16

### Changed

#### 🔧 MCP Tool Description Optimization
- **Enhanced save_session tool guidance**: Added comprehensive step-by-step instructions in tool description to ensure AI assistant properly collects complete conversation history before saving
- **Improved content parameter description**: Added detailed requirements and examples to prevent summarization and ensure full conversation preservation
- **Better error prevention**: Added explicit warnings about prohibited behaviors (summarization, incomplete history, simplified formats)

#### 📝 Technical Improvements
- **Bidirectional interaction workaround**: While MCP protocol doesn't support bidirectional communication (tools cannot request data from AI), the optimized prompts guide the AI to proactively prepare complete conversation content
- **Enhanced user experience**: When users say "save current session", AI will now automatically organize full conversation history before calling MCP tool

### Technical Details

**Problem Solved**: 
- Previous behavior: AI might save conversation summaries instead of complete original dialogues
- New behavior: Strongly guided prompts ensure AI collects and formats complete conversation history

**Implementation**:
```
⚠️ Steps AI must execute before calling tool:
1. Internally organize complete conversation history
2. Format all user questions and AI answers in chronological order
3. Use clear Markdown format (# User, # AI Assistant headers)
4. Pass organized complete conversation as content parameter

❌ Prohibited behaviors:
- Passing conversation summaries
- Omitting any historical Q&A
- Using simplified formats

✅ Correct format example:
# User
[Complete content of first question...]

# AI Assistant
[Complete content of first answer...]
```

### Documentation
- No user-facing documentation updates required - changes are in tool descriptions only

---

## [1.3.1] - 2025-12-16

### Added
- 🌍 **Internationalization support** (i18n) for 4 languages:
  - Chinese (简体中文)
  - English
  - Japanese (日本語)
  - Korean (한국어)
- 📝 Bilingual README files with language switcher links
- 🔧 Configuration validation on startup
- 🔄 File write retry mechanism with exponential backoff
- 🧪 Comprehensive edge case testing
- 📚 I18N.md documentation

### Changed
- 📁 Reorganized project structure:
  - IDE configurations → `configs/`
  - Quick setup tools → `tools/`
  - Tests → `test/`
  - Documentation → `docs/`
  - Development notes → `dev/` (gitignored)
- ✨ Optimized MCP tool trigger prompts for better recognition
- 📦 Enhanced npm package configuration

### Fixed
- 🐛 Performance optimization for saving MD files
- 🔒 Path security validation to prevent traversal attacks
- ⚡ Directory caching to avoid repeated directory creation (99% reduction)

### Performance
- 🚀 10-28x faster single session save
- 🚀 28x faster consecutive saves (100 sessions)
- 🚀 11x higher throughput (558 sessions/sec vs 50/sec)

---

## [1.3.0] - 2025-12-15

### Added
- 🎯 Multi-IDE support configurations:
  - Qoder
  - Claude Desktop
  - Cursor
  - VSCode (Cline/Continue)
  - Windsurf (Codeium)
  - Aider
  - Trae
  - Codebuddy
  - Lingma
- 🛠️ Quick setup tools for automatic MCP configuration
- 📝 Comprehensive documentation (USAGE.md, MULTI_IDE_SETUP.md)

### Changed
- 🔧 Made `base_dir` parameter optional with smart defaults
- 📝 Enhanced tool descriptions with usage examples

---

## [1.2.0] - 2025-12-14

### Added
- ✅ Configuration file support (`config.json`)
- 🔍 Session search functionality
- 📋 Session listing with filtering
- 📖 Session reading
- 🗑️ Session deletion

### Changed
- 🎨 Improved file organization structure
- 📝 Enhanced Markdown output format

---

## [1.1.0] - 2025-12-13

### Added
- 💾 Basic session saving functionality
- 📂 Automatic directory creation
- 🕒 Timestamp-based file naming
- 📝 Markdown file generation

---

## [1.0.0] - 2025-12-12

### Added
- 🎉 Initial release
- 🔧 Basic MCP server setup
- 📦 Project structure
