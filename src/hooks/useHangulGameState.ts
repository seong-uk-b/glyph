import { useMemo, useCallback } from 'react';
import { HangulGameConfig, HangulQuestion, HangulQuestionResult } from '../data/types';
import {
  HangulCharacter,
  BASIC_CONSONANTS,
  DOUBLE_CONSONANTS,
  BASIC_VOWELS,
  COMPOUND_VOWELS,
} from '../data/hangul';
import { shuffle } from '../utils/gameLogic';
import { useGameStateBase } from './useGameStateBase';

const CATEGORY_MAP: Record<string, HangulCharacter[]> = {
  basicConsonants: BASIC_CONSONANTS,
  doubleConsonants: DOUBLE_CONSONANTS,
  basicVowels: BASIC_VOWELS,
  compoundVowels: COMPOUND_VOWELS,
};

function generateHangulOptions(
  correct: HangulCharacter,
  allChars: HangulCharacter[],
  count: number = 4
): string[] {
  const others = shuffle(allChars.filter(c => c.romanization !== correct.romanization));
  const wrong = others.slice(0, count - 1).map(c => c.romanization);
  return shuffle([correct.romanization, ...wrong]);
}

export function useHangulGameState(config: HangulGameConfig) {
  const questions = useMemo<HangulQuestion[]>(() => {
    const allChars = config.categories.flatMap(cat => CATEGORY_MAP[cat] || []);
    const shuffled = shuffle(allChars);

    return shuffled.map(char => {
      const options = generateHangulOptions(char, allChars);
      return {
        character: char.character,
        romanization: char.romanization,
        name: char.name,
        options,
        correctIndex: options.indexOf(char.romanization),
      };
    });
  }, [config]);

  const checkAnswer = useCallback(
    (answer: string, question: HangulQuestion) =>
      answer === question.options[question.correctIndex],
    [],
  );

  const createResult = useCallback(
    (question: HangulQuestion, userAnswer: string, isCorrect: boolean): HangulQuestionResult => ({
      question,
      userAnswer,
      isCorrect,
    }),
    [],
  );

  return useGameStateBase({ questions, checkAnswer, createResult });
}
