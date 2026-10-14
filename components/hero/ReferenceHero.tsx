import type { ReactNode } from "react";
import { preload } from "react-dom";
import Header from "@/components/Header";
import { HeroCopy } from "./HeroCopy";
import ReferenceMotion from "./ReferenceMotion";

// All artwork samples the same original render. SVG windows are animation layers,
// not newly generated approximations of its materials, shapes or lighting.
const SOURCE = "/hero/approved-hero.png";
const pieces = [
  { id: "cloud", box: [35, 120, 240, 155], group: "back" },
  { id: "cup", box: [300, 90, 220, 190], group: "mid" },
  { id: "spiral", box: [890, 55, 300, 230], group: "mid" },
  { id: "flower", box: [1195, 215, 345, 320], group: "mid" },
  { id: "gold-left", box: [268, 500, 60, 64], group: "back" },
  { id: "gold-right", box: [1325, 568, 65, 65], group: "back" },
  { id: "blue", box: [1220, 710, 366, 282], group: "front" },
  { id: "gift", box: [700, 415, 140, 140], group: "mid" },
];
const letters = {
  t: "288,279 588,279 588,374 492,374 492,660 382,660 382,374 288,374",
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
            {/* Keep cream out of the moving red letter silhouettes. */}
            <filter id="ref-red" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 4 -4 0 0 -1" />
            </filter>
            <mask id="ref-plate-mask" maskUnits="userSpaceOnUse" x="-20000" y="-20000" width="40000" height="40000">
              <rect x="-20000" y="-20000" width="40000" height="40000" fill="white" />
              <circle data-reference-hole cx="765" cy="470" r="102" fill="black" />
            </mask>
            <mask id="ref-ring-mask" maskUnits="userSpaceOnUse" x="565" y="270" width="400" height="400">
              <circle cx="765" cy="470" r="198" fill="white" />
              <circle data-reference-counter cx="765" cy="470" r="102" fill="black" />
            </mask>
            {Object.entries(letters).map(([id, points]) => <clipPath key={id} id={`ref-${id}`}><polygon points={points} /></clipPath>)}
            <clipPath id="ref-o"><rect x="565" y="270" width="397" height="397" /></clipPath>
            <clipPath id="ref-copy"><rect x="540" y="700" width="520" height="118" /></clipPath>
            <clipPath id="ref-services"><rect x="540" y="825" width="520" height="48" /></clipPath>
            <clipPath id="ref-nav"><rect width="1586" height="65" /></clipPath>
            <clipPath id="ref-cue"><rect x="750" y="898" width="85" height="85" /></clipPath>
            {pieces.map(({ id, box }) => <clipPath key={id} id={`ref-piece-${id}`}><rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} rx={id === "gift" ? 60 : 8} /></clipPath>)}
          </defs>
          <g data-reference-plate><rect x="-20000" y="-20000" width="40000" height="40000" fill="#F4E9DC" mask="url(#ref-plate-mask)" /></g>
          <g data-reference-letter="t"><g clipPath="url(#ref-t)"><image href={SOURCE} width="1586" height="992" filter="url(#ref-red)" /></g></g>
          <g data-reference-letter="b"><g clipPath="url(#ref-b)"><image href={SOURCE} width="1586" height="992" filter="url(#ref-red)" /></g></g>
          <g data-reference-letter="o"><g clipPath="url(#ref-o)" mask="url(#ref-ring-mask)"><image href={SOURCE} width="1586" height="992" filter="url(#ref-red)" /></g></g>
          {pieces.map(({ id, group }) => <g key={id} className={id === "blue" ? "reference-blue" : undefined}><g data-reference-piece={id} data-depth={group}><g clipPath={`url(#ref-piece-${id})`}><image href={SOURCE} width="1586" height="992"  /></g></g></g>)}
          <g data-reference-copy className="reference-desktop"><image href={SOURCE} width="1586" height="992" clipPath="url(#ref-copy)" /></g>
          <g data-reference-services className="reference-desktop"><image href={SOURCE} width="1586" height="992" clipPath="url(#ref-services)" /></g>
          <g data-reference-nav className="reference-desktop"><image href={SOURCE} width="1586" height="992" clipPath="url(#ref-nav)" /></g>
          <g data-reference-cue className="reference-desktop"><image href={SOURCE} width="1586" height="992" clipPath="url(#ref-cue)" /></g>
          {/* This source layer guarantees an exact first frame before the scroll layers take over. */}
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
