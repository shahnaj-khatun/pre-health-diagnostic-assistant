/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    history: "Health History",
    schedule: "Treatment Schedule",
    medicalProfile: "Medical Profile",
    bookAppt: "Book Appointment",
    logout: "Logout",
    login: "Login",
    register: "Register"
  },
  hi: {
    home: "मुख्य पृष्ठ",
    dashboard: "डैशबोर्ड",
    history: "स्वास्थ्य इतिहास",
    schedule: "उपचार अनुसूची",
    medicalProfile: "मेडिकल प्रोफाइल",
    bookAppt: "अपॉइंटमेंट बुक करें",
    logout: "लॉगआउट",
    login: "लॉगिन",
    register: "रजिस्टर"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
