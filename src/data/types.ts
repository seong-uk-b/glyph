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

// Word types — 일본어/한국어 통합
export type WordLanguage = 'ja' | 'ko';

export type WordLevel =
  | 'JLPT_N5' | 'JLPT_N4' | 'JLPT_N3' | 'JLPT_N2' | 'JLPT_N1'
  | 'TOPIK_1' | 'TOPIK_2' | 'TOPIK_3' | 'TOPIK_4' | 'TOPIK_5' | 'TOPIK_6';

export interface Meanings {
  en: string;
  ko?: string;
  ja?: string;
}

export interface Word {
  expression: string;       // 단어 (漢字, 한글 등)
  reading?: string;         // 읽기 (일본어: ひらがな, 한국어: 불필요)
  meanings: Meanings;       // 번역 맵
  lang: WordLanguage;       // 원어
  level: WordLevel;         // 급수
}

export type MeaningLanguage = 'en' | 'ko' | 'ja';

export type WordGameMode = 'meaningToWord' | 'wordToMeaning';

export interface WordGameConfig {
  lang: WordLanguage;
  levels: WordLevel[];
  gameMode: WordGameMode;
  questionCount: number;
  meaningLanguage: MeaningLanguage;
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
