import { useReducer, useMemo, useCallback } from 'react';
import { BaseGameState, FeedbackState } from '../data/types';

// 제네릭 액션 타입 — 모든 게임 모드에서 동일한 액션을 사용
type GameAction =
  | { type: 'SUBMIT_ANSWER'; answer: string }
  | { type: 'NEXT_QUESTION' };

// useGameStateBase에 전달하는 설정 객체
interface BaseGameConfig<Q, R extends { isCorrect: boolean }> {
  questions: Q[];                                              // 미리 생성된 문제 배열
  checkAnswer: (answer: string, question: Q) => boolean;       // 정답 판별 함수
  createResult: (question: Q, answer: string, isCorrect: boolean) => R; // 결과 객체 생성 함수
}

// 제네릭 reducer — 문제 타입(Q)과 결과 타입(R)만 다르고 로직은 동일
function createReducer<Q, R extends { isCorrect: boolean }>(
  checkAnswer: (answer: string, question: Q) => boolean,
  createResult: (question: Q, answer: string, isCorrect: boolean) => R,
) {
  return function reducer(
    state: BaseGameState<Q, R>,
    action: GameAction,
  ): BaseGameState<Q, R> {
    switch (action.type) {
      case 'SUBMIT_ANSWER': {
        if (state.feedbackState !== 'idle') return state;
        const current = state.questions[state.currentIndex];
        const correct = checkAnswer(action.answer, current);
        const newStreak = correct ? state.currentStreak + 1 : 0;
        const result = createResult(current, action.answer, correct);
        return {
          ...state,
          results: [...state.results, result],
          currentStreak: newStreak,
          bestStreak: Math.max(state.bestStreak, newStreak),
          feedbackState: correct ? 'correct' : 'wrong',
        };
      }
      case 'NEXT_QUESTION': {
        const nextIndex = state.currentIndex + 1;
        return {
          ...state,
          currentIndex: nextIndex,
          feedbackState: 'idle',
          isFinished: nextIndex >= state.questions.length,
        };
      }
      default:
        return state;
    }
  };
}

/**
 * 공통 게임 상태 훅 — 가나 게임과 단어 게임이 공유하는 reducer, 파생 값, 콜백을 제공
 *
 * @param config.questions   - 미리 생성된 문제 배열
 * @param config.checkAnswer - (userAnswer, question) => boolean
 * @param config.createResult - (question, userAnswer, isCorrect) => R
 */
export function useGameStateBase<Q, R extends { isCorrect: boolean }>(
  config: BaseGameConfig<Q, R>,
) {
  // reducer를 config의 함수로 생성 (useMemo로 안정적 참조 유지)
  const reducer = useMemo(
    () => createReducer(config.checkAnswer, config.createResult),
    [config.checkAnswer, config.createResult],
  );

  const initialState = useMemo<BaseGameState<Q, R>>(() => ({
    questions: config.questions,
    currentIndex: 0,
    results: [],
    currentStreak: 0,
    bestStreak: 0,
    feedbackState: 'idle' as FeedbackState,
    isFinished: false,
    startTime: Date.now(),
  }), [config.questions]);

  const [state, dispatch] = useReducer(reducer, initialState);

  // 콜백 래퍼 — 화면 컴포넌트에서 dispatch 대신 사용
  const submitAnswer = useCallback((answer: string) => {
    dispatch({ type: 'SUBMIT_ANSWER', answer });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  // 파생 값 계산
  const currentQuestion = state.questions[state.currentIndex] ?? null;
  const totalQuestions = state.questions.length;
  const correctCount = state.results.filter(r => r.isCorrect).length;
  const accuracy = state.results.length > 0
    ? Math.round((correctCount / state.results.length) * 100)
    : 0;

  return {
    ...state,
    currentQuestion,
    totalQuestions,
    correctCount,
    accuracy,
    submitAnswer,
    nextQuestion,
  };
}
