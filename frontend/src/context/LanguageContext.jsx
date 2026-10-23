import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: () => '',
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang === 'es' || urlLang === 'en') return urlLang;
      if (window.location.hash === '#es') return 'es';
      const stored = localStorage.getItem('llc_preferred_lang');
      if (stored === 'es' || stored === 'en') return stored;
    }
    return 'en';
  });

  const setLang = (nextLang) => {
    const safeLang = nextLang === 'es' ? 'es' : 'en';
    setLangState(safeLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('llc_preferred_lang', safeLang);
      document.documentElement.lang = safeLang;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = (section, key, fallback = '') => {
    const secObj = translations[lang]?.[section] || translations.en[section] || {};
    if (secObj[key] !== undefined) return secObj[key];
    const fallbackSec = translations.en[section] || {};
    return fallbackSec[key] !== undefined ? fallbackSec[key] : fallback;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
