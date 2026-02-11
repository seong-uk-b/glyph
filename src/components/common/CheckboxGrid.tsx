import styles from './CheckboxGrid.module.css';
import { useLanguage } from '../../i18n';

interface CheckboxItem {
  id: string;
  label: string;
  sublabel?: string;
}

interface CheckboxGridProps {
  items: CheckboxItem[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function CheckboxGrid({ items, selectedIds, onChange }: CheckboxGridProps) {
  const { t } = useLanguage();
  const allSelected = items.every(item => selectedIds.includes(item.id));

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(sid => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const toggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(items.map(item => item.id));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <button className={styles.controlBtn} onClick={toggleAll}>
          {allSelected ? t.clearAll : t.selectAll}
        </button>
        <span className={styles.count}>
          {selectedIds.length} / {items.length}
        </span>
      </div>
      <div className={styles.grid}>
        {items.map(item => (
          <button
            key={item.id}
            className={`${styles.item} ${selectedIds.includes(item.id) ? styles.selected : ''}`}
            onClick={() => toggleItem(item.id)}
          >
            <span className={styles.itemLabel}>{item.label}</span>
            {item.sublabel && (
              <span className={styles.itemSublabel}>{item.sublabel}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
