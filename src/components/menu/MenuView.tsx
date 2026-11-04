"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { ButtonLink } from "@/components/brand/Button";
import { HeartSticker } from "@/components/brand/Brand";
import { PageHeader } from "@/components/site/PageHeader";
import { DrinkCard } from "./DrinkCard";
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
      const inners = cards.map((c) => c.querySelector("[data-img-inner]"));
      const tl = gsap.timeline({
        delay: first.current ? 0.3 : 0,
        scrollTrigger: first.current ? { trigger: grid.current, start: "top 85%", once: true } : undefined,
      });
      if (reduced) {
        tl.from(cards, { opacity: 0, duration: 0.5, stagger: 0.05 });
      } else {
        tl.from(cards, { y: 60, opacity: 0, duration: 1.1, stagger: 0.07, ease: "babe" }, 0)
          .from(inners, { scale: 1.2, duration: 1.5, stagger: 0.07, ease: "expo.out" }, 0);
      }
      first.current = false;
    },
    { scope: grid, dependencies: [tab], revertOnUpdate: true },
  );

  const items = MENU.filter((m) => m.category === tab);

  return (
    <>
      <PageHeader
        eyebrow="Fall 2026 menu"
        word="Menu"
        aside={<p className="text-[14px] text-forest/60">Prices are placeholders for this demo.</p>}
      >
        Organic ceremonial matcha, poured over ice and made the moment you order. Tap any drink to add it to a pre-order.
      </PageHeader>

      <section className="px-[var(--gutter)] pb-24 md:pb-32">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div ref={bar} role="tablist" aria-label="Menu categories" className="relative flex w-full max-w-lg rounded-full bg-milk p-1.5 shadow-[0_14px_40px_-26px_rgba(31,58,31,.5)]">
              <span ref={indicator} aria-hidden className="absolute inset-1.5 rounded-full bg-forest" style={{ clipPath: "inset(0px 66% 0px 0px round 999px)" }} />
              {TABS.map((t) => (
                <button
                  key={t}
                  role="tab"
                  data-tab={t}
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`relative z-10 flex-1 whitespace-nowrap rounded-full px-2 py-3 text-[13px] font-semibold transition-colors duration-500 sm:px-3 sm:text-[15px] ${tab === t ? "text-milk" : "text-forest/70 hover:text-forest"}`}
                >
                  {CATEGORY_META[t].label}
                </button>
              ))}
            </div>
            <p className="max-w-sm text-[16px] text-forest/70 md:text-right">{CATEGORY_META[tab].blurb}</p>
          </div>

          <div ref={grid} className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-16 md:gap-x-6 lg:grid-cols-3 lg:gap-y-14">
            {items.map((m) => (
              <article key={m.id} data-card>
                <DrinkCard item={m} on={menuOn[m.id]} />
              </article>
            ))}
          </div>

          <div className="mt-24 grid gap-5 md:mt-32 md:grid-cols-12">
            <div className="rounded-[28px] bg-milk p-7 md:col-span-4 md:p-9">
              <h2 className="display text-[1.9rem]">Make it yours</h2>
              <ul className="mt-6 space-y-3">
                {ADD_ONS.map((a) => (
                  <li key={a.name} className="flex items-baseline justify-between gap-3 border-b border-dashed border-forest/20 pb-3">
                    <span>{a.name}</span>
                    <span className="font-semibold tabular-nums">+{money(a.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[28px] bg-matcha-soft p-7 md:col-span-4 md:p-9">
              <h2 className="display text-[1.9rem]">Any milk</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {MILKS.map((m) => (
                  <span key={m} className="rounded-full bg-milk px-5 py-2.5 text-[16px] font-semibold">{m}</span>
                ))}
              </div>
              <p className="mt-6 text-forest/75">Every latte starts with organic ceremonial matcha. Sweetness is up to you: less, regular or extra.</p>
            </div>
            <div className="relative overflow-hidden rounded-[28px] bg-leaf p-7 text-milk md:col-span-4 md:p-9">
              <h2 className="display text-[1.9rem]">Throwing a party?</h2>
              <p className="mt-4 text-milk/80">Matcha bars and ribbon-tied favor bottles for showers, studios, birthdays and office mornings.</p>
              <div className="mt-8">
                <ButtonLink href="/order?type=event" variant="milk">Plan an event</ButtonLink>
              </div>
              <HeartSticker letter="B" className="absolute -right-3 -top-3 h-16 w-16 rotate-12" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
