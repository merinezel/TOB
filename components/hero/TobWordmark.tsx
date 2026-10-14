// TOB drawn as geometry (cap height 100 units) so the O can be a true ring whose counter is the portal.
// Each letter is its own layer drawn in the same box and viewBox, so they share one zoom origin (the
// O's centre) yet can move apart: T exits left, B exits right, the O carries on into the portal.
// The plate is the hero's cream background with a hole cut where the O's counter sits; whatever is
// behind the hero (the next section of the site) shows through it once the counter's fill fades out.

export const MARK = {
  width: 274,
  /** O centre as a fraction of the wordmark box (viewBox 0 -3 274 106) — the zoom origin */
  originX: 131 / 274,
  originY: 0.5,
  /** outer and resting inner radius of the O ring, units */
  outer: 53,
  counter: 29,
};

// The O's ring and the plate's hole take the inner radius as a parameter: during the portal the
// counter widens faster than the zoom, so the ring thins out and the opening takes over the screen.
export const ringPath = (rIn: number) =>
  `M131 -3A53 53 0 1 1 131 103A53 53 0 1 1 131 -3ZM131 ${50 - rIn}A${rIn} ${rIn} 0 1 0 131 ${50 + rIn}A${rIn} ${rIn} 0 1 0 131 ${50 - rIn}Z`;
export const platePath = (r: number) =>
  `M-20000 -20000H20000V20000H-20000Z M131 ${50 - r}A${r} ${r} 0 1 0 131 ${50 + r}A${r} ${r} 0 1 0 131 ${50 - r}Z`;
/** the plate's hole sits this far outside the ring's inner edge so the ring always covers the seam */
export const PLATE_GAP = 2;

const VIEWBOX = "0 -3 274 106";
const PATHS = {
  t: "M2 0H74Q76 0 76 2V22Q76 24 74 24H50V98Q50 100 48 100H28Q26 100 26 98V24H2Q0 24 0 22V2Q0 0 2 0Z",
  o: ringPath(MARK.counter),
  b:
    "M189 0H240C259 0 270 9 270 24C270 35 264 43 255 47C270 50 278 60 278 73C278 90 265 100 245 100H189Q187 100 187 98V2Q187 0 189 0Z" +
    "M211 21H238C249 21 249 37 238 37H211Z" +
    "M211 57H242C257 57 257 79 242 79H211Z",
};
export type Letter = keyof typeof PATHS;
// Render the side wall far-to-near so the lit front edge stays clean.
const DEPTH = ["#75040C", "#82050D", "#90060F", "#9D0711", "#AC0913", "#BA0B17", "#C60E1B", "#D31220"];

export function TobLetter({ letter }: { letter: Letter }) {
  const d = PATHS[letter];
  const id = (n: string) => `tob-${n}-${letter}`;
  const ring = letter === "o" ? "" : undefined;
  // Open the T/O and O/B gaps without moving the O or its portal origin.
  const spacing = letter === "t" ? -6 : letter === "b" ? 7 : 0;
  return (
    <svg viewBox={VIEWBOX} className="block h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={id("face")} x1="0" y1="-3" x2="24" y2="106" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF2634" />
          <stop offset="0.16" stopColor="#EF0A20" />
          <stop offset="0.52" stopColor="#DE0017" />
          <stop offset="0.82" stopColor="#D00015" />
          <stop offset="1" stopColor="#B70012" />
        </linearGradient>
        <linearGradient id={id("edge")} x1="0" y1="-3" x2="38" y2="103" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF5E8" stopOpacity="0.9" />
          <stop offset="0.12" stopColor="#FF8B86" stopOpacity="0.65" />
          <stop offset="0.38" stopColor="#F83B43" stopOpacity="0.18" />
          <stop offset="0.7" stopColor="#70030A" stopOpacity="0.2" />
          <stop offset="1" stopColor="#60020A" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id={id("sheen")} x1="0" y1="-3" x2="0" y2="103" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.24" />
          <stop offset="0.07" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="0.32" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* Alpha-derived normals follow every contour, including the O's changing counter. */}
        <filter id={id("bevel")} x="-8%" y="-12%" width="116%" height="128%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="rounded" />
          <feSpecularLighting in="rounded" surfaceScale="3" specularConstant="0.85" specularExponent="28" lightingColor="#FFF6ED" result="shine">
            <fePointLight x="-70" y="-160" z="180" />
          </feSpecularLighting>
          <feComposite in="shine" in2="SourceAlpha" operator="in" />
        </filter>
        <filter id={id("soft")} x="-20%" y="-30%" width="150%" height="180%">
          <feGaussianBlur stdDeviation="3.8" />
        </filter>
      </defs>
      <g transform={`translate(${spacing} 0)`}>
        <path data-mark-shadow data-ring={ring} d={d} fillRule="evenodd" fill="#532015" opacity="0.2" filter={`url(#${id("soft")})`} transform="translate(2.5 7)" />
        {DEPTH.map((c, i) => {
          const step = DEPTH.length - i;
          return <path key={i} data-mark-depth data-ring={ring} d={d} fillRule="evenodd" fill={c} stroke={c} strokeWidth="0.35" strokeLinejoin="round" transform={`translate(${step * 0.28} ${step * 0.38})`} />;
        })}
        <path data-ring={ring} d={d} fillRule="evenodd" fill={`url(#${id("face")})`} />
        <path data-mark-gloss data-ring={ring} d={d} fillRule="evenodd" fill={`url(#${id("sheen")})`} stroke={`url(#${id("edge")})`} strokeWidth="1.35" strokeLinejoin="round" />
        <path data-mark-gloss data-ring={ring} d={d} fillRule="evenodd" fill="#fff" filter={`url(#${id("bevel")})`} opacity="0.58" />
      </g>
    </svg>
  );
}

// Huge cream sheet with a circular hole a little larger than the counter (the ring covers the seam).
export function TobPortal() {
  const r = MARK.counter + PLATE_GAP;
  return (
    <svg viewBox={VIEWBOX} className="block h-full w-full overflow-visible" aria-hidden>
      <defs>
        {/* warm studio light: brightest behind the word, falling off to the edges (wider than tall) */}
        <radialGradient id="tob-bg" gradientUnits="userSpaceOnUse" cx="131" cy="46" r="300" gradientTransform="translate(131 46) scale(1.7 1) translate(-131 -46)">
          <stop offset="0" stopColor="var(--tob-warm-light)" />
          <stop offset="0.5" stopColor="var(--tob-warm-mid)" />
          <stop offset="1" stopColor="var(--tob-warm-edge)" />
        </radialGradient>
      </defs>
      <path data-plate fill="url(#tob-bg)" fillRule="evenodd" d={platePath(r)} />
      {/* fills the counter until the portal stage, so at rest the O looks like plain background */}
      <circle data-portal-fill cx="131" cy="50" r={r + 0.5} fill="url(#tob-bg)" />
    </svg>
  );
}
