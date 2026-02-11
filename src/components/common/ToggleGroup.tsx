import styles from './ToggleGroup.module.css';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function ToggleGroup({ options, value, onChange, label }: ToggleGroupProps) {
  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.group}>
        {options.map(option => (
          <button
            key={option.value}
            className={`${styles.option} ${value === option.value ? styles.active : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
