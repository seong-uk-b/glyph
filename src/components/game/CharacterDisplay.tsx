import styles from './CharacterDisplay.module.css';
import { CharacterType } from '../../data/types';
import { useLanguage } from '../../i18n';

interface CharacterDisplayProps {
  character: string;
  type: CharacterType;
  charType?: 'hiragana' | 'katakana';
}

export default function CharacterDisplay({ character, type, charType }: CharacterDisplayProps) {
  const { t } = useLanguage();

  const TYPE_LABELS: Record<string, string> = {
    hiragana: t.hiragana,
    katakana: t.katakana,
  };

  const label = charType ? TYPE_LABELS[charType] : TYPE_LABELS[type] || t.kana;

  return (
    <div className={styles.wrapper}>
      <span className={styles.typeLabel}>{label}</span>
      <span className={styles.character}>{character}</span>
    </div>
  );
}
