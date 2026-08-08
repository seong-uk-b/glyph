import { Word, WordGameConfig } from '../data/types';
import { renderHook } from '@testing-library/react';
import { useWordGameState } from './useWordGameState';

function ja(expression: string, reading: string, ko: string): Word {
  return { expression, reading, meanings: { en: ko, ko }, lang: 'ja', level: 'JLPT_N5' };
}

// 뜻이 겹치는 단어들 — meaningToWord 모드에서 서로 정답이 된다
const SAME_MEANING = [
  ja('明後日', 'あさって', '모레'),
  ja('明後日', 'みょうごにち', '모레'),
  ja('明々後日', 'しあさって', '모레'),
];
// 읽기가 겹치는 단어들 — 듣기 모드에서 발음만으로는 구별할 수 없다
const SAME_SOUND = [
  ja('暑い', 'あつい', '더운'),
  ja('熱い', 'あつい', '뜨거운'),
  ja('厚い', 'あつい', '두꺼운'),
];
const OTHERS = Array.from({ length: 20 }, (_, i) => ja(`語${i}`, `ご${i}`, `뜻${i}`));

function config(overrides: Partial<WordGameConfig> = {}): WordGameConfig {
  return {
    lang: 'ja',
    levels: [],
    gameMode: 'meaningToWord',
    questionCount: 3,
    meaningLanguage: 'ko',
    customWords: [...SAME_MEANING, ...OTHERS],
    ...overrides,
  };
}

describe('generateWordOptions — 동일한 뜻 오답 배제', () => {
  it('뜻→단어 모드에서 문제와 같은 뜻인 단어는 오답 선택지로 쓰지 않는다', () => {
    // 같은 뜻('모레')을 가진 단어만으로 출제해도, 선택지에 그 뜻의 단어가 둘 이상 나오면 안 된다
    for (let run = 0; run < 30; run++) {
      const { result } = renderHook(() =>
        useWordGameState(config({ questionCount: 3, customWords: [...SAME_MEANING, ...OTHERS] })),
      );
      const q = result.current.currentQuestion;
      if (!q || q.word.meanings.ko !== '모레') continue;

      const sameMeaningLabels = q.options.filter(o =>
        SAME_MEANING.some(w => o.startsWith(w.expression)),
      );
      expect(sameMeaningLabels).toHaveLength(1); // 정답 하나뿐
    }
  });

  it('단어→뜻 모드에서는 선택지 문자열이 중복되지 않는다', () => {
    const { result } = renderHook(() =>
      useWordGameState(config({ gameMode: 'wordToMeaning' })),
    );
    const q = result.current.currentQuestion;
    expect(q).toBeTruthy();
    expect(new Set(q!.options).size).toBe(q!.options.length);
  });

  it('듣기 모드에서 읽기가 같은 단어의 뜻은 오답 선택지로 쓰지 않는다', () => {
    // 발음 'あつい' 만 들려주고 暑い/熱い/厚い 중 고르라면 소리로 구별할 방법이 없다
    const meanings = new Set(SAME_SOUND.map(w => w.meanings.ko!));
    for (let run = 0; run < 40; run++) {
      const { result } = renderHook(() =>
        useWordGameState(config({ gameMode: 'listening', customWords: [...SAME_SOUND, ...OTHERS] })),
      );
      const q = result.current.currentQuestion;
      if (!q || (q.word.reading ?? '') !== 'あつい') continue;
      const ambiguous = q.options.filter(o => meanings.has(o));
      expect(ambiguous).toHaveLength(1); // 정답 하나뿐
    }
  });

  it('정답이 항상 선택지에 포함된다', () => {
    for (let run = 0; run < 20; run++) {
      const { result } = renderHook(() => useWordGameState(config()));
      const q = result.current.currentQuestion;
      expect(q).toBeTruthy();
      expect(q!.options[q!.correctIndex]).toBeTruthy();
      expect(q!.correctIndex).toBeGreaterThanOrEqual(0);
    }
  });
});
