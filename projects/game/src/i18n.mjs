export const LANGUAGES = ['en', 'zh', 'hi', 'es', 'fr', 'ar', 'pt']
export const DEFAULT_LANGUAGE = 'en'
export const FALLBACK_LANGUAGE = 'en'
export const LANGUAGE_KEY = 'minefield.language.v2'

export const LANGUAGE_PATHS = { en: '/', zh: '/zh/', hi: '/hi/', es: '/es/', fr: '/fr/', ar: '/ar/', pt: '/pt/' }
export const LANGUAGE_NAMES = { en: 'English', zh: '中文', hi: 'हिन्दी', es: 'Español', fr: 'Français', ar: 'العربية', pt: 'Português' }
export const HTML_LANG = { en: 'en', zh: 'zh-CN', hi: 'hi', es: 'es', fr: 'fr', ar: 'ar', pt: 'pt-BR' }
export const RTL_LANGUAGES = ['ar']

const BOT_PATTERN = /bot|crawl|spider|slurp|bingpreview|lighthouse|facebookexternalhit/i

export function languageFromPath (pathname) {
  const segment = pathname.split('/')[1]
  return LANGUAGES.includes(segment) && segment !== DEFAULT_LANGUAGE
    ? segment
    : DEFAULT_LANGUAGE
}

export function detectLanguage (browserLanguages = []) {
  for (const tag of browserLanguages) {
    const primary = String(tag).toLowerCase().split('-')[0]
    if (LANGUAGES.includes(primary)) return primary
  }
  return FALLBACK_LANGUAGE
}

export function isBot (userAgent = '') {
  return BOT_PATTERN.test(userAgent)
}

export function readStoredLanguage (storage) {
  try {
    const stored = storage.getItem(LANGUAGE_KEY)
    return LANGUAGES.includes(stored) ? stored : null
  } catch {
    return null
  }
}

export function storeLanguage (storage, language) {
  try {
    storage.setItem(LANGUAGE_KEY, language)
  } catch {
    // Preference is optional; the URL still selects the language.
  }
}

// Only the default (root) URL auto-detects: explicit /en/ and /es/ URLs and crawlers are never redirected.
export function getRedirectPath ({ pathname, browserLanguages, userAgent, storage }) {
  if (pathname !== LANGUAGE_PATHS[DEFAULT_LANGUAGE] || isBot(userAgent)) return null

  const language = readStoredLanguage(storage) ?? detectLanguage(browserLanguages)
  return language === DEFAULT_LANGUAGE ? null : LANGUAGE_PATHS[language]
}

const cell = {
  pt: (row, col) => `Linha ${row}, coluna ${col}`,
  en: (row, col) => `Row ${row}, column ${col}`,
  es: (row, col) => `Fila ${row}, columna ${col}`,
  zh: (row, col) => `第 ${row} 行，第 ${col} 列`,
  hi: (row, col) => `पंक्ति ${row}, स्तंभ ${col}`,
  fr: (row, col) => `Ligne ${row}, colonne ${col}`,
  ar: (row, col) => `الصف ${row}، العمود ${col}`
}

export const MESSAGES = {
  pt: {
    title: 'Campo Minado Smart — Jogue grátis no navegador',
    gameName: 'Campo Minado',
    titleTop: 'CAMPO',
    titleBottom: 'MINADO',
    language: 'Idioma',
    sizeLegend: 'TAMANHO',
    difficultyLegend: 'DIFICULDADE',
    sizes: { small: 'Pequeno', medium: 'Médio', large: 'Grande', fullscreen: 'Tela inteira', custom: 'Personalizado' },
    difficulties: { easy: 'Fácil', normal: 'Normal', hard: 'Difícil', insane: 'Insano' },
    columns: 'Colunas (x)',
    rows: 'Linhas (y)',
    minesIn: ' minas em ',
    cells: ' casas',
    dimensionsError: max => `As dimensões precisam estar entre 5 e ${max}.`,
    newGameUpper: 'NOVO JOGO',
    newGame: 'Novo jogo',
    summaryLabel: 'Resumo das partidas',
    summaryTitle: 'RESUMO DAS PARTIDAS',
    games: 'Partidas',
    wins: 'Vitórias',
    bestTime: 'Melhor tempo',
    win: 'Vitória',
    loss: 'Derrota',
    openMenu: 'Abrir menu',
    minesLeft: count => `${count} minas restantes`,
    restart: 'Reiniciar partida',
    restartTitle: 'Reiniciar',
    time: value => `Tempo ${value}`,
    flagModeOff: 'Desativar modo bandeira',
    flagModeOn: 'Ativar modo bandeira',
    flagModeTitle: 'Modo bandeira',
    exitFullscreen: 'Sair da tela inteira',
    enterFullscreen: 'Ativar tela inteira',
    fullscreenTitle: 'Tela inteira',
    fullscreenUnavailable: 'Tela inteira indisponível neste navegador.',
    fieldLabel: (cols, rows) => `Campo minado, ${cols} colunas por ${rows} linhas`,
    boardLabel: (rows, cols) => `Tabuleiro ${rows} por ${cols}`,
    cell: (row, col, state) => `${cell.pt(row, col)}, ${{
      wrongFlag: 'bandeira errada',
      correctFlag: 'bandeira correta',
      explodedMine: 'mina que explodiu',
      mine: 'mina',
      flag: 'bandeira',
      empty: 'vazia',
      closed: 'fechada'
    }[state] ?? state}`,
    clearTitle: 'CAMPO LIMPO',
    gameOver: 'FIM DE JOGO',
    clicks: 'cliques',
    openedCells: 'casas abertas',
    correctFlags: 'certas',
    wrongFlags: 'erradas'
  },
  en: {
    title: 'Minesweeper Smart — Play free in your browser',
    gameName: 'Minesweeper',
    titleTop: 'MINE',
    titleBottom: 'SWEEPER',
    language: 'Language',
    sizeLegend: 'SIZE',
    difficultyLegend: 'DIFFICULTY',
    sizes: { small: 'Small', medium: 'Medium', large: 'Large', fullscreen: 'Fullscreen', custom: 'Custom' },
    difficulties: { easy: 'Easy', normal: 'Normal', hard: 'Hard', insane: 'Insane' },
    columns: 'Columns (x)',
    rows: 'Rows (y)',
    minesIn: ' mines in ',
    cells: ' cells',
    dimensionsError: max => `Dimensions must be between 5 and ${max}.`,
    newGameUpper: 'NEW GAME',
    newGame: 'New game',
    summaryLabel: 'Game summary',
    summaryTitle: 'GAME SUMMARY',
    games: 'Games',
    wins: 'Wins',
    bestTime: 'Best time',
    win: 'Win',
    loss: 'Loss',
    openMenu: 'Open menu',
    minesLeft: count => `${count} mines left`,
    restart: 'Restart game',
    restartTitle: 'Restart',
    time: value => `Time ${value}`,
    flagModeOff: 'Turn off flag mode',
    flagModeOn: 'Turn on flag mode',
    flagModeTitle: 'Flag mode',
    exitFullscreen: 'Exit fullscreen',
    enterFullscreen: 'Enter fullscreen',
    fullscreenTitle: 'Fullscreen',
    fullscreenUnavailable: 'Fullscreen is not available in this browser.',
    fieldLabel: (cols, rows) => `Minesweeper, ${cols} columns by ${rows} rows`,
    boardLabel: (rows, cols) => `Board ${rows} by ${cols}`,
    cell: (row, col, state) => `${cell.en(row, col)}, ${{
      wrongFlag: 'wrong flag',
      correctFlag: 'correct flag',
      explodedMine: 'exploded mine',
      mine: 'mine',
      flag: 'flag',
      empty: 'empty',
      closed: 'closed'
    }[state] ?? state}`,
    clearTitle: 'FIELD CLEARED',
    gameOver: 'GAME OVER',
    clicks: 'clicks',
    openedCells: 'cells opened',
    correctFlags: 'correct',
    wrongFlags: 'wrong'
  },
  es: {
    title: 'Buscaminas Smart — Juega gratis en tu navegador',
    gameName: 'Buscaminas',
    titleTop: 'BUSCA',
    titleBottom: 'MINAS',
    language: 'Idioma',
    sizeLegend: 'TAMAÑO',
    difficultyLegend: 'DIFICULTAD',
    sizes: { small: 'Pequeño', medium: 'Mediano', large: 'Grande', fullscreen: 'Pantalla completa', custom: 'Personalizado' },
    difficulties: { easy: 'Fácil', normal: 'Normal', hard: 'Difícil', insane: 'Locura' },
    columns: 'Columnas (x)',
    rows: 'Filas (y)',
    minesIn: ' minas en ',
    cells: ' casillas',
    dimensionsError: max => `Las dimensiones deben estar entre 5 y ${max}.`,
    newGameUpper: 'NUEVO JUEGO',
    newGame: 'Nuevo juego',
    summaryLabel: 'Resumen de partidas',
    summaryTitle: 'RESUMEN DE PARTIDAS',
    games: 'Partidas',
    wins: 'Victorias',
    bestTime: 'Mejor tiempo',
    win: 'Victoria',
    loss: 'Derrota',
    openMenu: 'Abrir menú',
    minesLeft: count => `${count} minas restantes`,
    restart: 'Reiniciar partida',
    restartTitle: 'Reiniciar',
    time: value => `Tiempo ${value}`,
    flagModeOff: 'Desactivar modo bandera',
    flagModeOn: 'Activar modo bandera',
    flagModeTitle: 'Modo bandera',
    exitFullscreen: 'Salir de pantalla completa',
    enterFullscreen: 'Activar pantalla completa',
    fullscreenTitle: 'Pantalla completa',
    fullscreenUnavailable: 'La pantalla completa no está disponible en este navegador.',
    fieldLabel: (cols, rows) => `Buscaminas, ${cols} columnas por ${rows} filas`,
    boardLabel: (rows, cols) => `Tablero ${rows} por ${cols}`,
    cell: (row, col, state) => `${cell.es(row, col)}, ${{
      wrongFlag: 'bandera incorrecta',
      correctFlag: 'bandera correcta',
      explodedMine: 'mina que explotó',
      mine: 'mina',
      flag: 'bandera',
      empty: 'vacía',
      closed: 'cerrada'
    }[state] ?? state}`,
    clearTitle: 'CAMPO DESPEJADO',
    gameOver: 'FIN DEL JUEGO',
    clicks: 'clics',
    openedCells: 'casillas abiertas',
    correctFlags: 'correctas',
    wrongFlags: 'incorrectas'
  },
  zh: {
    title: '扫雷 Smart — 在浏览器中免费游玩',
    gameName: '扫雷',
    titleTop: '扫雷',
    titleBottom: '游戏',
    language: '语言',
    sizeLegend: '尺寸',
    difficultyLegend: '难度',
    sizes: { small: '小', medium: '中', large: '大', fullscreen: '全屏', custom: '自定义' },
    difficulties: { easy: '简单', normal: '普通', hard: '困难', insane: '疯狂' },
    columns: '列数 (x)',
    rows: '行数 (y)',
    minesIn: ' 颗地雷，共 ',
    cells: ' 个格子',
    dimensionsError: max => `尺寸必须在 5 到 ${max} 之间。`,
    newGameUpper: '新游戏',
    newGame: '新游戏',
    summaryLabel: '对局摘要',
    summaryTitle: '对局摘要',
    games: '对局',
    wins: '胜利',
    bestTime: '最佳时间',
    win: '胜利',
    loss: '失败',
    openMenu: '打开菜单',
    minesLeft: count => `剩余 ${count} 颗地雷`,
    restart: '重新开始',
    restartTitle: '重新开始',
    time: value => `用时 ${value}`,
    flagModeOff: '关闭插旗模式',
    flagModeOn: '开启插旗模式',
    flagModeTitle: '插旗模式',
    exitFullscreen: '退出全屏',
    enterFullscreen: '进入全屏',
    fullscreenTitle: '全屏',
    fullscreenUnavailable: '此浏览器不支持全屏。',
    fieldLabel: (cols, rows) => `扫雷，${cols} 列 ${rows} 行`,
    boardLabel: (rows, cols) => `棋盘 ${rows} × ${cols}`,
    cell: (row, col, state) => `${cell.zh(row, col)}，${{
      wrongFlag: '错误的旗子',
      correctFlag: '正确的旗子',
      explodedMine: '已爆炸的地雷',
      mine: '地雷',
      flag: '旗子',
      empty: '空',
      closed: '未打开'
    }[state] ?? state}`,
    clearTitle: '排雷成功',
    gameOver: '游戏结束',
    clicks: '次点击',
    openedCells: '个已打开的格子',
    correctFlags: '正确',
    wrongFlags: '错误'
  },
  hi: {
    title: 'माइनस्वीपर Smart — ब्राउज़र में मुफ़्त खेलें',
    gameName: 'माइनस्वीपर',
    titleTop: 'माइन',
    titleBottom: 'स्वीपर',
    language: 'भाषा',
    sizeLegend: 'आकार',
    difficultyLegend: 'कठिनाई',
    sizes: { small: 'छोटा', medium: 'मध्यम', large: 'बड़ा', fullscreen: 'फ़ुल स्क्रीन', custom: 'कस्टम' },
    difficulties: { easy: 'आसान', normal: 'सामान्य', hard: 'कठिन', insane: 'बेहद कठिन' },
    columns: 'कॉलम (x)',
    rows: 'पंक्तियाँ (y)',
    minesIn: ' बारूदी सुरंगें, कुल ',
    cells: ' खाने',
    dimensionsError: max => `आकार 5 से ${max} के बीच होना चाहिए।`,
    newGameUpper: 'नया खेल',
    newGame: 'नया खेल',
    summaryLabel: 'खेल का सारांश',
    summaryTitle: 'खेल का सारांश',
    games: 'खेल',
    wins: 'जीत',
    bestTime: 'सर्वश्रेष्ठ समय',
    win: 'जीत',
    loss: 'हार',
    openMenu: 'मेनू खोलें',
    minesLeft: count => `${count} बारूदी सुरंगें शेष`,
    restart: 'खेल फिर से शुरू करें',
    restartTitle: 'फिर से शुरू करें',
    time: value => `समय ${value}`,
    flagModeOff: 'झंडा मोड बंद करें',
    flagModeOn: 'झंडा मोड चालू करें',
    flagModeTitle: 'झंडा मोड',
    exitFullscreen: 'फ़ुल स्क्रीन से बाहर निकलें',
    enterFullscreen: 'फ़ुल स्क्रीन चालू करें',
    fullscreenTitle: 'फ़ुल स्क्रीन',
    fullscreenUnavailable: 'इस ब्राउज़र में फ़ुल स्क्रीन उपलब्ध नहीं है।',
    fieldLabel: (cols, rows) => `माइनस्वीपर, ${cols} कॉलम और ${rows} पंक्तियाँ`,
    boardLabel: (rows, cols) => `बोर्ड ${rows} गुणा ${cols}`,
    cell: (row, col, state) => `${cell.hi(row, col)}, ${{
      wrongFlag: 'गलत झंडा',
      correctFlag: 'सही झंडा',
      explodedMine: 'फटी हुई सुरंग',
      mine: 'बारूदी सुरंग',
      flag: 'झंडा',
      empty: 'खाली',
      closed: 'बंद'
    }[state] ?? state}`,
    clearTitle: 'मैदान साफ़',
    gameOver: 'खेल समाप्त',
    clicks: 'क्लिक',
    openedCells: 'खाने खोले गए',
    correctFlags: 'सही',
    wrongFlags: 'गलत'
  },
  fr: {
    title: 'Démineur Smart — Jouez gratuitement dans votre navigateur',
    gameName: 'Démineur',
    titleTop: 'DÉMI',
    titleBottom: 'NEUR',
    language: 'Langue',
    sizeLegend: 'TAILLE',
    difficultyLegend: 'DIFFICULTÉ',
    sizes: { small: 'Petite', medium: 'Moyenne', large: 'Grande', fullscreen: 'Plein écran', custom: 'Personnalisée' },
    difficulties: { easy: 'Facile', normal: 'Normal', hard: 'Difficile', insane: 'Démentiel' },
    columns: 'Colonnes (x)',
    rows: 'Lignes (y)',
    minesIn: ' mines sur ',
    cells: ' cases',
    dimensionsError: max => `Les dimensions doivent être comprises entre 5 et ${max}.`,
    newGameUpper: 'NOUVELLE PARTIE',
    newGame: 'Nouvelle partie',
    summaryLabel: 'Résumé des parties',
    summaryTitle: 'RÉSUMÉ DES PARTIES',
    games: 'Parties',
    wins: 'Victoires',
    bestTime: 'Meilleur temps',
    win: 'Victoire',
    loss: 'Défaite',
    openMenu: 'Ouvrir le menu',
    minesLeft: count => `${count} mines restantes`,
    restart: 'Recommencer la partie',
    restartTitle: 'Recommencer',
    time: value => `Temps ${value}`,
    flagModeOff: 'Désactiver le mode drapeau',
    flagModeOn: 'Activer le mode drapeau',
    flagModeTitle: 'Mode drapeau',
    exitFullscreen: 'Quitter le plein écran',
    enterFullscreen: 'Activer le plein écran',
    fullscreenTitle: 'Plein écran',
    fullscreenUnavailable: "Le plein écran n'est pas disponible dans ce navigateur.",
    fieldLabel: (cols, rows) => `Démineur, ${cols} colonnes sur ${rows} lignes`,
    boardLabel: (rows, cols) => `Grille ${rows} sur ${cols}`,
    cell: (row, col, state) => `${cell.fr(row, col)}, ${{
      wrongFlag: 'drapeau erroné',
      correctFlag: 'drapeau correct',
      explodedMine: 'mine explosée',
      mine: 'mine',
      flag: 'drapeau',
      empty: 'vide',
      closed: 'fermée'
    }[state] ?? state}`,
    clearTitle: 'CHAMP DÉMINÉ',
    gameOver: 'PARTIE TERMINÉE',
    clicks: 'clics',
    openedCells: 'cases ouvertes',
    correctFlags: 'justes',
    wrongFlags: 'erronés'
  },
  ar: {
    title: 'كاسحة الألغام Smart — العب مجانًا في المتصفح',
    gameName: 'كاسحة الألغام',
    titleTop: 'كاسحة ',
    titleBottom: 'الألغام',
    language: 'اللغة',
    sizeLegend: 'الحجم',
    difficultyLegend: 'الصعوبة',
    sizes: { small: 'صغير', medium: 'متوسط', large: 'كبير', fullscreen: 'ملء الشاشة', custom: 'مخصص' },
    difficulties: { easy: 'سهل', normal: 'عادي', hard: 'صعب', insane: 'جنوني' },
    columns: 'الأعمدة (x)',
    rows: 'الصفوف (y)',
    minesIn: ' ألغام في ',
    cells: ' خانة',
    dimensionsError: max => `يجب أن تكون الأبعاد بين 5 و${max}.`,
    newGameUpper: 'لعبة جديدة',
    newGame: 'لعبة جديدة',
    summaryLabel: 'ملخص الألعاب',
    summaryTitle: 'ملخص الألعاب',
    games: 'الألعاب',
    wins: 'الانتصارات',
    bestTime: 'أفضل وقت',
    win: 'فوز',
    loss: 'خسارة',
    openMenu: 'فتح القائمة',
    minesLeft: count => `متبقي ${count} ألغام`,
    restart: 'إعادة اللعبة',
    restartTitle: 'إعادة',
    time: value => `الوقت ${value}`,
    flagModeOff: 'إيقاف وضع العلم',
    flagModeOn: 'تشغيل وضع العلم',
    flagModeTitle: 'وضع العلم',
    exitFullscreen: 'الخروج من ملء الشاشة',
    enterFullscreen: 'تفعيل ملء الشاشة',
    fullscreenTitle: 'ملء الشاشة',
    fullscreenUnavailable: 'ملء الشاشة غير متاح في هذا المتصفح.',
    fieldLabel: (cols, rows) => `كاسحة الألغام، ${cols} أعمدة و${rows} صفوف`,
    boardLabel: (rows, cols) => `اللوحة ${rows} في ${cols}`,
    cell: (row, col, state) => `${cell.ar(row, col)}، ${{
      wrongFlag: 'علم خاطئ',
      correctFlag: 'علم صحيح',
      explodedMine: 'لغم انفجر',
      mine: 'لغم',
      flag: 'علم',
      empty: 'فارغة',
      closed: 'مغلقة'
    }[state] ?? state}`,
    clearTitle: 'تم تطهير الحقل',
    gameOver: 'انتهت اللعبة',
    clicks: 'نقرات',
    openedCells: 'خانات مفتوحة',
    correctFlags: 'صحيحة',
    wrongFlags: 'خاطئة'
  }
}
