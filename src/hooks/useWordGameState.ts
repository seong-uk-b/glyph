import { useMemo, useCallback } from 'react';
import {
  WordGameConfig,
  WordQuestion,
  WordQuestionResult,
  Word,
  MeaningLanguage
} from '../data/types';
import { getWordsByLevels } from '../data/words';
import { shuffle } from '../utils/gameLogic';
import { getMeaning, getWordLabel } from '../utils/wordUtils';
import { useGameStateBase } from './useGameStateBase';

// 오답 선택지를 포함한 4지선다 옵션 생성
function generateWordOptions(
  correctWord: Word,
  allWords: Word[],
  mode: 'meaningToWord' | 'wordToMeaning',
  language: MeaningLanguage,
  count: number = 4
): string[] {
  const correctAnswer = mode === 'meaningToWord'
    ? getWordLabel(correctWord)
    : getMeaning(correctWord, language);

  const otherWords = allWords.filter(w => w.expression !== correctWord.expression);
  const shuffledOthers = shuffle(otherWords).slice(0, count - 1);

  const wrongOptions = shuffledOthers.map(w =>
    mode === 'meaningToWord'
      ? getWordLabel(w)
      : getMeaning(w, language)
  );

  return shuffle([correctAnswer, ...wrongOptions]);
}

export function useWordGameState(config: WordGameConfig) {
  // 문제 생성 — 단어 게임 고유 로직
  const questions = useMemo<WordQuestion[]>(() => {
    const allWords = getWordsByLevels(config.levels);
    const shuffled = shuffle(allWords);
    const selected = shuffled.slice(0, config.questionCount);

    return selected.map(word => {
      const options = generateWordOptions(word, allWords, config.gameMode, config.meaningLanguage);
      const correctAnswer = config.gameMode === 'meaningToWord'
        ? getWordLabel(word)
        : getMeaning(word, config.meaningLanguage);
      return {
        word,
        options,
        correctIndex: options.indexOf(correctAnswer),
      };
    });
  }, [config]);

  // 정답 판별 — 선택한 답이 정답 옵션과 일치하는지 비교
  const checkAnswer = useCallback(
    (answer: string, question: WordQuestion) =>
      answer === question.options[question.correctIndex],
    [],
  );

  // 결과 객체 생성
  const createResult = useCallback(
    (question: WordQuestion, userAnswer: string, isCorrect: boolean): WordQuestionResult => ({
      question,
      userAnswer,
      isCorrect,
    }),
    [],
  );

  const base = useGameStateBase({ questions, checkAnswer, createResult });

  return {
    ...base,
    config,
  };
}
