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
const SPHERE = asset("sphere-gold", 784);
const CLOUD = asset("cloud-white", 503);
const BLOB = asset("blob-blue-premium", 571);

// Approved composition: five supporting pieces and two gold accents, with space around TOB.
export const heroObjects: HeroObject[] = [
  { id: "cloud", ...CLOUD, alt: "", layer: "back",
    desktop: { x: 2.9, y: 13.5, w: 13.7 }, mobile: { x: 2, y: 15, w: 22 }, drift: -40, portal: { x: -25, y: -10 } },
  { id: "cup", ...CUP, alt: "", layer: "mid",
    desktop: { x: 19.5, y: 10.1, w: 12.6, rot: -6 }, mobile: { x: 25, y: 12.5, w: 22, rot: -6 }, drift: -70, portal: { x: -60, y: -30 } },
  { id: "spiral", ...SPIRAL, alt: "", layer: "mid",
    desktop: { x: 56.5, y: 6.5, w: 17.7, rot: -6 }, mobile: { x: 66, y: 13, w: 28, rot: -6 }, drift: -55, portal: { x: 60, y: -40 } },
  { id: "flower-pink", ...PINK, alt: "", layer: "mid",
    desktop: { x: 75.7, y: 22.7, w: 20.2, rot: 10 }, mobile: { x: 78, y: 32, w: 30, rot: 10 }, drift: -110, portal: { x: 80, y: -30 } },
  { id: "sphere-1", ...SPHERE, alt: "", layer: "back",
    desktop: { x: 17.2, y: 51.1, w: 3 }, mobile: { x: 9, y: 48, w: 5 }, drift: -24, portal: { x: -30, y: -35 } },
  { id: "sphere-2", ...SPHERE, alt: "", layer: "back",
    desktop: { x: 84.2, y: 58.2, w: 2.8 }, mobile: null, drift: -30, portal: { x: -20, y: 40 } },
  { id: "blob", ...BLOB, alt: "", layer: "fore", z: 6,
    desktop: { x: 77.6, y: 72.8, w: 25, rot: 0 }, mobile: { x: 74, y: 77, w: 39, rot: 0 }, drift: 110, portal: { x: 120, scale: 1.08 } },
];

// The calm scene seen through the O before the site itself appears: same cream, a few faint objects,
// no text. Positions are % of the screen, w in vw (mobile w is wDesktop × 2.2).
export const portalScene: { id: string; src: string; size: [number, number]; x: number; y: number; w: number; rot?: number }[] = [
  { id: "p-sphere", src: "/hero/sphere-gold.webp", size: [800, 784], x: 40, y: 22, w: 2.2 },
  { id: "p-spiral", src: "/hero/spiral-pink.webp", size: [800, 705], x: 57, y: 41, w: 6, rot: -12 },
  { id: "p-flower", src: "/hero/flower-yellow.webp", size: [800, 787], x: 35, y: 47, w: 4.6, rot: 18 },
  { id: "p-cup", src: "/hero/cup-cream.webp", size: [800, 735], x: 59, y: 17, w: 5, rot: -10 },
];
