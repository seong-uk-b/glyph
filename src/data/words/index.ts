import { Word, WordLevel } from '../types';
import { n5Words } from './n5';
import { n4Words } from './n4';
import { n3Words } from './n3';
import { n2Words } from './n2';
import { n1Words } from './n1';
import { koreanWords } from '../korean-words';
import { koreanWords2 } from '../korean-words-2';

export const wordsByLevel: Record<WordLevel, Word[]> = {
  JLPT_N5: n5Words,
  JLPT_N4: n4Words,
  JLPT_N3: n3Words,
  JLPT_N2: n2Words,
  JLPT_N1: n1Words,
  TOPIK_1: koreanWords,
  TOPIK_2: koreanWords2,
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

export const japaneseLevels: WordLevel[] = ['JLPT_N5', 'JLPT_N4', 'JLPT_N3', 'JLPT_N2', 'JLPT_N1'];
export const japaneseComingSoonLevels: WordLevel[] = [];
export const koreanLevels: WordLevel[] = ['TOPIK_1', 'TOPIK_2'];
export const koreanComingSoonLevels: WordLevel[] = ['TOPIK_3', 'TOPIK_4', 'TOPIK_5', 'TOPIK_6'];
