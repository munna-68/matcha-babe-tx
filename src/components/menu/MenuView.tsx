"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TrackedLabel, Tilt, ScriptWrite } from "@/components/motion/primitives";
import { BrandImage } from "@/components/image/BrandImage";
import { TransitionLink } from "@/components/motion/PageTransition";
import { ButtonLink } from "@/components/brand/Button";
import { DemoTag, LimitedBadge, Ornament, HeartSticker, Sparkle } from "@/components/brand/Brand";
import { ADD_ONS, CATEGORY_META, MENU, MILKS, type MenuCategory } from "@/data/mock";
import { useStore } from "@/lib/store";

const TABS: MenuCategory[] = ["lattes", "seasonal", "bottles"];
const money = (n: number) => `$${n % 1 ? n.toFixed(2) : n}`;

export function MenuView() {
  const [tab, setTab] = useState<MenuCategory>("lattes");
  const { menuOn } = useStore();
  const bar = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // deep link: /menu?tab=seasonal
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab") as MenuCategory | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read deep link once
    if (t && TABS.includes(t)) setTab(t);
  }, []);

  // sliding pill indicator (clip-path only)
  useLayoutEffect(() => {
    const b = bar.current;
    const ind = indicator.current;
    if (!b || !ind) return;
    const place = (animate: boolean) => {
      const btn = b.querySelector<HTMLElement>(`[data-tab="${tab}"]`);
      if (!btn) return;
      const W = b.clientWidth;
      const l = btn.offsetLeft;
      const r = W - (btn.offsetLeft + btn.offsetWidth);
      gsap.to(ind, { clipPath: `inset(0px ${r}px 0px ${l}px round 999px)`, duration: animate && !prefersReducedMotion() ? 0.7 : 0, ease: "babe" });
    };
    place(!first.current);
    const ro = new ResizeObserver(() => place(false));
    ro.observe(b);
    return () => ro.disconnect();
  }, [tab]);

  // card entrance on every tab change
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", grid.current);
      const reduced = prefersReducedMotion();
      const frames = cards.map((c) => c.querySelector("[data-brand-img]"));
      const inners = cards.map((c) => c.querySelector("[data-img-inner]"));
      const tl = gsap.timeline({
        delay: first.current ? 0.3 : 0,
        scrollTrigger: first.current ? { trigger: grid.current, start: "top 85%", once: true } : undefined,
      });
      if (reduced) {
        tl.from(cards, { opacity: 0, duration: 0.5, stagger: 0.05 });
      } else {
        tl.from(cards, { y: 80, opacity: 0, duration: 1.1, stagger: 0.08, ease: "babe" }, 0)
          .from(frames, { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0px 0px)", duration: 1.3, stagger: 0.08, ease: "expo.out" }, 0)
          .from(inners, { scale: 1.25, duration: 1.6, stagger: 0.08, ease: "expo.out" }, 0);
      }
      first.current = false;
    },
    { scope: grid, dependencies: [tab], revertOnUpdate: true },
  );

  const items = MENU.filter((m) => m.category === tab);

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-10 pt-32 md:px-10 md:pt-44">
        <div className="mx-auto max-w-[1500px]">
          <TrackedLabel trigger="stage" className="text-pink">The menu · Fall 2026</TrackedLabel>
          <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SplitReveal as="h1" trigger="stage" data-hero className="display text-[clamp(3.6rem,10vw,10rem)] text-forest">
              Whisked <span data-kw className="text-kelly">to order.</span>
            </SplitReveal>
            <div className="max-w-sm pb-3">
              <ScriptWrite trigger="stage" delay={0.9} className="text-4xl text-pink">any milk, any day</ScriptWrite>
              <p className="mt-3 text-forest/70">
                Organic ceremonial matcha, poured over ice and made the moment you order. Tap any drink to add it to a pre-order.
              </p>
            </div>
          </div>

          <div className="sticky top-24 z-20 mt-12 md:top-28">
            <div ref={bar} role="tablist" aria-label="Menu categories" className="relative mx-auto flex w-full max-w-xl rounded-full bg-paper/85 p-1.5 shadow-[0_20px_50px_-30px_rgba(5,63,28,.5)] ring-1 ring-forest/10 backdrop-blur-md">
              <span ref={indicator} aria-hidden className="absolute inset-1.5 rounded-full bg-forest" style={{ clipPath: "inset(0px 66% 0px 0px round 999px)" }} />
              {TABS.map((t) => (
                <button
                  key={t}
                  role="tab"
                  data-tab={t}
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`relative z-10 flex-1 rounded-full px-3 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors duration-500 sm:text-[11.5px] ${tab === t ? "text-cream" : "text-forest/70 hover:text-forest"}`}
                >
                  {CATEGORY_META[t].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
            <p className="serif text-[clamp(1.6rem,2.4vw,2.3rem)] italic text-forest/85">{CATEGORY_META[tab].blurb}</p>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-forest/50">Prices are placeholders · demo</p>
          </div>

          <div ref={grid} className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {items.map((m, i) => {
              const on = menuOn[m.id];
              return (
                <article key={m.id} data-card className={`group ${i % 3 === 1 ? "lg:translate-y-14" : ""} ${on ? "" : "opacity-60"}`}>
                  <Tilt cursor={on ? "Order" : undefined} className="relative">
                    <TransitionLink href={on ? `/order?item=${m.id}` : "/menu"} aria-label={`Pre-order ${m.name}`} className="block">
                      <BrandImage slot={m.slot} className={`${i % 2 ? "rounded-t-full" : "rounded-t-[160px]"} rounded-b-[28px]`} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw" />
                    </TransitionLink>
                    <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-2">
                      {m.limited && <LimitedBadge>{m.badge ?? "Limited time"}</LimitedBadge>}
                      {!on && <span className="rounded-full bg-forest px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cream">Paused today</span>}
                    </div>
                  </Tilt>
                  <div className="mt-6 flex items-start justify-between gap-4">
                    <h2 className="display text-[clamp(1.9rem,2.4vw,2.5rem)] leading-[0.95] text-forest">{m.name}</h2>
                    <div className="shrink-0 pt-1 text-right">
                      <span className="font-mono text-base text-forest">{money(m.price)}</span>
                      {m.priceNote && <span className="block font-mono text-[10px] text-forest/50">{m.priceNote}</span>}
                      <DemoTag className="mt-1 text-forest" />
                    </div>
                  </div>
                  <p className="mt-3 max-w-sm text-forest/75">{m.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {m.notes.map((n) => (
                      <span key={n} className="rounded-full bg-matcha-mist px-3 py-1 text-[12.5px] text-forest/80">{n}</span>
                    ))}
                  </div>
                  {on ? (
                    <TransitionLink href={`/order?item=${m.id}`} className="label mt-5 inline-flex items-center gap-2 text-pink">
                      Add to pre-order <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                    </TransitionLink>
                  ) : (
                    <p className="label mt-5 text-forest/50">Back soon</p>
                  )}
                </article>
              );
            })}
          </div>

          <Ornament className="my-24 text-forest" />

          <div className="grid gap-10 md:grid-cols-3">
            <div className="rounded-[28px] bg-paper p-7 ring-1 ring-forest/10">
              <p className="label text-pink">Make it yours</p>
              <ul className="mt-5 space-y-3">
                {ADD_ONS.map((a) => (
                  <li key={a.name} className="flex items-baseline justify-between gap-3 border-b border-dashed border-forest/15 pb-3">
                    <span>{a.name}</span>
                    <span className="font-mono text-sm">+{money(a.price)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-forest/45">Demo prices</p>
            </div>
            <div className="rounded-[28px] bg-matcha-mist p-7">
              <p className="label text-pink">Milks</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {MILKS.map((m) => (
                  <span key={m} className="display rounded-full bg-paper px-5 py-2.5 text-xl text-forest">{m}</span>
                ))}
              </div>
              <p className="mt-6 text-forest/70">Every latte starts with organic ceremonial matcha. Sweetness is up to you: less, regular or extra.</p>
            </div>
            <div className="relative overflow-hidden rounded-[28px] bg-forest p-7 text-cream">
              <p className="label text-matcha-soft">Throwing a party?</p>
              <p className="display mt-4 text-4xl leading-[0.95]">Matcha bars &amp; favor bottles</p>
              <p className="mt-3 text-cream/70">Showers, studios, birthdays, office mornings.</p>
              <div className="mt-6">
                <ButtonLink href="/order?type=event" variant="pink" cursor="Book">Plan an event</ButtonLink>
              </div>
              <HeartSticker letter="B" className="absolute -right-3 -top-3 h-16 w-16 rotate-12" />
              <Sparkle className="absolute bottom-6 right-8 h-5 w-5 text-pink" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
