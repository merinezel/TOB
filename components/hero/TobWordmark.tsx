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
  t: "M0 0H76V24H50V100H26V24H0Z",
  o: ringPath(MARK.counter),
  b:
    "M187 0H243A23.5 23.5 0 0 1 243 47H247A26.5 26.5 0 0 1 247 100H187Z" +
    "M211 21H241A8 8 0 0 1 241 37H211Z" +
    "M211 57H245A11 11 0 0 1 245 79H211Z",
};
export type Letter = keyof typeof PATHS;
// side wall colours, near to far: lit edge first, falling into shade
const DEPTH = ["#B80E18", "#B00D16", "#A80C15", "#A00B14", "#980A12", "#900A11"];

export function TobLetter({ letter }: { letter: Letter }) {
  const d = PATHS[letter];
  const id = (n: string) => `tob-${n}-${letter}`;
  const ring = letter === "o" ? "" : undefined; // HeroMotion rewrites these paths as the counter widens
  return (
    <svg viewBox={VIEWBOX} className="block h-full w-full overflow-visible" aria-hidden>
      <defs>
        {/* body: lit from above, a touch deeper toward the base */}
        <linearGradient id={id("face")} x1="0" y1="-3" x2="0" y2="103" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D8141F" />
          <stop offset="0.14" stopColor="#CE0F1A" />
          <stop offset="0.7" stopColor="#C90D18" />
          <stop offset="1" stopColor="#BC0B15" />
        </linearGradient>
        {/* thin top-edge highlight, the only "gloss" */}
        <linearGradient id={id("sheen")} x1="0" y1="-3" x2="0" y2="103" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.06" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* light from the upper left: a little brighter on the left edge, a little deeper on the right */}
        <linearGradient id={id("side")} x1="0" y1="0" x2="274" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.1" />
        </linearGradient>
        <filter id={id("soft")} x="-15%" y="-25%" width="140%" height="170%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
      </defs>
      {/* very soft cast shadow; faded out early in the scroll so the blur never re-renders at large zoom */}
      <path data-mark-shadow data-ring={ring} d={d} fillRule="evenodd" fill="#5A0A0A" opacity="0.16" filter={`url(#${id("soft")})`} transform="translate(5 10)" />
      {/* extrusion: stacked copies stepped down-right, darkening with depth, so the letters have real
          thickness; they fade out before the big zoom so they never swell into a thick brown edge */}
      {DEPTH.map((c, i) => (
        <path key={i} data-mark-depth data-ring={ring} d={d} fillRule="evenodd" fill={c} transform={`translate(${((i + 1) * 0.5).toFixed(2)} ${((i + 1) * 0.8).toFixed(2)})`} />
      ))}
      <path data-ring={ring} d={d} fillRule="evenodd" fill={`url(#${id("face")})`} />
      <path data-mark-gloss data-ring={ring} d={d} fillRule="evenodd" fill={`url(#${id("sheen")})`} />
      <path data-mark-gloss data-ring={ring} d={d} fillRule="evenodd" fill={`url(#${id("side")})`} />
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
