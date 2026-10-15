"use client";
import { useEffect, useState } from "react";
import { nav } from "@/data/site";

export default function Header() {
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
        <a href="#top" onClick={() => select("#top")} aria-label="TOB ana sayfa" className="site-logo font-poster">tob<span aria-hidden>.</span></a>
        <nav aria-label="Ana menü" className="site-desktop-nav">
          {nav.map((n) => <a key={n.href} href={n.href} onClick={() => select(n.href)} aria-current={active === n.href ? "location" : undefined}>{n.label}</a>)}
        </nav>
        <div className="site-header-actions">
          <a data-project-cta href="#iletisim" onClick={() => select("#iletisim")} className="site-project-cta">Proje konuşalım <span aria-hidden>→</span></a>
          <button type="button" className="site-menu-toggle" aria-expanded={open} aria-controls="site-mobile-menu" onClick={() => setOpen(!open)}>{open ? "Kapat" : "Menü"}</button>
        </div>
      </div>
      {open && <nav id="site-mobile-menu" aria-label="Mobil menü" className="site-mobile-menu">
        {nav.map((n) => <a key={n.href} href={n.href} onClick={() => select(n.href)} aria-current={active === n.href ? "location" : undefined}>{n.label}</a>)}
        <a href="#iletisim" onClick={() => select("#iletisim")}>Proje konuşalım →</a>
      </nav>}
    </header>
  );
}
