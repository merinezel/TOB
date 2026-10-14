"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ReferenceMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const intro = document.querySelector<HTMLElement>("[data-reference-intro]");
    if (!intro) return;
    const root = document.documentElement;
    const q = gsap.utils.selector(intro);
    const el = (selector: string) => q(selector)[0] as HTMLElement;
    const hero = el("[data-reference-hero]");
    const art = el("[data-reference-art]");
    const spacer = el("[data-reference-spacer]");
    const title = el("[data-reference-title]");
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)" }, ({ conditions }) => {
      const { motion, mobile } = conditions as Record<string, boolean>;
      root.classList.toggle("tob-motion", motion);
      intro.classList.add("is-ready");
      if (!motion) return;
      const O = el('[data-reference-letter="o"]');
      const plate = el("[data-reference-plate]");
      const hole = el("[data-reference-hole]");
      const counter = el("[data-reference-counter]");
      const measure = () => {
        const r = art.getBoundingClientRect();
        const h = hero.getBoundingClientRect();
        const scale = Math.max(r.width / 1586, r.height / 992);
        const ox = r.left - h.left + (r.width - 1586 * scale) / 2 + 765 * scale;
        const oy = r.top - h.top + (r.height - 992 * scale) / 2 + 470 * scale;
        gsap.set(title, { left: ox, top: oy, xPercent: -50, yPercent: -50 });
      };
      measure();
      ScrollTrigger.addEventListener("refreshInit", measure);
      gsap.set([O, plate], { svgOrigin: "765 470" });
      gsap.set(title, { autoAlpha: 0, scale: 0.96, y: 8 });
      const z = { scale: 1, counter: 102 };
      const zoom = () => {
        gsap.set([O, plate], { scale: z.scale });
        hole.setAttribute("r", String(z.counter + 2));
        counter.setAttribute("r", String(z.counter));
      };
      const zoom0 = mobile ? 0.62 : 0.65;
      const letters0 = mobile ? 0.37 : 0.4;
      const tl = gsap.timeline({ defaults: { ease: "power1.inOut" }, scrollTrigger: {
        trigger: intro, start: "top top", end: () => `+=${spacer.offsetHeight}`,
        scrub: 1.1, invalidateOnRefresh: true, onRefresh: measure,
      } });
      tl.to(el("[data-reference-original]"), { opacity: 0, duration: 0.06 }, 0.1)
        .to(q("[data-reference-cue]"), { opacity: 0, y: 6, duration: 0.06 }, 0.1)
        .to(q("[data-reference-services], [data-reference-mobile-copy] [data-hero-services]"), { opacity: 0, y: 8, duration: 0.09 }, 0.12)
        .to(q("[data-reference-copy], [data-reference-mobile-copy] [data-hero-slogan]"), { opacity: 0, y: 12, duration: 0.1 }, 0.21)
        .to(q("[data-reference-nav], [data-reference-header]"), { autoAlpha: 0, duration: 0.1 }, 0.24)
        .to(el('[data-reference-letter="t"]'), { x: -550, opacity: 0, duration: 0.18, ease: "power2.inOut" }, letters0)
        .to(el('[data-reference-letter="b"]'), { x: 550, opacity: 0, duration: 0.18, ease: "power2.inOut" }, letters0)
        .to(z, { scale: 1.12, counter: 114, duration: (0.9 - zoom0) * 0.24, onUpdate: zoom }, zoom0)
        .to(z, { scale: 1.45, counter: 136, duration: (0.9 - zoom0) * 0.26, onUpdate: zoom }, zoom0 + (0.9 - zoom0) * 0.24)
        .to(z, { scale: 1.8, counter: 164, duration: (0.9 - zoom0) * 0.26, onUpdate: zoom }, zoom0 + (0.9 - zoom0) * 0.5)
        .to(z, { scale: 2.2, counter: 183, duration: (0.9 - zoom0) * 0.24, onUpdate: zoom }, zoom0 + (0.9 - zoom0) * 0.76)
        .to(title, { autoAlpha: 1, scale: 1, y: 0, duration: 0.07, ease: "power2.out" }, zoom0 + (0.9 - zoom0) * 0.68)
        .to(O, { opacity: 0, duration: 0.08 }, 0.92);
      ["front", "mid", "back"].forEach((depth, group) => {
        q(`[data-depth="${depth}"]`).forEach((piece, i) => {
          const direction = i % 2 ? 1 : -1;
          tl.to(piece, { x: direction * (120 - group * 35), y: 40 - group * 10, opacity: 0, duration: 0.15 }, [0.25, 0.31, 0.38][group] + i * 0.008);
        });
      });
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", measure);
        hole.setAttribute("r", "102");
        counter.setAttribute("r", "102");
      };
    });
    const navigate = (hash: string, smooth: boolean) => {
      const target = document.getElementById(hash.slice(1));
      if (!target) return false;
      const after = el("[data-reference-after]");
      let y = 0;
      if (hash !== "#top" && after.contains(target)) {
        let offset = 0;
        for (let n: HTMLElement | null = target; n && n !== after; n = n.offsetParent as HTMLElement | null) offset += n.offsetTop;
        y = (root.classList.contains("tob-motion") ? spacer.offsetHeight : hero.offsetHeight) + offset - 64;
      }
      history.replaceState(null, "", hash);
      window.scrollTo({ top: y, behavior: !smooth || matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      return true;
    };
    const onAnchor = (event: MouseEvent) => {
      const a = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (a && navigate(a.getAttribute("href")!, true)) event.preventDefault();
    };
    document.addEventListener("click", onAnchor);
    const raf = requestAnimationFrame(() => { if (location.hash) navigate(location.hash, false); });
    return () => { cancelAnimationFrame(raf); document.removeEventListener("click", onAnchor); mm.revert(); };
  }, []);
  return null;
}
