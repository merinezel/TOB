// Intro hero: layered objects around the TOB wordmark, composed after the reference mockup.
// Positions are the object's top-left corner as % of the hero (which is 100vw × 100svh); w is in vw.
// `mobile: null` hides the object below 768px. Files live in public/hero/ (transparent WebP).
//
// Never upscaled: a sharp object is capped at its 1× file's pixel width (`size[0]`); `soft` files
// (blur baked in) are exempt, since there is no detail to lose.

export type Layer = "back" | "mid" | "fore";

export type HeroObject = {
  id: string;
  src: string;
  /** optional 2× file for sharp objects, e.g. "/hero/cup-cream@2x.webp" */
  src2x?: string;
  alt: string;
  /** intrinsic size of `src`, px: width/height attributes and the no-upscale cap */
  size: [number, number];
  /** blur is baked into the file, so it may be shown larger than its pixels */
  soft?: boolean;
  layer: Layer;
  /** optional stacking override inside the hero (copy is 5, header 10) */
  z?: number;
  desktop: { x: number; y: number; w: number; rot?: number };
  mobile: { x: number; y: number; w: number; rot?: number } | null;
  /** gentle drift over the first part of the scroll, px at 1440px wide (sign = direction) */
  drift: number;
  /** where it moves as the portal opens (px at 1440px wide), before fading out */
  portal: { x?: number; y?: number; scale?: number };
};

// Mouse parallax per depth layer, px.
export const layers: Record<Layer, { parallax: number }> = {
  back: { parallax: 6 },
  mid: { parallax: 11 },
  fore: { parallax: 18 },
};

// 1× files are 800px wide; the @2× files are the full renders for retina screens.
const asset = (name: string, h: number) => ({ src: `/hero/${name}.webp`, src2x: `/hero/${name}@2x.webp`, size: [800, h] as [number, number] });
const CUP = asset("cup-cream", 735);
const SPIRAL = asset("spiral-pink", 705);
const PINK = asset("flower-pink", 650);
const YELLOW = asset("flower-yellow", 787);
const SUN = asset("sun-gold", 733);
const SPHERE = asset("sphere-gold", 784);
const CLOUD = asset("cloud-white", 503);
const BLOB = asset("blob-blue", 593);
const PETALS = { ...asset("petals-pink", 401), soft: true };
const RED_BLUR = { src: "/hero/blur-red.webp", src2x: "/hero/blur-red@2x.webp", size: [1000, 416] as [number, number], soft: true };

export const heroObjects: HeroObject[] = [
  // ---- back: small, behind the word ----
  { id: "cloud", ...CLOUD, alt: "", layer: "back",
    desktop: { x: 4.5, y: 12.5, w: 11 }, mobile: null, drift: -40, portal: { x: 100, y: 50 } },
  { id: "flower-yellow", ...YELLOW, alt: "", layer: "back",
    desktop: { x: 38.8, y: 7, w: 12.5, rot: 10 }, mobile: { x: 52, y: 6, w: 19.2, rot: 10 }, drift: -30, portal: { x: 30, y: -90 } },
  { id: "sphere-1", ...SPHERE, alt: "", layer: "back",
    desktop: { x: 3.4, y: 29, w: 3.2 }, mobile: null, drift: -24, portal: { x: -40, y: -60 } },
  { id: "sphere-2", ...SPHERE, alt: "", layer: "back",
    desktop: { x: 17.3, y: 37, w: 1.7 }, mobile: null, drift: -30, portal: { x: 20, y: -60 } },
  // ---- mid: touching and overlapping the word ----
  { id: "cup", ...CUP, alt: "", layer: "mid",
    desktop: { x: 17.2, y: 10.1, w: 9.4, rot: -6 }, mobile: { x: 5, y: 13, w: 18, rot: 14 }, drift: -70, portal: { x: -30, y: -80 } },
  { id: "spiral", ...SPIRAL, alt: "", layer: "mid",
    desktop: { x: 55.5, y: 5.9, w: 15, rot: -6 }, mobile: { x: 75, y: 12, w: 19 }, drift: -55, portal: { x: 40, y: -100 } },
  { id: "flower-pink", ...PINK, alt: "", layer: "mid",
    desktop: { x: 76.5, y: 21.2, w: 14.5, rot: 10 }, mobile: null, drift: -110, portal: { x: 90, y: -60 } },
  { id: "flower-pink-left", ...PINK, alt: "", layer: "mid",
    desktop: { x: 2, y: 39, w: 15, rot: -14 }, mobile: { x: -9, y: 64, w: 36, rot: -8 }, drift: 50, portal: { x: -80, y: 60 } },
  { id: "sun", ...SUN, alt: "", layer: "mid",
    desktop: { x: 90, y: 50, w: 9.5 }, mobile: null, drift: 60, portal: { x: 70 } },
  { id: "sphere-3", ...SPHERE, alt: "", layer: "mid",
    desktop: { x: 32.5, y: 57.5, w: 3.2 }, mobile: { x: 80, y: 61, w: 8 }, drift: 70, portal: { x: -40, y: 60 } },
  { id: "sphere-4", ...SPHERE, alt: "", layer: "mid",
    desktop: { x: 65.5, y: 64, w: 2.6 }, mobile: null, drift: 40, portal: { x: 60, y: 50 } },
  // ---- fore: cropped by the frame, in front of the copy; z orders blob < red blur < petals ----
  { id: "blob", ...BLOB, alt: "", layer: "fore", z: 6,
    desktop: { x: 77, y: 72, w: 20.5, rot: -10 }, mobile: { x: 62, y: 76, w: 35 }, drift: 110, portal: { x: 120, scale: 1.15 } },
  { id: "blur-red", ...RED_BLUR, alt: "", layer: "fore", z: 7,
    desktop: { x: -9, y: 74, w: 30, rot: 6 }, mobile: { x: -16, y: 91, w: 55, rot: 6 }, drift: 150, portal: { x: -100, y: 80 } },
  { id: "petals-bottom", ...PETALS, alt: "", layer: "fore", z: 8,
    desktop: { x: 66, y: 89, w: 14, rot: 8 }, mobile: null, drift: 90, portal: { x: 80, y: 80 } },
];

// The calm scene seen through the O before the site itself appears: same cream, a few faint objects,
// no text. Positions are % of the screen, w in vw (mobile w is wDesktop × 2.2).
export const portalScene: { id: string; src: string; size: [number, number]; x: number; y: number; w: number; rot?: number }[] = [
  { id: "p-sphere", src: "/hero/sphere-gold.webp", size: [800, 784], x: 40, y: 22, w: 2.2 },
  { id: "p-spiral", src: "/hero/spiral-pink.webp", size: [800, 705], x: 57, y: 41, w: 6, rot: -12 },
  { id: "p-flower", src: "/hero/flower-yellow.webp", size: [800, 787], x: 35, y: 47, w: 4.6, rot: 18 },
  { id: "p-cup", src: "/hero/cup-cream.webp", size: [800, 735], x: 59, y: 17, w: 5, rot: -10 },
];
