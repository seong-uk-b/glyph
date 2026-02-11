import { useState } from 'react';
import styles from './WordSetupScreen.module.css';
import ToggleGroup from '../common/ToggleGroup';
import Button from '../common/Button';
import { JLPTLevel, WordGameMode, WordGameConfig, MeaningLanguage } from '../../data/types';
import { getWordCount, availableLevels, comingSoonLevels } from '../../data/words';
import { useLanguage } from '../../i18n';

interface WordSetupScreenProps {
  onStartGame: (config: WordGameConfig) => void;
}

const QUESTION_COUNT_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
  { value: '50', label: '50' },
];

export default function WordSetupScreen({ onStartGame }: WordSetupScreenProps) {
  const { t, language } = useLanguage();
  const [selectedLevels, setSelectedLevels] = useState<JLPTLevel[]>(['N5']);
  const [gameMode, setGameMode] = useState<WordGameMode>('meaningToWord');
  const [questionCount, setQuestionCount] = useState<string>('20');

  const modeOptions = [
    { value: 'meaningToWord', label: t.meaningToWord },
    { value: 'wordToMeaning', label: t.wordToMeaning },
  ];

  const totalWords = selectedLevels.reduce((sum, level) => sum + getWordCount(level), 0);

  const toggleLevel = (level: JLPTLevel) => {
    if (selectedLevels.includes(level)) {
      if (selectedLevels.length > 1) {
        setSelectedLevels(selectedLevels.filter(l => l !== level));
      }
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  const handleStart = () => {
    // Map UI language to meaning language (Japanese words can't have Japanese meanings)
    const meaningLang: MeaningLanguage = language === 'ko' ? 'ko' : 'en';
    onStartGame({
      levels: selectedLevels,
      gameMode,
      questionCount: parseInt(questionCount),
      language: meaningLang,
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.wordGameSettings}</h2>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>{t.jlptLevel}</span>
        <div className={styles.levelGrid}>
          {availableLevels.map(level => (
            <button
              key={level}
              className={`${styles.levelButton} ${selectedLevels.includes(level) ? styles.selected : ''}`}
              onClick={() => toggleLevel(level)}
            >
              <span className={styles.levelName}>{level}</span>
              <span className={styles.wordCount}>{getWordCount(level)} {t.wordsUnit}</span>
            </button>
          ))}
          {comingSoonLevels.map(level => (
            <button
              key={level}
              className={`${styles.levelButton} ${styles.disabled}`}
              disabled
            >
              <span className={styles.levelName}>{level}</span>
              <span className={styles.comingSoon}>{t.comingSoon}</span>
            </button>
          ))}
        </div>
      </section>

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
        <span className={styles.charCount}>
          {totalWords} {t.wordsAvailable}
        </span>
        <Button
          onClick={handleStart}
          disabled={selectedLevels.length === 0}
        >
          {t.startGame}
        </Button>
      </div>
    </div>
  );
}
