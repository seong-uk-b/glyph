import { Word, WordQuestionResult } from '../data/types';
import {
  recordSession,
  recordMissedWords,
  getMissedWords,
  getMissedCount,
  getStreak,
  getTodayStats,
} from './studyStorage';

// 게임 완료 시 App이 두 함수를 함께 호출하는 것과 동일한 형태
function recordWordResults(results: WordQuestionResult[]): void {
  recordSession(results);
  recordMissedWords(results);
}

const MISSED_KEY = 'glyph-missed-words';
const STATS_KEY = 'glyph-daily-stats';

function makeWord(expression: string, lang: Word['lang'] = 'ja'): Word {
  return {
    expression,
    reading: expression,
    meanings: { en: `${expression} meaning` },
    lang,
    level: lang === 'ja' ? 'JLPT_N5' : 'TOPIK_1',
  };
}

function makeResult(word: Word, isCorrect: boolean): WordQuestionResult {
  return {
    question: { word, options: [word.meanings.en, 'a', 'b', 'c'], correctIndex: 0 },
    userAnswer: isCorrect ? word.meanings.en : 'a',
    isCorrect,
  };
}

// 오늘 기준 offset일 전의 날짜 키 (로컬 시간)
function dateKey(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function setStats(offsets: number[]): void {
  const stats: Record<string, { total: number; correct: number }> = {};
  for (const offset of offsets) {
    stats[dateKey(offset)] = { total: 10, correct: 8 };
  }
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

beforeEach(() => {
  localStorage.clear();
});

describe('recordWordResults - 오답 노트', () => {
  it('틀린 단어가 오답 목록에 추가된다', () => {
    const word = makeWord('食べる');
    recordWordResults([makeResult(word, false)]);

    expect(getMissedWords('ja').map(w => w.expression)).toEqual(['食べる']);
    expect(getMissedCount('ja')).toBe(1);
  });

  it('맞힌 단어는 오답 목록에 추가되지 않는다', () => {
    recordWordResults([makeResult(makeWord('飲む'), true)]);

    expect(getMissedWords('ja')).toEqual([]);
    expect(getMissedCount('ja')).toBe(0);
  });

  it('같은 단어를 반복해서 틀리면 missCount가 누적되고 많이 틀린 순으로 정렬된다', () => {
    const a = makeWord('食べる');
    const b = makeWord('飲む');

    recordWordResults([makeResult(a, false), makeResult(b, false)]);
    recordWordResults([makeResult(b, false)]);

    expect(getMissedWords('ja').map(w => w.expression)).toEqual(['飲む', '食べる']);
  });

  it('맞히면 missCount가 차감되고 0이 되면 목록에서 제거된다', () => {
    const word = makeWord('食べる');
    recordWordResults([makeResult(word, false)]);
    recordWordResults([makeResult(word, false)]); // missCount = 2

    recordWordResults([makeResult(word, true)]); // 1 — 아직 남아 있음
    expect(getMissedCount('ja')).toBe(1);

    recordWordResults([makeResult(word, true)]); // 0 — 제거
    expect(getMissedCount('ja')).toBe(0);
    expect(getMissedWords('ja')).toEqual([]);
  });

  it('언어별로 오답 목록이 분리된다', () => {
    recordWordResults([
      makeResult(makeWord('食べる', 'ja'), false),
      makeResult(makeWord('먹다', 'ko'), false),
    ]);

    expect(getMissedWords('ja').map(w => w.expression)).toEqual(['食べる']);
    expect(getMissedWords('ko').map(w => w.expression)).toEqual(['먹다']);
    expect(getMissedCount('ko')).toBe(1);
  });

  it('오답 목록은 최대 200개까지만 반환한다', () => {
    const results = Array.from({ length: 250 }, (_, i) =>
      makeResult(makeWord(`単語${i}`), false)
    );
    recordWordResults(results);

    expect(getMissedCount('ja')).toBe(250);
    expect(getMissedWords('ja')).toHaveLength(200);
  });
});

describe('getTodayStats', () => {
  it('기록이 없으면 0을 반환한다', () => {
    expect(getTodayStats()).toEqual({ total: 0, correct: 0 });
  });

  it('오늘 푼 문제 수와 정답 수를 누적한다', () => {
    recordWordResults([
      makeResult(makeWord('A'), true),
      makeResult(makeWord('B'), false),
    ]);
    recordWordResults([makeResult(makeWord('C'), true)]);

    expect(getTodayStats()).toEqual({ total: 3, correct: 2 });
  });
});

describe('getStreak', () => {
  it('기록이 없으면 0이다', () => {
    expect(getStreak()).toBe(0);
  });

  it('오늘 학습했으면 1부터 센다', () => {
    setStats([0]);
    expect(getStreak()).toBe(1);
  });

  it('오늘부터 연속된 날을 모두 센다', () => {
    setStats([0, 1, 2]);
    expect(getStreak()).toBe(3);
  });

  it('오늘 아직 학습하지 않아도 어제까지의 연속 기록은 유지된다', () => {
    setStats([1, 2]);
    expect(getStreak()).toBe(2);
  });

  it('오늘과 어제 모두 기록이 없으면 0이다', () => {
    setStats([2, 3]);
    expect(getStreak()).toBe(0);
  });

  it('중간에 빠진 날이 있으면 거기서 끊긴다', () => {
    setStats([0, 1, 3, 4]);
    expect(getStreak()).toBe(2);
  });

  it('학습을 기록하면 streak가 시작된다', () => {
    recordWordResults([makeResult(makeWord('A'), true)]);
    expect(getStreak()).toBe(1);
  });
});

describe('손상된 localStorage 복구', () => {
  it('깨진 JSON이 있어도 조회 함수가 예외를 던지지 않는다', () => {
    localStorage.setItem(MISSED_KEY, '{not json');
    localStorage.setItem(STATS_KEY, '<<<>>>');

    expect(() => getMissedWords('ja')).not.toThrow();
    expect(getMissedWords('ja')).toEqual([]);
    expect(getMissedCount('ja')).toBe(0);
    expect(getStreak()).toBe(0);
    expect(getTodayStats()).toEqual({ total: 0, correct: 0 });
  });

  it('깨진 JSON 위에 기록해도 정상 동작한다', () => {
    localStorage.setItem(MISSED_KEY, 'null');
    localStorage.setItem(STATS_KEY, '[1,2,3]');

    expect(() => recordWordResults([makeResult(makeWord('食べる'), false)])).not.toThrow();
    expect(getMissedWords('ja').map(w => w.expression)).toEqual(['食べる']);
    expect(getTodayStats()).toEqual({ total: 1, correct: 0 });
  });

  it('모양이 잘못된 항목은 무시한다', () => {
    localStorage.setItem(MISSED_KEY, JSON.stringify({ ja: { broken: 42, empty: null } }));

    expect(getMissedWords('ja')).toEqual([]);
    expect(getMissedCount('ja')).toBe(0);
  });

  it('빈 결과 배열은 아무것도 저장하지 않는다', () => {
    recordWordResults([]);
    expect(localStorage.getItem(STATS_KEY)).toBeNull();
  });
});

describe('일별 통계 보관', () => {
  it('최근 60일치만 유지한다', () => {
    const stats: Record<string, { total: number; correct: number }> = {};
    for (let i = 0; i < 80; i++) {
      stats[dateKey(i)] = { total: 1, correct: 1 };
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));

    recordWordResults([makeResult(makeWord('A'), true)]);

    const saved = JSON.parse(localStorage.getItem(STATS_KEY) as string);
    expect(Object.keys(saved)).toHaveLength(60);
    expect(saved[dateKey(0)]).toBeDefined();
    expect(saved[dateKey(59)]).toBeDefined();
    expect(saved[dateKey(60)]).toBeUndefined();
  });
});
