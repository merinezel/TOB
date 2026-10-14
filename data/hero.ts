// Intro hero: layered objects around the TOB wordmark, composed after the reference mockup.
// Positions are the object's top-left corner as % of the hero (which is 100vw × 100svh); w is in vw.
// `mobile: null` hides the object below 768px. Files live in public/hero/ (transparent WebP).
//
// Never upscaled: a sharp object is capped at its file's own pixel width (`size[0]`), so today's
// small files stay at a safe size. When the high-res renders arrive, drop them in, update `src` and
// `size`, and the objects grow to their intended `w` on their own. `soft` files (blur baked in) are
// exempt, since there is no detail to lose.

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

const CUP = { src: "/hero/cup-cream.webp", size: [276, 256] as [number, number] };
const SPIRAL = { src: "/hero/spiral-pink.webp", size: [284, 253] as [number, number] };
const PINK = { src: "/hero/flower-pink.webp", size: [320, 262] as [number, number] };
const YELLOW = { src: "/hero/flower-yellow.webp", size: [274, 263] as [number, number] };
const SUN = { src: "/hero/sun-gold.webp", size: [262, 244] as [number, number] };
const SPHERE = { src: "/hero/sphere-gold.webp", size: [172, 175] as [number, number] };
const CLOUD = { src: "/hero/cloud-white.webp", size: [298, 192] as [number, number] };
const BLOB = { src: "/hero/blob-blue.webp", size: [332, 294] as [number, number] };
const PINK_BLUR = { src: "/hero/flower-pink-blur.webp", size: [374, 316] as [number, number], soft: true };
const RED_BLUR = { src: "/hero/flower-red-blur.webp", size: [500, 424] as [number, number], soft: true };

export const heroObjects: HeroObject[] = [
  // ---- back: small, behind the word ----
  { id: "cloud", ...CLOUD, alt: "", layer: "back",
    desktop: { x: 8, y: 11, w: 13 }, mobile: null, drift: -40, portal: { x: 100, y: 50 } },
  { id: "flower-yellow", ...YELLOW, alt: "", layer: "back",
    desktop: { x: 81, y: 7, w: 10, rot: 10 }, mobile: { x: 56, y: 6, w: 24, rot: 10 }, drift: -30, portal: { x: 80, scale: 1.1 } },
  { id: "sphere-1", ...SPHERE, alt: "", layer: "back",
    desktop: { x: 4.5, y: 29, w: 4.2 }, mobile: { x: 80, y: 61, w: 8 }, drift: -24, portal: { x: -40, y: -60 } },
  { id: "sphere-2", ...SPHERE, alt: "", layer: "back",
    desktop: { x: 19, y: 44, w: 1.8 }, mobile: null, drift: 30, portal: { x: -50, y: 40 } },
  // ---- mid: touching and overlapping the word ----
  { id: "cup", ...CUP, alt: "", layer: "mid",
    desktop: { x: 22, y: 5, w: 17, rot: -8 }, mobile: { x: 3, y: 13, w: 28, rot: 14 }, drift: -70, portal: { x: -30, y: -80 } },
  { id: "spiral", ...SPIRAL, alt: "", layer: "mid",
    desktop: { x: 60, y: 7, w: 20, rot: -8 }, mobile: { x: 72, y: 13, w: 30 }, drift: -55, portal: { x: 40, y: -100 } },
  { id: "sun", ...SUN, alt: "", layer: "mid",
    desktop: { x: 88, y: 46, w: 12 }, mobile: null, drift: 60, portal: { x: 70 } },
  { id: "flower-pink", ...PINK, alt: "", layer: "mid",
    desktop: { x: 2, y: 40, w: 18, rot: -18 }, mobile: { x: -10, y: 62, w: 40, rot: -8 }, drift: 50, portal: { x: -80, y: 60 } },
  { id: "sphere-3", ...SPHERE, alt: "", layer: "mid",
    desktop: { x: 31, y: 63, w: 3.8 }, mobile: null, drift: 70, portal: { x: -40, y: 60 } },
  { id: "sphere-4", ...SPHERE, alt: "", layer: "mid",
    desktop: { x: 66, y: 70, w: 2.4 }, mobile: null, drift: 40, portal: { x: 60, y: 50 } },
  // ---- fore: big, cropped by the frame ----
  { id: "blob", ...BLOB, alt: "", layer: "fore",
    desktop: { x: 77, y: 64, w: 30, rot: -10 }, mobile: { x: 58, y: 70, w: 52 }, drift: 110, portal: { x: 120, scale: 1.15 } },
  // out-of-focus foreground forms (blur baked into the file), cropped by the frame
  { id: "blur-bottom", ...RED_BLUR, alt: "", layer: "fore",
    desktop: { x: -9, y: 62, w: 40, rot: 20 }, mobile: null, drift: 150, portal: { x: -100, y: 80 } },
  { id: "blur-behind-blob", ...PINK_BLUR, alt: "", layer: "mid",
    desktop: { x: 66, y: 76, w: 20, rot: -15 }, mobile: null, drift: 90, portal: { x: 80, y: 80 } },
  { id: "blur-top", ...PINK_BLUR, alt: "", layer: "fore",
    desktop: { x: 46, y: -12, w: 15, rot: -30 }, mobile: null, drift: -120, portal: { y: -120 } },
  { id: "blur-right", ...PINK_BLUR, alt: "", layer: "fore",
    desktop: { x: 95, y: 31, w: 12, rot: 60 }, mobile: null, drift: -80, portal: { x: 100 } },
];

// The calm scene seen through the O before the site itself appears: same cream, a few faint objects,
// no text. Positions are % of the screen, w in vw (mobile w is wDesktop × 2.2).
export const portalScene: { id: string; src: string; size: [number, number]; x: number; y: number; w: number; rot?: number }[] = [
  { id: "p-sphere", src: "/hero/sphere-gold.webp", size: [172, 175], x: 40, y: 22, w: 2.2 },
  { id: "p-spiral", src: "/hero/spiral-pink.webp", size: [284, 253], x: 57, y: 41, w: 6, rot: -12 },
  { id: "p-flower", src: "/hero/flower-yellow.webp", size: [274, 263], x: 35, y: 47, w: 4.6, rot: 18 },
  { id: "p-cup", src: "/hero/cup-cream.webp", size: [276, 256], x: 59, y: 17, w: 5, rot: -10 },
];
