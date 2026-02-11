import styles from './ScoreDisplay.module.css';
import { useLanguage } from '../../i18n';

interface ScoreDisplayProps {
  correct: number;
  total: number;
  streak: number;
  accuracy: number;
}

export default function ScoreDisplay({ correct, total, streak, accuracy }: ScoreDisplayProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.wrapper}>
      <div className={styles.stat}>
        <span className={styles.value}>{correct}/{total}</span>
        <span className={styles.label}>{t.score}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{accuracy}%</span>
        <span className={styles.label}>{t.accuracy}</span>
      </div>
      {streak > 1 && (
        <div className={`${styles.stat} ${styles.streakStat}`}>
          <span className={styles.streakValue}>{streak}</span>
          <span className={styles.label}>{t.streak}</span>
        </div>
      )}
    </div>
  );
}
