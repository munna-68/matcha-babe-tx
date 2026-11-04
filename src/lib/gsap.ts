"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGSAP() {
  if (registered || typeof window === "undefined") return;
  registered = true;
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
  // One house ease for everything: a soft expo-out. Plus an in-out for covers.
  CustomEase.create("babe", "0.22, 1, 0.36, 1");
  CustomEase.create("babeInOut", "0.76, 0, 0.24, 1");
  gsap.defaults({ ease: "babe", duration: 1.1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

registerGSAP();

/** Consistent durations across the site. */
export const DUR = { xs: 0.45, s: 0.7, m: 1.1, l: 1.5 } as const;

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Resolve once web fonts are ready (with a safety timeout). */
export function fontsReady(timeout = 1500): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return Promise.resolve();
  return Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((r) => setTimeout(r, timeout)),
  ]);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
