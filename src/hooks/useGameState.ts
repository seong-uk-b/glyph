import { useMemo, useCallback } from 'react';
import { GameConfig, GameQuestion, QuestionResult } from '../data/types';
import { getCharactersByRows } from '../data';
import { shuffle, generateOptions, isCorrectAnswer } from '../utils/gameLogic';
import { useGameStateBase } from './useGameStateBase';

export function useGameState(config: GameConfig) {
  // 문제 생성 — 가나 게임 고유 로직
  const questions = useMemo<GameQuestion[]>(() => {
    const characters = getCharactersByRows(config.characterType, config.selectedRowIds);
    const shuffled = shuffle(characters);

    return shuffled.map(char => {
      if (config.gameMode === 'multipleChoice') {
        const options = generateOptions(char, characters);
        return {
          character: char,
          options,
          correctIndex: options.indexOf(char.romaji),
        };
      }
      return { character: char };
    });
  }, [config]);

  // 정답 판별 — 로마지 대체 표기 허용 (shi=si 등)
  const checkAnswer = useCallback(
    (answer: string, question: GameQuestion) =>
      isCorrectAnswer(answer, question.character.romaji),
    [],
  );

  // 결과 객체 생성
  const createResult = useCallback(
    (question: GameQuestion, userAnswer: string, isCorrect: boolean): QuestionResult => ({
      question,
      userAnswer,
      isCorrect,
    }),
    [],
  );

  return useGameStateBase({ questions, checkAnswer, createResult });
}
