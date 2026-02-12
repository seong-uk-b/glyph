import { useState, useEffect } from 'react';
import styles from './ReleaseNotesScreen.module.css';
import { useLanguage } from '../../i18n';
import { Language, translations } from '../../i18n/translations';
import { releaseNotes } from '../../data/releaseNotes';

const LANG_OPTIONS: { value: Language; label: string }[] = [
  { value: 'ko', label: 'KO' },
  { value: 'en', label: 'EN' },
  { value: 'ja', label: 'JA' },
];

export default function ReleaseNotesScreen() {
  const { language } = useLanguage();
  const [noteLang, setNoteLang] = useState<Language>(language);
  const t = translations[noteLang];

  useEffect(() => {
    setNoteLang(language);
  }, [language]);

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>{t.releaseNotesTitle}</h2>
        <div className={styles.langSwitch}>
          {LANG_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`${styles.langBtn} ${noteLang === opt.value ? styles.langActive : ''}`}
              onClick={() => setNoteLang(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.timeline}>
        {releaseNotes.map((note) => (
          <div key={note.version} className={styles.entry}>
            <div className={styles.entryHeader}>
              <span className={styles.version}>{note.version}</span>
              <span className={styles.date}>{note.date}</span>
            </div>
            <ul className={styles.changeList}>
              {note.changes[noteLang].map((change, i) => (
                <li key={i} className={styles.changeItem}>{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
