"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/** Jump to top instantly (used by route transitions while the screen is covered). */
export function scrollToTopNow() {
  if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.095, wheelMultiplier: 0.95, smoothWheel: true });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
  return null;
}
