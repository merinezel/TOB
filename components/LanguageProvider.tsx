"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
type Language = "tr" | "en";
const LanguageContext = createContext<{ language: Language; setLanguage: (value: Language) => void }>({ language: "tr", setLanguage: () => {} });
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, update] = useState<Language>("tr");
  useEffect(() => {
    try { if (localStorage.getItem("tob-language") === "en") update("en"); } catch {}
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const setLanguage = (value: Language) => {
    document.documentElement.lang = value;
    update(value);
    try { localStorage.setItem("tob-language", value); } catch {}
  };
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
