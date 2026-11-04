"use client";

import { useRef, type ReactNode, type HTMLAttributes, type ElementType } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, fontsReady, prefersReducedMotion, isFinePointer } from "@/lib/gsap";
import { onStage } from "@/lib/stage";

type Trigger = "scroll" | "stage";

/** Run `fn` either on scroll-into-view or when the stage opens. */
function useEntrance(
  ref: React.RefObject<HTMLElement | null>,
  setup: (el: HTMLElement) => void,
  play: (el: HTMLElement, st?: ScrollTrigger.Vars) => void,
  { trigger = "scroll", start = "top 85%" }: { trigger?: Trigger; start?: string } = {},
) {
  useGSAP(
    (_c, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      setup(el);
      const st = trigger === "scroll" ? { trigger: el, start, once: true } : undefined;
      const go = contextSafe(() => play(el, st));
      if (trigger === "stage") return onStage(go);
      go();
    },
    { scope: ref },
  );
}

// ───────────────────────────────────────────── ScriptWrite
/** Script accents "write themselves in": a left→right mask wipe with a slight lift. */
export function ScriptWrite({
  children, className = "", delay = 0, trigger = "scroll", duration = 1.5,
}: { children: ReactNode; className?: string; delay?: number; trigger?: Trigger; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEntrance(
    ref,
    (el) => gsap.set(el, { clipPath: "inset(-30% 100% -30% -6%)" }),
    (el, st) =>
      gsap.to(el, {
        clipPath: "inset(-30% -6% -30% -6%)",
        duration: prefersReducedMotion() ? 0.01 : duration,
        ease: "power2.inOut",
        delay,
        scrollTrigger: st,
      }),
    { trigger },
  );
  return (
    <span ref={ref} className={`script inline-block will-change-[clip-path] ${className}`}>
      {children}
    </span>
  );
}

// ───────────────────────────────────────────── ScrollFill
/** Big statement paragraph: words fill from pale to full ink as you scroll (opacity only). */
export function ScrollFill({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      let split: SplitText | undefined;
      let alive = true;
      fontsReady().then(() => {
        if (!alive) return;
        split = SplitText.create(el, {
          type: "words",
          wordsClass: "fill-word",
          autoSplit: true,
          onSplit(self) {
            if (prefersReducedMotion()) return;
            return gsap.fromTo(
              self.words,
              { opacity: 0.14 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.12,
                scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: 0.6 },
              },
            );
          },
        });
      });
      return () => {
        alive = false;
        split?.revert();
      };
    },
    { scope: ref },
  );
  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}

// ───────────────────────────────────────────── Marquee
/** Endless kinetic marquee that speeds up / reverses with scroll velocity. */
export function Marquee({
  items, className = "", itemClassName = "", separator, speed = 38,
}: { items: string[]; className?: string; itemClassName?: string; separator: ReactNode; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!track.current || !ref.current || prefersReducedMotion()) return;
      const tween = gsap.to(track.current, { xPercent: -50, repeat: -1, ease: "none", duration: speed });
      let dir = 1;
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          dir = self.direction;
          const boost = gsap.utils.clamp(0, 5, Math.abs(self.getVelocity()) / 400);
          gsap.to(tween, {
            timeScale: dir * (1 + boost),
            duration: 0.25,
            overwrite: true,
            onComplete: () => {
              gsap.to(tween, { timeScale: dir, duration: 1.4, ease: "power2.out" });
            },
          });
        },
      });
    },
    { scope: ref },
  );
  const row = (copy: number) => (
    <div className="flex shrink-0 items-center" aria-hidden={copy > 0}>
      {items.map((it, i) => (
        <span key={`${copy}-${i}`} className="flex items-center">
          <span className={itemClassName}>{it}</span>
          <span className="mx-[0.5em] inline-flex items-center">{separator}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div ref={ref} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────── CountUp
export function CountUp({
  to, from = 0, decimals = 0, prefix = "", suffix = "", className = "", duration = 1.8, trigger = "scroll",
}: { to: number; from?: number; decimals?: number; prefix?: string; suffix?: string; className?: string; duration?: number; trigger?: Trigger }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;
  useEntrance(
    ref,
    (el) => {
      el.textContent = fmt(from);
    },
    (el, st) => {
      const o = { v: from };
      gsap.to(o, {
        v: to,
        duration: prefersReducedMotion() ? 0.01 : duration,
        ease: "power3.out",
        scrollTrigger: st,
        onUpdate: () => {
          el.textContent = fmt(o.v);
        },
      });
    },
    { trigger },
  );
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {fmt(to)}
    </span>
  );
}

// ───────────────────────────────────────────── TrackedLabel
/**
 * Small tracked caps that "open up": characters start bunched toward the
 * centre and ease out to full tracking (transform-only letter-spacing).
 */
export function TrackedLabel({
  children, className = "", as: Tag = "span", trigger = "scroll", delay = 0,
}: { children: string; className?: string; as?: ElementType; trigger?: Trigger; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    (_c, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      let split: SplitText | undefined;
      let un = () => {};
      let alive = true;
      gsap.set(el, { autoAlpha: 0 });
      const go = contextSafe(() => {
        if (!alive) return;
        if (prefersReducedMotion()) {
          gsap.to(el, { autoAlpha: 1, duration: 0.6, delay });
          return;
        }
        split = SplitText.create(el, { type: "chars" });
        gsap.set(el, { autoAlpha: 1 });
        const mid = (split.chars.length - 1) / 2;
        gsap.from(split.chars, {
          x: (i: number) => (mid - i) * 5,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          delay,
          stagger: { each: 0.012, from: "center" },
          scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 92%", once: true } : undefined,
        });
      });
      fontsReady().then(() => {
        if (!alive) return;
        if (trigger === "stage") un = onStage(go);
        else go();
      });
      return () => {
        alive = false;
        un();
        split?.revert();
      };
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={`label inline-block ${className}`}>
      {children}
    </Tag>
  );
}

// ───────────────────────────────────────────── RevealImage
export type RevealVariant = "arch" | "curtain" | "wipe" | "inset" | "fade";
const CLIPS: Record<RevealVariant, [string, string]> = {
  arch: ["inset(100% 0% 0% 0% round 999px 999px 0px 0px)", "inset(0% 0% 0% 0% round 999px 999px 0px 0px)"],
  curtain: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
  wipe: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
  inset: ["inset(16% 16% 16% 16% round 28px)", "inset(0% 0% 0% 0% round 0px)"],
  fade: ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
};

/**
 * Wraps a <BrandImage>. The frame opens with a clip-path, the inner layer
 * scales 1.25 → 1, then drifts with subtle parallax while in view.
 */
export function RevealImage({
  children, variant = "inset", parallax = true, trigger = "scroll", delay = 0, className = "", duration = 1.6, start = "top 88%", ...rest
}: {
  children: ReactNode; variant?: RevealVariant; parallax?: boolean; trigger?: Trigger; delay?: number; className?: string; duration?: number; start?: string;
} & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    (_c, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      const frame = el.querySelector<HTMLElement>("[data-brand-img]");
      const inner = el.querySelector<HTMLElement>("[data-img-inner]");
      if (!frame || !inner) return;
      const reduced = prefersReducedMotion();
      const [from, to] = CLIPS[variant];

      if (reduced) {
        gsap.set(frame, { opacity: 0 });
      } else {
        gsap.set(frame, { clipPath: from, opacity: variant === "fade" ? 0 : 1 });
        gsap.set(inner, { scale: 1.25 });
      }
      const st = trigger === "scroll" ? { trigger: el, start, once: true } : undefined;
      const go = contextSafe(() => {
        if (reduced) {
          gsap.to(frame, { opacity: 1, duration: 0.8, delay, scrollTrigger: st });
          return;
        }
        const tl = gsap.timeline({ delay, scrollTrigger: st });
        tl.to(frame, { clipPath: to, opacity: 1, duration, ease: "expo.out" }, 0).to(
          inner,
          { scale: 1, duration: duration + 0.3, ease: "expo.out" },
          0,
        );
      });
      if (parallax && !reduced) {
        gsap.fromTo(
          inner,
          { yPercent: -5 },
          { yPercent: 5, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      }
      if (trigger === "stage") return onStage(go);
      go();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}

// ───────────────────────────────────────────── Stagger (batch reveal)
/** Children marked [data-stagger] rise in, batched as they enter. */
export function Stagger({
  children, className = "", as: Tag = "div", y = 70, deps = [], ...rest
}: { children: ReactNode; className?: string; as?: ElementType; y?: number; deps?: unknown[] } & HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-stagger]", ref.current);
      if (!items.length) return;
      const reduced = prefersReducedMotion();
      gsap.set(items, { opacity: 0, y: reduced ? 0 : y });
      ScrollTrigger.batch(items, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: reduced ? 0.6 : 1.2, ease: "babe", stagger: 0.09, overwrite: true }),
      });
      ScrollTrigger.refresh();
    },
    { scope: ref, dependencies: deps, revertOnUpdate: true },
  );
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

// ───────────────────────────────────────────── Tilt (hover)
/** Gentle 3D tilt + image zoom on hover (fine pointers only). */
export function Tilt({
  children, className = "", max = 5, cursor, ...rest
}: { children: ReactNode; className?: string; max?: number; cursor?: string } & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !isFinePointer() || prefersReducedMotion()) return;
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;
      gsap.set(el, { perspective: 900 });
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * max * 2);
        rx(-py * max * 2);
      };
      const enter = () => {
        const inner = el.querySelector("[data-img-inner] > *");
        if (inner) gsap.to(inner, { scale: 1.07, duration: 1, ease: "babe" });
      };
      const leave = () => {
        rx(0);
        ry(0);
        const inner = el.querySelector("[data-img-inner] > *");
        if (inner) gsap.to(inner, { scale: 1, duration: 1, ease: "babe" });
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className} data-cursor={cursor} {...rest}>
      {children}
    </div>
  );
}
