import styles from './Header.module.css';
import { useLanguage } from '../../i18n';
import { Language } from '../../i18n/translations';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  onHome?: () => void;
  showLangSwitch?: boolean;
}

const LANG_OPTIONS: { value: Language; label: string }[] = [
  { value: 'ko', label: 'KO' },
  { value: 'en', label: 'EN' },
  { value: 'ja', label: 'JA' },
];

export default function Header({ showBack, onBack, onHome, showLangSwitch = false }: HeaderProps) {
  const { language, setLanguage, learnLanguage, t } = useLanguage();

  // Disable UI language that matches learn language
  const disabledLang: Language | null = learnLanguage === 'japanese' ? 'ja' : learnLanguage === 'korean' ? 'ko' : null;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {showBack ? (
          <button className={styles.backBtn} onClick={onBack} aria-label={t.back}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <div className={styles.spacer} />
        )}
        <button className={styles.logoBtn} onClick={onHome} aria-label={t.home}>
          <img
            src={`${process.env.PUBLIC_URL}/logo.svg`}
            alt={t.appTitle}
            className={styles.logoImg}
          />
          <span className={styles.logoText}>Glyph</span>
        </button>
        {showLangSwitch ? (
          <div className={styles.langSwitch}>
            {LANG_OPTIONS.map(opt => {
              const isDisabled = opt.value === disabledLang;
              return (
                <button
                  key={opt.value}
                  className={`${styles.langBtn} ${language === opt.value ? styles.langActive : ''} ${isDisabled ? styles.langDisabled : ''}`}
                  onClick={() => !isDisabled && setLanguage(opt.value)}
                  disabled={isDisabled}
                  title={isDisabled ? t.cannotSelectSameLang : undefined}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className={styles.spacer} />
        )}
      </div>
    </header>
  );
}
