export type Locale = 'en' | 'zh';

export type MessageKey =
  | 'nav.prompts'
  | 'nav.guides'
  | 'nav.bookmarks'
  | 'nav.howItWorks'
  | 'nav.privacy'
  | 'nav.launchApp'
  | 'toggle.theme.dark'
  | 'toggle.theme.light'
  | 'toggle.locale.en'
  | 'toggle.locale.zh'
  | 'app.header.kicker'
  | 'app.header.title'
  | 'app.header.subtitle'
  | 'journal.label'
  | 'journal.placeholder'
  | 'journal.wordMinimum'
  | 'journal.new'
  | 'journal.save'
  | 'journal.getInsights'
  | 'journal.analyzing'
  | 'journal.confirmUpdateClearsInsights'
  | 'journal.confirmDeleteEntry'
  | 'journal.confirmClearHistory'
  | 'history.title'
  | 'history.kicker'
  | 'history.subtitle.empty'
  | 'history.subtitle.stats'
  | 'history.export'
  | 'history.export.markdown'
  | 'history.export.json'
  | 'history.import'
  | 'history.clear'
  | 'history.searchPlaceholder'
  | 'history.filter.all'
  | 'history.filter.positive'
  | 'history.filter.negative'
  | 'history.mood.positive'
  | 'history.mood.negative'
  | 'history.moodRatio'
  | 'history.basedOnAnalyzed'
  | 'history.recurringThemes'
  | 'history.recurringThemes.empty'
  | 'history.entry.savedNotAnalyzed'
  | 'history.entry.load'
  | 'history.entry.analyze'
  | 'history.entry.delete'
  | 'history.entry.noInsights'
  | 'history.entry.words'
  | 'history.empty.title'
  | 'history.empty.subtitle'
  | 'history.empty.clearFilters'
  | 'history.activity'
  | 'history.activity.streak'
  | 'history.activity.last30'
  | 'history.view.list'
  | 'history.view.calendar'
  | 'history.calendar.daySummary'
  | 'history.calendar.selectDay'
  | 'history.calendar.noEntries'
  | 'promptSelector.title'
  | 'insights.emotion.title'
  | 'insights.emotion.confidence'
  | 'insights.theme.title'
  | 'insights.reflection.title'
  | 'insights.reflection.technique'
  | 'analysis.error.empty'
  | 'analysis.error.tooShort'
  | 'analysis.notice.simplified.language'
  | 'analysis.notice.simplified.modelsFailed'
  | 'feedback.title'
  | 'feedback.helpful'
  | 'feedback.notHelpful'
  | 'firstTimeSetup.kicker'
  | 'firstTimeSetup.title'
  | 'firstTimeSetup.body'
  | 'firstTimeSetup.footer'
  | 'error.title'
  | 'error.retry'
  | 'error.troubleshooting.title'
  | 'error.troubleshooting.network.checkConnection'
  | 'error.troubleshooting.network.refresh'
  | 'error.troubleshooting.network.disableVpn'
  | 'error.troubleshooting.security.disableExtensions'
  | 'error.troubleshooting.security.allowThirdParty'
  | 'error.troubleshooting.security.tryDifferentBrowser'
  | 'error.troubleshooting.timeout.checkSpeed'
  | 'error.troubleshooting.timeout.tryAgain'
  | 'diagnostics.button'
  | 'diagnostics.title'
  | 'diagnostics.subtitle'
  | 'diagnostics.run'
  | 'diagnostics.running'
  | 'browserWarning.title'
  | 'browserWarning.getChrome'
  | 'browserWarning.dismiss'
  | 'browserWarning.reason.noWebAssembly'
  | 'browserWarning.reason.noIndexedDB'
  | 'browserWarning.reason.noLocalStorage'
  | 'browserWarning.reason.noFetch'
  | 'browserWarning.reason.generic'
  | 'privacy.title'
  | 'privacy.subtitle'
  | 'privacy.howItWorks'
  | 'privacy.whatWeLog'
  | 'privacy.weCollect'
  | 'privacy.weNeverCollect'
  | 'privacy.trustChecklist'
  | 'privacy.footer'
  | 'vault.title'
  | 'vault.setPassword'
  | 'vault.locked'
  | 'vault.unlocked'
  | 'vault.description'
  | 'vault.unlockTitle'
  | 'vault.lockedTitle'
  | 'vault.setupTitle'
  | 'vault.passwordPlaceholder'
  | 'vault.confirmPasswordPlaceholder'
  | 'vault.newPasswordPlaceholder'
  | 'vault.confirmNewPasswordPlaceholder'
  | 'vault.unlockPlaceholder'
  | 'vault.enableButton'
  | 'vault.enablingButton'
  | 'vault.unlockButton'
  | 'vault.unlockingButton'
  | 'vault.lockButton'
  | 'vault.changePasswordButton'
  | 'vault.disableButton'
  | 'vault.workingButton'
  | 'vault.saveButton'
  | 'vault.savingButton'
  | 'vault.backButton'
  | 'vault.error.passwordTooShort'
  | 'vault.error.passwordsNotMatch'
  | 'vault.error.enableFailed'
  | 'vault.error.incorrectPassword'
  | 'vault.error.unlockFailed'
  | 'vault.error.newPasswordTooShort'
  | 'vault.error.newPasswordsNotMatch'
  | 'vault.error.changeFailed'
  | 'vault.confirmDisable'
  | 'vault.error.disableFailed'
  | 'bookmarks.empty.title'
  | 'bookmarks.empty.subtitle'
  | 'bookmarks.empty.browseButton'
  | 'bookmarks.stats.singular'
  | 'bookmarks.stats.plural'
  | 'bookmarks.stats.showing'
  | 'bookmarks.clearAll'
  | 'bookmarks.confirmClearAll'
  | 'bookmarks.filter.all'
  | 'bookmarks.category.noBookmarks'
  | 'bookmarks.button.add'
  | 'bookmarks.button.remove'
  | 'bookmarks.button.addTitle'
  | 'bookmarks.button.removeTitle'
  | 'promptCard.copy'
  | 'promptCard.copied'
  | 'promptCard.tryWithAI'
  | 'diagnostics.troubleshooting'
  | 'diagnostics.tip.disableExtensions'
  | 'diagnostics.tip.checkConnection'
  | 'diagnostics.tip.tryDifferentBrowser'
  | 'diagnostics.tip.disableVPN'
  | 'diagnostics.tip.checkFirewall'
  | 'common.close'
  | 'common.of';

export const MESSAGES: Record<Locale, Record<MessageKey, string>> = {
  en: {
    'nav.prompts': 'Prompts',
    'nav.guides': 'Guides',
    'nav.bookmarks': 'Bookmarks',
    'nav.howItWorks': 'How it works',
    'nav.privacy': 'Privacy',
    'nav.launchApp': 'Launch app',
    'toggle.theme.dark': 'Dark',
    'toggle.theme.light': 'Light',
    'toggle.locale.en': 'EN',
    'toggle.locale.zh': '中文',
    'app.header.kicker': 'journalingtechniques.ai / Private AI Lab',
    'app.header.title': 'On-device AI journaling workspace',
    'app.header.subtitle':
      'Everything you write stays on this device. Need proof? Open DevTools → Network tab and watch as we make exactly zero requests when you click “Get insights”.',
    'journal.label': 'Your journal',
    'journal.placeholder': 'Start writing here…',
    'journal.wordMinimum': '{count} / {min} word minimum',
    'journal.new': 'New',
    'journal.save': 'Save',
    'journal.getInsights': '✨ Get insights',
    'journal.analyzing': 'Analyzing locally…',
    'journal.confirmUpdateClearsInsights':
      'Updating this entry will clear its AI insights (since the text changed). Continue?',
    'journal.confirmDeleteEntry': 'Delete this entry? This cannot be undone.',
    'journal.confirmClearHistory':
      'Are you sure you want to clear your journal history? This cannot be undone.',
    'history.title': 'Recent entries & mood trend',
    'history.kicker': 'Timeline',
    'history.subtitle.empty':
      'Save entries first. Run analysis whenever you want.',
    'history.subtitle.stats':
      'Showing analysis stats for {count} analyzed entr{plural}.',
    'history.export': 'Export',
    'history.export.markdown': 'Download as Markdown',
    'history.export.json': 'Download as JSON',
    'history.import': 'Import',
    'history.clear': 'Clear history',
    'history.searchPlaceholder': 'Search your journal entries...',
    'history.filter.all': 'All',
    'history.filter.positive': '😊 Positive',
    'history.filter.negative': '😔 Negative',
    'history.mood.positive': 'positive',
    'history.mood.negative': 'negative',
    'history.moodRatio': 'Mood ratio',
    'history.basedOnAnalyzed': 'Based on {count} analyzed entr{plural}',
    'history.recurringThemes': 'Recurring themes',
    'history.recurringThemes.empty': 'Analyze an entry to see themes here.',
    'history.entry.savedNotAnalyzed': 'Saved entry (not analyzed)',
    'history.entry.load': 'Load',
    'history.entry.analyze': 'Analyze',
    'history.entry.delete': 'Delete',
    'history.entry.noInsights':
      'No AI insights yet. You can analyze later or keep it as a private note.',
    'history.entry.words': '{count} words',
    'history.empty.title': 'No entries found',
    'history.empty.subtitle': 'Try adjusting your search or filters',
    'history.empty.clearFilters': 'Clear filters',
    'history.activity': 'Activity',
    'history.activity.streak': 'Current streak: {count} day{plural}',
    'history.activity.last30': 'Last 30 days (entries saved or analyzed).',
    'history.view.list': 'List',
    'history.view.calendar': 'Calendar',
    'history.calendar.daySummary': '{day} ({count})',
    'history.calendar.selectDay': 'Select a day to view entries',
    'history.calendar.noEntries': 'No entries for this day.',
    'promptSelector.title': 'Guided templates',
    'insights.emotion.title': 'Your emotional tone',
    'insights.emotion.confidence': 'Confidence: {percent}%',
    'insights.theme.title': 'Your main theme',
    'insights.reflection.title': 'A reflection to explore',
    'insights.reflection.technique': 'Technique: {technique}',
    'analysis.error.empty': 'Please write at least a few words.',
    'analysis.error.tooShort':
      'Please write at least a few sentences (20+ characters) for better analysis.',
    'analysis.notice.simplified.language':
      'Note: Using simplified analysis because the current AI models are optimized for English.',
    'analysis.notice.simplified.modelsFailed':
      'Note: Using simplified analysis because AI models could not be loaded.',
    'feedback.title': 'Was this helpful?',
    'feedback.helpful': '👍 Helpful',
    'feedback.notHelpful': '👎 Not really',
    'firstTimeSetup.kicker': 'First-time setup',
    'firstTimeSetup.title': 'Downloading local AI models…',
    'firstTimeSetup.body':
      'This happens once per browser. Models are cached securely on your device so future analyses start instantly.',
    'firstTimeSetup.footer':
      '🔒 Nothing is uploading — we are downloading the AI to you ({progress}% complete)',
    'error.title': 'Something went wrong',
    'error.retry': 'Try again',
    'error.troubleshooting.title': 'Troubleshooting tips:',
    'error.troubleshooting.network.checkConnection':
      'Check your internet connection',
    'error.troubleshooting.network.refresh': 'Try refreshing the page',
    'error.troubleshooting.network.disableVpn': 'Disable VPN if enabled',
    'error.troubleshooting.security.disableExtensions':
      'Try disabling ad blockers or privacy extensions',
    'error.troubleshooting.security.allowThirdParty':
      'Check if your browser allows third-party resources',
    'error.troubleshooting.security.tryDifferentBrowser':
      'Try a different browser (Chrome, Firefox, or Safari)',
    'error.troubleshooting.timeout.checkSpeed': 'Check your internet speed',
    'error.troubleshooting.timeout.tryAgain':
      'Try again when you have a better connection',
    'diagnostics.button': '🔧 AI Diagnostics',
    'diagnostics.title': 'AI Model Diagnostics',
    'diagnostics.subtitle':
      'Run diagnostics to identify why AI models are failing to load.',
    'diagnostics.run': 'Run Diagnostics',
    'diagnostics.running': 'Running tests...',
    'browserWarning.title': 'Browser compatibility warning',
    'browserWarning.getChrome': 'Get Chrome',
    'browserWarning.dismiss': 'Dismiss',
    'browserWarning.reason.noWebAssembly':
      'WebAssembly not supported. Please use Chrome 90+, Safari 15+, or Firefox 90+.',
    'browserWarning.reason.noIndexedDB':
      'IndexedDB not supported. Please upgrade your browser.',
    'browserWarning.reason.noLocalStorage':
      'Local storage not supported. Please enable cookies/storage.',
    'browserWarning.reason.noFetch':
      'Fetch API not supported. Please upgrade your browser.',
    'browserWarning.reason.generic': 'Browser not fully supported.',
    'privacy.title': 'Privacy Promise',
    'privacy.subtitle':
      'journalingtechniques.ai was built for people who refuse to compromise on privacy. Our entire architecture makes it mathematically impossible for us to touch your journal text.',
    'privacy.howItWorks': 'How it works',
    'privacy.whatWeLog': 'What we log (and what we never will)',
    'privacy.weCollect': 'We collect',
    'privacy.weNeverCollect': 'We never collect',
    'privacy.trustChecklist': 'Trust checklist',
    'privacy.footer':
      'Need extra assurance? Open DevTools → Network tab and watch the silence while you journal. Or email privacy@journalingtechniques.ai for a full threat-model walkthrough.',
    'vault.title': 'Vault',
    'vault.setPassword': 'Set password',
    'vault.locked': 'Locked',
    'vault.unlocked': 'Unlocked',
    'vault.description':
      'When enabled: drafts, history, bookmarks, and reading progress are encrypted locally with AES‑GCM. The password is never uploaded and cannot be recovered.',
    'vault.unlockTitle': 'Unlocked (data encrypted)',
    'vault.lockedTitle': 'Locked (password required)',
    'vault.setupTitle': 'Enable on-device encryption',
    'vault.passwordPlaceholder': 'Set a password (min 8 chars)',
    'vault.confirmPasswordPlaceholder': 'Confirm password',
    'vault.newPasswordPlaceholder': 'New password (min 8 chars)',
    'vault.confirmNewPasswordPlaceholder': 'Confirm new password',
    'vault.unlockPlaceholder': 'Enter password to unlock',
    'vault.enableButton': 'Enable encryption',
    'vault.enablingButton': 'Enabling…',
    'vault.unlockButton': 'Unlock',
    'vault.unlockingButton': 'Unlocking…',
    'vault.lockButton': 'Lock now',
    'vault.changePasswordButton': 'Change password',
    'vault.disableButton': 'Disable vault',
    'vault.workingButton': 'Working…',
    'vault.saveButton': 'Save',
    'vault.savingButton': 'Saving…',
    'vault.backButton': 'Back',
    'vault.error.passwordTooShort': 'Password must be at least 8 characters.',
    'vault.error.passwordsNotMatch': 'Passwords do not match.',
    'vault.error.enableFailed': 'Failed to enable vault. Please try again.',
    'vault.error.incorrectPassword': 'Incorrect password.',
    'vault.error.unlockFailed': 'Failed to unlock.',
    'vault.error.newPasswordTooShort':
      'New password must be at least 8 characters.',
    'vault.error.newPasswordsNotMatch': 'Passwords do not match.',
    'vault.error.changeFailed':
      'Failed to change password (vault may be locked).',
    'vault.confirmDisable':
      'Disabling the vault will write your data back to local storage in plaintext. Continue?',
    'vault.error.disableFailed': 'Failed to disable (please unlock first).',
    'bookmarks.empty.title': 'No bookmarks yet',
    'bookmarks.empty.subtitle':
      'Start bookmarking prompts to save them for quick access',
    'bookmarks.empty.browseButton': 'Browse prompts →',
    'bookmarks.stats.singular': 'bookmark',
    'bookmarks.stats.plural': 'bookmarks',
    'bookmarks.stats.showing': 'showing',
    'bookmarks.clearAll': 'Clear all bookmarks',
    'bookmarks.confirmClearAll':
      'Are you sure you want to remove all bookmarks? This cannot be undone.',
    'bookmarks.filter.all': 'All',
    'bookmarks.category.noBookmarks': 'No bookmarks in this category',
    'bookmarks.button.add': 'Add bookmark',
    'bookmarks.button.remove': 'Remove bookmark',
    'bookmarks.button.addTitle': 'Add to bookmarks',
    'bookmarks.button.removeTitle': 'Remove from bookmarks',
    'promptCard.copy': 'Copy prompt',
    'promptCard.copied': '✓ Copied',
    'promptCard.tryWithAI': 'Try with AI →',
    'diagnostics.troubleshooting': 'Troubleshooting:',
    'diagnostics.tip.disableExtensions':
      'Try disabling browser extensions (ad blockers, privacy tools)',
    'diagnostics.tip.checkConnection': 'Check your internet connection',
    'diagnostics.tip.tryDifferentBrowser':
      'Try a different browser (Chrome, Firefox, Safari)',
    'diagnostics.tip.disableVPN': 'Disable VPN if enabled',
    'diagnostics.tip.checkFirewall':
      'Check if your firewall is blocking requests',
    'common.close': 'Close',
    'common.of': 'of',
  },
  zh: {
    'nav.prompts': '提示词库',
    'nav.guides': '指南',
    'nav.bookmarks': '收藏',
    'nav.howItWorks': '如何工作',
    'nav.privacy': '隐私',
    'nav.launchApp': '打开应用',
    'toggle.theme.dark': '深色',
    'toggle.theme.light': '浅色',
    'toggle.locale.en': 'EN',
    'toggle.locale.zh': '中文',
    'app.header.kicker': 'journalingtechniques.ai / 私密 AI 实验室',
    'app.header.title': '端侧 AI 日记工作台',
    'app.header.subtitle':
      '你写的每一个字都留在本机。想验证？打开开发者工具 → Network，看你点击“获取洞察”时网络请求为 0。',
    'journal.label': '你的日记',
    'journal.placeholder': '从这里开始写…',
    'journal.wordMinimum': '{count} / 最少 {min} 字/词',
    'journal.new': '新建',
    'journal.save': '保存',
    'journal.getInsights': '✨ 获取洞察',
    'journal.analyzing': '本地分析中…',
    'journal.confirmUpdateClearsInsights':
      '更新这条记录会清除已有的 AI 洞察（因为文本已改变）。确定继续？',
    'journal.confirmDeleteEntry': '删除这条记录？此操作无法撤销。',
    'journal.confirmClearHistory': '确定清空日记历史？此操作无法撤销。',
    'history.title': '最近记录与情绪趋势',
    'history.kicker': '时间线',
    'history.subtitle.empty': '先保存记录，想分析时再分析。',
    'history.subtitle.stats': '统计基于 {count} 条已分析记录。',
    'history.export': '导出',
    'history.export.markdown': '下载 Markdown',
    'history.export.json': '下载 JSON',
    'history.import': '导入',
    'history.clear': '清空历史',
    'history.searchPlaceholder': '搜索你的日记内容…',
    'history.filter.all': '全部',
    'history.filter.positive': '😊 正向',
    'history.filter.negative': '😔 负向',
    'history.mood.positive': '正向',
    'history.mood.negative': '负向',
    'history.moodRatio': '情绪占比',
    'history.basedOnAnalyzed': '基于 {count} 条已分析记录',
    'history.recurringThemes': '高频主题',
    'history.recurringThemes.empty': '分析一条记录后，这里会显示主题。',
    'history.entry.savedNotAnalyzed': '已保存（未分析）',
    'history.entry.load': '载入',
    'history.entry.analyze': '分析',
    'history.entry.delete': '删除',
    'history.entry.noInsights':
      '还没有 AI 洞察。你可以之后再分析，或就当作纯私密笔记。',
    'history.entry.words': '{count} 字/词',
    'history.empty.title': '没有找到记录',
    'history.empty.subtitle': '试试调整搜索或筛选条件',
    'history.empty.clearFilters': '清除筛选',
    'history.activity': '活跃度',
    'history.activity.streak': '连续：{count} 天',
    'history.activity.last30': '最近 30 天（已保存或已分析）。',
    'history.view.list': '列表',
    'history.view.calendar': '日历',
    'history.calendar.daySummary': '{day} 的记录（{count}）',
    'history.calendar.selectDay': '选择一天查看记录',
    'history.calendar.noEntries': '这一天没有记录',
    'promptSelector.title': '引导模板',
    'insights.emotion.title': '你的情绪倾向',
    'insights.emotion.confidence': '置信度：{percent}%',
    'insights.theme.title': '主要主题',
    'insights.reflection.title': '一个可以继续探索的问题',
    'insights.reflection.technique': '方法：{technique}',
    'analysis.error.empty': '请先写几句话再分析。',
    'analysis.error.tooShort': '请至少写几句（20+ 字符）再分析，效果更好。',
    'analysis.notice.simplified.language':
      '提示：当前 AI 模型主要针对英文优化，本条使用简化分析。',
    'analysis.notice.simplified.modelsFailed':
      '提示：AI 模型加载失败，本条使用简化分析。',
    'feedback.title': '这些洞察有帮助吗？',
    'feedback.helpful': '👍 有帮助',
    'feedback.notHelpful': '👎 一般',
    'firstTimeSetup.kicker': '首次配置',
    'firstTimeSetup.title': '正在下载本地 AI 模型…',
    'firstTimeSetup.body':
      '每个浏览器只需一次。模型会安全缓存到你的设备，之后离线也能更快分析。',
    'firstTimeSetup.footer':
      '🔒 没有上传任何内容 —— 我们只是把 AI 下载到你的设备（{progress}%）',
    'error.title': '出现问题',
    'error.retry': '再试一次',
    'error.troubleshooting.title': '排查建议：',
    'error.troubleshooting.network.checkConnection': '检查网络连接',
    'error.troubleshooting.network.refresh': '尝试刷新页面',
    'error.troubleshooting.network.disableVpn': '如果开着 VPN，试试关闭',
    'error.troubleshooting.security.disableExtensions':
      '尝试暂时关闭广告拦截/隐私类扩展',
    'error.troubleshooting.security.allowThirdParty':
      '检查浏览器是否允许加载第三方资源',
    'error.troubleshooting.security.tryDifferentBrowser':
      '换个浏览器试试（Chrome / Firefox / Safari）',
    'error.troubleshooting.timeout.checkSpeed': '检查网速',
    'error.troubleshooting.timeout.tryAgain': '网络更稳定时再试一次',
    'diagnostics.button': '🔧 AI 诊断',
    'diagnostics.title': 'AI 模型诊断',
    'diagnostics.subtitle': '运行诊断以定位模型为何加载失败。',
    'diagnostics.run': '开始诊断',
    'diagnostics.running': '诊断中…',
    'browserWarning.title': '浏览器兼容性提示',
    'browserWarning.getChrome': '下载 Chrome',
    'browserWarning.dismiss': '关闭',
    'browserWarning.reason.noWebAssembly':
      '当前浏览器不支持 WebAssembly。请使用 Chrome 90+、Safari 15+ 或 Firefox 90+。',
    'browserWarning.reason.noIndexedDB':
      '当前浏览器不支持 IndexedDB。请升级浏览器。',
    'browserWarning.reason.noLocalStorage':
      '当前浏览器无法使用本地存储。请启用 Cookies/存储权限。',
    'browserWarning.reason.noFetch':
      '当前浏览器不支持 Fetch API。请升级浏览器。',
    'browserWarning.reason.generic': '当前浏览器可能无法完整运行此应用。',
    'privacy.title': '隐私承诺',
    'privacy.subtitle':
      'journalingtechniques.ai 为拒绝牺牲隐私的人而生。我们的架构让“触碰你的日记文本”在数学意义上不可能发生。',
    'privacy.howItWorks': '工作方式',
    'privacy.whatWeLog': '我们记录什么（以及永远不会记录什么）',
    'privacy.weCollect': '我们会收集',
    'privacy.weNeverCollect': '我们永不收集',
    'privacy.trustChecklist': '可信清单',
    'privacy.footer':
      '想更放心？打开开发者工具 → Network，写日记时你会看到一片安静。或发邮件到 privacy@journalingtechniques.ai 获取完整威胁模型说明。',
    'vault.title': '密码保护',
    'vault.setPassword': '设置密码',
    'vault.locked': '已锁定',
    'vault.unlocked': '已解锁',
    'vault.description':
      '启用后：日记草稿、历史、收藏、阅读进度会在本机用 AES-GCM 加密。密码不会上传，也无法找回。',
    'vault.unlockTitle': '已解锁（数据已加密）',
    'vault.lockedTitle': '已锁定（需要密码）',
    'vault.setupTitle': '启用端侧加密',
    'vault.passwordPlaceholder': '设置密码（至少 8 位）',
    'vault.confirmPasswordPlaceholder': '再次输入密码',
    'vault.newPasswordPlaceholder': '新密码（至少 8 位）',
    'vault.confirmNewPasswordPlaceholder': '确认新密码',
    'vault.unlockPlaceholder': '输入密码解锁',
    'vault.enableButton': '启用加密',
    'vault.enablingButton': '启用中…',
    'vault.unlockButton': '解锁',
    'vault.unlockingButton': '解锁中…',
    'vault.lockButton': '立即上锁',
    'vault.changePasswordButton': '修改密码',
    'vault.disableButton': '关闭密码保护',
    'vault.workingButton': '处理中…',
    'vault.saveButton': '保存',
    'vault.savingButton': '保存中…',
    'vault.backButton': '返回',
    'vault.error.passwordTooShort': '密码至少 8 位',
    'vault.error.passwordsNotMatch': '两次输入的密码不一致',
    'vault.error.enableFailed': '启用失败，请重试。',
    'vault.error.incorrectPassword': '密码错误',
    'vault.error.unlockFailed': '解锁失败',
    'vault.error.newPasswordTooShort': '新密码至少 8 位',
    'vault.error.newPasswordsNotMatch': '两次输入的新密码不一致',
    'vault.error.changeFailed': '修改失败（可能未解锁）',
    'vault.confirmDisable':
      '关闭密码保护会把数据以明文形式写回本机存储。确定继续？',
    'vault.error.disableFailed': '关闭失败（请先解锁）',
    'bookmarks.empty.title': '还没有收藏',
    'bookmarks.empty.subtitle': '收藏提示词以便快速访问',
    'bookmarks.empty.browseButton': '浏览提示词 →',
    'bookmarks.stats.singular': '条收藏',
    'bookmarks.stats.plural': '条收藏',
    'bookmarks.stats.showing': '显示',
    'bookmarks.clearAll': '清空所有收藏',
    'bookmarks.confirmClearAll': '确定移除所有收藏？此操作无法撤销。',
    'bookmarks.filter.all': '全部',
    'bookmarks.category.noBookmarks': '此类别暂无收藏',
    'bookmarks.button.add': '添加收藏',
    'bookmarks.button.remove': '移除收藏',
    'bookmarks.button.addTitle': '添加到收藏',
    'bookmarks.button.removeTitle': '从收藏中移除',
    'promptCard.copy': '复制提示词',
    'promptCard.copied': '✓ 已复制',
    'promptCard.tryWithAI': '用 AI 试试 →',
    'diagnostics.troubleshooting': '排查建议：',
    'diagnostics.tip.disableExtensions': '尝试暂时关闭广告拦截/隐私类扩展',
    'diagnostics.tip.checkConnection': '检查网络连接',
    'diagnostics.tip.tryDifferentBrowser':
      '换个浏览器试试（Chrome / Firefox / Safari）',
    'diagnostics.tip.disableVPN': '如果开着 VPN，试试关闭',
    'diagnostics.tip.checkFirewall': '检查防火墙是否拦截了请求',
    'common.close': '关闭',
    'common.of': '共',
  },
};
