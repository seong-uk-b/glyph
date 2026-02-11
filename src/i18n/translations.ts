export type Language = 'en' | 'ko' | 'ja';

export interface Translations {
  // Header & Footer
  appTitle: string;
  back: string;
  footerText: string;

  // Home Screen
  homeSubtitle: string;
  selectLanguage: string;
  japanese: string;
  koreanLang: string;
  sectionChart: string;
  sectionGame: string;
  kanaChart: string;
  kanaChartDesc: string;
  hangulChart: string;
  hangulChartDesc: string;
  kana: string;
  kanaDesc: string;
  hangul: string;
  hangulDesc: string;
  words: string;
  wordsDesc: string;
  wordsDescKo: string;
  syllable: string;
  syllableDesc: string;
  kanji: string;
  kanjiDesc: string;
  comingSoon: string;

  // Setup Screen (Kana)
  gameSettings: string;
  characterType: string;
  hiragana: string;
  katakana: string;
  both: string;
  gameMode: string;
  typing: string;
  quiz4: string;
  selectRows: string;
  characters: string;
  startGame: string;

  // Chart Screen
  basicGojuon: string;
  dakutenHandakuten: string;
  basicConsonants: string;
  doubleConsonants: string;
  basicVowels: string;
  compoundVowels: string;
  includeBatchim: string;
  withBatchim: string;
  withoutBatchim: string;

  // Word Setup Screen
  wordGameSettings: string;
  jlptLevel: string;
  topikLevel: string;
  meaningToWord: string;
  wordToMeaning: string;
  language: string;
  english: string;
  korean: string;
  questions: string;
  wordsAvailable: string;
  wordsUnit: string;

  // Game
  score: string;
  accuracy: string;
  streak: string;
  typeRomaji: string;
  enter: string;
  correct: string;
  wrong: string;
  answer: string;
  next: string;

  // Result Screen
  perfect: string;
  excellent: string;
  good: string;
  keepPracticing: string;
  tryAgain: string;
  total: string;
  reviewMissedCharacters: string;
  reviewMissedWords: string;
  yours: string;
  playAgain: string;
  changeSettings: string;
  home: string;

  // Common
  selectAll: string;
  clearAll: string;
  cannotSelectSameLang: string;
}

const en: Translations = {
  // Header & Footer
  appTitle: 'Glyph',
  back: '← Back',
  footerText: 'Glyph v0.7',

  // Home Screen
  homeSubtitle: 'What would you like to learn?',
  selectLanguage: 'Select Language',
  japanese: 'Japanese',
  koreanLang: 'Korean',
  sectionChart: 'Charts',
  sectionGame: 'Games',
  kanaChart: 'Kana Chart',
  kanaChartDesc: 'Hiragana & Katakana',
  hangulChart: 'Hangul Chart',
  hangulChartDesc: 'Korean Alphabet',
  kana: 'Kana',
  kanaDesc: 'Hiragana & Katakana',
  hangul: 'Hangul',
  hangulDesc: 'Korean Characters',
  words: 'Words',
  wordsDesc: 'JLPT N5-N3 Vocabulary',
  wordsDescKo: 'TOPIK Vocabulary',
  syllable: 'Syllables',
  syllableDesc: 'Build Korean Syllables',
  kanji: 'Kanji',
  kanjiDesc: 'Chinese Characters',
  comingSoon: 'Coming Soon',

  // Setup Screen (Kana)
  gameSettings: 'Game Settings',
  characterType: 'Character Type',
  hiragana: 'Hiragana',
  katakana: 'Katakana',
  both: 'Both',
  gameMode: 'Game Mode',
  typing: 'Typing',
  quiz4: 'Quiz (4)',
  selectRows: 'Select Rows',
  characters: 'characters',
  startGame: 'Start Game',

  // Chart Screen
  basicGojuon: 'Basic (Gojuon)',
  dakutenHandakuten: 'Dakuten & Handakuten',
  basicConsonants: 'Basic Consonants',
  doubleConsonants: 'Double Consonants',
  basicVowels: 'Basic Vowels',
  compoundVowels: 'Compound Vowels',
  includeBatchim: 'Final Consonant',
  withBatchim: 'With 받침',
  withoutBatchim: 'Without 받침',

  // Word Setup Screen
  wordGameSettings: 'Word Game Settings',
  jlptLevel: 'JLPT Level',
  topikLevel: 'TOPIK Level',
  meaningToWord: 'Meaning → Word',
  wordToMeaning: 'Word → Meaning',
  language: 'Language',
  english: 'English',
  korean: '한국어',
  questions: 'Questions',
  wordsAvailable: 'words available',
  wordsUnit: 'words',

  // Game
  score: 'Score',
  accuracy: 'Accuracy',
  streak: 'Streak',
  typeRomaji: 'Type romaji...',
  enter: 'Enter',
  correct: 'Correct',
  wrong: 'Wrong',
  answer: 'Answer:',
  next: 'Next →',

  // Result Screen
  perfect: 'Perfect!',
  excellent: 'Excellent!',
  good: 'Good',
  keepPracticing: 'Keep Practicing',
  tryAgain: 'Try Again',
  total: 'Total',
  reviewMissedCharacters: 'Review Missed Characters',
  reviewMissedWords: 'Review Missed Words',
  yours: 'yours:',
  playAgain: 'Play Again',
  changeSettings: 'Change Settings',
  home: 'Home',

  // Common
  selectAll: 'Select All',
  clearAll: 'Clear All',
  cannotSelectSameLang: 'Cannot use as UI language while learning this language',
};

const ko: Translations = {
  // Header & Footer
  appTitle: '글리프',
  back: '← 뒤로',
  footerText: '글리프 v0.7',

  // Home Screen
  homeSubtitle: '무엇을 배우고 싶으세요?',
  selectLanguage: '언어 선택',
  japanese: '일본어',
  koreanLang: '한국어',
  sectionChart: '문자표',
  sectionGame: '게임',
  kanaChart: '가나 표',
  kanaChartDesc: '히라가나 & 가타카나',
  hangulChart: '한글 표',
  hangulChartDesc: '자음 & 모음',
  kana: '가나',
  kanaDesc: '히라가나 & 가타카나',
  hangul: '한글',
  hangulDesc: '자음 & 모음',
  words: '단어',
  wordsDesc: 'JLPT N5-N3 어휘',
  wordsDescKo: 'TOPIK 어휘',
  syllable: '조합',
  syllableDesc: '한글 조합 연습',
  kanji: '한자',
  kanjiDesc: '한자 학습',
  comingSoon: '출시 예정',

  // Setup Screen (Kana)
  gameSettings: '게임 설정',
  characterType: '문자 유형',
  hiragana: '히라가나',
  katakana: '가타카나',
  both: '모두',
  gameMode: '게임 모드',
  typing: '직접 입력',
  quiz4: '4지선다',
  selectRows: '행 선택',
  characters: '글자',
  startGame: '게임 시작',

  // Chart Screen
  basicGojuon: '기본 (오십음)',
  dakutenHandakuten: '탁음 & 반탁음',
  basicConsonants: '기본 자음',
  doubleConsonants: '쌍자음',
  basicVowels: '기본 모음',
  compoundVowels: '복합 모음',
  includeBatchim: '받침',
  withBatchim: '받침 포함',
  withoutBatchim: '받침 없이',

  // Word Setup Screen
  wordGameSettings: '단어 게임 설정',
  jlptLevel: 'JLPT 레벨',
  topikLevel: 'TOPIK 레벨',
  meaningToWord: '뜻 → 단어',
  wordToMeaning: '단어 → 뜻',
  language: '언어',
  english: 'English',
  korean: '한국어',
  questions: '문제 수',
  wordsAvailable: '단어 사용 가능',
  wordsUnit: '단어',

  // Game
  score: '점수',
  accuracy: '정확도',
  streak: '연속',
  typeRomaji: '로마지 입력...',
  enter: '확인',
  correct: '정답',
  wrong: '오답',
  answer: '정답:',
  next: '다음 →',

  // Result Screen
  perfect: '완벽!',
  excellent: '훌륭!',
  good: '좋음',
  keepPracticing: '계속 연습하세요',
  tryAgain: '다시 도전',
  total: '전체',
  reviewMissedCharacters: '틀린 문자 복습',
  reviewMissedWords: '틀린 단어 복습',
  yours: '내 답:',
  playAgain: '다시 하기',
  changeSettings: '설정 변경',
  home: '홈',

  // Common
  selectAll: '전체 선택',
  clearAll: '전체 해제',
  cannotSelectSameLang: '학습 중인 언어는 UI 언어로 선택할 수 없습니다',
};

const ja: Translations = {
  // Header & Footer
  appTitle: 'グリフ',
  back: '← 戻る',
  footerText: 'グリフ v0.7',

  // Home Screen
  homeSubtitle: '何を学びたいですか？',
  selectLanguage: '言語選択',
  japanese: '日本語',
  koreanLang: '韓国語',
  sectionChart: '文字表',
  sectionGame: 'ゲーム',
  kanaChart: 'かな表',
  kanaChartDesc: 'ひらがな & カタカナ',
  hangulChart: 'ハングル表',
  hangulChartDesc: '子音 & 母音',
  kana: 'かな',
  kanaDesc: 'ひらがな & カタカナ',
  hangul: 'ハングル',
  hangulDesc: '子音 & 母音',
  words: '単語',
  wordsDesc: 'JLPT N5-N3 語彙',
  wordsDescKo: 'TOPIK 語彙',
  syllable: '組み合わせ',
  syllableDesc: 'ハングル組み合わせ',
  kanji: '漢字',
  kanjiDesc: '漢字学習',
  comingSoon: '近日公開',

  // Setup Screen (Kana)
  gameSettings: 'ゲーム設定',
  characterType: '文字タイプ',
  hiragana: 'ひらがな',
  katakana: 'カタカナ',
  both: '両方',
  gameMode: 'ゲームモード',
  typing: 'タイピング',
  quiz4: '4択クイズ',
  selectRows: '行を選択',
  characters: '文字',
  startGame: 'ゲーム開始',

  // Chart Screen
  basicGojuon: '基本 (五十音)',
  dakutenHandakuten: '濁音 & 半濁音',
  basicConsonants: '基本子音',
  doubleConsonants: '濃音',
  basicVowels: '基本母音',
  compoundVowels: '複合母音',
  includeBatchim: 'パッチム',
  withBatchim: 'パッチムあり',
  withoutBatchim: 'パッチムなし',

  // Word Setup Screen
  wordGameSettings: '単語ゲーム設定',
  jlptLevel: 'JLPTレベル',
  topikLevel: 'TOPIKレベル',
  meaningToWord: '意味 → 単語',
  wordToMeaning: '単語 → 意味',
  language: '言語',
  english: 'English',
  korean: '한국어',
  questions: '問題数',
  wordsAvailable: '単語が利用可能',
  wordsUnit: '単語',

  // Game
  score: 'スコア',
  accuracy: '正解率',
  streak: '連続',
  typeRomaji: 'ローマ字入力...',
  enter: '確認',
  correct: '正解',
  wrong: '不正解',
  answer: '答え:',
  next: '次へ →',

  // Result Screen
  perfect: 'パーフェクト！',
  excellent: '素晴らしい！',
  good: '良い',
  keepPracticing: '練習を続けよう',
  tryAgain: '再挑戦',
  total: '合計',
  reviewMissedCharacters: '間違えた文字を復習',
  reviewMissedWords: '間違えた単語を復習',
  yours: 'あなたの答え:',
  playAgain: 'もう一度',
  changeSettings: '設定変更',
  home: 'ホーム',

  // Common
  selectAll: '全選択',
  clearAll: '全解除',
  cannotSelectSameLang: '学習中の言語はUI言語として選択できません',
};

export const translations: Record<Language, Translations> = { en, ko, ja };
