"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { nav } from "@/data/site";

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const en = language === "en";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const sync = () => setActive(location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const select = (hash: string) => { setActive(hash); setOpen(false); };
  return (
    <header data-site-header className="site-header">
      <div className="site-header-row">
        {/* Native hash navigation is coordinated with the hero scroll timeline. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/#tob" onClick={() => select("#tob")} aria-label={en ? "TOB home" : "TOB ana sayfa"} className="site-logo font-poster">tob<span aria-hidden>.</span></a>
        <nav aria-label={en ? "Main menu" : "Ana menü"} className="site-desktop-nav">
          {nav.map((n) => <a key={n.href} href={n.href} onClick={() => select(n.href)} aria-current={active === n.href ? "location" : undefined}>{en ? n.labelEn : n.label}</a>)}
        </nav>
        <div className="site-header-actions">
          <div className="site-language" role="group" aria-label={en ? "Language" : "Dil"}>
            <button type="button" lang="tr" aria-label="Türkçe" aria-pressed={!en} onClick={() => setLanguage("tr")}>TR</button>
            <span aria-hidden>/</span>
            <button type="button" lang="en" aria-label="English" aria-pressed={en} onClick={() => setLanguage("en")}>EN</button>
          </div>
          <a data-project-cta href="#iletisim" onClick={() => select("#iletisim")} className="site-project-cta">{en ? "Let’s talk" : "Proje konuşalım"} <span aria-hidden>→</span></a>
          <button type="button" className="site-menu-toggle" aria-expanded={open} aria-controls="site-mobile-menu" onClick={() => setOpen(!open)}>{open ? (en ? "Close" : "Kapat") : (en ? "Menu" : "Menü")}</button>
        </div>
      </div>
      {open && <nav id="site-mobile-menu" aria-label={en ? "Mobile menu" : "Mobil menü"} className="site-mobile-menu">
        {nav.map((n) => <a key={n.href} href={n.href} onClick={() => select(n.href)} aria-current={active === n.href ? "location" : undefined}>{en ? n.labelEn : n.label}</a>)}
        <a href="#iletisim" onClick={() => select("#iletisim")}>{en ? "Let’s talk" : "Proje konuşalım"} →</a>
      </nav>}
    </header>
  );
}
