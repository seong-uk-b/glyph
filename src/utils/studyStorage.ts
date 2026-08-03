// 학습 기록 저장 유틸 — 오답 노트 + 일별 통계 (localStorage)

import { Word, WordLanguage, WordQuestionResult } from '../data/types';

const MISSED_KEY = 'glyph-missed-words';
const STATS_KEY = 'glyph-daily-stats';

const MAX_MISSED_WORDS = 200; // 복습 목록 최대 개수
const MAX_STAT_DAYS = 60;     // 일별 통계 보관 일수

export interface MissedEntry {
  word: Word;
  missCount: number;
  lastMissed: string; // ISO 8601
}

export interface DayStat {
  total: number;
  correct: number;
}

type MissedStore = { [lang in WordLanguage]?: Record<string, MissedEntry> };
type DailyStats = Record<string, DayStat>;

// localStorage 읽기 — 깨진 JSON이나 접근 불가 상황은 빈 값으로 복구
function readStore<T extends object>(key: string): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {} as T;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {} as T;
    return parsed as T;
  } catch {
    return {} as T;
  }
}

function writeStore(key: string, value: object): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 용량 초과(QuotaExceeded) 등은 무시 — 저장 실패가 학습을 막지 않도록
  }
}

// 로컬 시간 기준 YYYY-MM-DD (toISOString은 UTC라 날짜가 밀릴 수 있음)
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function todayKey(): string {
  return toDateKey(new Date());
}

// 저장된 항목이 기대하는 모양인지 확인 (수동 편집/구버전 데이터 방어)
function isValidEntry(entry: unknown): entry is MissedEntry {
  if (!entry || typeof entry !== 'object') return false;
  const e = entry as MissedEntry;
  return !!e.word && typeof e.word.expression === 'string' && typeof e.missCount === 'number';
}

// 검증은 읽기 경계에서 한 번만 — 이후 코드는 결과를 신뢰
function readMissedEntries(lang: WordLanguage): MissedEntry[] {
  const byLang = readStore<MissedStore>(MISSED_KEY)[lang];
  if (!byLang || typeof byLang !== 'object') return [];
  return Object.values(byLang).filter(isValidEntry);
}

function toDayStat(day: DayStat | undefined): DayStat {
  return {
    total: typeof day?.total === 'number' ? day.total : 0,
    correct: typeof day?.correct === 'number' ? day.correct : 0,
  };
}

// 오래된 통계 제거 — 최근 MAX_STAT_DAYS일만 보관
function pruneStats(stats: DailyStats): DailyStats {
  const dates = Object.keys(stats).sort();
  if (dates.length <= MAX_STAT_DAYS) return stats;

  const kept: DailyStats = {};
  for (const date of dates.slice(-MAX_STAT_DAYS)) {
    kept[date] = stats[date];
  }
  return kept;
}

// 일별 통계 기록 — isCorrect만 있으면 되므로 모든 게임 종류(가나/한글/조합/단어)가 공유
export function recordSession(results: Array<{ isCorrect: boolean }>): void {
  if (!results.length) return;

  const stats = readStore<DailyStats>(STATS_KEY);
  const today = todayKey();
  const day = toDayStat(stats[today]);

  for (const result of results) {
    day.total += 1;
    if (result.isCorrect) day.correct += 1;
  }

  stats[today] = day;
  writeStore(STATS_KEY, pruneStats(stats));
}

// 오답 노트 반영 — 단어 게임 전용 (Word 객체가 필요)
export function recordMissedWords(results: WordQuestionResult[]): void {
  if (!results.length) return;

  const missed = readStore<MissedStore>(MISSED_KEY);
  const now = new Date().toISOString();
  let missedDirty = false;

  for (const result of results) {
    const word = result.question?.word;
    if (!word) continue;

    const byLang = missed[word.lang] || {};
    const key = word.expression;
    const entry = isValidEntry(byLang[key]) ? byLang[key] : undefined;

    if (result.isCorrect) {
      // 맞히면 오답 횟수 차감 — 0이 되면 복습 목록에서 제거 (마스터)
      if (!entry) continue;
      const nextCount = entry.missCount - 1;
      if (nextCount <= 0) {
        delete byLang[key];
      } else {
        byLang[key] = { ...entry, missCount: nextCount };
      }
    } else {
      byLang[key] = {
        word,
        missCount: (entry?.missCount ?? 0) + 1,
        lastMissed: now,
      };
    }

    missed[word.lang] = byLang;
    missedDirty = true;
  }

  // 오답 목록에 변화가 없으면(전부 정답 + 기존 오답 없음) 큰 blob 재기록 생략
  if (missedDirty) writeStore(MISSED_KEY, missed);
}

// 오답 단어 목록 — 많이 틀린 순, 최대 MAX_MISSED_WORDS개
export function getMissedWords(lang: WordLanguage): Word[] {
  return readMissedEntries(lang)
    .sort((a, b) => b.missCount - a.missCount)
    .slice(0, MAX_MISSED_WORDS)
    .map(entry => entry.word);
}

export function getMissedCount(lang: WordLanguage): number {
  return readMissedEntries(lang).length;
}

// 연속 학습일 — 오늘 또는 어제부터 거슬러 올라가며 끊기지 않은 날 수
// (오늘 아직 학습 전이어도 어제까지의 연속 기록은 유지)
function computeStreak(stats: DailyStats): number {
  const cursor = new Date();
  if (!stats[toDateKey(cursor)]) {
    cursor.setDate(cursor.getDate() - 1);
    if (!stats[toDateKey(cursor)]) return 0;
  }

  let streak = 0;
  while (stats[toDateKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getStreak(): number {
  return computeStreak(readStore<DailyStats>(STATS_KEY));
}

export function getTodayStats(): DayStat {
  return toDayStat(readStore<DailyStats>(STATS_KEY)[todayKey()]);
}

// 홈 화면용 — 통계 blob을 한 번만 파싱해 스트릭과 오늘 기록을 함께 반환
export function getStudySummary(): { streak: number; today: DayStat } {
  const stats = readStore<DailyStats>(STATS_KEY);
  return {
    streak: computeStreak(stats),
    today: toDayStat(stats[todayKey()]),
  };
}
