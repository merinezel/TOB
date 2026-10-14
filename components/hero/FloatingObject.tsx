import type { CSSProperties } from "react";
import type { HeroObject } from "@/data/hero";

// Three nested wrappers so the motions never fight over one transform:
// [data-obj] scroll (drift, portal move, fade) › [data-par] mouse parallax › [data-enter] load-in › image.
export default function FloatingObject({ o, available }: { o: HeroObject; available: boolean }) {
  const m = o.mobile;
  const style = {
    "--x": `${o.desktop.x}%`, "--y": `${o.desktop.y}%`, "--w": `${o.desktop.w}vw`, "--rot": `${o.desktop.rot ?? 0}deg`,
    "--mx": `${m?.x ?? 0}%`, "--my": `${m?.y ?? 0}%`, "--mw": `${m?.w ?? 0}vw`, "--mrot": `${m?.rot ?? 0}deg`,
    // no upscaling of sharp files: cap at the file's own width (a 2× file allows the same CSS size, crisper)
    "--max": o.soft ? "9999px" : `${o.size[0]}px`,
  } as CSSProperties;

  return (
    <div data-obj={o.id} data-layer={o.layer} data-mobile={m ? "" : undefined} className="tob-obj" style={style}>
      <div data-par className="w-full">
        <div data-enter className="tob-enter w-full">
          {available ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={o.src}
              srcSet={o.src2x ? `${o.src} 1x, ${o.src2x} 2x` : undefined}
              alt={o.alt}
              width={o.size[0]}
              height={o.size[1]}
              decoding="async"
              draggable={false}
              className="tob-obj-img"
            />
          ) : (
            // dev-only stand-in until the real file is dropped into public/hero/
            <div className="tob-obj-img tob-obj-missing" style={{ aspectRatio: `${o.size[0]} / ${o.size[1]}` }}>
              {o.src.replace("/hero/", "")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
