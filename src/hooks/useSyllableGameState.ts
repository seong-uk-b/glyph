import { useMemo, useCallback } from 'react';
import { SyllableGameConfig, SyllableQuestion, SyllableQuestionResult } from '../data/types';
import { generateSyllables, romanizeSyllable } from '../data/hangul';
import { shuffle } from '../utils/gameLogic';
import { useGameStateBase } from './useGameStateBase';

function generateOptions(
  correct: { choIdx: number; jungIdx: number; jongIdx: number; romanization: string },
): string[] {
  const wrong = new Set<string>();

  // 같은 초성, 다른 중성
  for (let attempt = 0; attempt < 15 && wrong.size < 1; attempt++) {
    const jung = Math.floor(Math.random() * 21);
    if (jung === correct.jungIdx) continue;
    const r = romanizeSyllable(correct.choIdx, jung, correct.jongIdx);
    if (r !== correct.romanization) wrong.add(r);
  }

  // 다른 초성, 같은 중성
  for (let attempt = 0; attempt < 15 && wrong.size < 2; attempt++) {
    const cho = Math.floor(Math.random() * 19);
    if (cho === correct.choIdx) continue;
    const r = romanizeSyllable(cho, correct.jungIdx, correct.jongIdx);
    if (r !== correct.romanization) wrong.add(r);
  }

  // 완전 랜덤
  while (wrong.size < 3) {
    const cho = Math.floor(Math.random() * 19);
    const jung = Math.floor(Math.random() * 21);
    const r = romanizeSyllable(cho, jung, correct.jongIdx);
    if (r !== correct.romanization) wrong.add(r);
  }

  return shuffle([correct.romanization, ...Array.from(wrong).slice(0, 3)]);
}

export function useSyllableGameState(config: SyllableGameConfig) {
  const questions = useMemo<SyllableQuestion[]>(() => {
    const all = generateSyllables(config.includeBatchim);
    const selected = shuffle(all).slice(0, config.questionCount);

    return selected.map(info => {
      const options = generateOptions(info);
      return {
        syllable: info.syllable,
        romanization: info.romanization,
        options,
        correctIndex: options.indexOf(info.romanization),
      };
    });
  }, [config]);

  const checkAnswer = useCallback(
    (answer: string, question: SyllableQuestion) =>
      answer === question.romanization,
    [],
  );

  const createResult = useCallback(
    (question: SyllableQuestion, userAnswer: string, isCorrect: boolean): SyllableQuestionResult => ({
      question,
      userAnswer,
      isCorrect,
    }),
    [],
  );

  return useGameStateBase({ questions, checkAnswer, createResult });
}
