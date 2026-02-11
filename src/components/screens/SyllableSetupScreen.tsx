import { useState } from 'react';
import styles from './SetupScreen.module.css';
import ToggleGroup from '../common/ToggleGroup';
import Button from '../common/Button';
import { SyllableGameConfig } from '../../data/types';
import { useLanguage } from '../../i18n';

interface SyllableSetupScreenProps {
  onStartGame: (config: SyllableGameConfig) => void;
}

const QUESTION_COUNT_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
];

export default function SyllableSetupScreen({ onStartGame }: SyllableSetupScreenProps) {
  const { t } = useLanguage();
  const [includeBatchim, setIncludeBatchim] = useState('without');
  const [questionCount, setQuestionCount] = useState('10');

  const batchimOptions = [
    { value: 'without', label: t.withoutBatchim },
    { value: 'with', label: t.withBatchim },
  ];

  const totalCombinations = includeBatchim === 'with'
    ? 19 * 21 * 27
    : 19 * 21;

  const handleStart = () => {
    onStartGame({
      includeBatchim: includeBatchim === 'with',
      questionCount: parseInt(questionCount),
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.gameSettings}</h2>

      <section className={styles.section}>
        <ToggleGroup
          label={t.includeBatchim}
          options={batchimOptions}
          value={includeBatchim}
          onChange={setIncludeBatchim}
        />
      </section>

      <section className={styles.section}>
        <ToggleGroup
          label={t.questions}
          options={QUESTION_COUNT_OPTIONS}
          value={questionCount}
          onChange={setQuestionCount}
        />
      </section>

      <div className={styles.footer}>
        <span className={styles.charCount}>{totalCombinations.toLocaleString()} {t.characters}</span>
        <Button onClick={handleStart}>{t.startGame}</Button>
      </div>
    </div>
  );
}
