import { useEffect, useCallback } from 'react';
import styles from './MultipleChoiceMode.module.css';
import { FeedbackState } from '../../data/types';

interface MultipleChoiceModeProps {
  options: string[];
  correctIndex: number;
  onSubmit: (answer: string) => void;
  feedbackState: FeedbackState;
  selectedAnswer?: string;
}

export default function MultipleChoiceMode({
  options,
  correctIndex,
  onSubmit,
  feedbackState,
  selectedAnswer,
}: MultipleChoiceModeProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (feedbackState !== 'idle') return;
    const num = parseInt(e.key);
    if (num >= 1 && num <= options.length) {
      onSubmit(options[num - 1]);
    }
  }, [feedbackState, options, onSubmit]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getButtonClass = (index: number, option: string) => {
    const base = styles.option;
    if (feedbackState === 'idle') return base;

    if (index === correctIndex) {
      return `${base} ${styles.correct}`;
    }
    if (option === selectedAnswer && feedbackState === 'wrong') {
      return `${base} ${styles.wrong}`;
    }
    return `${base} ${styles.dimmed}`;
  };

  return (
    <div className={styles.grid}>
      {options.map((option, index) => (
        <button
          key={`${option}-${index}`}
          className={getButtonClass(index, option)}
          onClick={() => feedbackState === 'idle' && onSubmit(option)}
          disabled={feedbackState !== 'idle'}
        >
          <span className={styles.keyHint}>{index + 1}</span>
          <span className={styles.optionText}>{option}</span>
        </button>
      ))}
    </div>
  );
}
