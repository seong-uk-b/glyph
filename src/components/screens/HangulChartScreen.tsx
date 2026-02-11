import { useState, useCallback, useRef } from 'react';
import styles from './HangulChartScreen.module.css';
import { useLanguage } from '../../i18n';
import { speak } from '../../utils/speech';
import {
  HangulCharacter,
  BASIC_CONSONANTS,
  DOUBLE_CONSONANTS,
  BASIC_VOWELS,
  COMPOUND_VOWELS,
} from '../../data/hangul';

function HangulGrid({ characters, speakingChar, onCellClick }: {
  characters: HangulCharacter[];
  speakingChar: string | null;
  onCellClick: (char: HangulCharacter) => void;
}) {
  return (
    <div className={styles.grid}>
      {characters.map(char => {
        const isSpeaking = char.character === speakingChar;
        return (
          <div
            key={char.character}
            className={`${styles.cell} ${isSpeaking ? styles.cellSpeaking : ''}`}
            onClick={() => onCellClick(char)}
          >
            <span className={styles.charMain}>{char.character}</span>
            <span className={styles.charRomaji}>{char.romanization}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function HangulChartScreen() {
  const { t } = useLanguage();
  const [speakingChar, setSpeakingChar] = useState<string | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const handleCellClick = useCallback((char: HangulCharacter) => {
    setSpeakingChar(char.character);
    speak(char.name, 'ko');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => setSpeakingChar(null), 600);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.hangulChart}</h2>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.basicConsonants}</h3>
        <HangulGrid characters={BASIC_CONSONANTS} speakingChar={speakingChar} onCellClick={handleCellClick} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.doubleConsonants}</h3>
        <HangulGrid characters={DOUBLE_CONSONANTS} speakingChar={speakingChar} onCellClick={handleCellClick} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.basicVowels}</h3>
        <HangulGrid characters={BASIC_VOWELS} speakingChar={speakingChar} onCellClick={handleCellClick} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.compoundVowels}</h3>
        <HangulGrid characters={COMPOUND_VOWELS} speakingChar={speakingChar} onCellClick={handleCellClick} />
      </section>
    </div>
  );
}
