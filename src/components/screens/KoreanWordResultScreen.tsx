import styles from './WordResultScreen.module.css';
import Button from '../common/Button';
import { KoreanWordQuestionResult, KoreanWordGameConfig, KoreanWord } from '../../data/types';
import { useLanguage } from '../../i18n';

interface KoreanWordResultScreenProps {
  results: KoreanWordQuestionResult[];
  config: KoreanWordGameConfig | null;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
  onHome: () => void;
}

function getMeaning(word: KoreanWord, language: 'en' | 'ja'): string {
  if (language === 'ja' && word.meaningJa) return word.meaningJa;
  return word.meaning;
}

export default function KoreanWordResultScreen({
  results,
  config,
  onPlayAgain,
  onChangeSettings,
  onHome,
}: KoreanWordResultScreenProps) {
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
          <h3 className={styles.missedTitle}>{t.reviewMissedWords}</h3>
          <div className={styles.missedList}>
            {missed.map((r, i) => (
              <div key={i} className={styles.missedItem}>
                <div className={styles.missedWord}>
                  <span className={styles.expression}>{r.question.word.expression}</span>
                </div>
                <div className={styles.missedMeaning}>
                  {config ? getMeaning(r.question.word, config.language) : r.question.word.meaning}
                </div>
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
