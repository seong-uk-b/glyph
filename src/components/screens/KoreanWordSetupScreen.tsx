import { useState } from 'react';
import styles from './SetupScreen.module.css';
import ToggleGroup from '../common/ToggleGroup';
import Button from '../common/Button';
import { WordGameMode, KoreanWordGameConfig } from '../../data/types';
import { getKoreanWordCount } from '../../data/korean-words';
import { useLanguage } from '../../i18n';

interface KoreanWordSetupScreenProps {
  onStartGame: (config: KoreanWordGameConfig) => void;
}

const QUESTION_COUNT_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
];

export default function KoreanWordSetupScreen({ onStartGame }: KoreanWordSetupScreenProps) {
  const { t, language } = useLanguage();
  const [gameMode, setGameMode] = useState<WordGameMode>('meaningToWord');
  const [questionCount, setQuestionCount] = useState('10');

  const modeOptions = [
    { value: 'meaningToWord', label: t.meaningToWord },
    { value: 'wordToMeaning', label: t.wordToMeaning },
  ];

  const totalWords = getKoreanWordCount();

  const handleStart = () => {
    const meaningLang: 'en' | 'ja' = language === 'ja' ? 'ja' : 'en';
    onStartGame({
      gameMode,
      questionCount: parseInt(questionCount),
      language: meaningLang,
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.wordGameSettings}</h2>

      <section className={styles.section}>
        <ToggleGroup
          label={t.gameMode}
          options={modeOptions}
          value={gameMode}
          onChange={(v) => setGameMode(v as WordGameMode)}
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
        <span className={styles.charCount}>{totalWords} {t.wordsAvailable}</span>
        <Button onClick={handleStart}>{t.startGame}</Button>
      </div>
    </div>
  );
}
