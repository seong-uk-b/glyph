import { useMemo, useCallback } from 'react';
import {
  KoreanWordGameConfig,
  KoreanWordQuestion,
  KoreanWordQuestionResult,
  KoreanWord,
} from '../data/types';
import { koreanWords } from '../data/korean-words';
import { shuffle } from '../utils/gameLogic';
import { useGameStateBase } from './useGameStateBase';

function getMeaning(word: KoreanWord, language: 'en' | 'ja'): string {
  if (language === 'ja' && word.meaningJa) return word.meaningJa;
  return word.meaning;
}

function generateOptions(
  correct: KoreanWord,
  allWords: KoreanWord[],
  mode: 'meaningToWord' | 'wordToMeaning',
  language: 'en' | 'ja',
  count: number = 4
): string[] {
  const correctAnswer = mode === 'meaningToWord'
    ? correct.expression
    : getMeaning(correct, language);

  const others = shuffle(allWords.filter(w => w.expression !== correct.expression));
  const wrong = others.slice(0, count - 1).map(w =>
    mode === 'meaningToWord' ? w.expression : getMeaning(w, language)
  );

  return shuffle([correctAnswer, ...wrong]);
}

export function useKoreanWordGameState(config: KoreanWordGameConfig) {
  const questions = useMemo<KoreanWordQuestion[]>(() => {
    const shuffled = shuffle(koreanWords);
    const selected = shuffled.slice(0, config.questionCount);

    return selected.map(word => {
      const options = generateOptions(word, koreanWords, config.gameMode, config.language);
      const correctAnswer = config.gameMode === 'meaningToWord'
        ? word.expression
        : getMeaning(word, config.language);
      return {
        word,
        options,
        correctIndex: options.indexOf(correctAnswer),
      };
    });
  }, [config]);

  const checkAnswer = useCallback(
    (answer: string, question: KoreanWordQuestion) =>
      answer === question.options[question.correctIndex],
    [],
  );

  const createResult = useCallback(
    (question: KoreanWordQuestion, userAnswer: string, isCorrect: boolean): KoreanWordQuestionResult => ({
      question,
      userAnswer,
      isCorrect,
    }),
    [],
  );

  return useGameStateBase({ questions, checkAnswer, createResult });
}
