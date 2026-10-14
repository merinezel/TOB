import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { preload } from "react-dom";
import Header from "@/components/Header";
import { heroObjects } from "@/data/hero";
import FloatingObject from "./FloatingObject";
import { HeroCopy, ScrollIndicator } from "./HeroCopy";
import HeroMotion from "./HeroMotion";
import { TobLetter, TobPortal } from "./TobWordmark";

// Intro hero laid over the rest of the site. With motion on, the hero and the site share one sticky
// layer for --tob-d of scroll while the camera zooms through the O, then everything scrolls normally.
// With reduced motion (or no JS) the hero is just a static first screen above the site.
export default function TobHero({ children }: { children: ReactNode }) {
  // checked at build time (the page is static): missing files show a labelled stand-in in dev, nothing in production
  const has = new Set(heroObjects.map((o) => o.src).filter((src) => fs.existsSync(path.join(process.cwd(), "public", src))));
  const dev = process.env.NODE_ENV !== "production";
  const objects = heroObjects.filter((o) => dev || has.has(o.src));
  has.forEach((src) => preload(src, { as: "image", fetchPriority: "high" }));

  return (
    <div data-tob-intro className="tob-intro">
      <div className="tob-sticky">
        <section data-hero className="tob-hero" aria-label="We Are TOB">
          <div data-hero-header className="tob-header">
            <Header />
          </div>

          <div data-portal-zoom className="tob-mark-box tob-portal">
            <TobPortal />
          </div>
          <div data-mark-par className="tob-mark-par">
            <h1 data-mark-enter className="tob-enter absolute inset-0">
              <span className="sr-only">We Are TOB. Küçük işletmeler için büyük marka fikirleri.</span>
              {(["t", "o", "b"] as const).map((l) => (
                <span key={l} data-letter={l} className="tob-mark-box block">
                  <TobLetter letter={l} />
                </span>
              ))}
              {/* the TOB parcel resting in the O's counter; drawn in the wordmark's own box so it stays
                  in the O at every screen size */}
              <span data-gift aria-hidden className="tob-mark-box block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero/gift.webp" srcSet="/hero/gift.webp 1x, /hero/gift@2x.webp 2x" alt="" width={800} height={670} decoding="async" draggable={false} className="tob-gift" />
              </span>
            </h1>
          </div>

          {objects.map((o) => (
            <FloatingObject key={o.id} o={o} available={has.has(o.src)} />
          ))}

          <HeroCopy />
          <ScrollIndicator />
        </section>

        <div data-after className="tob-after">
          {/* The title card overlays the site; it dissolves in place before sticky releases. */}
          <div data-brand-line aria-hidden className="tob-brand-line">
            <span data-brand-text className="tob-brand-text">
              the other
              <br />
              brands
            </span>
          </div>
          {children}
        </div>
      </div>
      <div data-tob-spacer aria-hidden className="tob-spacer" />
      <HeroMotion />
    </div>
  );
}
