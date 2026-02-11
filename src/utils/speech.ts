// Text-to-Speech utility using Web Speech API

type SpeechLang = 'ja' | 'ko' | 'en';

const LANG_MAP: Record<SpeechLang, string> = {
  ja: 'ja-JP',
  ko: 'ko-KR',
  en: 'en-US',
};

const voiceCache: Partial<Record<SpeechLang, SpeechSynthesisVoice>> = {};

// 고품질 음성 키워드 — 이 키워드가 포함된 음성을 우선 선택
const PREFERRED_KEYWORDS = ['google', 'natural', 'premium', 'enhanced', 'neural'];

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  if (PREFERRED_KEYWORDS.some(kw => name.includes(kw))) return 2;
  if (!voice.localService) return 1; // 네트워크 음성 우선
  return 0;
}

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  for (const lang of Object.keys(LANG_MAP) as SpeechLang[]) {
    const matches = voices.filter(v => v.lang.includes(lang));
    matches.sort((a, b) => scoreVoice(b) - scoreVoice(a));
    voiceCache[lang] = matches[0] || undefined;
  }
}

// Load voices on init
if (typeof window !== 'undefined') {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

let pendingSpeak: number | undefined;

export function speak(text: string, lang: SpeechLang = 'ja', reading?: string): void {
  if (pendingSpeak) {
    clearTimeout(pendingSpeak);
  }

  const textToSpeak = reading || text;

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = LANG_MAP[lang];
  utterance.rate = 0.8;
  utterance.pitch = 0.95;

  const voice = voiceCache[lang];
  if (voice) {
    utterance.voice = voice;
  }

  if (speechSynthesis.speaking || speechSynthesis.pending) {
    // Something is playing — cancel first, then speak after brief delay
    speechSynthesis.cancel();
    pendingSpeak = window.setTimeout(() => {
      speechSynthesis.speak(utterance);
    }, 50);
  } else {
    // Nothing playing — speak directly, no cancel needed
    speechSynthesis.speak(utterance);
  }
}

export function stopSpeaking(): void {
  if (pendingSpeak) {
    clearTimeout(pendingSpeak);
  }
  speechSynthesis.cancel();
}
