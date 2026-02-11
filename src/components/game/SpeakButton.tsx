import { useState, useCallback } from 'react';
import { speak } from '../../utils/speech';
import styles from './SpeakButton.module.css';

interface SpeakButtonProps {
  text: string;
  reading?: string;
  lang?: 'ja' | 'ko' | 'en';
  size?: 'small' | 'medium' | 'large';
}

export default function SpeakButton({ text, reading, lang = 'ja', size = 'medium' }: SpeakButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = useCallback(() => {
    setIsPlaying(true);
    speak(text, lang, reading);

    const duration = Math.max(500, (reading || text).length * 200);
    setTimeout(() => setIsPlaying(false), duration);
  }, [text, reading, lang]);

  return (
    <button
      className={`${styles.speakButton} ${styles[size]} ${isPlaying ? styles.playing : ''}`}
      onClick={handleClick}
      aria-label="発音を聞く"
      type="button"
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isPlaying ? (
          // Sound waves animation
          <>
            <path
              d="M11 5L6 9H2v6h4l5 4V5z"
              fill="currentColor"
            />
            <path
              className={styles.wave1}
              d="M15.54 8.46a5 5 0 0 1 0 7.07"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              className={styles.wave2}
              d="M19.07 4.93a10 10 0 0 1 0 14.14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        ) : (
          // Speaker icon
          <>
            <path
              d="M11 5L6 9H2v6h4l5 4V5z"
              fill="currentColor"
            />
            <path
              d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
          </>
        )}
      </svg>
    </button>
  );
}
