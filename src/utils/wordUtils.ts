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

export function getWordLabel(word: Word): string {
  return word.reading ? `${word.expression} (${word.reading})` : word.expression;
}
