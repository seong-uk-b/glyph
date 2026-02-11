import { Word, JLPTLevel } from '../types';
import { n5Words } from './n5';
import { n4Words } from './n4';
import { n3Words } from './n3';

export const wordsByLevel: Record<JLPTLevel, Word[]> = {
  N5: n5Words,
  N4: n4Words,
  N3: n3Words,
  N2: [], // Coming soon
  N1: [], // Coming soon
};

export function getWordsByLevels(levels: JLPTLevel[]): Word[] {
  return levels.flatMap(level => wordsByLevel[level]);
}

export function getWordCount(level: JLPTLevel): number {
  return wordsByLevel[level].length;
}

export const availableLevels: JLPTLevel[] = ['N5', 'N4', 'N3'];
export const comingSoonLevels: JLPTLevel[] = ['N2', 'N1'];
