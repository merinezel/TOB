# Portal motion validation

Checked on 2026-10-14 against a local production build. The initial version was deployed; the title persistence correction below supersedes its destination handoff.

- Desktop: 1440 × 900, 2900px scroll distance.
- Mobile: 390 × 844, 1850px scroll distance.
- Forward and reverse scroll sampled at 0, 9, 18, 30, 55, 60, 70, 81, 87, 92, 96, 100 and 103 percent.
- Verified initial hold, copy fade order, stationary title, ring thinning, persistent title screen at sticky release and restoration at the top.
- No horizontal overflow or browser runtime errors in either viewport.
- Live reduced-motion preference toggles restore the static hero, remove the spacer and restore motion on opt-in.
- Desktop pointer parallax resets on scroll without requiring another pointer event; desktop-to-mobile resize preserves the handoff.
- `npm run build` passes, including TypeScript checks.
- `npm run lint` passes with one pre-existing unused `arrow` warning in `app/page.tsx`. Next 15 also reports the upcoming deprecation of `next lint`.

## Timing

The normalized timeline holds the finished composition for 10%. Copy leaves cue → services → slogan. Front objects start at 25%, mid at 31%, back at 35% mobile / 37% desktop. T/B exit at 37–55% mobile / 40–58% desktop. The isolated O holds until 62% mobile / 65% desktop, then zooms through four scale stages until 90%. The counter widens through the existing SVG paths. The title starts 68% through the zoom; the title remains fully visible after the O clears. The title screen occupies the first viewport of the destination; continued native scrolling reveals services and projects below it. No marquee is added.

The dormant `PortalScene` component was inspected and left unused: introducing it would add an unnecessary intermediate scene. `TobWordmark` and `FloatingObject` already provide the SVG counter and independent animation wrappers needed for this change; their resting artwork was preserved.
