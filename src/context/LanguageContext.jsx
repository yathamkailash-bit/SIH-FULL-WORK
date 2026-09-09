import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, TRANSLATIONS } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('kalakriti_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('kalakriti_lang', language);
  }, [language]);

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  const getLanguageDetails = () => {
    return LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, LANGUAGES, getLanguageDetails }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
