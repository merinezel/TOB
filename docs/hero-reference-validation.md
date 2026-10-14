# Original-render hero

The opening desktop scene uses the user-provided approved PNG directly, at its original 1586 × 992 aspect ratio. No regenerated letters, materials or object approximations are used. The image is copied unchanged to `public/hero/approved-hero.png`.

SVG windows sample the same source for the T, O, B, objects, slogan, service line and navigation. A complete source layer preserves the opening frame; on scroll it hands over to the independently animated windows. This retains a raster artwork approach rather than introducing a 3D renderer.

The O counter and background opening are SVG masks; they expand together through four scale stages. The ring fades at 92–100%, the centered title remains, and normal scrolling exposes the existing page below.

Mobile uses a cropped art stage, a live menu and live readable copy. Desktop uses live transparent navigation hit targets aligned with the rendered navigation. Reduced-motion uses a static first screen and no long spacer.

Validation: local production build and lint (one existing unused `arrow` warning); desktop and mobile portal end checks confirm ring opacity 0, title opacity 1 and no horizontal overflow.
