'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Try to load from localStorage, default to English
  const [language, setLanguage] = useState('English');
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('amannat_lang');
    if (saved) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    setIsRtl(language === 'Arabic');
    localStorage.setItem('amannat_lang', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRtl }}>
      <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full h-full">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
