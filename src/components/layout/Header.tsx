import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { useLanguage } from '../../i18n';
import { Language } from '../../i18n/translations';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  onHome?: () => void;
  showLangSwitch?: boolean;
  onReleaseNotes?: () => void;
}

const LANG_OPTIONS: { value: Language; label: string }[] = [
  { value: 'ko', label: 'KO' },
  { value: 'en', label: 'EN' },
  { value: 'ja', label: 'JA' },
];

export default function Header({ showBack, onBack, onHome, showLangSwitch = false, onReleaseNotes }: HeaderProps) {
  const { language, setLanguage, learnLanguage, t } = useLanguage();
  const [showLangHint, setShowLangHint] = useState(false);

  useEffect(() => {
    if (showLangSwitch && !localStorage.getItem('hasUsedLangSwitch')) {
      setShowLangHint(true);
    }
  }, [showLangSwitch]);

  const handleLangClick = (lang: Language) => {
    setLanguage(lang);
    if (showLangHint) {
      localStorage.setItem('hasUsedLangSwitch', '1');
      setShowLangHint(false);
    }
  };

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
        ) : onReleaseNotes ? (
          <button className={styles.releaseNotesBtn} onClick={onReleaseNotes} aria-label={t.releaseNotes}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="5" y1="11" x2="9" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
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
                  onClick={() => !isDisabled && handleLangClick(opt.value)}
                  disabled={isDisabled}
                  title={isDisabled ? t.cannotSelectSameLang : undefined}
                >
                  {opt.label}
                </button>
              );
            })}
            {showLangHint && <span className={styles.langHintDot} />}
          </div>
        ) : (
          <div className={styles.spacer} />
        )}
      </div>
    </header>
  );
}
