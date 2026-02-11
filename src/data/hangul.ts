export interface HangulCharacter {
  character: string;
  romanization: string;
  name: string;
}

export const BASIC_CONSONANTS: HangulCharacter[] = [
  { character: 'ㄱ', romanization: 'g/k', name: '기역' },
  { character: 'ㄴ', romanization: 'n', name: '니은' },
  { character: 'ㄷ', romanization: 'd/t', name: '디귿' },
  { character: 'ㄹ', romanization: 'r/l', name: '리을' },
  { character: 'ㅁ', romanization: 'm', name: '미음' },
  { character: 'ㅂ', romanization: 'b/p', name: '비읍' },
  { character: 'ㅅ', romanization: 's', name: '시옷' },
  { character: 'ㅇ', romanization: 'ng', name: '이응' },
  { character: 'ㅈ', romanization: 'j', name: '지읒' },
  { character: 'ㅊ', romanization: 'ch', name: '치읓' },
  { character: 'ㅋ', romanization: 'k', name: '키읔' },
  { character: 'ㅌ', romanization: 't', name: '티읕' },
  { character: 'ㅍ', romanization: 'p', name: '피읖' },
  { character: 'ㅎ', romanization: 'h', name: '히읗' },
];

export const DOUBLE_CONSONANTS: HangulCharacter[] = [
  { character: 'ㄲ', romanization: 'kk', name: '쌍기역' },
  { character: 'ㄸ', romanization: 'tt', name: '쌍디귿' },
  { character: 'ㅃ', romanization: 'pp', name: '쌍비읍' },
  { character: 'ㅆ', romanization: 'ss', name: '쌍시옷' },
  { character: 'ㅉ', romanization: 'jj', name: '쌍지읒' },
];

export const BASIC_VOWELS: HangulCharacter[] = [
  { character: 'ㅏ', romanization: 'a', name: '아' },
  { character: 'ㅑ', romanization: 'ya', name: '야' },
  { character: 'ㅓ', romanization: 'eo', name: '어' },
  { character: 'ㅕ', romanization: 'yeo', name: '여' },
  { character: 'ㅗ', romanization: 'o', name: '오' },
  { character: 'ㅛ', romanization: 'yo', name: '요' },
  { character: 'ㅜ', romanization: 'u', name: '우' },
  { character: 'ㅠ', romanization: 'yu', name: '유' },
  { character: 'ㅡ', romanization: 'eu', name: '으' },
  { character: 'ㅣ', romanization: 'i', name: '이' },
];

export const COMPOUND_VOWELS: HangulCharacter[] = [
  { character: 'ㅐ', romanization: 'ae', name: '애' },
  { character: 'ㅒ', romanization: 'yae', name: '얘' },
  { character: 'ㅔ', romanization: 'e', name: '에' },
  { character: 'ㅖ', romanization: 'ye', name: '예' },
  { character: 'ㅘ', romanization: 'wa', name: '와' },
  { character: 'ㅙ', romanization: 'wae', name: '왜' },
  { character: 'ㅚ', romanization: 'oe', name: '외' },
  { character: 'ㅝ', romanization: 'wo', name: '워' },
  { character: 'ㅞ', romanization: 'we', name: '웨' },
  { character: 'ㅟ', romanization: 'wi', name: '위' },
  { character: 'ㅢ', romanization: 'ui', name: '의' },
];

// --- 한글 조합 (Syllable composition) ---

// 초성 19자 (Unicode 순서)
export const CHOSEONG = [
  'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ',
  'ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
];

// 중성 21자
export const JUNGSEONG = [
  'ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ',
  'ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ',
];

// 종성 27자 (index 0 = 없음)
export const JONGSEONG = [
  '','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ',
  'ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ',
  'ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
];

// 초성 로마자
const CHO_ROMAN = [
  'g','kk','n','d','tt','r','m','b','pp','s',
  'ss','','j','jj','ch','k','t','p','h',
];

// 중성 로마자
const JUNG_ROMAN = [
  'a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae',
  'oe','yo','u','wo','we','wi','yu','eu','ui','i',
];

// 종성 로마자 (index 0 = 없음)
const JONG_ROMAN = [
  '','k','kk','ks','n','nj','nh','t','l','lk','lm',
  'lp','ls','lt','lp','lh','m','p','ps','t','ss',
  'ng','j','ch','k','t','p','h',
];

// 자주 쓰이는 받침만 (희귀 겹받침 제외)
const COMMON_JONG_INDICES = [0, 1, 4, 7, 8, 16, 17, 19, 21];

export interface SyllableInfo {
  syllable: string;
  romanization: string;
  choIdx: number;
  jungIdx: number;
  jongIdx: number;
}

export function composeSyllable(choIdx: number, jungIdx: number, jongIdx: number = 0): string {
  return String.fromCharCode(0xAC00 + (choIdx * 21 + jungIdx) * 28 + jongIdx);
}

export function romanizeSyllable(choIdx: number, jungIdx: number, jongIdx: number = 0): string {
  return CHO_ROMAN[choIdx] + JUNG_ROMAN[jungIdx] + JONG_ROMAN[jongIdx];
}

export function generateSyllables(includeBatchim: boolean): SyllableInfo[] {
  const all: SyllableInfo[] = [];
  const jongList = includeBatchim ? COMMON_JONG_INDICES : [0];

  for (let cho = 0; cho < 19; cho++) {
    for (let jung = 0; jung < 21; jung++) {
      for (const jong of jongList) {
        all.push({
          syllable: composeSyllable(cho, jung, jong),
          romanization: romanizeSyllable(cho, jung, jong),
          choIdx: cho, jungIdx: jung, jongIdx: jong,
        });
      }
    }
  }

  return all;
}
