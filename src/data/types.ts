export type CharacterType = 'hiragana' | 'katakana' | 'both';

export interface KanaCharacter {
  character: string;
  romaji: string;
  rowId: string;
  type?: 'hiragana' | 'katakana';
}

export interface KanaRow {
  id: string;
  label: string;
  labelRomaji: string;
  characters: KanaCharacter[];
}

export interface KanaSet {
  type: CharacterType;
  rows: KanaRow[];
}

export type GameMode = 'typing' | 'multipleChoice';

export interface GameConfig {
  characterType: CharacterType;
  gameMode: GameMode;
  selectedRowIds: string[];
}

export interface GameQuestion {
  character: KanaCharacter;
  options?: string[];
  correctIndex?: number;
}

export interface QuestionResult {
  question: GameQuestion;
  userAnswer: string;
  isCorrect: boolean;
}

export type FeedbackState = 'idle' | 'correct' | 'wrong';

// 제네릭 베이스 타입 — 가나 게임과 단어 게임의 공통 구조
export interface BaseGameState<Q, R> {
  questions: Q[];
  currentIndex: number;
  results: R[];
  currentStreak: number;
  bestStreak: number;
  feedbackState: FeedbackState;
  isFinished: boolean;
  startTime: number;
}

// 공통 결과 타입 — 문제(Q)와 사용자 답, 정답 여부
export interface BaseQuestionResult<Q> {
  question: Q;
  userAnswer: string;
  isCorrect: boolean;
}

// Word types
export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface Word {
  expression: string;  // 日本語 (kanji)
  reading: string;     // ひらがな
  meaning: string;     // English
  meaningKo?: string;  // 한국어
}

export type MeaningLanguage = 'en' | 'ko';

export type WordGameMode = 'meaningToWord' | 'wordToMeaning';

export interface WordGameConfig {
  levels: JLPTLevel[];
  gameMode: WordGameMode;
  questionCount: number;
  language: MeaningLanguage;
}

export interface WordQuestion {
  word: Word;
  options: string[];
  correctIndex: number;
}

// 기존 타입을 제네릭 alias로 유지 — 화면 컴포넌트 변경 불필요
export type WordQuestionResult = BaseQuestionResult<WordQuestion>;
export type WordGameState = BaseGameState<WordQuestion, WordQuestionResult>;
export type GameState = BaseGameState<GameQuestion, QuestionResult>;

// Hangul Game types
export type HangulCategory = 'basicConsonants' | 'doubleConsonants' | 'basicVowels' | 'compoundVowels';

export interface HangulGameConfig {
  categories: HangulCategory[];
}

export interface HangulQuestion {
  character: string;
  romanization: string;
  name: string;
  options: string[];
  correctIndex: number;
}

export type HangulQuestionResult = BaseQuestionResult<HangulQuestion>;

// Korean Word types
export interface KoreanWord {
  expression: string;
  meaning: string;
  meaningJa?: string;
}

export interface KoreanWordGameConfig {
  gameMode: WordGameMode;
  questionCount: number;
  language: 'en' | 'ja';
}

export interface KoreanWordQuestion {
  word: KoreanWord;
  options: string[];
  correctIndex: number;
}

export type KoreanWordQuestionResult = BaseQuestionResult<KoreanWordQuestion>;

// Syllable Combination Game types
export interface SyllableGameConfig {
  includeBatchim: boolean;
  questionCount: number;
}

export interface SyllableQuestion {
  syllable: string;
  romanization: string;
  options: string[];
  correctIndex: number;
}

export type SyllableQuestionResult = BaseQuestionResult<SyllableQuestion>;
