"use client";
import { useState } from "react";
import { nav } from "@/data/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header data-site-header className="site-header">
      <div className="site-header-row">
        <a href="#top" onClick={close} aria-label="TOB ana sayfa" className="site-logo font-poster">tob<span aria-hidden>.</span></a>
        <nav aria-label="Ana menü" className="site-desktop-nav">
          {nav.map((n) => <a key={n.href} href={n.href} onClick={close}>{n.label}</a>)}
        </nav>
        <div className="site-header-actions">
          <a data-project-cta href="#iletisim" onClick={close} className="site-project-cta">Proje konuşalım <span aria-hidden>→</span></a>
          <button type="button" className="site-menu-toggle" aria-expanded={open} aria-controls="site-mobile-menu" onClick={() => setOpen(!open)}>{open ? "Kapat" : "Menü"}</button>
        </div>
      </div>
      {open && <nav id="site-mobile-menu" aria-label="Mobil menü" className="site-mobile-menu">
        {nav.map((n) => <a key={n.href} href={n.href} onClick={close}>{n.label}</a>)}
        <a href="#iletisim" onClick={close}>Proje konuşalım →</a>
      </nav>}
    </header>
  );
}
