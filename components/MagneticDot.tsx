"use client";
import { useEffect, useRef } from "react";

// The full stop of TOB, run by a small physics loop: it falls from the top of the screen and lands
// in place, stretches while moving and squashes on impact, can be grabbed and thrown (it bounces off
// the screen edges and rolls home), hops when clicked and edges away from a nearby cursor.
const G = 4200; // gravity, px/s²
const FLOOR_E = 0.55; // restitution against the floor
const WALL_E = 0.6; // restitution against the screen edges
const HOP = 1100; // click hop speed, px/s
const SQ_K = 900, SQ_C = 21; // squash spring: ~0.2s jiggle, settles in a few wobbles

export default function MagneticDot() {
  const home = useRef<HTMLSpanElement>(null);
  const ball = useRef<HTMLSpanElement>(null);
  const shadow = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const h = home.current, b = ball.current, sh = shadow.current;
    if (!h || !b || !sh) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      h.classList.remove("dot-wait");
      return;
    }
    const fine = matchMedia("(pointer: fine)").matches;

    let x = 0, y = 0, vx = 0, vy = 0; // offset from the resting spot, px
    let q = 0, qv = 0; // squash amount (+ flat, − tall) and its velocity
    let fx = 0, tfx = 0; // cursor-shy offset and its target
    let w = 0, homeL = 0, homeT = 0;
    let dragging = false, thrown = false, raf = 0, last = 0;
    let gx = 0, gy = 0, downT = 0, moved = 0, lastMoveT = 0, lastPX = 0, lastPY = 0;

    const measure = () => {
      const r = h.getBoundingClientRect();
      w = r.width;
      homeL = r.left;
      homeT = r.top;
    };

    const render = () => {
      const lift = Math.max(0, -y) / w; // height above the floor, in ball widths
      const s = dragging || y >= 0 ? 0 : Math.min(Math.hypot(vx, vy) / 20000, 0.12);
      const a = Math.atan2(-vx, vy);
      const sq = Math.max(-0.12, Math.min(0.25, q));
      // squash pivots on the contact point; the stretch runs along the direction of travel
      b.style.transform =
        `translate(${x + fx}px, ${y + (w * sq) / 2}px) scale(${1 + sq}, ${1 - sq}) ` +
        `rotate(${a}rad) scale(${1 - s * 0.6}, ${1 + s}) rotate(${-a}rad)`;
      const k = 1 / (1 + lift * 0.35);
      sh.style.transform = `translateX(calc(-50% + ${x + fx}px)) scale(${k * (1 + sq * 0.6)})`;
      sh.style.opacity = String(k ** 1.5);
      sh.style.filter = `blur(calc(0.011em + ${(1 - k) * w * 0.25}px))`;
    };

    const step = (dt: number) => {
      if (!dragging) {
        vy += G * dt;
        const grounded = y >= 0 && vy >= 0;
        // on the floor it rolls home on a slightly underdamped spring; in the air, light drag
        if (grounded) vx += (-x * 30 - vx * 9) * dt;
        else vx *= 1 - 0.15 * dt;
        x += vx * dt;
        y += vy * dt;
        if (y > 0) {
          y = 0;
          if (vy > 80) {
            qv += Math.min(vy, 3500) * 0.0027;
            vy = -vy * FLOOR_E;
          } else vy = 0;
        }
        // the edges only count once it has been thrown (the opening drop starts above the screen)
        if (thrown) {
          const minX = -homeL, maxX = innerWidth - homeL - w, minY = -homeT;
          if (x < minX) { x = minX; vx = -vx * WALL_E; }
          if (x > maxX) { x = maxX; vx = -vx * WALL_E; }
          if (y < minY) { y = minY; vy = -vy * WALL_E; }
        }
      }
      qv += (-q * SQ_K - qv * SQ_C) * dt;
      q += qv * dt;
      const atHome = !dragging && y === 0 && vy === 0 && Math.abs(x) < w;
      if (!atHome) tfx = 0;
      fx += (tfx - fx) * Math.min(1, dt * 10);
    };

    const resting = () =>
      !dragging && y === 0 && vy === 0 && Math.abs(x) < 0.3 && Math.abs(vx) < 3 &&
      Math.abs(q) < 0.002 && Math.abs(qv) < 0.02 && Math.abs(fx - tfx) < 0.1;

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 1 / 30);
      last = t;
      step(dt);
      if (resting()) {
        x = vx = q = qv = 0;
        fx = tfx;
        thrown = false;
        render();
        raf = 0;
        return;
      }
      render();
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      b.setPointerCapture(e.pointerId);
      measure();
      x += fx;
      fx = tfx = 0;
      gx = e.clientX - (homeL + x);
      gy = e.clientY - (homeT + y);
      dragging = true;
      downT = lastMoveT = performance.now();
      lastPX = e.clientX;
      lastPY = e.clientY;
      moved = 0;
      vx = vy = 0;
      wake();
    };
    const onDrag = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dt = Math.max((now - lastMoveT) / 1000, 1 / 240);
      const nx = e.clientX - homeL - gx;
      const ny = Math.min(0, e.clientY - homeT - gy); // can't be pushed through the floor
      vx = vx * 0.4 + ((nx - x) / dt) * 0.6;
      vy = vy * 0.4 + ((ny - y) / dt) * 0.6;
      moved += Math.hypot(e.clientX - lastPX, e.clientY - lastPY);
      lastPX = e.clientX;
      lastPY = e.clientY;
      lastMoveT = now;
      x = nx;
      y = ny;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      thrown = true;
      const now = performance.now();
      if (moved < 6 && now - downT < 300) {
        vx = 0;
        vy = Math.min(vy, 0) - HOP; // a click: hop in place
      } else if (now - lastMoveT > 80) {
        vx = vy = 0; // held still before letting go: just drop
      } else {
        const sp = Math.hypot(vx, vy), cap = 5000;
        if (sp > cap) { vx *= cap / sp; vy *= cap / sp; }
      }
      wake();
    };

    // shy: edges sideways away from a nearby cursor while it sits in its spot. Measured from the
    // resting spot, not the moving ball, so it can't chase its own offset, and it fades to zero over
    // the centre so the direction never snaps from one side to the other (that jittered).
    const onHover = (e: PointerEvent) => {
      if (dragging || e.pointerType !== "mouse") return;
      const dx = e.clientX - (homeL + w / 2);
      const dy = e.clientY - (homeT + w / 2);
      const d = Math.hypot(dx, dy), reach = w * 3;
      const nt = d < reach ? -dx * (1 - d / reach) * 0.53 : 0; // peaks at ~0.4 ball widths
      if (Math.abs(nt - tfx) > 0.1) { tfx = nt; wake(); }
    };

    measure();
    let timer = 0;
    // if hydration came late, the CSS fallback has already shown the ball at rest: skip the drop
    if (performance.now() < 2400) {
      timer = window.setTimeout(() => {
        measure();
        y = -Math.max(homeT + w * 1.5, w * 4);
        render();
        h.classList.remove("dot-wait");
        wake();
      }, 900);
    } else h.classList.remove("dot-wait");

    b.addEventListener("pointerdown", onDown);
    b.addEventListener("pointermove", onDrag);
    b.addEventListener("pointerup", onUp);
    b.addEventListener("pointercancel", onUp);
    if (fine) window.addEventListener("pointermove", onHover, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
      b.removeEventListener("pointerdown", onDown);
      b.removeEventListener("pointermove", onDrag);
      b.removeEventListener("pointerup", onUp);
      b.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onHover);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, []);

  return (
    <span ref={home} aria-hidden className="dot-wait relative ml-[0.05em] inline-block w-[0.3em] align-baseline">
      {/* floor shadow stays on the ground; it follows the ball sideways and shrinks, fades and blurs as it rises */}
      <span ref={shadow} className="dot-shadow" />
      <span className="block translate-y-[0.02em]">
        <span
          ref={ball}
          data-cursor
          className="tobs-dot block aspect-square w-full touch-none select-none rounded-full will-change-transform"
        />
      </span>
    </span>
  );
}
