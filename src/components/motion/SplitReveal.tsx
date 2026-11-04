"use client";

import { useRef, type ElementType, type ReactNode, type HTMLAttributes } from "react";
import { gsap, SplitText, useGSAP, fontsReady, prefersReducedMotion } from "@/lib/gsap";
import { onStage } from "@/lib/stage";

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  /** lines rise out of masks; words/chars stagger inside line masks */
  mode?: "lines" | "words" | "chars";
  /** "scroll": when it enters the viewport. "stage": after preloader / route transition. */
  trigger?: "scroll" | "stage";
  delay?: number;
  stagger?: number;
  start?: string;
};

/**
 * Headline reveal: SplitText line masks + per-character pop on any
 * descendant marked [data-kw]. Pink pills ([data-pill]) draw in after.
 * Content is fully visible without JS; reduced motion gets a plain fade.
 */
export function SplitReveal({
  as: Tag = "div", children, mode = "lines", trigger = "scroll", delay = 0, stagger, start = "top 86%", ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      let alive = true;
      let unStage = () => {};
      let split: SplitText | undefined;
      const pills = el.querySelectorAll("[data-pill]");
      const markPills = () => pills.forEach((p) => p.classList.add("is-in"));
      const st = trigger === "scroll" ? { trigger: el, start, once: true } : undefined;

      gsap.set(el, { autoAlpha: 0 });

      const go = contextSafe(() => {
        if (!alive) return;
        if (prefersReducedMotion()) {
          gsap.to(el, { autoAlpha: 1, duration: 0.8, delay, onStart: markPills, scrollTrigger: st });
          return;
        }
        const hasKw = !!el.querySelector("[data-kw]");
        const type = mode === "chars" || hasKw ? "lines,words,chars" : mode === "words" ? "lines,words" : "lines";
        split = SplitText.create(el, {
          type,
          mask: "lines",
          linesClass: "split-line",
          charsClass: "split-char",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { autoAlpha: 1 });
            const targets = mode === "chars" ? self.chars : mode === "words" ? self.words : self.lines;
            const tl = gsap.timeline({ delay, scrollTrigger: st, onStart: markPills });
            tl.from(targets, {
              yPercent: 118,
              rotate: mode === "lines" ? 2.5 : 0,
              transformOrigin: "0% 100%",
              duration: mode === "chars" ? 0.9 : 1.15,
              stagger: stagger ?? (mode === "lines" ? 0.09 : mode === "words" ? 0.04 : 0.022),
              ease: "babe",
            });
            if (hasKw) {
              const kw = el.querySelectorAll("[data-kw] .split-char");
              tl.from(kw, { yPercent: 70, rotate: 12, opacity: 0, duration: 0.8, stagger: 0.035, ease: "back.out(2.2)" }, 0.3);
            }
            return tl;
          },
        });
      });

      fontsReady().then(() => {
        if (!alive) return;
        if (trigger === "stage") unStage = onStage(go);
        else go();
      });

      return () => {
        alive = false;
        unStage();
        split?.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
