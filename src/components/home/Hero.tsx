"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onStage, introOwnsHeroWord } from "@/lib/stage";
import { BrandImage } from "@/components/image/BrandImage";
import { ButtonLink } from "@/components/brand/Button";
import { Wordmark, SpeedDashes, BrushUnderline, HeartDoodle, LeafShadow, Icon, SpinBadge, HeartSticker } from "@/components/brand/Brand";
import { TransitionLink } from "@/components/motion/PageTransition";
import { DROPS } from "@/data/mock";

const FEATURES = [
  { icon: "leaf", text: ["Organic", "ceremonial grade"] },
  { icon: "whisk", text: ["Whisked the", "moment you order"] },
  { icon: "heart", text: ["Pop-ups &", "private events"] },
] as const;

/**
 * HERO — rebuilt from the reference: tracked line, the giant bouncy
 * wordmark with speed dashes, a light tagline with a brush underline,
 * the pill, and three small promises. Right: her photo in an arch on a
 * leaf-green disc, with hand-drawn hearts. Sunlight-through-leaves
 * shadows drift across the wall.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const next = DROPS[0];
  const nextDate = new Date(next.date + "T12:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  useGSAP(
    (_c, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      const q = gsap.utils.selector(el);
      // (gsap.matchMedia nested in useGSAP recursed in Context.getTweens, so read the queries directly)
      const reduce = prefersReducedMotion();
      const desk = window.matchMedia("(min-width: 768px)").matches;
      const ownsWord = introOwnsHeroWord();
      const chars = q("[data-hero-word] [data-wm-char]");
      const fades = q("[data-fade]");
      const frame = q("[data-arch] [data-brand-img]")[0];
      const inner = q("[data-arch] [data-img-inner]")[0];
      const draws = q("[data-hero-draw] [data-draw]");

      if (reduce) {
        gsap.set(fades, { opacity: 0 });
        return onStage(contextSafe(() => gsap.to(fades, { opacity: 1, duration: 0.8, stagger: 0.05 })));
      }

      // initial states (set before first paint via layout effect)
      if (!ownsWord) gsap.set(chars, { yPercent: 115, rotate: 10 });
      gsap.set(fades, { opacity: 0, y: 28 });
      gsap.set(q("[data-dash]"), { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(draws, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(q("[data-disc]"), { scale: 0.4, opacity: 0 });
      gsap.set(frame, { clipPath: "inset(100% 0% 0% 0% round 999px 999px 36px 36px)" });
      gsap.set(inner, { scale: 1.35 });
      gsap.set(q("[data-pop]"), { scale: 0, rotate: -25 });

      const un = onStage(
        contextSafe(() => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          const t0 = ownsWord ? 0.05 : 0.15;
          tl.to(q("[data-disc]"), { scale: 1, opacity: 1, duration: 1.8 }, 0)
            .to(frame, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 36px 36px)", duration: 1.6 }, 0.1)
            .to(inner, { scale: 1, duration: 2.2 }, 0.1);
          if (!ownsWord) tl.to(chars, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.045, ease: "back.out(1.5)" }, t0);
          tl.to(q("[data-dash]"), { scaleX: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }, ownsWord ? 0.35 : 0.75)
            .to(fades, { opacity: 1, y: 0, duration: 1.1, stagger: 0.07 }, 0.3)
            .to(draws, { strokeDashoffset: 0, duration: 1.1, stagger: 0.15, ease: "power2.inOut" }, 0.8)
            .to(q("[data-pop]"), { scale: 1, rotate: 0, duration: 1, stagger: 0.1, ease: "back.out(1.8)" }, 0.9);
        }),
      );

      // scroll: the scene drifts apart as you leave it
      const st = { trigger: el, start: "top top", end: "bottom top", scrub: true } as const;
      gsap.to(q("[data-hero-copy]"), { yPercent: desk ? -22 : -8, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-arch-wrap]"), { yPercent: desk ? -10 : -4, ease: "none", scrollTrigger: st });
      gsap.to(inner, { yPercent: 7, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-disc-wrap]"), { yPercent: 14, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-leaves]"), { yPercent: -18, ease: "none", scrollTrigger: st });
      return un;
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      {/* light through leaves */}
      <div data-leaves aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <LeafShadow className="-left-[6vw] -top-[4vw] w-[46vw] rotate-[8deg]" />
        <LeafShadow className="right-[18vw] -top-[10vw] w-[34vw] -scale-x-100 rotate-[20deg]" />
        <LeafShadow className="-bottom-[8vw] -left-[10vw] w-[30vw] rotate-[-40deg] opacity-[0.08]" />
      </div>

      <div className="mx-auto grid min-h-[100dvh] max-w-[1440px] items-center gap-12 px-[var(--gutter)] pb-14 pt-32 md:grid-cols-12 md:gap-6 md:pb-16 md:pt-36">
        <div data-hero-copy className="relative z-10 min-w-0 md:col-span-7 lg:col-span-6">
          <p data-fade className="eyebrow text-forest/80">Organic ceremonial matcha</p>

          {/* font-size lives on the wrapper so the dashes can sit in em next to "BABE" */}
          <div className="relative mt-6 inline-block text-[20.5vw] md:mt-7 md:text-[clamp(5.5rem,10.4vw,10.25rem)]">
            <h1 data-hero-word className="relative text-forest">
              <Wordmark />
            </h1>
            <SpeedDashes className="absolute bottom-[0.14em] left-[3.42em] w-[0.5em] text-forest" />
          </div>

          <div data-fade className="relative mt-6 w-fit md:mt-8">
            <p className="text-[clamp(1.35rem,2.1vw,2rem)] font-normal tracking-[0.08em] text-forest/90 md:pl-[0.3em]">Handcrafted to order.</p>
            <span data-hero-draw className="block text-leaf/70">
              <BrushUnderline className="mt-1 h-3 w-[78%] md:ml-[0.4em]" />
            </span>
          </div>

          <div data-fade className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
            <ButtonLink href="/order">Pre-order a drink</ButtonLink>
            <ButtonLink href="/menu" variant="ghost" arrow={false}>See the menu</ButtonLink>
          </div>

          <ul className="mt-12 flex max-w-[34rem] items-stretch md:mt-16">
            {FEATURES.map((f, i) => (
              <li key={f.icon} data-fade className={`flex flex-1 flex-col items-center gap-2 px-2 text-center ${i ? "border-l border-forest/25" : ""}`}>
                <Icon name={f.icon} className="h-7 w-7 text-forest" />
                <span className="text-[13px] font-medium leading-tight text-forest/90 md:text-[14px]">
                  {f.text[0]}
                  <br />
                  {f.text[1]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* her photo in an arch */}
        <div className="relative md:col-span-5 lg:col-span-6">
          {/* field-green disc (the reference's arch) */}
          <div data-disc-wrap aria-hidden className="pointer-events-none absolute -z-10 left-[-4%] top-[16%] aspect-square w-[128%] md:left-[18%] md:top-[6%] md:w-[118%]">
            <div data-disc className="h-full w-full rounded-full bg-leaf" />
          </div>
          <div data-arch-wrap className="relative mx-auto w-[82%] max-w-[480px] md:mr-[11%] md:w-[min(30vw,calc(70vh*0.75))]">
            <div data-arch>
              <BrandImage slot="home-hero" priority className="rounded-t-full rounded-b-[36px] shadow-[0_50px_90px_-50px_rgba(21,42,22,.7)]" sizes="(min-width: 768px) 34vw, 82vw" />
            </div>

            <span data-hero-draw className="absolute -right-[14%] -top-[2%] block w-[20%] rotate-[14deg] text-milk md:-right-[24%]">
              <HeartDoodle className="w-full" />
            </span>
            <span data-hero-draw className="absolute -right-[20%] top-[17%] block w-[11%] -rotate-[10deg] text-milk/90 md:-right-[30%]">
              <HeartDoodle className="w-full" />
            </span>

            <div data-pop className="absolute -left-[16%] bottom-[16%] h-28 w-28 text-forest md:-left-[22%] md:h-36 md:w-36">
              <div className="h-full w-full rounded-full bg-milk p-1.5 shadow-[0_20px_50px_-25px_rgba(21,42,22,.6)]">
                <SpinBadge text="For the Babes · organic ceremonial · " className="h-full w-full">
                  <HeartSticker letter="M" className="h-11 w-11 md:h-14 md:w-14" />
                </SpinBadge>
              </div>
            </div>

            <TransitionLink
              href="/order"
              data-fade
              className="group absolute -bottom-6 right-[-4%] flex items-center gap-3 rounded-full bg-milk py-2.5 pl-3 pr-5 text-forest shadow-[0_20px_40px_-20px_rgba(21,42,22,.55)] md:right-[-10%]"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pink" />
              </span>
              <span className="leading-tight">
                <span className="block text-[12px] text-forest/60">Next pop-up · {nextDate}</span>
                <span className="block text-[14px] font-semibold">{next.title}, {next.place.split(",").pop()?.trim()}</span>
              </span>
              <Icon name="arrow" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
