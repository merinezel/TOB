"use client";
import { useLanguage } from "@/components/LanguageProvider";
import type { ReactNode } from "react";
import { preload } from "react-dom";
import Header from "@/components/Header";
import { HeroCopy } from "./HeroCopy";
import ReferenceMotion from "./ReferenceMotion";
import BrandName from "./BrandName";

// Letter surfaces sample the approved render; the transparent object assets move independently.
const SOURCE = "/hero/approved-hero.png";
const pieces = [
  { id: "cloud", src: "cloud-white", box: [48, 134, 218, 137], group: "back" },
  { id: "cup", src: "cup-cream", box: [315, 103, 193, 161], group: "mid" },
  { id: "spiral", src: "spiral-pink", box: [903, 65, 267, 215], group: "mid" },
  { id: "flower", src: "flower-reference-v2", box: [1195, 207, 345, 330], group: "mid" },
  { id: "gold-left", src: "sphere-gold", box: [273, 611, 48, 48], group: "back" },
  { id: "gold-right", src: "sphere-gold", box: [1334, 614, 45, 45], group: "back" },
  { id: "gift", src: "", box: [705, 418, 132, 118], group: "mid" },
];

const letters = {
  t: "288,283 574,281 587,295 587,373 575,385 493,385 493,647 482,659 397,659 386,648 386,385 299,385 288,374",
};

export default function ReferenceHero({ children }: { children: ReactNode }) {
  const en = useLanguage().language === "en";
  [SOURCE, "/hero/letter-b-glossy-v2.png", "/hero/gift-clean-v2.png", "/hero/flower-reference-v2.png"].forEach((src) => preload(src, { as: "image", fetchPriority: "high" }));
  return <div id="tob" data-reference-intro className="tob-intro">
    <div data-reference-header className="reference-header"><Header /></div>
    <div className="tob-sticky">
      <section data-reference-hero className="reference-hero" aria-label="We Are TOB">
        <h1 className="sr-only">{en ? "We Are TOB. Big brand ideas for small businesses." : "We Are TOB. Küçük işletmeler için büyük marka fikirleri."}</h1>
        <div data-reference-backdrop className="reference-backdrop" aria-hidden />
        <div data-reference-mobile-ring className="reference-mobile-ring" aria-hidden />
        <svg data-reference-art className="reference-art" viewBox="0 0 1586 992" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <defs>
            {/* Sample the original material without recolouring its highlights. */}
            <filter id="ref-object-shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="3" dy="7" stdDeviation="4" floodColor="#68452e" floodOpacity="0.12" /></filter>
            <filter id="ref-floor" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="9" /></filter>
            <filter id="ref-ink" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -4 0 0 0 3" />
            </filter>
            <mask id="ref-b-alpha" maskUnits="userSpaceOnUse" x="120" y="170" width="950" height="1045">
              <rect x="120" y="170" width="950" height="1045" fill="white" />
              <path d="M416 451H679C758 451 758 554 679 554H416Z M416 816H711C797 816 797 946 711 946H416Z" fill="black" />
            </mask>

            <mask id="ref-ring-mask" maskUnits="userSpaceOnUse" x="565" y="270" width="404" height="402">
              <circle cx="766" cy="470" r="197" fill="white" />
              <circle data-reference-counter cx="769" cy="475" r="96" fill="black" />
            </mask>
            {Object.entries(letters).map(([id, points]) => <clipPath key={id} id={`ref-${id}`}><polygon points={points} /></clipPath>)}
            <clipPath id="ref-o"><rect x="565" y="270" width="404" height="402" /></clipPath>
            <clipPath id="ref-copy"><rect x="540" y="700" width="520" height="118" /></clipPath>
            <clipPath id="ref-services"><rect x="540" y="825" width="520" height="48" /></clipPath>
            <clipPath id="ref-nav"><rect width="1586" height="65" /></clipPath>
            <clipPath id="ref-cue"><rect x="750" y="898" width="85" height="85" /></clipPath>

          </defs>
          <g data-reference-letter="t"><ellipse data-reference-shadow cx="433" cy="662" rx="140" ry="13" fill="#6b3422" opacity="0.22" filter="url(#ref-floor)" /><g clipPath="url(#ref-t)"><image href={SOURCE} width="1586" height="992"  /></g></g>
          <g data-reference-letter="b">
            <ellipse data-reference-shadow cx="1118" cy="663" rx="165" ry="15" fill="#6b3422" opacity="0.22" filter="url(#ref-floor)" />
            <svg x="960" y="282" width="326" height="382" viewBox="120 170 950 1045" preserveAspectRatio="none" overflow="hidden">
              <image href="/hero/letter-b-glossy-v2.png" width="1144" height="1375" mask="url(#ref-b-alpha)" />
            </svg>
          </g>
          <g data-reference-letter="o"><ellipse data-reference-shadow cx="771" cy="665" rx="162" ry="15" fill="#6b3422" opacity="0.22" filter="url(#ref-floor)" /><g clipPath="url(#ref-o)" mask="url(#ref-ring-mask)"><image href={SOURCE} width="1586" height="992"  /></g></g>
          {pieces.map(({ id, src, group, box }) => <g key={id}>
            <g data-reference-piece={id} data-depth={group} data-bounds={box.join(",")} filter="url(#ref-object-shadow)">
              {id === "gift" ? <svg x={box[0]} y={box[1]} width={box[2]} height={box[3]} viewBox="170 225 965 895" preserveAspectRatio="none" overflow="hidden">
                <image href="/hero/gift-clean-v2.png" width="1254" height="1254" />
              </svg> : src ? <image href={src === "flower-reference-v2" ? "/hero/flower-reference-v2.png" : `/hero/${src}@2x.webp`} x={box[0]} y={box[1]} width={box[2]} height={box[3]} preserveAspectRatio="none" /> :
                <image href={SOURCE} width="1586" height="992" clipPath={`url(#ref-${id})`} />}
            </g>
          </g>)}
          <g data-reference-copy className="reference-desktop"><image href={SOURCE} width="1586" height="992" filter="url(#ref-ink)" clipPath="url(#ref-copy)" /></g>
          <g data-reference-services className="reference-desktop"><image href={SOURCE} width="1586" height="992" filter="url(#ref-ink)" clipPath="url(#ref-services)" /></g>


        </svg>
        <span data-reference-title className="tob-brand-text reference-title" aria-hidden><BrandName /></span>
        <div data-reference-cue className="reference-scroll-cue" aria-hidden>
          <span>Scroll</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 3v17m-5-5 5 5 5-5" /></svg>
        </div>
        <div data-reference-mobile-copy className="reference-mobile-copy"><HeroCopy /></div>
      </section>
      <div data-reference-after className="tob-after">
        {children}
      </div>
    </div>
    <div data-reference-spacer aria-hidden className="tob-spacer" />
    <ReferenceMotion />
  </div>;
}
