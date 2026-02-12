import { Word, MeaningLanguage } from '../data/types';

export function getMeaning(word: Word, lang: MeaningLanguage): string {
  return word.meanings[lang] ?? word.meanings.en;
}

export function getWordLabel(word: Word): string {
  return word.reading ? `${word.expression} (${word.reading})` : word.expression;
}
