"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ScriptWrite, ScrollFill, TrackedLabel, RevealImage, CountUp, Stagger, Tilt } from "@/components/motion/primitives";
import { BrandImage } from "@/components/image/BrandImage";
import { ButtonLink } from "@/components/brand/Button";
import { HeartSticker, Mascot, Sparkle, Ornament, LimitedBadge, DemoTag } from "@/components/brand/Brand";
import { TransitionLink } from "@/components/motion/PageTransition";
import { BRAND, DROPS, HOW_IT_WORKS, MENU } from "@/data/mock";
import { useStore } from "@/lib/store";

const money = (n: number) => `$${n % 1 ? n.toFixed(2) : n}`;

// ───────────────────────────────────────────── Statement
export function Statement() {
  return (
    <section className="relative px-5 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1180px]">
        <TrackedLabel className="text-pink">Handcrafted to order</TrackedLabel>
        <ScrollFill className="serif mt-8 text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.08] tracking-[-0.015em] text-forest">
          Every cup starts the same way: organic ceremonial matcha, whisked the moment you order it — then poured over
          your milk, your foam, your sprinkles. Small batches, pop-up days, private parties, and a whole lot of love for
          the Valley.
        </ScrollFill>
        <div className="mt-10 flex items-center gap-5">
          <ScriptWrite className="text-[clamp(2rem,3.4vw,3.2rem)] text-kelly">xo, Matcha Babe</ScriptWrite>
          <HeartSticker letter="B" className="h-10 w-10 rotate-12" />
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────── This season feature
export function SeasonFeature() {
  return (
    <section className="relative overflow-hidden bg-blush-soft px-5 py-24 md:px-10 md:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream to-transparent" />
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-14 md:grid-cols-12">
        <div className="relative md:col-span-6">
          <RevealImage variant="inset" className="relative">
            <BrandImage slot="season-feature" className="rounded-[36px]" sizes="(min-width: 768px) 46vw, 100vw" />
          </RevealImage>
          <div className="absolute left-5 top-5"><LimitedBadge /></div>
          <div className="absolute -bottom-8 -right-3 rotate-[-8deg] rounded-full bg-paper px-6 py-4 shadow-[0_24px_60px_-30px_rgba(5,63,28,.45)] md:-right-10">
            <ScriptWrite className="text-4xl text-pink md:text-5xl">2 yrs of MB</ScriptWrite>
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <TrackedLabel className="text-pink">This season · Fall 2026</TrackedLabel>
          <SplitReveal as="h2" mode="lines" className="display mt-6 text-[clamp(3rem,6.4vw,6.4rem)] text-forest">
            Two years of <span data-kw className="text-pink">Babe.</span>
          </SplitReveal>
          <p className="serif mt-6 text-[clamp(1.4rem,2vw,1.9rem)] leading-snug text-forest/85">
            From Casa Vibra weekends to fall markets across the Valley — we&rsquo;re celebrating with a birthday-cake
            foam, pumpkin cream, horchata and more. <em className="text-pink">Limited time only.</em>
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 border-y border-forest/15 py-6">
            {[
              { n: 2, l: "years of pop-ups" },
              { n: 4, l: "fall markets" },
              { n: 6, l: "limited drinks" },
            ].map((s) => (
              <div key={s.l}>
                <CountUp to={s.n} className="display block text-[clamp(2.6rem,4.4vw,4rem)] text-forest" />
                <span className="label mt-1 block !text-[9.5px] text-forest/60">{s.l}</span>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <ButtonLink href="/menu?tab=seasonal" label="Fall Menu" cursor="Menu">See the fall menu</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────── Pinned horizontal fall menu
export function FallMenuScroller() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const { menuOn } = useStore();
  const items = MENU.filter((m) => m.category === "seasonal" && menuOn[m.id]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const dist = () => t.scrollWidth - window.innerWidth;
        const tween = gsap.to(t, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
          },
        });
        // inner parallax + card lift driven by the horizontal movement
        gsap.utils.toArray<HTMLElement>("[data-hcard]", t).forEach((card) => {
          const inner = card.querySelector("[data-img-inner]");
          if (inner)
            gsap.fromTo(inner, { xPercent: -8, scale: 1.18 }, {
              xPercent: 8, scale: 1.18, ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            });
          gsap.from(card, {
            yPercent: 14, rotate: 3, opacity: 0.2, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 100%", end: "left 62%", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: section, dependencies: [items.length], revertOnUpdate: true },
  );

  return (
    <section ref={section} className="relative overflow-hidden bg-forest text-cream md:h-screen">
      <div className="tiles pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div
        ref={track}
        className="no-scrollbar relative flex h-full snap-x snap-mandatory items-center gap-5 overflow-x-auto px-5 py-20 will-change-transform md:snap-none md:gap-8 md:overflow-visible md:px-10 md:py-0"
      >
        <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-center md:w-[36vw] md:pr-10">
          <TrackedLabel className="text-matcha-soft">Limited time only</TrackedLabel>
          <h2 className="display mt-6 text-[clamp(3.4rem,7.4vw,8rem)] text-cream">
            The Fall <span className="text-matcha">Menu</span>
          </h2>
          <p className="serif mt-6 max-w-sm text-2xl leading-snug text-cream/80">
            Six cups for the season. When they&rsquo;re gone, they&rsquo;re gone.
          </p>
          <p className="label mt-10 hidden items-center gap-3 text-cream/50 md:flex">
            Keep scrolling <span className="inline-block animate-[mb-nudge_1.6s_ease-in-out_infinite] motion-reduce:animate-none">→</span>
          </p>
          <style>{`@keyframes mb-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(8px)}}`}</style>
        </div>

        {items.map((m, i) => (
          <article key={m.id} data-hcard className="w-[72vw] shrink-0 snap-start sm:w-[46vw] md:w-[24vw]">
            <Tilt cursor="Order" className="relative">
              <TransitionLink href={`/order?item=${m.id}`} className="block" aria-label={`Pre-order ${m.name}`}>
                <BrandImage slot={m.slot} className="rounded-t-full rounded-b-[24px]" sizes="(min-width: 768px) 24vw, 72vw" />
              </TransitionLink>
            </Tilt>
            <div className="mt-5 flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-matcha-soft">0{i + 1}</span>
                <h3 className="display mt-1 text-[clamp(1.6rem,2vw,2.1rem)] leading-none">{m.name}</h3>
              </div>
              <span className="mt-4 text-right font-mono text-sm">
                {money(m.price)}
                <DemoTag className="ml-2 align-middle" />
              </span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-cream/70">{m.description}</p>
            <div className="mt-4">
              <LimitedBadge>{m.badge ?? "Limited time"}</LimitedBadge>
            </div>
          </article>
        ))}
        <div className="w-[6vw] shrink-0" />
      </div>
      <div className="absolute inset-x-10 bottom-8 hidden h-px bg-cream/15 md:block">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-pink" />
      </div>
    </section>
  );
}

// ───────────────────────────────────────────── Category entries
export function Categories() {
  const cats = [
    { n: "01", title: "Lattes", body: "OG Babe, Strawberry Cutie, Lavender Haze — iced, whisked to order, any milk.", slot: "latte-og-babe", href: "/menu?tab=lattes", cursor: "Explore" },
    { n: "02", title: "Bottles & bundles", body: "Round bottles, six-pack shots and ribbon-tied party favors.", slot: "bottle-signature", href: "/menu?tab=bottles", cursor: "Explore" },
    { n: "03", title: "Private events", body: "A matcha bar at your shower, studio class, birthday or office morning.", slot: "cat-events", href: "/order?type=event", cursor: "Book" },
  ] as const;
  return (
    <section className="px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SplitReveal as="h2" className="serif max-w-3xl text-[clamp(2.8rem,6vw,6rem)] leading-[0.95] tracking-[-0.02em]">
            Three ways to get your <span data-kw className="italic text-pink">matcha</span> fix.
          </SplitReveal>
          <p className="max-w-xs text-forest/70">Pick a lane — every one ends in a proper request she can say yes to.</p>
        </div>
        <Ornament className="my-12 text-forest" />
        <Stagger className="grid gap-6 md:grid-cols-3 md:gap-8">
          {cats.map((c, i) => (
            <div key={c.n} data-stagger className={i === 1 ? "md:mt-16" : ""}>
              <Tilt cursor={c.cursor}>
                <TransitionLink href={c.href} className="group block">
                  <BrandImage slot={c.slot} className={`${i === 1 ? "rounded-t-full" : "rounded-[30px]"} rounded-b-[30px]`} sizes="(min-width: 768px) 32vw, 100vw" />
                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <h3 className="display text-[clamp(2rem,2.8vw,2.8rem)] leading-none transition-colors duration-500 group-hover:text-pink">{c.title}</h3>
                    <span className="font-mono text-xs text-forest/50">{c.n}</span>
                  </div>
                  <p className="mt-3 max-w-sm text-forest/70">{c.body}</p>
                  <span className="label mt-5 inline-flex items-center gap-2 text-pink">
                    {c.cursor === "Book" ? "Plan an event" : "View the lineup"}
                    <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                  </span>
                </TransitionLink>
              </Tilt>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────── How it works (sticky stacked cards)
export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack]", ref.current);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.querySelector("[data-stack-inner]"), {
          scale: 0.9,
          yPercent: -4,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 18%", scrub: true },
        });
        gsap.to(card.querySelector("[data-stack-shade]"), {
          opacity: 0.4,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 18%", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  const tones = { paper: "bg-paper text-forest", matcha: "bg-matcha text-forest", blush: "bg-blush text-forest" } as const;
  const next = DROPS[0];

  return (
    <section ref={ref} className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1500px] gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <TrackedLabel className="text-pink">How it works</TrackedLabel>
            <SplitReveal as="h2" className="display mt-6 text-[clamp(3rem,5.4vw,5.6rem)]">
              Three steps. <span className="text-kelly">Zero DMs.</span>
            </SplitReveal>
            <p className="mt-6 max-w-sm text-forest/70">
              Ordering used to be a long DM thread. Now it&rsquo;s one tidy request — and she gets everything she needs
              the first time.
            </p>
            <div className="mt-8">
              <ButtonLink href="/order" cursor="Order">Start a pre-order</ButtonLink>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:col-span-8 md:col-start-5">
          {HOW_IT_WORKS.map((s, i) => (
            <div key={s.n} data-stack className="sticky" style={{ top: `calc(12vh + ${i * 22}px)` }}>
              <div data-stack-inner className={`relative origin-top overflow-hidden rounded-[36px] ${tones[s.tone]} p-7 shadow-[0_40px_80px_-50px_rgba(5,63,28,.55)] md:p-12`}>
                <div data-stack-shade className="pointer-events-none absolute inset-0 bg-forest opacity-0" />
                <div className="relative grid min-h-[56vh] gap-8 md:grid-cols-2 md:items-center">
                  <div>
                    <span className="display block text-[clamp(5rem,10vw,9rem)] leading-none opacity-90">{s.n}</span>
                    <h3 className="serif mt-4 text-[clamp(2.2rem,3.6vw,3.6rem)] leading-none">{s.title}</h3>
                    <p className="mt-4 max-w-sm text-[17px] leading-relaxed opacity-80">{s.body}</p>
                  </div>
                  <div className="relative">
                    {i === 0 && (
                      <ul className="space-y-3">
                        {DROPS.slice(0, 3).map((d, k) => (
                          <li key={d.id} className={`flex items-center gap-4 rounded-2xl p-4 ${k === 0 ? "bg-forest text-cream" : "bg-cream/70"}`}>
                            <span className="display w-12 text-3xl leading-none">{d.date.slice(8)}</span>
                            <span className="min-w-0">
                              <span className="label block !text-[9px] opacity-70">{d.day} · {d.time}</span>
                              <span className="block truncate font-medium">{d.title}</span>
                            </span>
                            {k === 0 && <Sparkle className="ml-auto h-4 w-4 shrink-0 text-pink" />}
                          </li>
                        ))}
                      </ul>
                    )}
                    {i === 1 && (
                      <RevealImage variant="wipe">
                        <BrandImage slot="packaging-bundle" className="rounded-[24px]" sizes="(min-width: 768px) 30vw, 90vw" />
                      </RevealImage>
                    )}
                    {i === 2 && (
                      <div className="relative mx-auto max-w-xs rounded-[28px] bg-forest p-6 text-cream">
                        <p className="label text-matcha-soft">At pick-up</p>
                        <p className="display mt-3 text-4xl leading-none">Scan 2 Pay</p>
                        <div className="mt-5 grid grid-cols-6 gap-1.5" aria-hidden>
                          {Array.from({ length: 36 }).map((_, k) => (
                            <span key={k} className={`aspect-square rounded-[3px] ${[0, 1, 2, 6, 8, 12, 13, 14, 4, 10, 16, 21, 22, 27, 29, 33, 35, 24, 19].includes(k) ? "bg-cream" : "bg-cream/10"}`} />
                          ))}
                        </div>
                        <p className="mt-5 text-sm text-cream/70">+1 stamp on your loyalty card</p>
                        <Mascot className="absolute -right-6 -top-10 h-24 w-auto rotate-12" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <p className="label pt-4 text-center text-forest/40">Next drop: {next.day} {next.date.slice(5).replace("-", "/")} · {next.title}</p>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────── Find us + loyalty
export function FindUs() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const stamps = gsap.utils.toArray<HTMLElement>("[data-stamp]", ref.current);
      if (prefersReducedMotion()) return;
      gsap.from(stamps, {
        scale: 0, rotate: -40, opacity: 0, duration: 0.6, stagger: 0.12, ease: "back.out(3)",
        scrollTrigger: { trigger: ref.current?.querySelector("[data-card]"), start: "top 75%", once: true },
      });
      ScrollTrigger.refresh();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative bg-paper px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1500px] gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <TrackedLabel className="text-pink">Where to find us</TrackedLabel>
          <SplitReveal as="h2" className="serif mt-6 text-[clamp(2.6rem,5vw,5rem)] leading-[0.95] tracking-[-0.02em]">
            Upcoming drops &amp; <span className="italic">pick-ups</span>
          </SplitReveal>
          <Stagger as="ul" className="mt-10 border-t border-forest/15">
            {DROPS.map((d) => (
              <li key={d.id} data-stagger>
                <TransitionLink
                  href={`/order?drop=${d.id}`}
                  data-cursor="Order"
                  className="group relative flex items-center gap-5 overflow-hidden border-b border-forest/15 py-5 md:gap-8 md:py-6"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-blush-soft transition-transform duration-700 ease-[var(--ease-babe)] group-hover:scale-y-100" />
                  <span className="relative w-16 shrink-0 md:w-24">
                    <span className="label block !text-[9.5px] text-forest/50">{d.day}</span>
                    <span className="display block text-[clamp(2rem,3.4vw,3.2rem)] leading-none">
                      {new Date(d.date + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block text-lg font-medium md:text-xl">
                      {d.title} {!d.real && <DemoTag className="ml-1 align-middle" />}
                    </span>
                    <span className="block truncate text-forest/60">{d.place} · {d.time}</span>
                  </span>
                  <span className="label relative hidden text-pink transition-transform duration-500 group-hover:-translate-x-1 md:block">Pre-order →</span>
                </TransitionLink>
              </li>
            ))}
          </Stagger>
          <p className="mt-6 text-sm text-forest/60">
            Pick-up addresses are shared when your order is confirmed. Holiday orders close <strong>Dec 19</strong>.
          </p>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <div className="md:sticky md:top-32">
            <div data-card className="relative rotate-[-3deg] rounded-[28px] bg-cream p-7 shadow-[0_40px_80px_-40px_rgba(5,63,28,.5)] ring-1 ring-forest/10">
              <div className="flex items-center justify-between">
                <span className="display text-2xl leading-[0.85] text-forest">MATCHA<br />BABE</span>
                <HeartSticker letter="M" className="h-10 w-10" />
              </div>
              <p className="display mt-6 text-3xl tracking-wide">LOYALTY CARD</p>
              <div className="mt-5 grid grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, k) => (
                  <span key={k} className="relative grid aspect-square place-items-center rounded-full border-2 border-dashed border-forest/30">
                    {k < 7 && (
                      <span data-stamp className="absolute inset-0 grid place-items-center rounded-full bg-forest text-cream">
                        <Mascot className="h-[70%] w-auto [&_*]:[stroke:var(--color-cream)]" />
                      </span>
                    )}
                    {k === 9 && <span className="font-mono text-[9px] font-medium tracking-wider text-pink">FREE</span>}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-center font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.12em] text-forest/80">{BRAND.loyalty}</p>
            </div>
            <p className="mt-10 text-forest/70">
              Pay at pick-up with <strong>Scan 2 Pay</strong>. Got a full card? Tick &ldquo;redeem my free latte&rdquo; when
              you pre-order and it&rsquo;s on us.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────── Closing CTA
export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden px-5 py-28 text-center md:px-10 md:py-44">
      <div className="tiles pointer-events-none absolute inset-0 opacity-[0.06]" />
      <HeartSticker letter="B" className="absolute left-[8%] top-[18%] h-16 w-16 -rotate-12 md:h-24 md:w-24" />
      <HeartSticker letter="M" className="absolute bottom-[16%] right-[9%] h-14 w-14 rotate-12 md:h-20 md:w-20" />
      <Sparkle className="absolute right-[22%] top-[14%] h-6 w-6 text-pink" />
      <div className="relative mx-auto max-w-5xl">
        <TrackedLabel className="text-pink">Your cup is waiting</TrackedLabel>
        <SplitReveal as="h2" className="display mt-8 text-[clamp(3.2rem,8.6vw,9rem)] text-forest">
          Skip the DMs. <span data-pill className="pill [--pill-bg:var(--color-matcha-soft)]">Pre-order</span> your matcha.
        </SplitReveal>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/order" cursor="Order">Start a pre-order</ButtonLink>
          <ButtonLink href="/order?type=event" variant="forest" arrow={false}>Plan a private event</ButtonLink>
        </div>
      </div>
    </section>
  );
}
