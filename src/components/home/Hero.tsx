"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onStage } from "@/lib/stage";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ScriptWrite, TrackedLabel, RevealImage, Marquee } from "@/components/motion/primitives";
import { BrandImage } from "@/components/image/BrandImage";
import { ButtonLink } from "@/components/brand/Button";
import { HeartSticker, Mascot, Sparkle, SpinBadge, Badge } from "@/components/brand/Brand";
import { TransitionLink } from "@/components/motion/PageTransition";
import { BRAND, DROPS, FLAVOR_MARQUEE } from "@/data/mock";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const next = DROPS[0];

  useGSAP(
    (_c, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      const q = gsap.utils.selector(el);
      const reduced = prefersReducedMotion();
      const pops = q("[data-pop]");
      const fades = q("[data-fade]");
      gsap.set(pops, { scale: 0, rotate: -30 });
      gsap.set(fades, { opacity: 0, y: reduced ? 0 : 30 });

      const un = onStage(
        contextSafe(() => {
          gsap.to(fades, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, delay: 0.75, ease: "babe" });
          gsap.to(pops, { scale: 1, rotate: 0, duration: 1.1, stagger: 0.12, delay: 1.0, ease: "back.out(1.8)" });
        }),
      );

      if (!reduced) {
        // scroll parallax on stickers
        q("[data-speed]").forEach((s) => {
          const speed = Number((s as HTMLElement).dataset.speed);
          gsap.to(s, {
            yPercent: speed * -100,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
        });
        // the headline drifts up a touch slower than the page
        gsap.to(q("[data-hero-copy]"), {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      }
      return un;
    },
    { scope: ref },
  );

  return (
    <>
      <section ref={ref} className="relative overflow-hidden px-5 pb-14 pt-28 md:px-10 md:pb-20 md:pt-36">
        {/* soft matcha glow */}
        <div aria-hidden className="pointer-events-none absolute -right-[20vw] -top-[20vw] h-[70vw] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(200,217,156,.55),transparent)]" />
        <div className="relative mx-auto grid max-w-[1500px] items-end gap-12 md:grid-cols-12 md:gap-8">
          <div data-hero-copy className="relative z-10 md:col-span-7">
            <div data-hero>
              <TrackedLabel trigger="stage" className="text-forest/70">{`${BRAND.area} · Pop-ups & private events`}</TrackedLabel>
            </div>

            <div className="relative mt-6 md:mt-8">
              <SplitReveal
                as="h1"
                trigger="stage"
                data-hero
                className="serif text-[clamp(3.3rem,8.6vw,9.4rem)] leading-[0.9] tracking-[-0.025em] text-forest"
              >
                Organic ceremonial <span data-kw className="italic text-kelly">matcha,</span> handcrafted{" "}
                <span data-pill className="pill">to order.</span>
              </SplitReveal>
              <div className="pointer-events-none absolute -bottom-8 right-0 rotate-[-7deg] md:-bottom-6 md:right-[6%]">
                <ScriptWrite trigger="stage" delay={1.15} className="text-[clamp(2.2rem,4.4vw,4.2rem)] text-pink">
                  for the Babes
                </ScriptWrite>
              </div>
            </div>

            <p data-fade className="mt-14 max-w-md text-[17px] leading-relaxed text-forest/80 md:mt-16">
              Whisked fresh at pop-ups across the Rio Grande Valley — and now you can pre-order, skip the line,
              and book us for your next party without a single back-and-forth DM.
            </p>

            <div data-fade className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/order" cursor="Order">Pre-order a drink</ButtonLink>
              <ButtonLink href="/menu" variant="ghost" arrow={false}>See the menu</ButtonLink>
            </div>

            <TransitionLink
              href="/order"
              data-fade
              data-cursor="Order"
              className="group mt-10 flex max-w-md items-center gap-4 rounded-2xl border border-forest/12 bg-paper/70 p-3 pr-5 backdrop-blur transition-colors hover:border-pink/50"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-forest text-center text-cream">
                <span className="leading-none">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-matcha-soft">{next.day}</span>
                  <span className="display block text-xl">{next.date.slice(8)}</span>
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="label block !text-[9.5px] text-pink">Next drop</span>
                <span className="block truncate font-medium">{next.title} · {next.time}</span>
                <span className="block truncate text-sm text-forest/60">{next.place}</span>
              </span>
              <span className="text-xl transition-transform duration-500 group-hover:translate-x-1">→</span>
            </TransitionLink>
          </div>

          <div className="relative md:col-span-5">
            <RevealImage data-hero variant="arch" trigger="stage" delay={0.15} duration={1.8} className="relative mx-auto w-[86%] md:w-full">
              <BrandImage slot="home-hero" priority className="rounded-t-full rounded-b-[28px]" sizes="(min-width: 768px) 40vw, 86vw" />
            </RevealImage>

            <div data-pop className="absolute -left-2 bottom-[12%] h-28 w-28 text-forest md:-left-12 md:h-36 md:w-36">
              <div className="h-full w-full rounded-full bg-cream/90 p-1 shadow-[0_20px_50px_-25px_rgba(5,63,28,.5)] backdrop-blur">
                <SpinBadge text="Handcrafted to order ✦ Organic ceremonial ✦ " className="h-full w-full">
                  <Badge className="h-12 w-12 md:h-14 md:w-14" />
                </SpinBadge>
              </div>
            </div>
            <span data-speed="0.35" className="absolute -right-1 top-[8%] block md:-right-6">
              <span data-pop className="block"><HeartSticker letter="B" className="h-16 w-16 rotate-12 md:h-20 md:w-20" /></span>
            </span>
            <span data-speed="0.6" className="absolute right-[18%] top-[-3%] block">
              <span data-pop className="block"><HeartSticker letter="M" className="h-12 w-12 -rotate-12 md:h-14 md:w-14" /></span>
            </span>
            <span data-speed="0.2" className="absolute -right-2 bottom-[4%] block md:-right-10">
              <span data-pop className="block"><Mascot className="h-24 w-auto md:h-32" /></span>
            </span>
            <span data-speed="0.8" className="absolute left-[8%] top-[18%] block text-pink">
              <span data-pop className="block"><Sparkle className="h-6 w-6" /></span>
            </span>
          </div>
        </div>

        <div data-fade className="mx-auto mt-12 hidden max-w-[1500px] items-center justify-between md:flex">
          <span className="label text-forest/50">Scroll</span>
          <span className="relative mx-6 h-px flex-1 overflow-hidden bg-forest/15">
            <span className="absolute inset-y-0 left-0 w-1/4 animate-[mb-scan_2.4s_var(--ease-babe-io)_infinite] bg-forest motion-reduce:animate-none" />
          </span>
          <span className="label text-forest/50">{BRAND.handle}</span>
        </div>
        <style>{`@keyframes mb-scan{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}`}</style>
      </section>

      {/* crossing marquee bands */}
      <section aria-label="Flavors" className="relative z-10 -my-4 overflow-hidden py-10">
        <div className="-mx-4 rotate-[2.2deg] bg-pink py-3 text-paper">
          <Marquee
            items={["Handcrafted to order", "Organic ceremonial", "Pop-ups & private events", "For the Babes"]}
            itemClassName="label !text-[12px] !tracking-[0.26em]"
            separator={<Sparkle className="h-3 w-3 text-blush" />}
            speed={46}
          />
        </div>
        <div className="-mx-4 -mt-8 rotate-[-2.4deg] bg-forest py-5 text-cream shadow-[0_30px_60px_-30px_rgba(5,63,28,.6)] md:py-7">
          <Marquee
            items={FLAVOR_MARQUEE}
            itemClassName="display text-[clamp(2.2rem,5.4vw,5rem)] leading-none"
            separator={<HeartSticker letter="B" className="h-[0.9em] w-[0.9em] text-[clamp(2.2rem,5.4vw,5rem)]" />}
            speed={52}
          />
        </div>
      </section>
    </>
  );
}
