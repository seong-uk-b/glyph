import { Word, MeaningLanguage, WordLanguage } from '../data/types';

// 학습 언어와 같은 언어로는 뜻을 보여줄 수 없다 — UI 언어를 쓰되 겹치면 영어로
export function deriveMeaningLanguage(
  wordLang: WordLanguage,
  uiLanguage: MeaningLanguage,
): MeaningLanguage {
  if (wordLang === 'ja') return uiLanguage === 'ko' ? 'ko' : 'en';
  return uiLanguage === 'ja' ? 'ja' : 'en';
}

export function getMeaning(word: Word, lang: MeaningLanguage): string {
  return word.meanings[lang] ?? word.meanings.en;
}

// 괄호 주석 제거 — 표기/읽기 비교와 표시에 쓴다
// (예: 읽기 'けっこん (する)' → 'けっこん', 표기 'パート (タイム)' → 'パート')
function stripAnnotation(s: string): string {
  return s.replace(/\s*[（(][^）)]*[）)]/g, '').trim();
}

/**
 * 퀴즈 선택지·정답에 쓰는 단어 표시.
 * 읽기가 표기와 같거나(가나 단어) 없으면 표기만 — `あそこ (あそこ)` 같은 중복을 막는다.
 */
export function getWordLabel(word: Word): string {
  const reading = stripAnnotation(word.reading ?? '');
  if (!reading || reading === stripAnnotation(word.expression)) {
    return word.expression;
  }
  return `${word.expression} (${reading})`;
}
