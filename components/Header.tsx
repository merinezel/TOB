"use client";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { localizeHash } from "@/data/navigation";
import { nav, site } from "@/data/site";

export default function Header() {
  const { language } = useLanguage();
  const en = language === "en";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(en ? "Let’s talk about your project" : "Projenizi konuşalım")}`;
  useEffect(() => {
    const sync = () => setActive(location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("tob:navigate", sync);
    return () => { window.removeEventListener("hashchange", sync); window.removeEventListener("tob:navigate", sync); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", outside); };
  }, [open]);
  const select = (hash: string) => { setActive(hash); setOpen(false); };
  const close = () => { setOpen(false); toggle.current?.focus(); };
  const links = nav.map((n) => ({ ...n, href: localizeHash(n.href, language) }));
  return (
    <header ref={header} data-site-header className="site-header">
      <div className="site-header-row">
        {/* Native hash navigation is coordinated with the hero scroll timeline. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/#tob" onClick={() => select("#tob")} aria-label={en ? "TOB home" : "TOB ana sayfa"} className="site-logo font-poster">tob<span aria-hidden>.</span></a>
        <nav aria-label={en ? "Main menu" : "Ana menü"} className="site-desktop-nav">
          {links.map((n) => <a key={n.href} href={n.href} onClick={() => select(n.href)} aria-current={active === n.href ? "location" : undefined}>{en ? n.labelEn : n.label}</a>)}
        </nav>
        <div className="site-header-actions">
          <LanguageSwitch />
          <a data-project-cta href={mailHref} className="site-project-cta">{en ? "Let’s talk" : "Projenizi konuşalım"} <span aria-hidden>→</span></a>
          <button ref={toggle} type="button" className="site-menu-toggle" aria-expanded={open} aria-controls="site-mobile-menu" onClick={() => setOpen(!open)}>{en ? "Menu" : "Menü"}</button>
        </div>
      </div>
      {open && <nav id="site-mobile-menu" aria-label={en ? "Mobile menu" : "Mobil menü"} className="site-mobile-menu">
        <button type="button" className="site-mobile-menu-close" data-menu-close aria-label={en ? "Close menu" : "Menüyü kapat"} onClick={close}><svg aria-hidden viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m4 4 12 12M16 4 4 16" /></svg></button>
        {links.map((n) => <a key={n.href} href={n.href} onClick={() => select(n.href)} aria-current={active === n.href ? "location" : undefined}>{en ? n.labelEn : n.label}</a>)}
        <a data-mobile-project-cta href={mailHref} onClick={() => setOpen(false)}>{en ? "Let’s talk" : "Projenizi konuşalım"} →</a>
      </nav>}
    </header>
  );
}
function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  return <div className="site-language" role="group" aria-label={language === "en" ? "Language" : "Dil"}>
    <button type="button" lang="tr" aria-label="Türkçe" aria-pressed={language === "tr"} onClick={() => setLanguage("tr")}>TR</button>
    <span aria-hidden>/</span>
    <button type="button" lang="en" aria-label="English" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
  </div>;
}
