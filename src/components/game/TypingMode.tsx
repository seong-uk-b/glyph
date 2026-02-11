import { useState, useRef, useEffect } from 'react';
import styles from './TypingMode.module.css';
import { FeedbackState } from '../../data/types';
import { useLanguage } from '../../i18n';

interface TypingModeProps {
  onSubmit: (answer: string) => void;
  feedbackState: FeedbackState;
}

export default function TypingMode({ onSubmit, feedbackState }: TypingModeProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (feedbackState === 'idle') {
      setValue('');
      inputRef.current?.focus();
    }
  }, [feedbackState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && feedbackState === 'idle') {
      onSubmit(value.trim());
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t.typeRomaji}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        disabled={feedbackState !== 'idle'}
      />
      <button
        className={styles.submit}
        type="submit"
        disabled={!value.trim() || feedbackState !== 'idle'}
      >
        {t.enter}
      </button>
    </form>
  );
}
