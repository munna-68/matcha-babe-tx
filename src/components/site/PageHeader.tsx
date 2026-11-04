"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onStage } from "@/lib/stage";
import { LeafShadow } from "@/components/brand/Brand";

const JIG: [number, number][] = [[-4, 0], [3, -0.03], [-2, 0.02], [3.5, -0.02], [-3, 0.03], [2, -0.01], [-3, 0.02], [3, 0]];

/**
 * Shared opening for inner pages — the hero's language in one line:
 * a tracked line, one giant bouncy word, a sentence, and a fact on the
 * right, over the same leaf-shadowed wall. Learn it once on the home
 * page, recognise it everywhere.
 */
export function PageHeader({
  eyebrow, word, children, aside, className = "",
}: { eyebrow: string; word: string; children?: ReactNode; aside?: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    (_c, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      const q = gsap.utils.selector(el);
      const chars = q("[data-ph-char]");
      const fades = q("[data-fade]");
      if (prefersReducedMotion()) {
        gsap.set(fades, { opacity: 0 });
        return onStage(contextSafe(() => gsap.to(fades, { opacity: 1, duration: 0.8 })));
      }
      gsap.set(chars, { yPercent: 115, rotate: 10 });
      gsap.set(fades, { opacity: 0, y: 24 });
      gsap.set(q("[data-ph-rule]"), { scaleX: 0 });
      return onStage(
        contextSafe(() => {
          gsap.timeline({ defaults: { ease: "expo.out" } })
            .to(chars, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.05, ease: "back.out(1.5)" }, 0.1)
            .to(fades, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.35)
            .to(q("[data-ph-rule]"), { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.2);
        }),
      );
    },
    { scope: ref },
  );

  return (
    <header ref={ref} className={`relative isolate overflow-hidden px-[var(--gutter)] pb-12 pt-32 md:pb-16 md:pt-40 ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <LeafShadow className="-right-[8vw] -top-[8vw] w-[44vw] -scale-x-100 rotate-[10deg]" />
      </div>
      <div className="mx-auto max-w-[1440px]">
        <p data-fade className="eyebrow text-forest/75">{eyebrow}</p>
        <div className="mt-5 grid items-end gap-8 md:grid-cols-12">
          <h1 className="puff min-w-0 overflow-hidden pb-[0.08em] text-[21vw] text-forest md:col-span-8 md:text-[clamp(6rem,13vw,13rem)]" aria-label={word}>
            <span aria-hidden className="flex">
              {word.split("").map((c, i) => {
                const [r, y] = JIG[i % JIG.length];
                return (
                  <span key={i} data-ph-char className="inline-block whitespace-pre">
                    <span className="inline-block" style={{ transform: `translateY(${y}em) rotate(${r}deg)` }}>{c}</span>
                  </span>
                );
              })}
            </span>
          </h1>
          <div className="flex flex-col gap-5 pb-[1.2vw] md:col-span-4">
            {children && <div data-fade className="max-w-sm text-[17px] text-forest/80">{children}</div>}
            {aside && <div data-fade>{aside}</div>}
          </div>
        </div>
        <div data-ph-rule className="mt-10 h-px origin-left bg-forest/25 md:mt-12" />
      </div>
    </header>
  );
}
