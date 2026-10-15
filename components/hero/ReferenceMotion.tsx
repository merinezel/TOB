"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// The approved artwork supplies the material and lighting; scroll only moves its layers.
export default function ReferenceMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const intro = document.querySelector<HTMLElement>("[data-reference-intro]");
    if (!intro) return;
    const root = document.documentElement;
    const q = gsap.utils.selector(intro);
    const el = (selector: string) => q(selector)[0] as HTMLElement;
    const hero = el("[data-reference-hero]");
    const art = el("[data-reference-art]");
    const backdrop = el("[data-reference-backdrop]");
    const spacer = el("[data-reference-spacer]");
    const title = el("[data-reference-title]");
    const destinationTitle = el("[data-brand-destination]");
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)" }, ({ conditions }) => {
      const { motion, mobile } = conditions as Record<string, boolean>;
      root.classList.toggle("tob-motion", motion);
      intro.classList.add("is-ready");
      if (!motion) return;
      const O = el('[data-reference-letter="o"]');
      const geo = { scale: 1, ox: 0, oy: 0, end: 12, blueX: 0, blueY: 0, titleX: 0, titleY: 0, titleSize: 72, startSize: 14, portalScale: 1, textWidth: 1, textHeight: 1 };
      const measure = () => {
        // Use the SVG's mapping itself so the text, plate and O cannot drift on resize.
        const matrix = (art as unknown as SVGSVGElement).getScreenCTM();
        if (!matrix) return;
        const h = hero.getBoundingClientRect();
        geo.scale = matrix.a;
        geo.blueX = (hero.clientWidth - (1586 * matrix.a + matrix.e - h.left)) / matrix.a;
        geo.blueY = (hero.clientHeight - (992 * matrix.d + matrix.f - h.top)) / matrix.d + 2;
        gsap.set(el(".reference-blue"), { x: geo.blueX, y: geo.blueY });
        geo.ox = 769 * matrix.a + matrix.e - h.left;
        geo.oy = 475 * matrix.d + matrix.f - h.top;
        geo.end = Math.max(2.2, (Math.hypot(Math.max(geo.ox, hero.clientWidth - geo.ox),
          Math.max(geo.oy, hero.clientHeight - geo.oy)) + 32) / (92 * geo.scale));
        backdrop.style.setProperty("--portal-x", `${geo.ox}px`);
        backdrop.style.setProperty("--portal-y", `${geo.oy}px`);
        backdrop.style.setProperty("--portal-r", `${96 * geo.scale}px`);
        const destination = destinationTitle.getBoundingClientRect();
        geo.titleX = destination.left + destination.width / 2 - h.left;
        geo.titleY = destination.top + destination.height / 2 - h.top;
        geo.titleSize = parseFloat(getComputedStyle(destinationTitle).fontSize);
        geo.startSize = mobile ? 12 : Math.min(18, Math.max(12, innerWidth * 0.011));
        // Measure untransformed type once; fitting each frame then needs no layout reads.
        gsap.set(title, { fontSize: 100 });
        geo.textWidth = title.offsetWidth / 100;
        geo.textHeight = title.offsetHeight / 100;
        gsap.set(title, { left: geo.ox, top: geo.oy, fontSize: geo.startSize, xPercent: -50, yPercent: -50 });
      };
      measure();
      ScrollTrigger.addEventListener("refreshInit", measure);
      gsap.set(O, { svgOrigin: "769 475" });
      gsap.set(title, { autoAlpha: 0, scale: 0.97, y: 6 });
      const pose = { fontSize: geo.startSize, left: geo.ox, top: geo.oy };
      const fitTitle = () => {
        // Keep the whole text rectangle inside the circular counter, with breathing room.
        const revealY = Number(gsap.getProperty(title, "y")) || 0;
        const radius = Math.max(1, 96 * geo.scale * geo.portalScale * 0.92 - 4 - Math.abs(revealY));
        const diagonal = Math.hypot(geo.textWidth, geo.textHeight);
        const fontSize = Math.min(pose.fontSize, radius * 2 / diagonal);
        const halfDiagonal = diagonal * fontSize / 2;
        const dx = pose.left - geo.ox;
        const dy = pose.top - geo.oy;
        const distance = Math.hypot(dx, dy);
        const travel = Math.min(1, Math.max(0, radius - halfDiagonal) / (distance || 1));
        gsap.set(title, {
          fontSize,
          left: geo.ox + dx * travel,
          top: geo.oy + dy * travel,
        });
      };
      fitTitle();
      const z = { p: 0 };
      const zoom = () => {
        const stages = [1, 1.35, 2.2, geo.end];
        const i = Math.min(2, Math.floor(z.p));
        const scale = stages[i] * Math.pow(stages[i + 1] / stages[i], z.p - i);
        geo.portalScale = scale;
        gsap.set(O, { scale });
        backdrop.style.setProperty("--portal-r", `${96 * geo.scale * scale}px`);
      };
      const tl = gsap.timeline({ onUpdate: fitTitle, defaults: { ease: "none" }, scrollTrigger: {
        trigger: intro, start: "top top", end: () => `+=${spacer.offsetHeight}`,
        scrub: 0.8, invalidateOnRefresh: true, onRefresh: () => { zoom(); fitTitle(); },
      } });
      // The same artwork layers render from the first frame through the entire scroll.
      tl.to(el("[data-site-header]"), { backgroundColor: "rgba(244,233,220,0.94)", duration: 0.1 }, 0.4)
        .to(q("[data-reference-cue]"), { opacity: 0, y: 6, duration: 0.06 }, 0.06)
        .to(q("[data-reference-services], [data-reference-mobile-copy] [data-hero-services]"), { opacity: 0, y: 6, duration: 0.08 }, 0.06)
        .to(q("[data-reference-copy], [data-reference-mobile-copy] [data-hero-slogan]"), { opacity: 0, y: 8, duration: 0.1 }, 0.14)
        .to(el('[data-reference-letter="t"]'), { x: () => -hero.clientWidth / geo.scale, duration: 0.18, ease: "power2.inOut" }, 0.4)
        .to(el('[data-reference-letter="b"]'), { x: () => hero.clientWidth / geo.scale, duration: 0.18, ease: "power2.inOut" }, 0.4)
        .to(title, { autoAlpha: 1, scale: 1, y: 0, duration: 0.12 }, 0.6)
        .fromTo(pose, { fontSize: () => geo.startSize },
          { fontSize: () => geo.startSize * 2.2, duration: 0.13, ease: "power1.inOut" }, 0.72)
        .to(pose, { fontSize: () => geo.titleSize, duration: 0.15, ease: "power1.inOut" }, 0.85)
        .fromTo(pose, { left: () => geo.ox, top: () => geo.oy },
          { left: () => geo.titleX, top: () => geo.titleY, duration: mobile ? 0.18 : 0.22, ease: "power1.inOut" }, mobile ? 0.82 : 0.78)
        .to(z, { p: 1, duration: 0.1, onUpdate: zoom }, 0.65)
        .to(z, { p: 2, duration: 0.1, onUpdate: zoom }, 0.75)
        .to(z, { p: 3, duration: 0.15, onUpdate: zoom }, 0.85)
        .to(O.querySelectorAll("[data-reference-shadow]"), { opacity: 0.12, duration: 0.1 }, 0.75)
        .to(O.querySelectorAll("[data-reference-shadow]"), { opacity: 0.04, duration: 0.15 }, 0.85)
        // The two titles have identical type and position here. Switch ownership in the same paint,
        // then the heading belongs to the project area during normal scrolling (and reverses cleanly).
        .set(destinationTitle, { visibility: "visible" }, 1)
        .set(title, { visibility: "hidden" }, 1)
        .set(hero, { pointerEvents: "none" }, 1);
      q("[data-reference-piece]").forEach((piece) => {
        const node = piece as unknown as SVGGraphicsElement;
        const [x, y, width, height] = node.dataset.bounds!.split(",").map(Number);
        const box = { x, y, width, height };
        const depth = node.dataset.depth;
        const start = depth === "front" ? 0.06 : depth === "back" ? 0.24 : 0.19;
        const end = depth === "front" ? 0.38 : depth === "back" ? 0.48 : 0.44;
        const id = node.dataset.referencePiece;
        const dx = id === "gift" ? 0 : id === "cup" ? -80 : id === "spiral" ? 80 : box.x + box.width / 2 < 765 ? -100 : 100;
        const dy = id === "gift" ? 100 : id === "cup" ? -40 : id === "spiral" ? -50 : box.y + box.height / 2 < 470 ? -70 : 70;
        const destination = () => {
          const matrix = (art as unknown as SVGSVGElement).getScreenCTM()!;
          const parentY = node.dataset.referencePiece === "blue" ? geo.blueY : 0;
          const parentX = node.dataset.referencePiece === "blue" ? geo.blueX : 0;
          const viewport = hero.getBoundingClientRect();
          const minX = (viewport.left - matrix.e) / matrix.a - parentX;
          const minY = (viewport.top - matrix.f) / matrix.d - parentY;
          const maxX = minX + hero.clientWidth / matrix.a;
          const maxY = minY + hero.clientHeight / matrix.d;
          const tx = dx > 0 ? (maxX - box.x) / dx : dx < 0 ? (minX - box.x - box.width) / dx : Infinity;
          const ty = dy > 0 ? (maxY - box.y) / dy : dy < 0 ? (minY - box.y - box.height) / dy : Infinity;
          const travel = Math.max(0, Math.min(tx, ty)) + 0.15;
          return { x: dx * travel, y: dy * travel };
        };
        tl.to(piece, { x: () => destination().x, y: () => destination().y, duration: end - start }, start)
          .to(piece, { autoAlpha: 0, duration: (end - start) * 0.12 }, end - (end - start) * 0.12);
      });
      return () => { ScrollTrigger.removeEventListener("refreshInit", measure); };
    });
    const navigate = (hash: string, smooth: boolean) => {
      const target = document.getElementById(hash.slice(1));
      if (!target) return false;
      const after = el("[data-reference-after]");
      let y = 0;
      if (hash !== "#top" && after.contains(target)) {
        const offset = target.getBoundingClientRect().top - after.getBoundingClientRect().top;
        y = (root.classList.contains("tob-motion") ? spacer.offsetHeight : hero.offsetHeight) + offset - (el("[data-site-header]").offsetHeight + 16);
      }
      intro.querySelectorAll(".is-navigation-target").forEach((node) => node.classList.remove("is-navigation-target"));
      if (hash !== "#top") {
        target.classList.add("is-navigation-target");
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
