import { useState } from 'react';
import styles from './SetupScreen.module.css';
import CheckboxGrid from '../common/CheckboxGrid';
import Button from '../common/Button';
import { HangulCategory, HangulGameConfig } from '../../data/types';
import { BASIC_CONSONANTS, DOUBLE_CONSONANTS, BASIC_VOWELS, COMPOUND_VOWELS } from '../../data/hangul';
import { useLanguage } from '../../i18n';

interface HangulSetupScreenProps {
  onStartGame: (config: HangulGameConfig) => void;
}

const CATEGORIES: { id: HangulCategory; count: number }[] = [
  { id: 'basicConsonants', count: BASIC_CONSONANTS.length },
  { id: 'doubleConsonants', count: DOUBLE_CONSONANTS.length },
  { id: 'basicVowels', count: BASIC_VOWELS.length },
  { id: 'compoundVowels', count: COMPOUND_VOWELS.length },
];

export default function HangulSetupScreen({ onStartGame }: HangulSetupScreenProps) {
  const { t } = useLanguage();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['basicConsonants']);

  const categoryLabels: Record<string, string> = {
    basicConsonants: t.basicConsonants,
    doubleConsonants: t.doubleConsonants,
    basicVowels: t.basicVowels,
    compoundVowels: t.compoundVowels,
  };

  const gridItems = CATEGORIES.map(cat => ({
    id: cat.id,
    label: categoryLabels[cat.id],
    sublabel: `${cat.count}`,
  }));

  const totalChars = CATEGORIES
    .filter(c => selectedCategories.includes(c.id))
    .reduce((sum, c) => sum + c.count, 0);

  const handleStart = () => {
    onStartGame({ categories: selectedCategories as HangulCategory[] });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.gameSettings}</h2>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>{t.selectRows}</span>
        <CheckboxGrid
          items={gridItems}
          selectedIds={selectedCategories}
          onChange={setSelectedCategories}
        />
      </section>

      <div className={styles.footer}>
        <span className={styles.charCount}>{totalChars} {t.characters}</span>
        <Button onClick={handleStart} disabled={selectedCategories.length === 0}>
          {t.startGame}
        </Button>
      </div>
    </div>
  );
}
