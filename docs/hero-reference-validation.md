# Approved hero composition

The full hero now follows the approved 1586 × 992 reference, rather than changing only the letters.

- Seven supporting objects: cloud, cup, spiral, one pink flower, two gold spheres and the foreground blue sculpture.
- Remove the yellow flower, left pink flower, sun, red blur, loose petals and extra gold accents.
- Rebalance desktop positions, increase TOB scale, align its top at 28svh, and adjust slogan size and spacing.
- Mobile uses a separate composition with a readable slogan and no horizontal overflow.
- Preserve the O center, the staged scroll transition and the persistent title screen above the rest of the site.
- Local build and lint pass with the existing unused `arrow` warning. At mobile scroll 1857px, ring opacity is 0, title opacity is 1 and site content begins below the title screen.

## Asset provenance

The blue sculpture was created with the built-in image generation tool from the approved screenshot. The source render is preserved separately; the project consumes `public/hero/blob-blue-premium.webp` and its `@2x` sibling. Existing object assets remain unchanged.

Prompt: Extract and faithfully recreate only the glossy cobalt-blue sculptural object in the reference's bottom-right corner on a transparent background. Preserve the smooth inflated double-wave form, two parallel flowing lobes, deep royal-blue lacquer and white studio highlights. Extend cropped edges naturally. No text, website, background, other objects or floor plane. The object is positioned and cropped by the hero's bottom-right corner in HTML.
