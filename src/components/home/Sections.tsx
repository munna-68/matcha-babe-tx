"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, SplitText, fontsReady } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Stagger } from "@/components/motion/primitives";
import { BrandImage } from "@/components/image/BrandImage";
import { ButtonLink } from "@/components/brand/Button";
import { HeartSticker, HeartDoodle, Icon, LimitedBadge, Wordmark, Mascot, Sparkle } from "@/components/brand/Brand";
import { TransitionLink } from "@/components/motion/PageTransition";
import { DrinkCard } from "@/components/menu/DrinkCard";
import { BRAND, DROPS, GALLERY, MENU } from "@/data/mock";
import type { SlotId } from "@/data/images";
import { useStore } from "@/lib/store";

const money = (n: number) => `$${n % 1 ? n.toFixed(2) : n}`;
const shortDate = (iso: string) => new Date(iso + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** Section heading: the reference's tracked line + a display heading. */
function Head({ eyebrow, children, className = "", center = false, light = false }: { eyebrow?: string; children: React.ReactNode; className?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={`${center ? "flex flex-col items-center text-center" : ""} ${className}`}>
      {eyebrow && <p className={`eyebrow ${light ? "text-milk/75" : "text-forest/70"}`}>{eyebrow}</p>}
      <SplitReveal as="h2" className={`display mt-5 text-[clamp(2.6rem,5.6vw,5.4rem)] ${light ? "text-milk" : "text-forest"}`}>
        {children}
      </SplitReveal>
    </div>
  );
}

/** Small round photo that sits inside a sentence. */
function Pill({ slot, rot = 0 }: { slot: SlotId; rot?: number }) {
  return (
    <span data-pill-photo className="relative top-[-0.06em] mx-[0.12em] inline-block h-[0.86em] w-[1.7em] overflow-hidden rounded-full align-middle" style={{ rotate: `${rot}deg` }}>
      <BrandImage slot={slot} fill bleed={false} className="h-full w-full" sizes="120px" />
    </span>
  );
}

// ───────────────────────────────────────────── Intro statement (centred)
export function Statement() {
  const ref = useRef<HTMLElement>(null);
  const para = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const p = para.current;
      if (!p || prefersReducedMotion()) return;
      let split: SplitText | undefined;
      let alive = true;
      // Split first, then grab the pills: SplitText rebuilds the nodes, so
      // anything targeted before the split would be animating detached copies.
      fontsReady().then(() => {
        if (!alive) return;
        split = SplitText.create(p, { type: "words", wordsClass: "fill-word" });
        gsap.fromTo(split.words, { opacity: 0.16 }, {
          opacity: 1, ease: "none", stagger: 0.12,
          scrollTrigger: { trigger: p, start: "top 78%", end: "bottom 45%", scrub: 0.6 },
        });
        gsap.fromTo(p.querySelectorAll("[data-pill-photo]"), { scale: 0 }, {
          scale: 1, duration: 0.9, stagger: 0.2, ease: "back.out(2)",
          scrollTrigger: { trigger: p, start: "top 75%", once: true },
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
    <section ref={ref} className="relative px-[var(--gutter)] py-28 md:py-44">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center text-center">
        <HeartDoodle className="h-10 w-10 text-leaf" />
        <div ref={para} className="display mt-8 text-[clamp(1.9rem,4.3vw,4.1rem)] leading-[1.12] text-forest">
          Organic ceremonial matcha <Pill slot="latte-og-babe" rot={-4} />, whisked the moment you order it and poured over your milk, your foam,
          your sprinkles <Pill slot="season-birthday-cake" rot={5} />. Find us at pop-ups across the Valley <Pill slot="cat-events" rot={-3} /> or
          pre-order and skip the line.
        </div>
        <p className="mt-10 text-[15px] text-forest/65">{BRAND.hello} · {BRAND.area}</p>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────── Signature line-up
export function Signatures() {
  const { menuOn } = useStore();
  const items = MENU.filter((m) => m.category === "lattes" && menuOn[m.id]);
  return (
    <section className="px-[var(--gutter)] pb-28 md:pb-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Head eyebrow="The everyday line-up">Pick your Babe.</Head>
          <div className="flex max-w-sm flex-col items-start gap-5 md:items-end md:text-right">
            <p className="text-[17px] text-forest/75">Six iced lattes, whisked to order. Any milk, any sweetness.</p>
            <ButtonLink href="/menu" variant="ghost">Full menu</ButtonLink>
          </div>
        </div>

        <Stagger className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-20 md:gap-x-6 lg:grid-cols-3 lg:gap-y-14">
          {items.map((m) => (
            <article key={m.id} data-stagger>
              <DrinkCard item={m} />
            </article>
          ))}
        </Stagger>
        <p className="mt-10 text-[13px] text-forest/50">Prices are placeholders for this demo.</p>
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
      if (prefersReducedMotion() || !window.matchMedia("(min-width: 768px)").matches) return;
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
      gsap.utils.toArray<HTMLElement>("[data-hcard]", t).forEach((card, i) => {
        gsap.from(card, {
          yPercent: i % 2 ? 10 : -6, rotate: i % 2 ? 4 : -4, ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 100%", end: "left 55%", scrub: true },
        });
      });
    },
    { scope: section, dependencies: [items.length], revertOnUpdate: true },
  );

  return (
    <section ref={section} className="relative overflow-hidden bg-leaf text-milk md:h-[100dvh]">
      <div className="tiles pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div ref={track} className="no-scrollbar relative flex h-full snap-x snap-mandatory scroll-px-[var(--gutter)] items-center gap-5 overflow-x-auto px-[var(--gutter)] py-20 md:snap-none md:gap-8 md:overflow-visible md:py-0">
        <div className="flex w-[80vw] shrink-0 snap-start flex-col justify-center md:w-[34vw] md:pr-8">
          <p className="eyebrow text-milk/75">Limited for fall</p>
          <h2 className="display mt-5 text-[clamp(3rem,6.4vw,6.6rem)]">Here for a little while.</h2>
          <p className="mt-6 max-w-sm text-[18px] text-milk/80">Six cups for the season, including our second-birthday Birthday Cake Babe. When they&rsquo;re gone, they&rsquo;re gone.</p>
          <div className="mt-8">
            <ButtonLink href="/menu?tab=seasonal" variant="milk">See the fall menu</ButtonLink>
          </div>
        </div>

        {items.map((m) => (
          <article key={m.id} data-hcard className="w-[70vw] shrink-0 snap-start sm:w-[44vw] md:w-[23vw]">
            <TransitionLink href={`/order?item=${m.id}`} className="group block" aria-label={`Pre-order ${m.name}`}>
              <div className="relative overflow-hidden rounded-t-full rounded-b-[28px] bg-milk p-2.5">
                <BrandImage slot={m.slot} className="rounded-t-full rounded-b-[20px]" sizes="(min-width: 768px) 23vw, 70vw" />
                <div className="absolute bottom-6 left-6">{m.badge && <LimitedBadge>{m.badge}</LimitedBadge>}</div>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-3">
                <h3 className="display text-[clamp(1.5rem,1.9vw,2rem)]">{m.name}</h3>
                <span className="shrink-0 font-semibold tabular-nums">{money(m.price)}</span>
              </div>
              <p className="mt-2 text-[15px] text-milk/75">{m.description}</p>
            </TransitionLink>
          </article>
        ))}
        <div className="w-[4vw] shrink-0" />
      </div>
      <div className="absolute inset-x-[var(--gutter)] bottom-8 hidden h-[3px] overflow-hidden rounded-full bg-milk/15 md:block">
        <div ref={bar} className="h-full origin-left scale-x-0 rounded-full bg-milk" />
      </div>
    </section>
  );
}

// ───────────────────────────────────────────── How it works (sticky stacked cards)
const STEPS = [
  { n: "1", title: "Pick a pop-up or a pick-up day", body: "Choose where you'll grab your drinks. Throwing a party instead? Tell us about your event.", slot: "cat-events", tone: "bg-milk" },
  { n: "2", title: "Build your order", body: "Drinks, milk, sweetness and notes in one request. She gets everything the first time, so there's no DM back-and-forth.", slot: "latte-strawberry-cutie", tone: "bg-matcha-soft" },
  { n: "3", title: "Skip the line", body: "Your order is ready when you arrive. Scan 2 Pay at the table, collect your loyalty stamp, sip.", slot: "packaging-bundle", tone: "bg-blush" },
] as const;

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack]", ref.current);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const st = { trigger: next, start: "top bottom", end: "top 20%", scrub: true };
        gsap.to(card.querySelector("[data-stack-inner]"), { scale: 0.93, ease: "none", scrollTrigger: st });
        gsap.to(card.querySelector("[data-stack-shade]"), { opacity: 0.18, ease: "none", scrollTrigger: st });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative px-[var(--gutter)] py-28 md:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <Head eyebrow="How pre-orders work">Three steps. Zero DMs.</Head>
            <p className="mt-6 max-w-sm text-[17px] text-forest/75">
              Ordering used to mean a long DM thread. Now it&rsquo;s one tidy request she can say yes to.
            </p>
            <div className="mt-8">
              <ButtonLink href="/order">Start a pre-order</ButtonLink>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:col-span-8">
          {STEPS.map((s, i) => (
            <div key={s.n} data-stack className="sticky" style={{ top: `calc(14vh + ${i * 24}px)` }}>
              <div data-stack-inner className={`relative origin-top overflow-hidden rounded-[32px] ${s.tone} p-6 md:p-10`}>
                <div data-stack-shade className="pointer-events-none absolute inset-0 z-10 bg-forest opacity-0" />
                <div className="grid items-center gap-8 md:min-h-[52vh] md:grid-cols-[1.1fr_1fr]">
                  <div>
                    <span className="puff block text-[clamp(4.5rem,8vw,7.5rem)] text-forest">{s.n}</span>
                    <h3 className="display mt-4 text-[clamp(1.8rem,2.8vw,2.7rem)]">{s.title}</h3>
                    <p className="mt-4 max-w-md text-[17px] text-forest/75">{s.body}</p>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] md:aspect-[4/5]">
                    <BrandImage slot={s.slot} fill className="h-full w-full" sizes="(min-width: 768px) 30vw, 90vw" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────── Loyalty card (centred, stamps on scroll)
export function Loyalty() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const stamps = q("[data-stamp]");
      const free = q("[data-free]");
      const back = q("[data-card-back]");
      gsap.set(back, { rotate: 6, xPercent: 4, yPercent: -17 });
      if (prefersReducedMotion()) return;
      gsap.set(stamps, { scale: 0, rotate: -35 });
      gsap.set(free, { scale: 0.4, opacity: 0 });
      const desk = window.matchMedia("(min-width: 768px)").matches;
      const tl = gsap.timeline({
        scrollTrigger: desk
          ? { trigger: el, start: "top top", end: "+=110%", pin: true, scrub: 0.6 }
          : { trigger: q("[data-card]")[0], start: "top 70%", once: true },
      });
      tl.from(back, { rotate: 0, xPercent: 0, yPercent: 0, duration: 1, ease: "power2.out" }, 0)
        .to(stamps, { scale: 1, rotate: 0, duration: 0.5, stagger: 0.35, ease: "back.out(2.6)" }, 0.4)
        .to(free, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(3)" }, ">-0.1")
        .from(q("[data-free-spark]"), { scale: 0, opacity: 0, duration: 0.5, stagger: 0.06, ease: "back.out(3)" }, "<0.1");
      if (!desk) tl.duration(3.2);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-sand px-[var(--gutter)] py-24 md:flex md:h-[100dvh] md:items-center md:py-0">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center text-center">
        <p className="eyebrow text-forest/70">Loyalty card</p>
        <h2 className="display mt-5 text-[clamp(2.6rem,5.4vw,5.2rem)]">Your 10th latte is on us.</h2>
        <p className="mt-5 max-w-lg text-[17px] text-forest/75">
          {BRAND.loyalty} Pre-orders count: she stamps your card at pick-up, and you can redeem a full card right in the order form.
        </p>

        {/* the card: dark front peeking out behind the cream stamp side */}
        <div data-card className="relative mt-20 w-full max-w-[560px] md:mt-16">
          <div data-card-back className="absolute inset-0 rounded-[22px] bg-forest shadow-[0_30px_60px_-30px_rgba(21,42,22,.7)]">
            <div className="absolute right-[6%] top-[5%] text-milk">
              <Wordmark className="text-[clamp(1.1rem,2.6vw,1.7rem)]" />
            </div>
          </div>
          <div className="relative rotate-[-2deg] rounded-[22px] bg-milk px-6 py-7 shadow-[0_40px_80px_-40px_rgba(21,42,22,.6)] md:px-10 md:py-9">
            <div className="flex items-center justify-between">
              <span className="puff text-[clamp(1.5rem,3.4vw,2.3rem)] tracking-wide">LOYALTY CARD</span>
              <HeartSticker letter="M" className="h-9 w-9 md:h-11 md:w-11" />
            </div>
            <div className="mt-6 grid grid-cols-5 gap-2.5 md:gap-4">
              {Array.from({ length: 10 }).map((_, k) => (
                <span key={k} className="relative grid aspect-square place-items-center rounded-full border-2 border-dashed border-forest/25">
                  {k < 9 ? (
                    <span data-stamp className="absolute inset-[6%] grid place-items-center rounded-full bg-matcha-soft">
                      <Mascot className="h-[72%] w-auto" />
                    </span>
                  ) : (
                    <span data-free className="absolute inset-[6%] grid place-items-center rounded-full bg-pink text-[clamp(.7rem,1.6vw,.95rem)] font-bold text-milk">
                      FREE
                      <span data-free-spark className="absolute -right-2 -top-2 text-pink"><Sparkle className="h-4 w-4" /></span>
                      <span data-free-spark className="absolute -left-3 top-1 text-leaf"><Sparkle className="h-3 w-3" /></span>
                    </span>
                  )}
                </span>
              ))}
            </div>
            <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-forest/70 md:text-[13px]">Grab 9 iced matcha lattes and your 10th is on us!</p>
          </div>
        </div>

        <div className="mt-14">
          <ButtonLink href="/order">Start a pre-order</ButtonLink>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────── Upcoming pop-ups
export function FindUs() {
  return (
    <section className="px-[var(--gutter)] py-28 md:py-40">
      <div className="mx-auto max-w-[1180px]">
        <Head eyebrow="Where to find us" center>Upcoming pop-ups</Head>
        <p className="mx-auto mt-5 max-w-md text-center text-[17px] text-forest/75">Pre-order for any date below and your drinks will be waiting.</p>
        <Stagger as="ul" className="mt-14 border-t border-forest/20">
          {DROPS.map((d) => (
            <li key={d.id} data-stagger>
              <TransitionLink href={`/order?drop=${d.id}`} className="group relative grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-1 border-b border-forest/20 py-6 md:grid-cols-[9rem_1fr_auto] md:gap-x-10 md:py-7">
                <span className="absolute inset-x-[-1.25rem] inset-y-0 -z-10 origin-bottom scale-y-0 rounded-2xl bg-milk transition-transform duration-700 ease-[var(--ease-babe)] group-hover:scale-y-100 md:inset-x-[-1.5rem]" />
                <span className="row-span-2 md:row-span-1">
                  <span className="block text-[13px] font-medium text-forest/60">{d.day}</span>
                  <span className="display block text-[clamp(1.9rem,3.2vw,2.9rem)] leading-none">{shortDate(d.date)}</span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[19px] font-semibold md:text-[21px]">{d.title}</span>
                  <span className="block text-forest/65">{d.place} · {d.time}</span>
                </span>
                <span className="hidden items-center gap-2 rounded-full bg-forest px-5 py-3 text-[14px] font-semibold text-milk opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:inline-flex">
                  Pre-order <Icon name="arrow" className="h-4 w-4" />
                </span>
              </TransitionLink>
            </li>
          ))}
        </Stagger>
        <p className="mt-6 text-center text-[14px] text-forest/60">
          Pick-up addresses are shared when your order is confirmed. Holiday orders close Dec 19. Only the Nov 7 market is a real date; the rest are demo.
        </p>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────── Private events (photo window reveal)
export function Events() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const frame = ref.current?.querySelector("[data-window]");
      const inner = ref.current?.querySelector("[data-window] [data-img-inner]");
      const st = { trigger: ref.current, start: "top 85%", end: "top 15%", scrub: true };
      gsap.fromTo(frame!, { clipPath: "inset(12% 9% 12% 9% round 40px)" }, { clipPath: "inset(0% 0% 0% 0% round 32px)", ease: "none", scrollTrigger: st });
      if (inner) gsap.fromTo(inner, { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: st });
    },
    { scope: ref },
  );
  return (
    <section ref={ref} className="px-[var(--gutter)] pb-28 md:pb-40">
      <div className="relative mx-auto max-w-[1440px]">
        <div data-window className="relative h-[78vh] min-h-[520px] overflow-hidden rounded-[32px] md:[&_[role=img]>svg]:left-[72%]">
          <BrandImage slot="cat-events" fill className="h-full w-full" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-between gap-6 p-6 text-milk md:flex-row md:items-end md:p-12">
            <div>
              <p className="eyebrow text-milk/80">Private events</p>
              <h2 className="display mt-4 max-w-2xl text-[clamp(2.4rem,5vw,4.8rem)]">Bring the matcha bar to your party.</h2>
              <p className="mt-4 max-w-md text-[17px] text-milk/85">Showers, studio classes, birthdays, office mornings. Up to three flavors, ribbon-tied favor bottles, and Babe behind the bar.</p>
            </div>
            <ButtonLink href="/order?type=event" variant="milk">Plan an event</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────── Photo strip
export function PhotoStrip() {
  const row = [...GALLERY, ...GALLERY];
  return (
    <section className="overflow-hidden pb-28 md:pb-36">
      <div className="mb-10 flex flex-col items-center gap-3 px-[var(--gutter)] text-center">
        <p className="eyebrow text-forest/70">On Instagram</p>
        <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="display text-[clamp(2rem,4vw,3.6rem)] underline decoration-leaf/40 decoration-[3px] underline-offset-[10px] transition-colors hover:decoration-leaf">
          {BRAND.handle}
        </a>
      </div>
      <div className="marquee flex w-max gap-4 [--marquee-d:60s] md:gap-6">
        {row.map((g, i) => (
          <div key={i} aria-hidden={i >= GALLERY.length} className={`relative h-[46vw] shrink-0 overflow-hidden rounded-[24px] md:h-[22vw] ${i % 3 === 1 ? "w-[34vw] md:w-[16vw]" : "w-[38vw] md:w-[18vw]"} ${i % 2 ? "mt-8" : ""}`}>
            <BrandImage slot={g.slot} fill bleed={false} className="h-full w-full" sizes="20vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
