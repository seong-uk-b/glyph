#!/usr/bin/env node
/**
 * 단어 발음 mp3 일괄 생성 (Google Cloud Text-to-Speech)
 *
 * 사용법:
 *   GOOGLE_TTS_API_KEY=<발급받은 키> npm run tts:generate
 *
 * - 출력: public/audio/<lang>/<id>.mp3 (id는 fnv1a(expression|reading) — src/utils/wordAudio.ts와 동일)
 * - 이미 생성된 파일은 건너뛰므로 중단 후 재실행해도 이어서 진행됨
 * - 일본어 TTS 입력: 기본은 한자 표기(악센트 사전 참조를 위해).
 *   같은 표기가 여러 읽기를 갖는 단어(一日 등)는 읽기(かな)를 입력해 오독을 방지.
 * - 한국어는 표기 자체가 발음이므로 expression을 그대로 사용 (reading 없음 → id는 'expression|')
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const API_KEY = process.env.GOOGLE_TTS_API_KEY;
const CONCURRENCY = 3;
const REQUEST_INTERVAL_MS = 1100; // 워커당 요청 간격 — 분당 약 160건으로 제한 (429 방지)

const LANG_CONFIG = {
  ja: {
    // 레벨 파일을 추가하면 여기에도 반드시 등록할 것 — 누락되면 그 레벨 단어는
    // mp3 없이 배포돼 Web Speech 폴백(가나 입력)으로 읽힌다 (docs/harness/sync-contracts.md)
    files: [
      'src/data/words/n5.ts', 'src/data/words/n4.ts', 'src/data/words/n3.ts',
      'src/data/words/n2.ts', 'src/data/words/n1.ts',
    ],
    hasReading: true,
    voice: { languageCode: 'ja-JP', name: 'ja-JP-Neural2-B' },
  },
  ko: {
    files: ['src/data/korean-words.ts', 'src/data/korean-words-2.ts'],
    hasReading: false,
    voice: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-A' },
  },
};

if (!API_KEY) {
  console.error('GOOGLE_TTS_API_KEY 환경변수가 필요합니다.');
  console.error('예: GOOGLE_TTS_API_KEY=AIza... npm run tts:generate');
  process.exit(1);
}

// src/utils/wordAudio.ts의 fnv1a와 반드시 동일하게 유지
function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function unescapeTs(s) {
  return s.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}

function cleanForSpeech(s) {
  return s
    .split(';')[0]                 // '足; 脚' → '足'
    .replace(/[～〜]/g, '')        // 접두/접미사 표시 제거
    .replace(/\([^)]*\)/g, '')     // '(する)' 등 괄호 주석 제거
    .trim();
}

// 단어 데이터 파싱
const words = [];
for (const [lang, cfg] of Object.entries(LANG_CONFIG)) {
  for (const file of cfg.files) {
    const src = readFileSync(join(ROOT, file), 'utf-8');
    const re = cfg.hasReading
      ? /\{ expression: '((?:[^'\\]|\\.)*)', reading: '((?:[^'\\]|\\.)*)'/g
      : /\{ expression: '((?:[^'\\]|\\.)*)', meanings/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      words.push({ lang, expression: unescapeTs(m[1]), reading: cfg.hasReading ? unescapeTs(m[2]) : '' });
    }
  }
}
console.log(`단어 파싱 완료: ${words.length}개 (ja: ${words.filter(w => w.lang === 'ja').length}, ko: ${words.filter(w => w.lang === 'ko').length})`);

// 같은 표기가 서로 다른 읽기를 가지면(一日: いちにち/ついたち 등) 한자 입력 시
// 하나의 발음으로 뭉개지므로, 해당 단어들은 읽기를 TTS 입력으로 사용
const readingsByExpr = new Map();
for (const w of words) {
  const key = `${w.lang}:${w.expression}`;
  const set = readingsByExpr.get(key) ?? new Set();
  set.add(w.reading);
  readingsByExpr.set(key, set);
}

function ttsInput(w) {
  const ambiguous = readingsByExpr.get(`${w.lang}:${w.expression}`).size > 1;
  return cleanForSpeech(ambiguous && w.reading ? w.reading : w.expression);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function synthesize(text, voice) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice,
          audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9 },
        }),
      },
    );
    if (res.ok) {
      const { audioContent } = await res.json();
      return Buffer.from(audioContent, 'base64');
    }
    // 429(속도 제한)는 지수 백오프 후 재시도
    if (res.status === 429 && attempt < 6) {
      await sleep(2000 * attempt);
      continue;
    }
    throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

for (const lang of Object.keys(LANG_CONFIG)) {
  mkdirSync(join(ROOT, 'public/audio', lang), { recursive: true });
}

const queue = words.map(w => ({
  ...w,
  outPath: join(ROOT, 'public/audio', w.lang, `${fnv1a(`${w.expression}|${w.reading}`)}.mp3`),
  input: ttsInput(w),
})).filter(w => w.input && !existsSync(w.outPath));

console.log(`생성 대상 ${queue.length}개 (기존 파일은 건너뜀)`);

let done = 0;
const failures = [];

async function worker() {
  while (queue.length > 0) {
    const w = queue.shift();
    try {
      const mp3 = await synthesize(w.input, LANG_CONFIG[w.lang].voice);
      writeFileSync(w.outPath, mp3);
    } catch (err) {
      failures.push({ ...w, error: String(err) });
    }
    await sleep(REQUEST_INTERVAL_MS);
    done++;
    if (done % 100 === 0) console.log(`진행: ${done}개 완료`);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`\n완료: 성공 ${done - failures.length}개 / 실패 ${failures.length}개`);
if (failures.length > 0) {
  const logPath = join(ROOT, 'scripts/pipeline/tts-failures.json');
  writeFileSync(logPath, JSON.stringify(failures, null, 2));
  console.log(`실패 목록: ${logPath} — 재실행하면 실패분만 다시 시도합니다.`);
  process.exit(1);
}
