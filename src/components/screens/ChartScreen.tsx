import { useState, useCallback, useRef } from 'react';
import styles from './ChartScreen.module.css';
import ToggleGroup from '../common/ToggleGroup';
import { HIRAGANA, KATAKANA, KanaRow } from '../../data';
import { useLanguage } from '../../i18n';
import { speak } from '../../utils/speech';

type ChartTab = 'hiragana' | 'katakana';

const VOWELS = ['a', 'i', 'u', 'e', 'o'];

const BASIC_ROW_IDS = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa'];
const DAKUTEN_ROW_IDS = ['ga', 'za', 'da', 'ba', 'pa'];

function getVowel(romaji: string): string {
  if (romaji === 'n') return 'a';
  return romaji[romaji.length - 1];
}

function ChartTable({ rows, rowIds, speakingChar, onCellClick }: {
  rows: KanaRow[];
  rowIds: string[];
  speakingChar: string | null;
  onCellClick: (character: string) => void;
}) {
  const filtered = rows.filter(r => rowIds.includes(r.id));

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}></th>
            {VOWELS.map(v => (
              <th key={v} className={styles.th}>{v}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map(row => {
            const charMap: Record<string, typeof row.characters[0]> = {};
            row.characters.forEach(c => {
              if (c.romaji === 'n') {
                charMap['a'] = c;
              } else {
                charMap[getVowel(c.romaji)] = c;
              }
            });

            return (
              <tr key={row.id}>
                <td className={styles.rowLabel}>{row.label}</td>
                {VOWELS.map(v => {
                  const char = charMap[v];
                  const isSpeaking = char?.character === speakingChar;
                  return (
                    <td
                      key={v}
                      className={`${char ? styles.cell : styles.cellEmpty}${isSpeaking ? ` ${styles.cellSpeaking}` : ''}`}
                      onClick={char ? () => onCellClick(char.character) : undefined}
                    >
                      {char ? (
                        <>
                          <span className={styles.charMain}>{char.character}</span>
                          <span className={styles.charRomaji}>{char.romaji}</span>
                        </>
                      ) : (
                        <span className={styles.empty}></span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ChartScreen() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<ChartTab>('hiragana');
  const [speakingChar, setSpeakingChar] = useState<string | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const handleCellClick = useCallback((character: string) => {
    setSpeakingChar(character);
    speak(character, 'ja');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => setSpeakingChar(null), 600);
  }, []);

  const tabOptions = [
    { value: 'hiragana', label: t.hiragana },
    { value: 'katakana', label: t.katakana },
  ];

  const data = tab === 'hiragana' ? HIRAGANA : KATAKANA;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.kanaChart}</h2>

      <div className={styles.toggle}>
        <ToggleGroup
          options={tabOptions}
          value={tab}
          onChange={v => setTab(v as ChartTab)}
        />
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.basicGojuon}</h3>
        <ChartTable rows={data.rows} rowIds={BASIC_ROW_IDS} speakingChar={speakingChar} onCellClick={handleCellClick} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.dakutenHandakuten}</h3>
        <ChartTable rows={data.rows} rowIds={DAKUTEN_ROW_IDS} speakingChar={speakingChar} onCellClick={handleCellClick} />
      </section>
    </div>
  );
}
