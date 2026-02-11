import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Language, Translations, translations } from './translations';

export type LearnLanguage = 'japanese' | 'korean';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  learnLanguage: LearnLanguage;
  setLearnLanguage: (lang: LearnLanguage) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'glyph-lang';
const LEARN_LANG_KEY = 'glyph-learn-lang';

function getInitialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ko' || stored === 'ja') return stored;
  } catch {}
  return 'ko';
}

function getInitialLearnLanguage(): LearnLanguage {
  try {
    const stored = localStorage.getItem(LEARN_LANG_KEY);
    if (stored === 'japanese' || stored === 'korean') return stored;
  } catch {}
  return 'japanese';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [learnLanguage, setLearnLanguageState] = useState<LearnLanguage>(getInitialLearnLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, []);

  const setLearnLanguage = useCallback((lang: LearnLanguage) => {
    setLearnLanguageState(lang);
    try {
      localStorage.setItem(LEARN_LANG_KEY, lang);
    } catch {}
  }, []);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, learnLanguage, setLearnLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
