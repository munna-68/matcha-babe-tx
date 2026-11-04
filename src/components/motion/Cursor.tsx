"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

/**
 * Custom cursor (desktop / fine pointers only).
 * - a small forest dot that tracks 1:1
 * - a blush disc that trails and grows into a label on [data-cursor="Label"]
 * Magnetic pull for [data-magnetic] lives here too, to share one listener.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!isFinePointer()) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detect pointer once on the client
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    const reduced = prefersReducedMotion();

    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: reduced ? 0.1 : 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: reduced ? 0.1 : 0.55, ease: "power3.out" });

    let current: string | null = null;
    let magnet: HTMLElement | null = null;

    const setState = (l: string | null, interactive: boolean) => {
      if (l === current && !interactive) return;
      current = l;
      setLabel(l ?? "");
      gsap.to(ring.current, {
        scale: l ? 1 : interactive ? 0.42 : 0.18,
        opacity: l ? 1 : interactive ? 0.55 : 0.35,
        duration: 0.5,
        ease: "babe",
      });
      gsap.to(dot.current, { scale: l ? 0 : 1, duration: 0.3, ease: "babe" });
    };

    const releaseMagnet = () => {
      if (!magnet) return;
      gsap.to(magnet, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.45)" });
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const t = e.target as HTMLElement | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      const interactive = !!t?.closest("a, button, input, select, textarea, label, [role=button]");
      setState(labelled?.dataset.cursor ?? null, interactive && !labelled);

      const m = t?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) releaseMagnet();
      if (m && !reduced) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const strength = Number(m.dataset.magnetic || 0.35);
        gsap.to(m, {
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    };
    const onLeave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    const onEnter = () => gsap.to(dot.current, { opacity: 1, duration: 0.3 });
    const onDown = () => gsap.to(ring.current, { scale: "*=0.85", duration: 0.2 });
    const onUp = () => setState(current, false);

    setState(null, false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[120] grid h-[92px] w-[92px] place-items-center rounded-full bg-blush text-forest will-change-transform"
        style={{ opacity: 0 }}
      >
        <span className="label !text-[0.62rem] !tracking-[0.18em]">{label}</span>
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[121] h-2 w-2 rounded-full bg-forest will-change-transform"
      />
    </>
  );
}
