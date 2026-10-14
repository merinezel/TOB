"use client";
import { useState } from "react";
import { nav } from "@/data/site";

// Desktop positions are the reference's 1536px-wide coordinates expressed in vw.
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fade-in relative z-30 h-20 xl:h-[5.6vw]">
      <a href="#top" className="absolute left-5 top-4 block leading-none xl:left-[3.9vw] xl:top-[1.3vw]">
        <span className="block font-poster text-[36px] tracking-[-0.07em] xl:text-[2.75vw]">
          tob
          <span aria-hidden className="ml-[0.03em] inline-block aspect-square w-[0.19em] rounded-full bg-current align-baseline" />
        </span>
        <span className="mt-1 block text-[13px] font-normal tracking-[-0.005em] text-ink/80 xl:mt-[0.1vw] xl:text-[clamp(12px,0.9vw,14px)]">the other brands</span>
      </a>

      <nav className="absolute left-[34.8vw] top-[2.55vw] hidden items-center gap-[3.65vw] xl:flex">
        {nav.map((n) => (
          <a key={n.label} href={n.href} className="relative text-[clamp(12px,0.78vw,14px)] font-semibold uppercase tracking-[0.04em] text-ink transition after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-ink after:transition-transform after:duration-500 hover:text-ink hover:after:origin-left hover:after:scale-x-100">
            {n.label}
          </a>
        ))}
      </nav>

      <a
        href="mailto:projectstheother@gmail.com"
        className="absolute left-[79vw] top-[1.76vw] hidden h-[2.54vw] w-[12vw] items-center justify-center gap-[0.6vw] rounded-full border border-ink text-[clamp(12px,0.78vw,14px)] font-semibold uppercase tracking-[0.02em] transition hover:border-ink hover:bg-ink hover:text-cream xl:flex"
      >
        Proje konuşalım <span aria-hidden>→</span>
      </a>
      <span aria-hidden className="absolute left-[94.7vw] top-[2.3vw] hidden w-[2.1vw] xl:block">
        <span className="block h-[2px] bg-ink" />
        <span className="mt-[0.5vw] block h-[2px] bg-ink" />
      </span>

      <button
        className="absolute right-5 top-6 text-xs font-semibold uppercase tracking-[0.12em] xl:hidden"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {open ? "Kapat" : "Menü"}
      </button>
      {open && (
        <nav className="absolute inset-x-5 top-16 flex flex-col gap-5 bg-ivory p-6 shadow-lg xl:hidden">
          {nav.map((n) => (
            <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-[0.1em]">
              {n.label}
            </a>
          ))}
          <a href="mailto:projectstheother@gmail.com" onClick={() => setOpen(false)} className="rounded-full border border-ink px-6 py-3 text-center text-xs font-semibold uppercase">
            Proje konuşalım →
          </a>
        </nav>
      )}
    </header>
  );
}
