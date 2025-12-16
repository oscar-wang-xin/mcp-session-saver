/**
 * 国际化支持模块
 * Internationalization (i18n) support module
 */

// 支持的语言列表
export const SUPPORTED_LANGUAGES = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'];

// 默认语言
const DEFAULT_LANGUAGE = 'zh-CN';

// 当前语言（从环境变量读取，默认中文）
let currentLanguage = process.env.MCP_SESSION_LANGUAGE || DEFAULT_LANGUAGE;

/**
 * 翻译字典
 */
const translations = {
  // 中文（简体）
  'zh-CN': {
    // 会话保存相关
    'session.saved': '✅ 会话已保存到',
    'session.reading': '📖 正在读取会话',
    'session.deleting': '🗑️  正在删除会话',
    'session.deleted': '✅ 会话已删除',
    'session.searching': '🔍 正在搜索会话',
    'session.notFound': '未找到会话文件',
    'session.description': '会话描述',
    'session.content': '会话内容',
    
    // 列表相关
    'list.found': '找到 {count} 个会话',
    'list.noSessions': '未找到任何会话',
    'list.ide': 'IDE',
    'list.date': '日期',
    'list.time': '时间',
    'list.file': '文件',
    'list.size': '大小',
    'list.created': '创建时间',
    
    // 错误消息
    'error.configInvalid': '⚠️  配置错误: {message}',
    'error.envInvalid': '⚠️  环境变量 {name} 无效: {message}',
    'error.pathRequired': '路径不能为空',
    'error.pathTraversal': '路径不能包含 ".." 字符（路径遍历攻击）',
    'error.fileWriteFailed': '文件写入失败，已重试 {retries} 次',
    'error.contentTooLarge': '会话内容过大，超过10MB限制',
    'error.pathUnsafe': '目标路径不安全，可能存在路径遍历攻击',
    'error.fileNotFound': '文件或目录不存在',
    'error.permissionDenied': '权限不足，无法访问文件或目录',
    'error.diskFull': '磁盘空间不足',
    'error.unknown': '❌ 错误: {message}',
    
    // 配置相关
    'config.loading': '正在加载配置...',
    'config.loaded': '配置加载成功',
    'config.validating': '正在验证配置...',
    'config.typeError': 'defaultBaseDir 必须是字符串',
    'config.pathInvalid': 'defaultBaseDir 路径无效',
    'config.parseError': '配置文件解析失败: {message}',
    
    // Markdown 模板
    'markdown.ide': 'IDE',
    'markdown.date': '日期',
    'markdown.time': '时间',
  },
  
  // 英文
  'en-US': {
    // Session related
    'session.saved': '✅ Session saved to',
    'session.reading': '📖 Reading session',
    'session.deleting': '🗑️  Deleting session',
    'session.deleted': '✅ Session deleted',
    'session.searching': '🔍 Searching sessions',
    'session.notFound': 'Session file not found',
    'session.description': 'Session Description',
    'session.content': 'Session Content',
    
    // List related
    'list.found': 'Found {count} session(s)',
    'list.noSessions': 'No sessions found',
    'list.ide': 'IDE',
    'list.date': 'Date',
    'list.time': 'Time',
    'list.file': 'File',
    'list.size': 'Size',
    'list.created': 'Created',
    
    // Error messages
    'error.configInvalid': '⚠️  Config error: {message}',
    'error.envInvalid': '⚠️  Environment variable {name} invalid: {message}',
    'error.pathRequired': 'Path cannot be empty',
    'error.pathTraversal': 'Path cannot contain ".." (path traversal attack)',
    'error.fileWriteFailed': 'File write failed after {retries} retries',
    'error.contentTooLarge': 'Session content too large, exceeds 10MB limit',
    'error.pathUnsafe': 'Target path is unsafe, possible path traversal attack',
    'error.fileNotFound': 'File or directory not found',
    'error.permissionDenied': 'Permission denied, cannot access file or directory',
    'error.diskFull': 'Disk space insufficient',
    'error.unknown': '❌ Error: {message}',
    
    // Config related
    'config.loading': 'Loading configuration...',
    'config.loaded': 'Configuration loaded successfully',
    'config.validating': 'Validating configuration...',
    'config.typeError': 'defaultBaseDir must be a string',
    'config.pathInvalid': 'defaultBaseDir path invalid',
    'config.parseError': 'Config file parse error: {message}',
    
    // Markdown template
    'markdown.ide': 'IDE',
    'markdown.date': 'Date',
    'markdown.time': 'Time',
  },
  
  // 日文
  'ja-JP': {
    // セッション関連
    'session.saved': '✅ セッションが保存されました',
    'session.reading': '📖 セッションを読み込んでいます',
    'session.deleting': '🗑️  セッションを削除しています',
    'session.deleted': '✅ セッションが削除されました',
    'session.searching': '🔍 セッションを検索しています',
    'session.notFound': 'セッションファイルが見つかりません',
    'session.description': 'セッションの説明',
    'session.content': 'セッション内容',
    
    // リスト関連
    'list.found': '{count}個のセッションが見つかりました',
    'list.noSessions': 'セッションが見つかりません',
    'list.ide': 'IDE',
    'list.date': '日付',
    'list.time': '時刻',
    'list.file': 'ファイル',
    'list.size': 'サイズ',
    'list.created': '作成日時',
    
    // エラーメッセージ
    'error.configInvalid': '⚠️  設定エラー: {message}',
    'error.envInvalid': '⚠️  環境変数 {name} が無効です: {message}',
    'error.pathRequired': 'パスを空にすることはできません',
    'error.pathTraversal': 'パスに ".." を含めることはできません（パストラバーサル攻撃）',
    'error.fileWriteFailed': 'ファイル書き込みに失敗しました（{retries}回再試行）',
    'error.contentTooLarge': 'セッション内容が大きすぎます（10MB制限）',
    'error.pathUnsafe': 'ターゲットパスが安全ではありません',
    'error.fileNotFound': 'ファイルまたはディレクトリが見つかりません',
    'error.permissionDenied': '権限が不足しています',
    'error.diskFull': 'ディスク容量が不足しています',
    'error.unknown': '❌ エラー: {message}',
    
    // 設定関連
    'config.loading': '設定を読み込んでいます...',
    'config.loaded': '設定の読み込みに成功しました',
    'config.validating': '設定を検証しています...',
    'config.typeError': 'defaultBaseDirは文字列である必要があります',
    'config.pathInvalid': 'defaultBaseDirパスが無効です',
    'config.parseError': '設定ファイルの解析エラー: {message}',
    
    // Markdownテンプレート
    'markdown.ide': 'IDE',
    'markdown.date': '日付',
    'markdown.time': '時刻',
  },
  
  // 韩文
  'ko-KR': {
    // 세션 관련
    'session.saved': '✅ 세션이 저장되었습니다',
    'session.reading': '📖 세션을 읽는 중입니다',
    'session.deleting': '🗑️  세션을 삭제하는 중입니다',
    'session.deleted': '✅ 세션이 삭제되었습니다',
    'session.searching': '🔍 세션을 검색하는 중입니다',
    'session.notFound': '세션 파일을 찾을 수 없습니다',
    'session.description': '세션 설명',
    'session.content': '세션 내용',
    
    // 목록 관련
    'list.found': '{count}개의 세션을 찾았습니다',
    'list.noSessions': '세션을 찾을 수 없습니다',
    'list.ide': 'IDE',
    'list.date': '날짜',
    'list.time': '시간',
    'list.file': '파일',
    'list.size': '크기',
    'list.created': '생성 시간',
    
    // 오류 메시지
    'error.configInvalid': '⚠️  구성 오류: {message}',
    'error.envInvalid': '⚠️  환경 변수 {name}가 유효하지 않습니다: {message}',
    'error.pathRequired': '경로는 비워둘 수 없습니다',
    'error.pathTraversal': '경로에 ".."를 포함할 수 없습니다(경로 순회 공격)',
    'error.fileWriteFailed': '파일 쓰기 실패({retries}회 재시도)',
    'error.contentTooLarge': '세션 내용이 너무 큽니다(10MB 제한)',
    'error.pathUnsafe': '대상 경로가 안전하지 않습니다',
    'error.fileNotFound': '파일 또는 디렉토리를 찾을 수 없습니다',
    'error.permissionDenied': '권한이 부족합니다',
    'error.diskFull': '디스크 공간이 부족합니다',
    'error.unknown': '❌ 오류: {message}',
    
    // 구성 관련
    'config.loading': '구성을 로드하는 중...',
    'config.loaded': '구성 로드 성공',
    'config.validating': '구성을 검증하는 중...',
    'config.typeError': 'defaultBaseDir은 문자열이어야 합니다',
    'config.pathInvalid': 'defaultBaseDir 경로가 유효하지 않습니다',
    'config.parseError': '구성 파일 파싱 오류: {message}',
    
    // Markdown 템플릿
    'markdown.ide': 'IDE',
    'markdown.date': '날짜',
    'markdown.time': '시간',
  }
};

/**
 * 设置当前语言
 * @param {string} lang 语言代码 (zh-CN, en-US, ja-JP, ko-KR)
 */
export function setLanguage(lang) {
  if (SUPPORTED_LANGUAGES.includes(lang)) {
    currentLanguage = lang;
  } else {
    console.warn(`⚠️  Unsupported language: ${lang}, using default: ${DEFAULT_LANGUAGE}`);
    currentLanguage = DEFAULT_LANGUAGE;
  }
}

/**
 * 获取当前语言
 * @returns {string}
 */
export function getLanguage() {
  return currentLanguage;
}

/**
 * 获取翻译文本
 * @param {string} key 翻译键
 * @param {Object} params 参数对象（用于替换占位符）
 * @returns {string} 翻译后的文本
 */
export function t(key, params = {}) {
  const langDict = translations[currentLanguage] || translations[DEFAULT_LANGUAGE];
  let text = langDict[key] || translations[DEFAULT_LANGUAGE][key] || key;
  
  // 替换占位符 {param}
  Object.keys(params).forEach(param => {
    text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
  });
  
  return text;
}

/**
 * 获取所有支持的语言
 * @returns {Array<{code: string, name: string}>}
 */
export function getSupportedLanguages() {
  return [
    { code: 'zh-CN', name: '简体中文' },
    { code: 'en-US', name: 'English' },
    { code: 'ja-JP', name: '日本語' },
    { code: 'ko-KR', name: '한국어' }
  ];
}

/**
 * 检测系统语言
 * @returns {string}
 */
export function detectSystemLanguage() {
  // 从环境变量检测
  const envLang = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL;
  
  if (envLang) {
    // 提取语言代码 (例如: zh_CN.UTF-8 -> zh-CN)
    const langCode = envLang.split('.')[0].replace('_', '-');
    
    // 匹配支持的语言
    const matched = SUPPORTED_LANGUAGES.find(lang => 
      lang.toLowerCase().startsWith(langCode.toLowerCase())
    );
    
    if (matched) return matched;
  }
  
  return DEFAULT_LANGUAGE;
}

// 自动检测语言（如果未设置 MCP_SESSION_LANGUAGE）
if (!process.env.MCP_SESSION_LANGUAGE) {
  currentLanguage = detectSystemLanguage();
}
