#!/usr/bin/env node
/**
 * 일본어 단어 발음 mp3 일괄 생성 (Google Cloud Text-to-Speech)
 *
 * 사용법:
 *   GOOGLE_TTS_API_KEY=<발급받은 키> npm run tts:generate
 *
 * - 출력: public/audio/ja/<id>.mp3 (id는 fnv1a(expression|reading) — src/utils/wordAudio.ts와 동일)
 * - 이미 생성된 파일은 건너뛰므로 중단 후 재실행해도 이어서 진행됨
 * - TTS 입력: 기본은 한자 표기(악센트 사전 참조를 위해).
 *   같은 표기가 여러 읽기를 갖는 단어(一日 등)는 읽기(かな)를 입력해 오독을 방지.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public/audio/ja');
const API_KEY = process.env.GOOGLE_TTS_API_KEY;
const VOICE = 'ja-JP-Neural2-B';
const CONCURRENCY = 3;
const REQUEST_INTERVAL_MS = 1100; // 워커당 요청 간격 — 분당 약 160건으로 제한 (429 방지)

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

// 단어 데이터 파싱
const words = [];
for (const file of ['n5.ts', 'n4.ts', 'n3.ts']) {
  const src = readFileSync(join(ROOT, 'src/data/words', file), 'utf-8');
  const re = /\{ expression: '((?:[^'\\]|\\.)*)', reading: '((?:[^'\\]|\\.)*)'/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    words.push({ expression: unescapeTs(m[1]), reading: unescapeTs(m[2]) });
  }
}
console.log(`단어 ${words.length}개 파싱 완료`);

// 같은 표기가 서로 다른 읽기를 가지면(一日: いちにち/ついたち 등) 한자 입력 시
// 하나의 발음으로 뭉개지므로, 해당 단어들은 읽기를 TTS 입력으로 사용
const readingsByExpr = new Map();
for (const w of words) {
  const set = readingsByExpr.get(w.expression) ?? new Set();
  set.add(w.reading);
  readingsByExpr.set(w.expression, set);
}

function cleanForSpeech(s) {
  return s
    .split(';')[0]                 // '足; 脚' → '足'
    .replace(/[～〜]/g, '')        // 접두/접미사 표시 제거
    .replace(/\([^)]*\)/g, '')     // '(する)' 등 괄호 주석 제거
    .trim();
}

function ttsInput(w) {
  const ambiguous = readingsByExpr.get(w.expression).size > 1;
  return cleanForSpeech(ambiguous ? w.reading : w.expression);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function synthesize(text) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'ja-JP', name: VOICE },
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

mkdirSync(OUT_DIR, { recursive: true });

const queue = words.map(w => ({
  ...w,
  id: fnv1a(`${w.expression}|${w.reading}`),
  input: ttsInput(w),
})).filter(w => {
  if (!w.input) return false;
  return !existsSync(join(OUT_DIR, `${w.id}.mp3`));
});

console.log(`생성 대상 ${queue.length}개 (기존 파일은 건너뜀)`);

let done = 0;
const failures = [];

async function worker() {
  while (queue.length > 0) {
    const w = queue.shift();
    try {
      const mp3 = await synthesize(w.input);
      writeFileSync(join(OUT_DIR, `${w.id}.mp3`), mp3);
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
  const logPath = join(ROOT, 'scripts/tts-failures.json');
  writeFileSync(logPath, JSON.stringify(failures, null, 2));
  console.log(`실패 목록: ${logPath} — 재실행하면 실패분만 다시 시도합니다.`);
  process.exit(1);
}
