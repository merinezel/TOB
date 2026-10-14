"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroObjects, layers } from "@/data/hero";
import { MARK, PLATE_GAP, platePath, ringPath } from "./TobWordmark";

// Drives the hero: the finished composition is the first screen (calm load-in), then one scroll timeline
// takes the camera through the O onto a plain screen that says "the other brands"; the page scrolls on.
// The hero is held in place by CSS sticky (see .tob-sticky), so ScrollTrigger only scrubs, it never pins.
//   0–10%   hold: nothing moves but a little mouse parallax
//   10–35%  scroll cue, then the services line, then the slogan, then the header leave
//   25–52%  layers dissolve front → mid → back (blob, blur, petals; flowers, cup, spiral, sun, gift; cloud,
//           yellow flower, spheres), each drifting a little and fading
//   40–60%  T and B slide out; the O is left alone and breathes for a moment
//   65–93%  the O zooms in stages while its opening widens faster than the zoom (the ring thins)
//   78–95%  "the other brands" appears on the O's centre
//   98–100% hero removed; the pin releases and the site scrolls up from below
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
          .to(markEnter, { opacity: 1, scale: 1, y: 0, duration: 0.9 }, 0)
          .to(objEnter, { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.1, stagger: 0.06 }, 0.15)
          .to(copyEnter, { opacity: 1, y: 0, duration: 0.9 }, 0.45)
          .to(cueEnter, { opacity: 1, duration: 0.8 }, 0.8);

        // ---- scroll timeline: one camera move, layers peeling away back-to-front of the lens ----
        gsap.set([plate, T, O, B], { transformOrigin: `${MARK.originX * 100}% ${MARK.originY * 100}%` });
        // the line the opening reveals sits on the O's own centre
        const brandText = one("[data-brand-text]");
        gsap.set(brandText, { xPercent: -50, yPercent: -50 });
        const placeBrand = () => {
          brandText.style.left = `${geo.ox}px`;
          brandText.style.top = `${geo.oy}px`;
        };
        placeBrand();
        ScrollTrigger.addEventListener("refreshInit", placeBrand);
        // ("scale" is an alias quickSetter doesn't expand, so set both axes)
        const scaler = (els: HTMLElement[]) => {
          const sx = gsap.quickSetter(els, "scaleX"), sy = gsap.quickSetter(els, "scaleY");
          return (v: number) => { sx(v); sy(v); };
        };
        const scalePortal = scaler(portal); // the O and its plate always share one transform
        // inner/outer radius per zoom keyframe: the opening grows faster than the zoom, so the ring thins
        const RING = mobile
          ? [MARK.counter / MARK.outer, 0.62, 0.78, 0.9, 0.95]
          : [MARK.counter / MARK.outer, 0.6, 0.72, 0.85, 0.93];
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
        // 1 → 1.12 → 1.45 → 2.4 → fill, interpolated in log space: slow first, steadily quicker, never a jump
        const z = { p: 0 };
        const applyZoom = () => {
          const k = [1, 1.12, 1.45, 2.4, Math.max(geo.end, 3)];
          const i = Math.min(3, Math.floor(z.p));
          const f = z.p - i;
          scalePortal(k[i] * Math.pow(k[i + 1] / k[i], f));
          setCounter(MARK.outer * (RING[i] + (RING[i + 1] - RING[i]) * f));
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: intro,
            start: "top top",
            end: () => `+=${spacer.offsetHeight}`,
            scrub: 1.2, // a little inertia
            invalidateOnRefresh: true,
            onRefresh: applyZoom,
          },
        });

        // timing (fractions of the whole scroll); mobile compresses the middle so it stays shorter
        const M = mobile;
        const tTB = M ? 0.34 : 0.4, dTB = M ? 0.18 : 0.2; // T and B leave
        const zoom0 = M ? 0.55 : 0.65, zoom1 = 0.93; // O zoom
        const reveal0 = M ? 0.7 : 0.78;
        const sheen = q("[data-mark-gloss]");

        // 0–10%: hold. Then the copy leaves, line first, and the cue goes before either
        tl.to(one("[data-hero-scroll]"), { autoAlpha: 0, duration: 0.06, ease: "power1.out" }, 0.1)
          .to(copyEnter.children[1], { autoAlpha: 0, y: 8, duration: 0.09, ease: "power1.inOut" }, 0.12)
          .to(copyEnter.children[0], { autoAlpha: 0, y: 12, duration: 0.1, ease: "power1.inOut" }, 0.21)
          .to(one("[data-hero-header]"), { autoAlpha: 0, y: -12, duration: 0.12, ease: "power1.inOut" }, 0.24)
          // the cast shadow goes early, the depth and the highlights thin out before the camera arrives
          .to(q("[data-mark-shadow]"), { autoAlpha: 0, duration: 0.2 }, 0.15)
          .to(q("[data-mark-depth]"), { autoAlpha: 0, duration: 0.14, ease: "power1.inOut" }, tTB + dTB - 0.04)
          .to(sheen, { opacity: 0.25, duration: 0.22, ease: "none" }, zoom0 - 0.02)
          // T and B slide out (translation does the leaving; they only dim a little on the way)
          .to(T, { xPercent: -135, scale: 1.04, opacity: 0.85, duration: dTB, ease: "power2.inOut" }, tTB)
          .to(B, { xPercent: 135, scale: 1.04, opacity: 0.85, duration: dTB, ease: "power2.inOut" }, tTB)
          .set([T, B], { autoAlpha: 0 }, tTB + dTB)
          // the counter stops being filled once the O is alone
          .to(fillEl, { opacity: 0, duration: 0.05 }, tTB + dTB - 0.02)
          // 65–93%: the zoom, one tween over the keyframes above
          .to(z, { p: 4, duration: zoom1 - zoom0, ease: "power1.in", onUpdate: applyZoom }, zoom0)
          // "the other brands" appears once the opening is wide enough to hold it
          .fromTo(brandText, { autoAlpha: 0, scale: 0.96, y: 8 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.17, ease: "power2.out" }, reveal0)
          // the ring barely dims; the hero hands over to the page's own scroll
          .to(O, { opacity: 0.4, duration: 0.07 }, 0.92)
          .to(hero, { autoAlpha: 0, duration: 0.02 }, 0.98);

        // layers dissolve front → mid → back, each with its own small, calm drift
        type Move = { g: 0 | 1 | 2; x: number; y: number; s?: number; r?: number; half?: boolean };
        const moves: Record<string, Move> = {
          blob: { g: 0, x: 120, y: 60, s: 1.08 },
          "blur-red": { g: 0, x: -100, y: 40, s: 1.05 },
          "petals-bottom": { g: 0, x: 80, y: 40, s: 1.04 },
          "flower-pink": { g: 1, x: 80, y: -30, s: 1.04 },
          "flower-pink-left": { g: 1, x: -70, y: 30, s: 1.04 },
          cup: { g: 1, x: -60, y: -30, r: -3 },
          spiral: { g: 1, x: 60, y: -40, r: 4 },
          sun: { g: 1, x: 70, y: 20, s: 1.03 },
          "sphere-3": { g: 1, x: -40, y: 30 },
          "sphere-4": { g: 1, x: 45, y: 25 },
          cloud: { g: 2, x: -25, y: -10, half: true },
          "flower-yellow": { g: 2, x: 12, y: -30, r: 3 },
          "sphere-1": { g: 2, x: -30, y: -35 },
          "sphere-2": { g: 2, x: -20, y: 40 },
        };
        const WIN = [0.25, 0.31, 0.38]; // when each layer starts, front first
        const seen = [0, 0, 0];
        objs.forEach(({ o, el }) => {
          const m = moves[o.id] ?? { g: 1 as const, x: 0, y: 30 };
          const t0 = WIN[m.g] + seen[m.g]++ * 0.012;
          const d = 0.15;
          tl.to(
            el,
            {
              x: () => m.x * geo.s,
              y: () => m.y * geo.s,
              scale: m.s ?? 1,
              rotation: m.r ?? 0,
              duration: d,
              ease: "power2.inOut",
            },
            t0,
          );
          if (m.half) tl.to(el, { opacity: 0.4, duration: d * 0.5, ease: "none" }, t0).to(el, { autoAlpha: 0, duration: d * 0.5, ease: "none" }, t0 + d * 0.5);
          else tl.to(el, { autoAlpha: 0, duration: d * 0.8, ease: "power1.in" }, t0 + d * 0.2);
        });
        // the parcel is a mid layer too
        tl.to(one("[data-gift]"), { autoAlpha: 0, y: 24, duration: 0.12, ease: "power1.in" }, WIN[1] + 0.05);

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
            const live = (tl.scrollTrigger?.progress ?? 0) < 0.12;
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
