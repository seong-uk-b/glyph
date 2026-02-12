let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playCorrectSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 상승 2음 chime: C5 (523Hz) → E5 (659Hz)
    const frequencies = [523, 659];
    const duration = 0.1;

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.3, now + i * duration);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * duration + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * duration);
      osc.stop(now + i * duration + duration);
    });
  } catch {
    // Audio not supported
  }
}

export function playWrongSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 하강 buzz: 300Hz → 200Hz, 150ms
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch {
    // Audio not supported
  }
}
