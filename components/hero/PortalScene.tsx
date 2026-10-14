import type { CSSProperties } from "react";
import { portalScene } from "@/data/hero";

// What the O opens onto first: the same cream, a few faint far-away objects, no text. It sits between
// the hero and the site; the site itself only fades in over it once the portal has filled the screen.
export default function PortalScene() {
  return (
    <div data-portal-scene aria-hidden className="tob-portal-scene">
      {portalScene.map((o) => (
        <div
          key={o.id}
          data-scene-obj
          className="tob-scene-obj"
          style={{ "--x": `${o.x}%`, "--y": `${o.y}%`, "--w": `${o.w}vw`, "--rot": `${o.rot ?? 0}deg` } as CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={o.src} alt="" width={o.size[0]} height={o.size[1]} decoding="async" draggable={false} className="tob-obj-img" />
        </div>
      ))}
    </div>
  );
}
