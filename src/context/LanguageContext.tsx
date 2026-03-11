'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

interface LanguageData {
  defaultLang: string;
  languages: Language[];
  translations: Record<string, Record<string, string>>;
}

interface LanguageContextValue {
  currentLang: string;
  languages: Language[];
  setLanguage: (code: string) => void;
  t: (key: string, fallback?: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<LanguageData | null>(null);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    fetch('/api/content/languages')
      .then((r) => r.json())
      .then((d: LanguageData) => {
        setData(d);
        const stored = localStorage.getItem('lang');
        const lang = stored && d.languages.some((l) => l.code === stored) ? stored : d.defaultLang;
        setCurrentLang(lang);
      })
      .catch(() => {});
  }, []);

  const setLanguage = useCallback((code: string) => {
    setCurrentLang(code);
    localStorage.setItem('lang', code);
    // Set dir attribute on html element
    const lang = data?.languages.find((l) => l.code === code);
    if (lang) {
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = code;
    }
  }, [data]);

  // Apply dir on initial load
  useEffect(() => {
    if (data) {
      const lang = data.languages.find((l) => l.code === currentLang);
      if (lang) {
        document.documentElement.dir = lang.dir;
        document.documentElement.lang = currentLang;
      }
    }
  }, [data, currentLang]);

  const t = useCallback((key: string, fallback?: string): string => {
    if (!data || currentLang === (data.defaultLang || 'en')) return fallback || key;
    return data.translations?.[currentLang]?.[key] || fallback || key;
  }, [data, currentLang]);

  const currentLangObj = data?.languages.find((l) => l.code === currentLang);
  const dir = currentLangObj?.dir || 'ltr';

  return (
    <LanguageContext.Provider value={{
      currentLang,
      languages: data?.languages || [],
      setLanguage,
      t,
      dir,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
