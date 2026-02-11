import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.label}>{current} / {total}</span>
    </div>
  );
}
