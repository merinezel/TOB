"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { languageFromHash, syncLanguageHash, type Language } from "@/data/navigation";
const LanguageContext = createContext<{ language: Language; setLanguage: (value: Language) => void }>({ language: "tr", setLanguage: () => {} });
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, update] = useState<Language>("tr");
  useEffect(() => {
    let saved: Language = "tr";
    try { if (localStorage.getItem("tob-language") === "en") saved = "en"; } catch {}
    const next = languageFromHash(location.hash) ?? saved;
    document.documentElement.lang = next;
    update(next);
    syncLanguageHash(next);
  }, []);
  const setLanguage = (value: Language) => {
    document.documentElement.lang = value;
    update(value);
    syncLanguageHash(value);
    try { localStorage.setItem("tob-language", value); } catch {}
  };
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
