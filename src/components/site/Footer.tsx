"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TransitionLink } from "@/components/motion/PageTransition";
import { Mascot, HeartSticker, Sparkle } from "@/components/brand/Brand";
import { BRAND } from "@/data/mock";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const chars = ref.current?.querySelectorAll("[data-foot-char]");
      if (!chars?.length) return;
      gsap.from(chars, {
        yPercent: 100,
        rotate: (i: number) => (i % 2 ? 6 : -6),
        duration: 1.1,
        stagger: 0.04,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });
      gsap.to("[data-foot-mascot]", { y: -14, rotate: 4, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="relative overflow-hidden bg-forest text-cream">
      <div className="checker h-6 opacity-90 [--c1:var(--color-forest-deep)] [--c2:var(--color-kelly)] [--s:12px]" />
      <div className="mx-auto max-w-[1500px] px-5 pb-8 pt-16 md:px-10 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label text-matcha-soft">{BRAND.hello} 💚</p>
            <p className="serif mt-4 max-w-md text-3xl leading-tight md:text-4xl">
              {BRAND.tagline} <span className="italic text-blush">Pop-ups &amp; private events</span> across the Valley.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-4 md:col-start-7">
            <div>
              <p className="label mb-4 text-cream/50">Visit</p>
              <ul className="space-y-2 font-sans text-[15px]">
                {[["/", "Home"], ["/menu", "Menu"], ["/order", "Pre-order"], ["/gallery", "Gallery"]].map(([h, l]) => (
                  <li key={h}>
                    <TransitionLink href={h} className="transition-colors hover:text-blush">{l}</TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label mb-4 text-cream/50">Say hi</p>
              <ul className="space-y-2 font-sans text-[15px]">
                <li>
                  <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-blush">Instagram ↗</a>
                </li>
                <li><TransitionLink href="/order" className="transition-colors hover:text-blush">Private events</TransitionLink></li>
                <li><TransitionLink href="/dashboard" className="transition-colors hover:text-blush">Babe HQ</TransitionLink></li>
              </ul>
            </div>
          </div>
          <div className="relative hidden md:col-span-2 md:block">
            <Mascot className="absolute right-0 top-0 h-36 w-auto [&_*]:[stroke:var(--color-cream)]" style={{}} />
            <span data-foot-mascot className="absolute -right-2 top-28 block">
              <HeartSticker letter="B" className="h-12 w-12" />
            </span>
          </div>
        </div>

        <div className="relative mt-16 select-none md:mt-24" aria-hidden>
          <div className="display flex justify-between overflow-hidden text-[21vw] leading-[0.82] text-cream md:text-[19.5vw]">
            {"MATCHA".split("").map((c, i) => (
              <span key={i} data-foot-char className="inline-block">{c}</span>
            ))}
          </div>
          <div className="display -mt-[1vw] flex justify-between overflow-hidden text-[21vw] leading-[0.82] text-matcha md:text-[19.5vw]">
            {"BABE".split("").map((c, i) => (
              <span key={i} data-foot-char className="inline-block">{c}</span>
            ))}
            <span data-foot-char className="inline-block self-center text-pink">
              <Sparkle className="h-[9vw] w-[9vw]" />
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-cream/15 pt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-cream/50 md:flex-row">
          <span>{BRAND.handle} · {BRAND.area}</span>
          <span>Concept demo · placeholder images, prices &amp; data</span>
        </div>
      </div>
    </footer>
  );
}
