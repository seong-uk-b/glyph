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

function detectDeviceRegion(): 'ko' | 'ja' | 'other' {
  try {
    const langs = navigator.languages ?? [navigator.language];
    for (const lang of langs) {
      const code = lang.slice(0, 2).toLowerCase();
      if (code === 'ko') return 'ko';
      if (code === 'ja') return 'ja';
    }
  } catch {}
  return 'other';
}

// 한국 기기: 일본어 학습, ko UI
// 일본 기기: 한국어 학습, ja UI
// 그 외:     일본어 학습, en UI
const DEVICE_DEFAULTS: Record<'ko' | 'ja' | 'other', { lang: Language; learn: LearnLanguage }> = {
  ko:    { lang: 'ko', learn: 'japanese' },
  ja:    { lang: 'ja', learn: 'korean' },
  other: { lang: 'en', learn: 'japanese' },
};

function getInitialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ko' || stored === 'ja') return stored;
  } catch {}
  return DEVICE_DEFAULTS[detectDeviceRegion()].lang;
}

function getInitialLearnLanguage(): LearnLanguage {
  try {
    const stored = localStorage.getItem(LEARN_LANG_KEY);
    if (stored === 'japanese' || stored === 'korean') return stored;
  } catch {}
  return DEVICE_DEFAULTS[detectDeviceRegion()].learn;
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
