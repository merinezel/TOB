import type { ReactNode } from "react";
import { preload } from "react-dom";
import Header from "@/components/Header";
import { HeroCopy } from "./HeroCopy";
import ReferenceMotion from "./ReferenceMotion";

// Letter surfaces sample the approved render; the transparent object assets move independently.
const SOURCE = "/hero/approved-hero.png";
const pieces = [
  { id: "cloud", src: "cloud-white", box: [48, 134, 218, 137], group: "back" },
  { id: "cup", src: "cup-cream", box: [315, 103, 193, 177], group: "mid" },
  { id: "spiral", src: "spiral-pink", box: [903, 65, 267, 235], group: "mid" },
  { id: "flower", src: "flower-pink", box: [1210, 220, 315, 300], group: "mid" },
  { id: "gold-left", src: "sphere-gold", box: [273, 506, 48, 48], group: "back" },
  { id: "gold-right", src: "sphere-gold", box: [1334, 575, 45, 45], group: "back" },
  { id: "blue", src: "", box: [1220, 710, 400, 297], group: "front" },
  { id: "gift", src: "", box: [705, 422, 132, 130], group: "mid" },
];
const bShape = "M966 283H1134C1216 283 1250 317 1250 366C1250 399 1230 421 1200 436C1254 449 1280 478 1280 536C1280 614 1230 658 1144 658H966Q960 658 960 651V290Q960 283 966 283Z M1050 367H1134C1189 367 1189 415 1134 415H1050Z M1050 515H1146C1200 515 1200 573 1146 573H1050Z";

const letters = {
  t: "288,283 574,281 587,295 587,373 575,385 493,385 493,647 482,659 397,659 386,648 386,385 299,385 288,374",
  b: "960,280 1195,280 1195,535 1286,535 1286,666 960,666",
};

export default function ReferenceHero({ children }: { children: ReactNode }) {
  preload(SOURCE, { as: "image", fetchPriority: "high" });
  return <div data-reference-intro className="tob-intro">
    <div className="tob-sticky">
      <section data-reference-hero className="reference-hero" aria-label="We Are TOB">
        <h1 className="sr-only">We Are TOB. Küçük işletmeler için büyük marka fikirleri.</h1>
        <div data-reference-header className="reference-header"><Header /></div>
        <svg data-reference-art className="reference-art" viewBox="0 0 1586 992" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs>
            {/* Sample the original material without recolouring its highlights. */}
            <filter id="ref-floor"><feGaussianBlur stdDeviation="9" /></filter>
            <filter id="ref-ink" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -4 0 0 0 3" />
            </filter>
            <linearGradient id="ref-b-face" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0" stopColor="#e00017" /><stop offset="0.7" stopColor="#ca0014" /><stop offset="1" stopColor="#bf0012" />
            </linearGradient>
            <clipPath id="ref-b-shape"><path d={bShape} clipRule="evenodd" /></clipPath>
            <clipPath id="ref-blue"><path d="M1234 949C1228 898 1264 856 1328 835C1333 778 1378 733 1420 724C1498 698 1554 740 1586 767V992H1296C1257 996 1242 980 1234 949Z" /></clipPath>
            <clipPath id="ref-gift"><polygon points="742,425 763,441 793,439 811,454 807,468 824,482 815,492 835,513 808,536 792,525 774,532 747,520 735,526 708,507 719,479 718,459 733,447" /></clipPath>
            <mask id="ref-plate-mask" maskUnits="userSpaceOnUse" x="-20000" y="-20000" width="40000" height="40000">
              <rect x="-20000" y="-20000" width="40000" height="40000" fill="white" />
              <circle data-reference-hole cx="769" cy="475" r="96" fill="black" />
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
          <g data-reference-plate><rect x="-20000" y="-20000" width="40000" height="40000" fill="#F4E9DC" mask="url(#ref-plate-mask)" /></g>
          <g data-reference-letter="t"><ellipse data-reference-shadow cx="433" cy="662" rx="140" ry="13" fill="#6b3422" opacity="0.22" filter="url(#ref-floor)" /><g clipPath="url(#ref-t)"><image href={SOURCE} width="1586" height="992"  /></g></g>
          <g data-reference-letter="b">
            <ellipse data-reference-shadow cx="1118" cy="663" rx="165" ry="15" fill="#6b3422" opacity="0.22" filter="url(#ref-floor)" />
            {/* Rebuild only the edge hidden behind the flower in the source, so its exit reveals a whole B. */}
            <path d={bShape} fillRule="evenodd" fill="#8b000c" transform="translate(3 4)" />
            <path d={bShape} fillRule="evenodd" fill="url(#ref-b-face)" stroke="#a4000e" strokeWidth="5" strokeLinejoin="round" />
            <path d={bShape} fill="none" stroke="#f6313d" strokeWidth="1.3" opacity="0.55" />
            <g clipPath="url(#ref-b-shape)"><g clipPath="url(#ref-b)"><image href={SOURCE} width="1586" height="992" /></g></g>
          </g>
          <g data-reference-letter="o"><ellipse data-reference-shadow cx="771" cy="665" rx="162" ry="15" fill="#6b3422" opacity="0.22" filter="url(#ref-floor)" /><g clipPath="url(#ref-o)" mask="url(#ref-ring-mask)"><image href={SOURCE} width="1586" height="992"  /></g></g>
          {pieces.map(({ id, src, group, box }) => <g key={id} className={id === "blue" ? "reference-blue" : undefined}>
            <g data-reference-piece={id} data-depth={group} data-bounds={box.join(",")}>
              {src ? <image href={`/hero/${src}@2x.webp`} x={box[0]} y={box[1]} width={box[2]} height={box[3]} preserveAspectRatio="none" /> :
                <image href={SOURCE} width="1586" height="992" clipPath={`url(#ref-${id})`} />}
            </g>
          </g>)}
          <g data-reference-copy className="reference-desktop"><image href={SOURCE} width="1586" height="992" filter="url(#ref-ink)" clipPath="url(#ref-copy)" /></g>
          <g data-reference-services className="reference-desktop"><image href={SOURCE} width="1586" height="992" filter="url(#ref-ink)" clipPath="url(#ref-services)" /></g>
          <g data-reference-nav className="reference-desktop"><image href={SOURCE} width="1586" height="992" filter="url(#ref-ink)" clipPath="url(#ref-nav)" /></g>
          <g data-reference-cue className="reference-desktop"><image href={SOURCE} width="1586" height="992" filter="url(#ref-ink)" clipPath="url(#ref-cue)" /></g>
          {/* Static fallback uses the complete approved source when motion is disabled. */}
          <image data-reference-original className="reference-original" href={SOURCE} width="1586" height="992" />
        </svg>
        <div data-reference-mobile-copy className="reference-mobile-copy"><HeroCopy /></div>
      </section>
      <div data-reference-after className="tob-after">
        <div className="tob-brand-line"><span data-reference-title className="tob-brand-text">the other<br />brands</span></div>
        {children}
      </div>
    </div>
    <div data-reference-spacer aria-hidden className="tob-spacer" />
    <ReferenceMotion />
  </div>;
}
