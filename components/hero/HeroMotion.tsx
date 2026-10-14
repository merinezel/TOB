"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroObjects, layers } from "@/data/hero";
import { MARK } from "./TobWordmark";

// One normalized scroll timeline: hold → physical exits → isolated O → zoom through its counter.
// The title remains as a real first screen; normal scrolling reveals the site below it.
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
          return () => { intro.classList.remove("is-ready"); };
        }
        root.classList.add("tob-motion");

        const objs = heroObjects
          .filter((o) => !mobile || o.mobile)
          .map((o) => ({ o, el: one(`[data-obj="${o.id}"]`) }))
          .filter((x) => x.el);

        // ---- geometry, re-read on every refresh (resize, orientation, address bar) ----
        const geo = { ox: 0, oy: 0, end: 10 };
        const measure = () => {
          const W = O.offsetWidth, H = O.offsetHeight;
          const vw = hero.clientWidth, vh = hero.clientHeight;
          geo.ox = O.offsetLeft + MARK.originX * W;
          geo.oy = O.offsetTop + MARK.originY * H;
          // Fill with the counter, not the outer ring: every viewport corner must be inside the hole.
          const farX = Math.max(geo.ox, vw - geo.ox);
          const farY = Math.max(geo.oy, vh - geo.oy);
          // Include the down-right extrusion (3 × 4.8 SVG units) in the safe opening radius.
          const clearRadius = MARK.counter - Math.hypot(3, 4.8);
          geo.end = Math.max(2.2, (Math.hypot(farX, farY) + 32) / (clearRadius * W / MARK.width));
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
        const fillEl = one("[data-portal-fill]");
        const z = { p: 0 };
        const applyZoom = () => {
          const stages = [1, 1.35, 2.2, geo.end];
          const i = Math.min(2, Math.floor(z.p));
          const f = z.p - i;
          scalePortal(stages[i] * Math.pow(stages[i + 1] / stages[i], f));
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

        // 0–12 hold; 12–30 copy; 25–48 objects; 40–58 letters;
        // 58–62 isolated O; 60–72 title reveal; 65–100 zoom.
        tl.to(one("[data-hero-scroll]"), { autoAlpha: 0, y: 6, duration: 0.06 }, 0.12)
          .to(one("[data-hero-services]"), { autoAlpha: 0, y: 6, duration: 0.08 }, 0.12)
          .to(one("[data-hero-slogan]"), { autoAlpha: 0, y: 8, duration: 0.1 }, 0.2)
          .to(one("[data-hero-header]"), { autoAlpha: 0, y: -8, duration: 0.1 }, 0.2)
          // Full-box translations guarantee both letters leave even on a narrow viewport.
          .to(T, { x: () => -hero.clientWidth, scale: 1.02, duration: 0.18, ease: "power2.inOut" }, 0.4)
          .to(B, { x: () => hero.clientWidth, scale: 1.02, duration: 0.18, ease: "power2.inOut" }, 0.4)
          .to(fillEl, { opacity: 0, duration: 0.04 }, 0.58)
          .fromTo(brandText, { autoAlpha: 0, scale: 0.97, y: 6 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.12 }, 0.6)
          .to(z, { p: 1, duration: 0.1, onUpdate: applyZoom }, 0.65)
          .to(z, { p: 2, duration: 0.1, onUpdate: applyZoom }, 0.75)
          .to(z, { p: 3, duration: 0.15, onUpdate: applyZoom }, 0.85)
          // Preserve the face, gloss and depth. Only soften the cast shadow at large scale.
          .to(O.querySelectorAll("[data-mark-shadow]"), { opacity: 0.08, duration: 0.15 }, 0.85);

        // Move each object towards an actual viewport edge; fade only over the final 12% of its trip.
        // Linear travel makes the late fade start when the object is already at the edge.
        const exit = (el: HTMLElement, dx: number, dy: number) => {
          const cx = el.offsetLeft + el.offsetWidth / 2;
          const cy = el.offsetTop + el.offsetHeight / 2;
          const halfW = el.offsetWidth / 2;
          const halfH = el.offsetHeight / 2;
          const tx = dx > 0 ? (hero.clientWidth + halfW - cx) / dx : dx < 0 ? (-halfW - cx) / dx : Infinity;
          const ty = dy > 0 ? (hero.clientHeight + halfH - cy) / dy : dy < 0 ? (-halfH - cy) / dy : Infinity;
          const travel = Math.min(tx, ty) + 0.04;
          return { x: dx * travel, y: dy * travel };
        };
        objs.forEach(({ o, el }) => {
          const group = o.layer === "fore" ? 0 : o.layer === "mid" ? 1 : 2;
          const start = [0.12, 0.25, 0.3][group];
          const end = [0.38, 0.44, 0.48][group];
          const dx = o.id === "cup" ? -80 : o.id === "spiral" ? 80 :
            el.offsetLeft + el.offsetWidth / 2 < geo.ox ? -100 : 100;
          const dy = o.id === "cup" ? -40 : o.id === "spiral" ? -50 :
            el.offsetTop + el.offsetHeight / 2 < geo.oy ? -70 : 70;
          tl.to(el, {
            x: () => exit(el, dx, dy).x,
            y: () => exit(el, dx, dy).y,
            duration: end - start,
          }, start).to(el, { autoAlpha: 0, duration: (end - start) * 0.12 }, end - (end - start) * 0.12);
        });
        // The parcel has its own move before fading, leaving the O's counter clear for the title.
        const gift = one("[data-gift]");
        tl.to(gift, { y: () => hero.clientHeight, duration: 0.23 }, 0.25)
          .to(gift, { autoAlpha: 0, duration: 0.028 }, 0.452);

        // ---- mouse parallax, desktop pointers only, and only while the hero is still the scene ----
        let onMove: ((e: PointerEvent) => void) | undefined;
        let resetParallax: (() => void) | undefined;
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
          resetParallax = () => {
            if ((tl.scrollTrigger?.progress ?? 0) >= 0.12) {
              movers.forEach((m) => { m.x(0); m.y(0); });
            }
          };
          window.addEventListener("scroll", resetParallax, { passive: true });
          window.addEventListener("pointermove", onMove, { passive: true });
        }

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", measure);
          ScrollTrigger.removeEventListener("refreshInit", placeBrand);
          if (onMove) window.removeEventListener("pointermove", onMove);
          if (resetParallax) window.removeEventListener("scroll", resetParallax);
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
      window.scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
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
