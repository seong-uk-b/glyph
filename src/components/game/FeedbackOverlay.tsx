import { useEffect } from 'react';
import styles from './FeedbackOverlay.module.css';
import { FeedbackState } from '../../data/types';
import { useLanguage } from '../../i18n';
import { playCorrectSound, playWrongSound } from '../../utils/sound';

interface FeedbackOverlayProps {
  state: FeedbackState;
  correctAnswer: string;
  onComplete: () => void;
}

export default function FeedbackOverlay({ state, correctAnswer, onComplete }: FeedbackOverlayProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (state === 'correct') playCorrectSound();
    if (state === 'wrong') playWrongSound();
  }, [state]);

  useEffect(() => {
    if (state === 'idle') return;
    // Only auto-advance for correct answers
    if (state === 'correct') {
      const timer = setTimeout(onComplete, 700);
      return () => clearTimeout(timer);
    }
  }, [state, onComplete]);

  if (state === 'idle') return null;

  return (
    <div className={`${styles.overlay} ${styles[state]}`}>
      {state === 'correct' ? (
        <span className={styles.correctText}>{t.correct}!</span>
      ) : (
        <div className={styles.wrongContent}>
          <span className={styles.wrongText}>{t.wrong}!</span>
          <span className={styles.answer}>
            {t.answer} <strong>{correctAnswer}</strong>
          </span>
          <button className={styles.nextButton} onClick={onComplete}>
            {t.next}
          </button>
        </div>
      )}
    </div>
  );
}
