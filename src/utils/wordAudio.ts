// 사전 생성된 단어 발음 mp3 재생 (없으면 Web Speech API 폴백은 호출부에서 처리)
// 파일명 해시는 scripts/generate-tts.mjs의 fnv1a와 반드시 동일해야 함

export function fnv1a(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function wordAudioId(expression: string, reading: string): string {
  return fnv1a(`${expression}|${reading}`);
}

// 존재하지 않는 파일에 대한 반복 요청 방지
const missing = new Set<string>();

/**
 * 사전 생성 mp3 재생을 시도한다.
 * 재생을 시작하면 HTMLAudioElement를, 파일이 없으면 null을 반환한다.
 * 한국어 단어는 reading이 없으므로 빈 문자열로 해시한다.
 */
export function tryPlayWordAudio(
  expression: string,
  reading: string,
  lang: 'ja' | 'ko' = 'ja',
): Promise<HTMLAudioElement | null> {
  const id = wordAudioId(expression, reading);
  if (missing.has(id)) {
    return Promise.resolve(null);
  }

  const url = `${process.env.PUBLIC_URL || '.'}/audio/${lang}/${id}.mp3`;
  const audio = new Audio(url);

  return new Promise(resolve => {
    audio.oncanplaythrough = () => {
      audio.play().then(() => resolve(audio)).catch(() => resolve(null));
    };
    audio.onerror = () => {
      missing.add(id);
      resolve(null);
    };
  });
}
