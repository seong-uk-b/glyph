import { useState } from 'react';
import styles from './WordSetupScreen.module.css';
import ToggleGroup from '../common/ToggleGroup';
import Button from '../common/Button';
import { WordLevel, WordGameMode, WordGameConfig, MeaningLanguage, WordLanguage } from '../../data/types';
import {
  getWordCount,
  japaneseLevels, japaneseComingSoonLevels,
  koreanLevels, koreanComingSoonLevels,
} from '../../data/words';
import { useLanguage } from '../../i18n';

interface WordSetupScreenProps {
  lang: WordLanguage;
  onStartGame: (config: WordGameConfig) => void;
}

const QUESTION_COUNT_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
  { value: '50', label: '50' },
];

export default function WordSetupScreen({ lang, onStartGame }: WordSetupScreenProps) {
  const { t, language } = useLanguage();

  const availableLevels = lang === 'ja' ? japaneseLevels : koreanLevels;
  const comingSoonLevels = lang === 'ja' ? japaneseComingSoonLevels : koreanComingSoonLevels;
  const levelLabel = lang === 'ja' ? t.jlptLevel : t.topikLevel;

  const [selectedLevels, setSelectedLevels] = useState<WordLevel[]>([availableLevels[0]]);
  const [gameMode, setGameMode] = useState<WordGameMode>('wordToMeaning');
  const [questionCount, setQuestionCount] = useState<string>('20');

  const modeOptions = [
    { value: 'wordToMeaning', label: t.wordToMeaning },
    { value: 'meaningToWord', label: t.meaningToWord },
  ];

  const totalWords = selectedLevels.reduce((sum, level) => sum + getWordCount(level), 0);

  const toggleLevel = (level: WordLevel) => {
    if (selectedLevels.includes(level)) {
      if (selectedLevels.length > 1) {
        setSelectedLevels(selectedLevels.filter(l => l !== level));
      }
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  // 레벨 표시 라벨 (JLPT_N5 → N5, TOPIK_1 → 1급)
  const getLevelDisplayName = (level: WordLevel): string => {
    if (level.startsWith('JLPT_')) return level.replace('JLPT_', '');
    return level.replace('TOPIK_', '') + '급';
  };

  const handleStart = () => {
    // 일본어 → 일본어 뜻 불가, 한국어 → 한국어 뜻 불가
    let meaningLang: MeaningLanguage;
    if (lang === 'ja') {
      meaningLang = language === 'ko' ? 'ko' : 'en';
    } else {
      meaningLang = language === 'ja' ? 'ja' : 'en';
    }
    onStartGame({
      lang,
      levels: selectedLevels,
      gameMode,
      questionCount: parseInt(questionCount),
      meaningLanguage: meaningLang,
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.wordGameSettings}</h2>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>{levelLabel}</span>
        <div className={styles.levelGrid}>
          {availableLevels.map(level => (
            <button
              key={level}
              className={`${styles.levelButton} ${selectedLevels.includes(level) ? styles.selected : ''}`}
              onClick={() => toggleLevel(level)}
            >
              <span className={styles.levelName}>{getLevelDisplayName(level)}</span>
              <span className={styles.wordCount}>{getWordCount(level)} {t.wordsUnit}</span>
            </button>
          ))}
          {comingSoonLevels.map(level => (
            <button
              key={level}
              className={`${styles.levelButton} ${styles.disabled}`}
              disabled
            >
              <span className={styles.levelName}>{getLevelDisplayName(level)}</span>
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
