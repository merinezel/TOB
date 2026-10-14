"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroObjects, layers } from "@/data/hero";
import { MARK, PLATE_GAP, platePath, ringPath } from "./TobWordmark";

// Drives the intro: load-in, mouse parallax and the scroll timeline that takes the camera through the O.
// The hero is held in place by CSS sticky (see .tob-sticky), so ScrollTrigger only scrubs, it never pins.
//   0–20%   TOB 1 → 1.1, objects drift at slightly different speeds; copy stays put
//   20–40%  copy, services line, scroll cue and header fade out (gone before the portal starts)
//   40–55%  T leaves left, B leaves right; objects make their own small moves and later fade
//   55–88%  the O alone zooms on its own centre; its counter widens faster than the zoom and opens
//           onto a calm cream scene (no text) rather than straight onto the site
//   85–100% the real site fades and rises in, ring and scene clear, the hero is removed
export default function HeroMotion() {
  useEffect(() => {
    const intro = document.querySelector<HTMLElement>("[data-tob-intro]");
    if (!intro) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const root = document.documentElement;
    const q = gsap.utils.selector(intro);
    const one = (sel: string) => q(sel)[0] as HTMLElement;
    const hero = one("[data-hero]");
    const after = one("[data-after]");
    const spacer = one("[data-tob-spacer]");
    const plate = one("[data-portal-zoom]");
    const [T, O, B] = ["t", "o", "b"].map((l) => one(`[data-letter="${l}"]`));
    const portal = [plate, O]; // these two must always share one transform, or the hole and the ring drift apart
    const mm = gsap.matchMedia();

    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)", fine: "(pointer: fine) and (min-width: 768px)" },
      (ctx) => {
        const { motion, mobile, fine } = ctx.conditions as Record<string, boolean>;
        if (!motion) {
          // reduced motion: static hero in normal flow, nothing pinned or zoomed
          root.classList.remove("tob-motion");
          intro.classList.add("is-ready");
          ScrollTrigger.refresh();
          return;
        }
        root.classList.add("tob-motion");

        const objs = heroObjects
          .filter((o) => !mobile || o.mobile)
          .map((o) => ({ o, el: one(`[data-obj="${o.id}"]`) }))
          .filter((x) => x.el);

        // ---- geometry, re-read on every refresh (resize, orientation, address bar) ----
        const geo = { ox: 0, oy: 0, end: 10, s: 1 };
        const measure = () => {
          const W = O.offsetWidth, H = O.offsetHeight;
          const vw = hero.clientWidth, vh = hero.clientHeight;
          geo.ox = O.offsetLeft + MARK.originX * W;
          geo.oy = O.offsetTop + MARK.originY * H;
          // scale at which the widened counter, still on the O's own centre, clears the farthest corner
          const far = Math.hypot(Math.max(geo.ox, vw - geo.ox), Math.max(geo.oy, vh - geo.oy));
          geo.end = (far / (MARK.outer * 0.9 * (W / MARK.width))) * 1.04;
          geo.s = Math.max(vw / 1440, 0.45);
        };
        measure();
        ScrollTrigger.addEventListener("refreshInit", measure);

        // ---- load-in: calm, no bounce ----
        const markEnter = one("[data-mark-enter]");
        const objEnter = objs.map((x) => x.el.querySelector("[data-enter]"));
        const copyEnter = one("[data-hero-copy] [data-enter]");
        const cueEnter = one("[data-hero-scroll] [data-enter]");
        gsap.set(markEnter, { opacity: 0, scale: 0.96, y: 16, transformOrigin: `50% ${geo.oy}px` });
        objEnter.forEach((el, i) =>
          gsap.set(el, {
            opacity: 0,
            x: Math.round(Math.sin(i * 2.3 + 1) * 34),
            y: Math.round(Math.cos(i * 1.9 + 0.5) * 30),
            scale: i % 2 ? 0.93 : 1.04,
          }),
        );
        gsap.set(copyEnter, { opacity: 0, y: 14 });
        gsap.set(cueEnter, { opacity: 0 });
        intro.classList.add("is-ready"); // hands the hidden start state from CSS to the inline styles above
        gsap
          .timeline({ defaults: { ease: "power3.out" }, delay: 0.1 })
          .to(markEnter, { opacity: 1, scale: 1, y: 0, duration: 1 }, 0)
          .to(objEnter, { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.1, stagger: 0.06 }, 0.15)
          .to(copyEnter, { opacity: 1, y: 0, duration: 0.9 }, 0.45)
          .to(cueEnter, { opacity: 1, duration: 0.8 }, 0.8);

        // ---- scroll timeline ----
        gsap.set([plate, T, O, B], { transformOrigin: `${MARK.originX * 100}% ${MARK.originY * 100}%` });
        // ("scale" is an alias quickSetter doesn't expand, so set both axes)
        const scaler = (els: HTMLElement[]) => {
          const sx = gsap.quickSetter(els, "scaleX"), sy = gsap.quickSetter(els, "scaleY");
          return (v: number) => { sx(v); sy(v); };
        };
        const scaleWord = scaler([plate, T, O, B]);
        const scalePortal = scaler(portal);
        // the counter widens faster than the zoom: inner/outer radius per keyframe
        const RING = [MARK.counter / MARK.outer, MARK.counter / MARK.outer, 0.62, 0.78, 0.9];
        const ringEls = q("[data-ring]");
        const plateEl = one("[data-plate]");
        const fillEl = one("[data-portal-fill]");
        let lastR = 0;
        const setCounter = (rIn: number) => {
          if (Math.abs(rIn - lastR) < 0.02) return;
          lastR = rIn;
          const d = ringPath(rIn);
          ringEls.forEach((el) => el.setAttribute("d", d));
          plateEl.setAttribute("d", platePath(rIn + PLATE_GAP));
          fillEl.setAttribute("r", String(rIn + PLATE_GAP + 0.5));
        };
        // separate keyframes, each interpolated in log space: slow at first, fastest in the last stretch
        const z = { p: 0 };
        const applyZoom = () => {
          const k = [1, 1.15, 2, 5, Math.max(geo.end, 5.5)];
          const i = Math.min(3, Math.floor(z.p));
          const f = z.p - i;
          const v = k[i] * Math.pow(k[i + 1] / k[i], f);
          // stage 1 the word grows as one; after that T and B have their own tweens
          (z.p <= 1 ? scaleWord : scalePortal)(v);
          setCounter(MARK.outer * (RING[i] + (RING[i + 1] - RING[i]) * f));
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: intro,
            start: "top top",
            end: () => `+=${spacer.offsetHeight}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: applyZoom,
          },
        });

        // 0–20%: the word breathes
        tl.to(z, { p: 1, duration: 0.2, onUpdate: applyZoom }, 0)
          // 20–40%: everything that reads as text leaves before the portal opens
          .to(one("[data-hero-copy]"), { autoAlpha: 0, y: -24, duration: 0.18, ease: "power1.in" }, 0.2)
          .to(one("[data-hero-scroll]"), { autoAlpha: 0, duration: 0.12 }, 0.2)
          .to(one("[data-hero-header]"), { autoAlpha: 0, y: -16, duration: 0.15 }, 0.22)
          .to(q("[data-mark-shadow]"), { autoAlpha: 0, duration: 0.15 }, 0.22)
          // 40–55%: T and B leave the screen; the O is left on its own
          .to(z, { p: 2, duration: 0.15, onUpdate: applyZoom }, 0.4)
          .fromTo(T, { scale: 1.15, xPercent: 0 }, { scale: 2.2, xPercent: -150, duration: 0.15, ease: "power2.in", immediateRender: false }, 0.4)
          .fromTo(B, { scale: 1.15, xPercent: 0 }, { scale: 2.2, xPercent: 150, duration: 0.15, ease: "power2.in", immediateRender: false }, 0.4)
          .set([T, B], { autoAlpha: 0 }, 0.55)
          // the depth copy would swell into a thick brown edge at large scale, so it goes first
          .to(q("[data-mark-depth]"), { autoAlpha: 0, duration: 0.15 }, 0.45)
          // the counter opens onto the calm cream scene (same colour, so no visible switch)
          .to(fillEl, { opacity: 0, duration: 0.06 }, 0.42)
          .fromTo(q("[data-scene-obj]"), { scale: 0.8 }, { scale: 1.3, duration: 0.55, ease: "power1.in" }, 0.45)
          // 55–88%: the portal — O only, zooming on its own centre, ring thinning as the opening grows
          .to(z, { p: 3, duration: 0.2, onUpdate: applyZoom }, 0.55)
          .to(z, { p: 4, duration: 0.13, onUpdate: applyZoom }, 0.75)
          // last 15%: the real site arrives, ring and scene clear, hero is removed
          .to(portal, { opacity: 0, duration: 0.12 }, 0.85)
          .to(one("[data-portal-scene]"), { autoAlpha: 0, duration: 0.08 }, 0.84)
          .fromTo(after, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.85)
          .to(hero, { autoAlpha: 0, duration: 0.03 }, 0.97);

        // objects: drift early, then each takes its own small move as the portal opens, and fades out
        objs.forEach(({ o, el }) => {
          const m = o.portal;
          tl.to(el, { y: () => o.drift * geo.s, duration: 0.4 }, 0)
            .to(
              el,
              {
                x: () => (m.x ?? 0) * geo.s,
                y: () => (o.drift + (m.y ?? 0)) * geo.s,
                scale: m.scale ?? 1,
                duration: 0.35,
                ease: "power1.inOut",
              },
              0.4,
            )
            .to(el, { autoAlpha: 0, duration: 0.18 }, 0.62);
        });

        // ---- mouse parallax, desktop pointers only, and only while the hero is still the scene ----
        let onMove: ((e: PointerEvent) => void) | undefined;
        if (fine) {
          const movers = [
            ...objs.map(({ o, el }) => ({ amt: layers[o.layer].parallax, el: el.querySelector("[data-par]")! })),
            { amt: 2, el: one("[data-mark-par]") },
          ].map(({ amt, el }) => ({
            amt,
            x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
          }));
          onMove = (e: PointerEvent) => {
            const live = (tl.scrollTrigger?.progress ?? 0) < 0.4;
            const nx = live ? (e.clientX / innerWidth - 0.5) * 2 : 0;
            const ny = live ? (e.clientY / innerHeight - 0.5) * 2 : 0;
            movers.forEach((m) => { m.x(nx * m.amt); m.y(ny * m.amt); });
          };
          window.addEventListener("pointermove", onMove, { passive: true });
        }

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", measure);
          if (onMove) window.removeEventListener("pointermove", onMove);
        };
      },
    );

    // In-page links: content behind the hero sits one intro-length further down than its layout says.
    const offsetIn = (el: HTMLElement, box: HTMLElement) => {
      let y = 0;
      for (let n: HTMLElement | null = el; n && n !== box; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
      return y;
    };
    const targetY = (hash: string) => {
      if (hash === "#top" || hash === "#") return 0;
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!el) return null;
      if (hero.contains(el)) return 0;
      if (!after.contains(el)) return null;
      const pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      const lead = root.classList.contains("tob-motion") ? spacer.offsetHeight : hero.offsetHeight;
      return Math.max(0, lead + offsetIn(el, after) - pad);
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const y = targetY(a.getAttribute("href")!);
      if (y == null) return;
      e.preventDefault();
      history.replaceState(null, "", a.getAttribute("href"));
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    // arriving on /#work etc.: the browser's own jump uses the wrong offset, so redo it
    const raf = requestAnimationFrame(() => {
      if (!location.hash) return;
      const y = targetY(location.hash);
      if (y != null) window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
    });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      mm.revert();
    };
  }, []);

  return null;
}
