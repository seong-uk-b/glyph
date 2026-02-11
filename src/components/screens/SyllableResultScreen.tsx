import styles from './ResultScreen.module.css';
import Button from '../common/Button';
import { SyllableQuestionResult } from '../../data/types';
import { useLanguage } from '../../i18n';

interface SyllableResultScreenProps {
  results: SyllableQuestionResult[];
  onPlayAgain: () => void;
  onChangeSettings: () => void;
  onHome: () => void;
}

export default function SyllableResultScreen({
  results,
  onPlayAgain,
  onChangeSettings,
  onHome,
}: SyllableResultScreenProps) {
  const { t } = useLanguage();
  const correct = results.filter(r => r.isCorrect).length;
  const total = results.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const missed = results.filter(r => !r.isCorrect);

  const getGrade = () => {
    if (accuracy === 100) return { label: t.perfect, color: 'var(--accent-yellow)' };
    if (accuracy >= 90) return { label: t.excellent, color: 'var(--accent-green)' };
    if (accuracy >= 70) return { label: t.good, color: 'var(--accent-cyan)' };
    if (accuracy >= 50) return { label: t.keepPracticing, color: 'var(--accent-orange)' };
    return { label: t.tryAgain, color: 'var(--accent-red)' };
  };

  const grade = getGrade();

  return (
    <div className={styles.container}>
      <div className={styles.gradeSection}>
        <h2 className={styles.grade} style={{ color: grade.color }}>
          {grade.label}
        </h2>
        <div className={styles.accuracyRing}>
          <span className={styles.accuracyValue}>{accuracy}%</span>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: 'var(--accent-green)' }}>{correct}</span>
          <span className={styles.statLabel}>{t.correct}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: 'var(--accent-red)' }}>{total - correct}</span>
          <span className={styles.statLabel}>{t.wrong}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{total}</span>
          <span className={styles.statLabel}>{t.total}</span>
        </div>
      </div>

      {missed.length > 0 && (
        <div className={styles.missedSection}>
          <h3 className={styles.missedTitle}>{t.reviewMissedCharacters}</h3>
          <div className={styles.missedGrid}>
            {missed.map((r, i) => (
              <div key={i} className={styles.missedItem}>
                <span className={styles.missedChar}>{r.question.syllable}</span>
                <span className={styles.missedAnswer}>{r.question.romanization}</span>
                <span className={styles.missedWrong}>{t.yours} {r.userAnswer}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Button onClick={onPlayAgain}>{t.playAgain}</Button>
        <Button variant="secondary" onClick={onChangeSettings}>{t.changeSettings}</Button>
        <Button variant="ghost" onClick={onHome}>{t.home}</Button>
      </div>
    </div>
  );
}
