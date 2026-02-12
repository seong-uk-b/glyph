import { Word, WordLevel } from '../types';
import { n5Words } from './n5';
import { n4Words } from './n4';
import { n3Words } from './n3';
import { koreanWords } from '../korean-words';

export const wordsByLevel: Record<WordLevel, Word[]> = {
  JLPT_N5: n5Words,
  JLPT_N4: n4Words,
  JLPT_N3: n3Words,
  JLPT_N2: [],
  JLPT_N1: [],
  TOPIK_1: koreanWords,
  TOPIK_2: [],
  TOPIK_3: [],
  TOPIK_4: [],
  TOPIK_5: [],
  TOPIK_6: [],
};

export function getWordsByLevels(levels: WordLevel[]): Word[] {
  return levels.flatMap(level => wordsByLevel[level]);
}

export function getWordCount(level: WordLevel): number {
  return wordsByLevel[level].length;
}

export const japaneseLevels: WordLevel[] = ['JLPT_N5', 'JLPT_N4', 'JLPT_N3'];
export const japaneseComingSoonLevels: WordLevel[] = ['JLPT_N2', 'JLPT_N1'];
export const koreanLevels: WordLevel[] = ['TOPIK_1'];
export const koreanComingSoonLevels: WordLevel[] = ['TOPIK_2', 'TOPIK_3', 'TOPIK_4', 'TOPIK_5', 'TOPIK_6'];
