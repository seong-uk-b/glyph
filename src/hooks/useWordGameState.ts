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
  mode: WordGameConfig['gameMode'],
  language: MeaningLanguage,
  count: number = 4
): string[] {
  // listening 모드는 발음을 듣고 뜻을 고르므로 wordToMeaning과 동일한 선택지 구성
  const correctAnswer = mode === 'meaningToWord'
    ? getWordLabel(correctWord)
    : getMeaning(correctWord, language);
  const toOption = (w: Word) =>
    mode === 'meaningToWord' ? getWordLabel(w) : getMeaning(w, language);

  // 뜻→단어 모드에서는 문제(뜻)가 같은 단어가 오답으로 나오면 그것도 정답이라 부당하다.
  // 예: 문제 '모레' → 明後日(あさって)와 明後日(みょうごにち) 둘 다 맞는데 하나만 정답 처리됨.
  const correctMeaning = getMeaning(correctWord, language);
  const isEquivalent = (w: Word) =>
    mode === 'meaningToWord' && getMeaning(w, language) === correctMeaning;

  // 풀 전체를 복사·셔플하는 대신 랜덤 인덱스로 추출 — 풀이 수천 개여도 문제당 O(1)
  const used = new Set<string>([correctAnswer]);
  const wrongOptions: string[] = [];
  for (let attempts = 0; wrongOptions.length < count - 1 && attempts < 60; attempts++) {
    const candidate = allWords[Math.floor(Math.random() * allWords.length)];
    if (!candidate || candidate.expression === correctWord.expression) continue;
    if (isEquivalent(candidate)) continue;
    const option = toOption(candidate);
    if (used.has(option)) continue;
    used.add(option);
    wrongOptions.push(option);
  }

  return shuffle([correctAnswer, ...wrongOptions]);
}

export function useWordGameState(config: WordGameConfig) {
  // 문제 생성 — 단어 게임 고유 로직
  const questions = useMemo<WordQuestion[]>(() => {
    const levelWords = getWordsByLevels(config.levels);
    // customWords 지정 시(오답 복습) 해당 목록에서 출제, 오답 선택지는 넓은 풀에서 생성
    const questionPool = config.customWords?.length ? config.customWords : levelWords;
    const distractorPool = levelWords.length ? levelWords : questionPool;
    const shuffled = shuffle(questionPool);
    const selected = shuffled.slice(0, config.questionCount);

    return selected.map(word => {
      const options = generateWordOptions(word, distractorPool, config.gameMode, config.meaningLanguage);
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
