"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TransitionLink } from "@/components/motion/PageTransition";
import { Wordmark, HeartDoodle } from "@/components/brand/Brand";
import { ButtonLink } from "@/components/brand/Button";
import { BRAND, DROPS } from "@/data/mock";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const next = DROPS[0];
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const chars = ref.current?.querySelectorAll("[data-foot-word] [data-wm-char]");
      if (!chars?.length) return;
      gsap.from(chars, {
        yPercent: 60,
        rotate: (i: number) => (i % 2 ? 8 : -8),
        ease: "none",
        stagger: 0.04,
        scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom bottom", scrub: 0.6 },
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="relative overflow-hidden rounded-t-[36px] bg-forest text-milk md:rounded-t-[56px]">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pb-8 pt-16 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <HeartDoodle className="h-9 w-9 text-matcha-soft" />
            <p className="display mt-5 max-w-md text-[clamp(1.9rem,3vw,2.8rem)]">{BRAND.hello}. Organic ceremonial matcha, handcrafted to order.</p>
            <div className="mt-8">
              <ButtonLink href="/order" variant="milk">Pre-order a drink</ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-[16px] md:col-span-6 md:col-start-7 md:grid-cols-3">
            <div>
              <p className="mb-4 text-[13px] text-milk/50">Visit</p>
              <ul className="space-y-2.5">
                {[["/", "Home"], ["/menu", "Menu"], ["/order", "Pre-order"], ["/gallery", "Gallery"]].map(([h, l]) => (
                  <li key={h}><TransitionLink href={h} className="transition-colors hover:text-matcha-soft">{l}</TransitionLink></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[13px] text-milk/50">Say hi</p>
              <ul className="space-y-2.5">
                <li><a href={BRAND.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-matcha-soft">Instagram</a></li>
                <li><TransitionLink href="/order?type=event" className="transition-colors hover:text-matcha-soft">Private events</TransitionLink></li>
                <li><TransitionLink href="/dashboard" className="transition-colors hover:text-matcha-soft">Babe HQ</TransitionLink></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="mb-4 text-[13px] text-milk/50">Next pop-up</p>
              <p className="font-semibold">{next.title}</p>
              <p className="text-milk/70">{next.day}, {new Date(next.date + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {next.time}</p>
              <p className="text-milk/70">{next.place}</p>
            </div>
          </div>
        </div>

        <div data-foot-word aria-hidden className="mt-16 flex select-none justify-center overflow-hidden pb-[0.06em] text-matcha-soft md:mt-24">
          <Wordmark className="text-[19.5vw] md:text-[19vw]" />
        </div>

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-milk/15 pt-6 text-[13px] text-milk/55 md:flex-row">
          <span>{BRAND.handle} · {BRAND.area}</span>
          <span>Concept demo: placeholder images, prices and data</span>
        </div>
      </div>
    </footer>
  );
}
