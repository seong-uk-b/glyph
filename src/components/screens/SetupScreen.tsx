import { useState } from 'react';
import styles from './SetupScreen.module.css';
import ToggleGroup from '../common/ToggleGroup';
import CheckboxGrid from '../common/CheckboxGrid';
import Button from '../common/Button';
import { CharacterType, GameMode, GameConfig } from '../../data/types';
import { getRows } from '../../data';
import { useLanguage } from '../../i18n';

interface SetupScreenProps {
  onStartGame: (config: GameConfig) => void;
}

export default function SetupScreen({ onStartGame }: SetupScreenProps) {
  const { t, language } = useLanguage();
  const rowSuffix: Record<string, string> = { ko: '행', ja: '行', en: '-row' };
  const [characterType, setCharacterType] = useState<CharacterType>('hiragana');
  const [gameMode, setGameMode] = useState<GameMode>('multipleChoice');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(['a']);

  const characterOptions = [
    { value: 'hiragana', label: t.hiragana },
    { value: 'katakana', label: t.katakana },
    { value: 'both', label: t.both },
  ];

  const modeOptions = [
    { value: 'typing', label: t.typing },
    { value: 'multipleChoice', label: t.quiz4 },
  ];

  const rows = getRows(characterType);
  const gridItems = rows.map(row => ({
    id: row.id,
    label: row.label,
    sublabel: `${row.id}${rowSuffix[language]}`,
  }));

  const rowChars = rows
    .filter(r => selectedRowIds.includes(r.id))
    .reduce((sum, r) => sum + r.characters.length, 0);
  const totalChars = characterType === 'both' ? rowChars * 2 : rowChars;

  const handleStart = () => {
    onStartGame({ characterType, gameMode, selectedRowIds });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.gameSettings}</h2>

      <section className={styles.section}>
        <ToggleGroup
          label={t.characterType}
          options={characterOptions}
          value={characterType}
          onChange={(v) => {
            setCharacterType(v as CharacterType);
            setSelectedRowIds(['a']);
          }}
        />
      </section>

      <section className={styles.section}>
        <ToggleGroup
          label={t.gameMode}
          options={modeOptions}
          value={gameMode}
          onChange={(v) => setGameMode(v as GameMode)}
        />
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>{t.selectRows}</span>
        <CheckboxGrid
          items={gridItems}
          selectedIds={selectedRowIds}
          onChange={setSelectedRowIds}
        />
      </section>

      <div className={styles.footer}>
        <span className={styles.charCount}>
          {totalChars} {t.characters}
        </span>
        <Button
          onClick={handleStart}
          disabled={selectedRowIds.length === 0}
        >
          {t.startGame}
        </Button>
      </div>
    </div>
  );
}
