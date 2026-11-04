"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useStore } from "@/lib/store";
import { getLenis } from "@/components/motion/SmoothScroll";
import { RevealImage, TrackedLabel } from "@/components/motion/primitives";
import { BrandImage } from "@/components/image/BrandImage";
import { Button } from "@/components/brand/Button";
import { DemoTag, LimitedBadge, Sparkle, HeartSticker } from "@/components/brand/Brand";
import { Calendar } from "./Calendar";
import { Confirmation } from "./Confirmation";
import {
  INITIAL, EVENT_TYPES, PACKAGES, SPOTS, TIME_WINDOWS, STEP_TITLES, STEP_SHORT,
  itemsFor, earliestDate, latestDate, isHolidayWindow, lineItems, totals, money, whenLabel, whereLabel, canContinue, toEnquiry,
  type OrderState,
} from "./model";
import { DROPS, MENU, MILKS, SWEETNESS, KIND_LABEL, HOLIDAY_CUTOFF, type Enquiry, type EnquiryKind } from "@/data/mock";
import { fmtDate } from "@/lib/dates";

const input =
  "w-full rounded-2xl bg-paper px-5 py-4 text-[16px] text-forest placeholder:text-forest/35 outline-none ring-1 ring-forest/15 transition-shadow focus:ring-2 focus:ring-leaf";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 rounded-full px-5 py-2.5 text-[15px] transition-all duration-300 ${
        active ? "bg-forest text-milk shadow-[0_10px_24px_-14px_rgba(31,58,31,.9)]" : "bg-paper text-forest ring-1 ring-forest/15 hover:ring-forest/40"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between gap-3">
        <span className="label !text-[10.5px] text-forest/70">{label}</span>
        {hint && <span className="text-[12px] text-forest/45">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Stepper({ value, onDec, onInc, label }: { value: number; onDec: () => void; onInc: () => void; label: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-cream p-1 ring-1 ring-forest/10">
      <button type="button" onClick={onDec} disabled={value === 0} aria-label={`Remove one ${label}`} className="grid h-10 w-10 place-items-center rounded-full text-lg transition-colors hover:bg-forest hover:text-milk disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-forest">−</button>
      <span className="w-8 text-center font-mono tabular-nums" aria-live="polite">{value}</span>
      <button type="button" onClick={onInc} aria-label={`Add one ${label}`} className="grid h-10 w-10 place-items-center rounded-full bg-forest text-lg text-milk transition-colors hover:bg-leaf">+</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────── Ticket (live summary)
function Ticket({ s, compact = false }: { s: OrderState; compact?: boolean }) {
  const items = lineItems(s);
  const t = totals(s);
  const rows: [string, string | null][] = [
    ["Order", s.kind ? KIND_LABEL[s.kind] : null],
    ["When", whenLabel(s)],
    ["Where", whereLabel(s)],
    ["Name", s.name.trim() || null],
  ];
  return (
    <div className={`relative rounded-[22px] bg-paper text-forest shadow-[0_30px_70px_-40px_rgba(31,58,31,.7)] ${compact ? "p-5" : "p-6"}`}>
      <div className="flex items-center justify-between">
        <span className="display text-xl leading-none">Your ticket</span>
        <DemoTag className="text-forest" />
      </div>
      <div className="my-4 border-t-2 border-dashed border-forest/15" />
      <dl className="space-y-2 text-[14px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-[10.5px] font-semibold text-forest/45">{k}</dt>
            <dd className={`truncate text-right ${v ? "" : "text-forest/30"}`}>{v ?? "—"}</dd>
          </div>
        ))}
      </dl>
      {items.length > 0 && (
        <>
          <div className="my-4 border-t-2 border-dashed border-forest/15" />
          <ul className="max-h-40 space-y-1.5 overflow-auto text-[14px]" data-lenis-prevent>
            {items.map((i) => (
              <li key={i.name} className="flex justify-between gap-3">
                <span className="truncate">
                  {s.kind !== "event" && <span className="font-mono text-forest/50">{i.qty}× </span>}
                  {i.name} {i.detail && <span className="text-forest/50">· {i.detail}</span>}
                </span>
                <span className="font-mono">{money(i.price)}</span>
              </li>
            ))}
            {t.milk > 0 && (
              <li className="flex justify-between gap-3 text-forest/70"><span>{s.milk} milk</span><span className="font-mono">{money(t.milk)}</span></li>
            )}
            {t.loyalty < 0 && (
              <li className="flex justify-between gap-3 text-leaf"><span>Loyalty · free latte</span><span className="font-mono">{money(t.loyalty)}</span></li>
            )}
          </ul>
        </>
      )}
      <div className="mt-4 flex items-end justify-between border-t border-forest/15 pt-4">
        <span className="label !text-[10px] text-forest/55">{s.kind === "event" ? "Estimate" : "Est. total"}</span>
        <span className="display text-3xl leading-none">{money(t.total)}</span>
      </div>
      {/* perforated edge */}
      <div aria-hidden className="absolute -left-2.5 top-[60px] h-5 w-5 rounded-full bg-cream" />
      <div aria-hidden className="absolute -right-2.5 top-[60px] h-5 w-5 rounded-full bg-cream" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────── Flow
export function OrderFlow() {
  const { submitEnquiry, menuOn } = useStore();
  const [s, setS] = useState<OrderState>(INITIAL);
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState<Enquiry | null>(null);
  const [mobileTicket, setMobileTicket] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const set = useCallback((patch: Partial<OrderState>) => setS((p) => ({ ...p, ...patch })), []);

  // deep links: ?item=, ?type=event, ?drop=
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const item = MENU.find((m) => m.id === p.get("item"));
    const drop = DROPS.find((d) => d.id === p.get("drop"));
    /* eslint-disable react-hooks/set-state-in-effect -- one-time prefill from the URL */
    if (item) {
      const kind: EnquiryKind = item.category === "bottles" ? "bottles" : "pickup";
      setS((x) => ({ ...x, kind, qty: { [item.id]: item.id === "favour-bottles" ? 24 : 1 } }));
      setStep(1);
    } else if (p.get("type") === "event") {
      setS((x) => ({ ...x, kind: "event" }));
      setStep(1);
    } else if (drop) {
      setS((x) => ({ ...x, kind: "pickup", dropId: drop.id }));
      setStep(1);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // step entrance
  useLayoutEffect(() => {
    const items = content.current?.querySelectorAll("[data-si]");
    if (!items?.length) return;
    const reduced = prefersReducedMotion();
    const tween = gsap.fromTo(
      items,
      { opacity: 0, y: reduced ? 0 : 36 },
      { opacity: 1, y: 0, duration: reduced ? 0.4 : 0.9, stagger: 0.06, ease: "babe", clearProps: "transform" },
    );
    return () => {
      tween.kill();
    };
  }, [step, sent]);

  const scrollTop = () => {
    const el = top.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 110;
    if (window.scrollY > y + 10) {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 0.9 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const go = (n: number) => {
    if (busy.current || n === step) return;
    busy.current = true;
    const items = content.current?.querySelectorAll("[data-si]");
    const done = () => {
      setStep(n);
      busy.current = false;
      scrollTop();
    };
    if (!items?.length || prefersReducedMotion()) return done();
    gsap.to(items, { opacity: 0, y: -18, duration: 0.28, stagger: 0.02, ease: "power2.in", onComplete: done });
  };

  const send = () => {
    const e = submitEnquiry(toEnquiry(s));
    const items = content.current?.querySelectorAll("[data-si]");
    const done = () => {
      setSent(e);
      scrollTop();
    };
    if (!items?.length || prefersReducedMotion()) return done();
    gsap.to(items, { opacity: 0, y: -24, scale: 0.98, duration: 0.35, stagger: 0.03, ease: "power2.in", onComplete: done });
  };

  const check = canContinue(step, s);
  const titles = STEP_TITLES(s.kind);
  const t = totals(s);
  const count = s.kind === "event" ? s.guests : lineItems(s).reduce((a, i) => a + i.qty, 0);

  if (sent) return <Confirmation enquiry={sent} />;

  return (
    <section className="relative px-5 pb-40 pt-28 md:px-10 md:pb-32 md:pt-36">
      <div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-12 md:gap-12">
        {/* side panel */}
        <aside className="hidden md:col-span-5 md:block">
          <div className="sticky top-28">
            <div className="relative">
              <RevealImage variant="arch" trigger="stage" duration={1.8} className="relative">
                <div className="relative">
                  <BrandImage slot="order-backdrop-1" className="rounded-t-full rounded-b-[30px]" sizes="40vw" priority />
                  <div className={`absolute inset-0 transition-opacity duration-1000 ${step >= 2 ? "opacity-100" : "opacity-0"}`}>
                    <BrandImage slot="order-backdrop-2" fill className="rounded-t-full rounded-b-[30px]" sizes="40vw" />
                  </div>
                </div>
              </RevealImage>
              <div className="absolute inset-x-6 bottom-6 lg:inset-x-10">
                <Ticket s={s} />
              </div>
              <HeartSticker letter="B" className="absolute -right-4 top-[14%] h-16 w-16 rotate-12" />
            </div>
          </div>
        </aside>

        {/* form */}
        <div className="min-w-0 md:col-span-7" ref={top}>
          <div className="flex items-center justify-between gap-4">
            <TrackedLabel trigger="stage" className="text-leaf">{`Pre-order · Step ${step + 1} of 5`}</TrackedLabel>
            <span className="label hidden !text-[10px] text-forest/45 sm:inline">No DMs needed</span>
          </div>
          {/* progress */}
          <ol className="mt-5 grid grid-cols-5 gap-1.5" aria-label="Progress">
            {STEP_SHORT.map((l, i) => (
              <li key={l}>
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => go(i)}
                  className="group block w-full text-left disabled:cursor-default"
                  aria-current={i === step ? "step" : undefined}
                >
                  <span className="block h-1.5 overflow-hidden rounded-full bg-forest/10">
                    <span className={`block h-full origin-left rounded-full bg-forest transition-transform duration-700 ease-[var(--ease-babe)] ${i <= step ? "scale-x-100" : "scale-x-0"} ${i === step ? "!bg-matcha" : ""}`} />
                  </span>
                  <span className={`mt-2 hidden text-[10px] font-semibold sm:block ${i === step ? "text-forest" : "text-forest/40"}`}>{l}</span>
                </button>
              </li>
            ))}
          </ol>

          <div ref={content} className="mt-10">
            <h1 data-si className="display text-[clamp(2.6rem,5.6vw,5.4rem)] text-forest">{titles[step]}</h1>

            {/* ── STEP 0: type */}
            {step === 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {([
                  { k: "pickup", title: "Pick-up pre-order", body: "Drinks waiting for you at an upcoming drop.", slot: "latte-og-babe" },
                  { k: "bottles", title: "Bottles & bundles", body: "Take-home bottles, shot packs, favors.", slot: "bottle-signature" },
                  { k: "event", title: "Private event", body: "A matcha bar or favors for your party.", slot: "cat-events" },
                ] as const).map((o) => {
                  const active = s.kind === o.k;
                  return (
                    <button
                      key={o.k}
                      data-si
                      type="button"
                      aria-pressed={active}
                      onClick={() => set({ kind: o.k, qty: {}, dropId: s.kind === o.k ? s.dropId : o.k === "pickup" ? s.dropId : null, date: null })}
                      className={`group relative flex items-center gap-4 overflow-hidden rounded-[26px] p-3 text-left transition-all duration-500 sm:flex-col sm:items-stretch sm:p-3 ${
                        active ? "bg-forest text-milk shadow-[0_24px_50px_-28px_rgba(31,58,31,.9)]" : "bg-paper ring-1 ring-forest/12 hover:ring-forest/35"
                      }`}
                    >
                      <span className="block w-24 shrink-0 sm:w-full">
                        <BrandImage slot={o.slot} className="rounded-[18px] transition-transform duration-700 group-hover:scale-[1.02]" sizes="(min-width: 640px) 20vw, 96px" />
                      </span>
                      <span className="block sm:px-2 sm:pb-3">
                        <span className="display block text-2xl leading-none">{o.title}</span>
                        <span className={`mt-2 block text-[14px] ${active ? "text-milk/70" : "text-forest/65"}`}>{o.body}</span>
                      </span>
                      <span className={`absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full transition-all duration-500 ${active ? "scale-100 bg-leaf text-milk" : "scale-75 bg-cream text-transparent ring-1 ring-forest/20"}`}>✓</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── STEP 1: order */}
            {step === 1 && s.kind !== "event" && (
              <div className="mt-8 space-y-10">
                <ul className="divide-y divide-forest/10 rounded-[26px] bg-paper px-4 ring-1 ring-forest/10 sm:px-6">
                  {itemsFor(s.kind)
                    .filter((m) => menuOn[m.id])
                    .map((m) => {
                      const q = s.qty[m.id] ?? 0;
                      const favor = m.id === "favour-bottles";
                      return (
                        <li key={m.id} data-si className="flex items-center gap-4 py-4">
                          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:h-[72px] sm:w-[72px]">
                            <BrandImage slot={m.slot} fill bleed={false} sizes="72px" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="display text-xl leading-none sm:text-2xl">{m.name}</span>
                              {m.limited && <span className="hidden sm:inline"><LimitedBadge>{m.badge ?? "Limited"}</LimitedBadge></span>}
                            </span>
                            <span className="mt-1 block font-mono text-[12.5px] text-forest/60">
                              ${m.price % 1 ? m.price.toFixed(2) : m.price} {m.priceNote ?? ""} <span className="opacity-60">· demo</span>
                            </span>
                          </span>
                          <Stepper
                            value={q}
                            label={m.name}
                            onDec={() => set({ qty: { ...s.qty, [m.id]: favor ? (q <= 24 ? 0 : q - 6) : Math.max(0, q - 1) } })}
                            onInc={() => set({ qty: { ...s.qty, [m.id]: favor ? (q === 0 ? 24 : q + 6) : Math.min(20, q + 1) } })}
                          />
                        </li>
                      );
                    })}
                </ul>
                {s.kind === "pickup" && (
                  <>
                    <div data-si>
                      <p className="label mb-3 !text-[10.5px] text-forest/70">Milk <span className="normal-case tracking-normal text-forest/45">· alt milks +$0.75 (demo)</span></p>
                      <div className="flex flex-wrap gap-2">
                        {MILKS.map((m) => <Chip key={m} active={s.milk === m} onClick={() => set({ milk: m })}>{m}</Chip>)}
                      </div>
                    </div>
                    <div data-si>
                      <p className="label mb-3 !text-[10.5px] text-forest/70">Sweetness</p>
                      <div className="flex flex-wrap gap-2">
                        {SWEETNESS.map((m) => <Chip key={m} active={s.sweetness === m} onClick={() => set({ sweetness: m })}>{m}</Chip>)}
                      </div>
                    </div>
                  </>
                )}
                {s.kind === "bottles" && (
                  <p data-si className="rounded-2xl bg-blush-soft px-5 py-4 text-[14.5px] text-forest/80">
                    Party Favor Bottles come in sets of 6 (min. 24) with a custom tag — tell us the wording in the next steps.
                  </p>
                )}
              </div>
            )}

            {step === 1 && s.kind === "event" && (
              <div className="mt-8 space-y-10">
                <div data-si>
                  <p className="label mb-3 !text-[10.5px] text-forest/70">What&rsquo;s the occasion?</p>
                  <div className="flex flex-wrap gap-2">
                    {EVENT_TYPES.map((e) => <Chip key={e} active={s.eventType === e} onClick={() => set({ eventType: e })}>{e}</Chip>)}
                  </div>
                </div>
                <div data-si>
                  <div className="mb-3 flex items-baseline justify-between">
                    <p className="label !text-[10.5px] text-forest/70">How many guests?</p>
                    <span className="display text-4xl leading-none text-forest tabular-nums">{s.guests}</span>
                  </div>
                  <input
                    type="range" min={10} max={150} step={5} value={s.guests}
                    onChange={(e) => set({ guests: Number(e.target.value) })}
                    className="h-11 w-full cursor-pointer accent-[var(--color-leaf)]"
                    aria-label="Guest count"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-forest/45"><span>10</span><span>150</span></div>
                </div>
                <div data-si className="grid gap-3 sm:grid-cols-3">
                  {PACKAGES.map((p) => {
                    const active = s.pkg === p.id;
                    return (
                      <button key={p.id} type="button" aria-pressed={active} onClick={() => set({ pkg: p.id })}
                        className={`rounded-[22px] p-5 text-left transition-all duration-500 ${active ? "bg-forest text-milk" : "bg-paper ring-1 ring-forest/12 hover:ring-forest/35"}`}>
                        <span className="display block text-xl leading-tight">{p.title}</span>
                        <span className={`mt-2 block text-[13.5px] ${active ? "text-milk/70" : "text-forest/60"}`}>{p.body}</span>
                        <span className="mt-4 block font-mono text-[12px]">~${p.perGuest}/guest · demo</span>
                      </button>
                    );
                  })}
                </div>
                <div data-si>
                  <p className="label mb-3 !text-[10.5px] text-forest/70">Pick up to 3 flavors <span className="normal-case tracking-normal text-forest/45">· {s.flavors.length}/3</span></p>
                  <div className="flex flex-wrap gap-2">
                    {MENU.filter((m) => m.category !== "bottles" && menuOn[m.id]).map((m) => {
                      const on = s.flavors.includes(m.name);
                      return (
                        <Chip key={m.id} active={on} onClick={() => set({ flavors: on ? s.flavors.filter((f) => f !== m.name) : s.flavors.length < 3 ? [...s.flavors, m.name] : s.flavors })}>
                          {m.name}
                        </Chip>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: when */}
            {step === 2 && s.kind === "pickup" && (
              <div className="mt-8 space-y-3">
                {DROPS.map((d) => {
                  const active = s.dropId === d.id;
                  return (
                    <button key={d.id} data-si type="button" aria-pressed={active} onClick={() => set({ dropId: d.id })}
                      className={`flex w-full items-center gap-5 rounded-[24px] p-4 text-left transition-all duration-500 sm:p-5 ${active ? "bg-forest text-milk shadow-[0_24px_50px_-28px_rgba(31,58,31,.9)]" : "bg-paper ring-1 ring-forest/12 hover:ring-forest/35"}`}>
                      <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-center ${active ? "bg-leaf text-milk" : "bg-cream"}`}>
                        <span className="leading-none">
                          <span className="block text-[9.5px] font-semibold opacity-70">{d.day}</span>
                          <span className="display block text-2xl">{d.date.slice(8)}</span>
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2 text-lg font-medium">
                          {d.title}
                          {!d.real && <DemoTag />}
                        </span>
                        <span className={`block truncate text-[14px] ${active ? "text-milk/70" : "text-forest/60"}`}>{fmtDate(d.date, { month: "long", day: "numeric" })} · {d.time} · {d.place}</span>
                      </span>
                      {active && <Sparkle className="h-5 w-5 shrink-0 text-leaf" />}
                    </button>
                  );
                })}
                <p data-si className="pt-2 text-[14px] text-forest/60">Pick-up address is sent when she confirms. Holiday orders close {fmtDate(HOLIDAY_CUTOFF, { month: "short", day: "numeric" })}.</p>
              </div>
            )}

            {step === 2 && s.kind !== "pickup" && (
              <div className="mt-8 space-y-6">
                <div data-si className="flex items-start gap-3 rounded-2xl bg-blush-soft px-5 py-4 text-[14.5px] text-forest">
                  <Sparkle className="mt-1 h-4 w-4 shrink-0 text-leaf" />
                  <span>
                    <strong>Holiday orders close Sat, Dec 19.</strong> We&rsquo;re on break Dec 20 – Jan 3.{" "}
                    {s.kind === "event" ? "Events need 10 days’ notice." : "Bottles need 3 days’ notice."}
                  </span>
                </div>
                <div data-si>
                  <Calendar value={s.date} onChange={(d) => set({ date: d })} earliest={earliestDate(s.kind)} latest={latestDate()} />
                </div>
                {s.date && isHolidayWindow(s.date) && (
                  <p data-si className="text-[14px] text-leaf">✦ Holiday rush date — we&rsquo;ll confirm availability fast.</p>
                )}
                {s.kind === "event" && (
                  <div data-si>
                    <p className="label mb-3 !text-[10.5px] text-forest/70">Time of day</p>
                    <div className="flex flex-wrap gap-2">
                      {TIME_WINDOWS.map((w) => <Chip key={w} active={s.timeWindow === w} onClick={() => set({ timeWindow: w })}>{w}</Chip>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: details */}
            {step === 3 && (
              <div className="mt-8 space-y-6">
                <div data-si className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name">
                    <input className={input} value={s.name} onChange={(e) => set({ name: e.target.value })} placeholder="First name + initial" autoComplete="given-name" />
                  </Field>
                  <Field label="Instagram" hint="optional">
                    <input className={input} value={s.handle} onChange={(e) => set({ handle: e.target.value })} placeholder="@yourhandle" autoCapitalize="none" />
                  </Field>
                </div>
                <div data-si>
                  <Field label="Phone or email" hint="only used to confirm this order">
                    <input className={input} value={s.contact} onChange={(e) => set({ contact: e.target.value })} placeholder="So she can confirm with you" inputMode="email" />
                  </Field>
                </div>
                {s.kind === "pickup" && (
                  <div data-si className="rounded-2xl bg-matcha-mist px-5 py-4">
                    <p className="label !text-[10px] text-forest/60">Pick-up at</p>
                    <p className="mt-1 text-lg font-medium">{whereLabel(s)}</p>
                    <p className="text-[14px] text-forest/60">{whenLabel(s)}</p>
                  </div>
                )}
                {s.kind === "bottles" && (
                  <div data-si>
                    <p className="label mb-3 !text-[10.5px] text-forest/70">Pick-up spot</p>
                    <div className="flex flex-wrap gap-2">
                      {SPOTS.map((p) => <Chip key={p} active={s.spot === p} onClick={() => set({ spot: p })}>{p}</Chip>)}
                    </div>
                  </div>
                )}
                {s.kind === "event" && (
                  <div data-si>
                    <Field label="Venue or city">
                      <input className={input} value={s.venue} onChange={(e) => set({ venue: e.target.value })} placeholder="e.g. Home in Mission, studio in McAllen" />
                    </Field>
                  </div>
                )}
                <div data-si>
                  <Field label="Anything else?" hint="allergies, tag wording, a vibe">
                    <textarea className={`${input} min-h-28 resize-none`} value={s.note} onChange={(e) => set({ note: e.target.value })} placeholder="Tell her anything that would've been a DM…" />
                  </Field>
                </div>
                {s.kind === "pickup" && (
                  <label data-si className="flex cursor-pointer items-center gap-4 rounded-2xl bg-paper px-5 py-4 ring-1 ring-forest/12">
                    <input type="checkbox" checked={s.loyalty} onChange={(e) => set({ loyalty: e.target.checked })} className="peer sr-only" />
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-2 ring-forest/25 transition-all peer-checked:bg-leaf peer-checked:ring-leaf peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-leaf">
                      <span className={`text-paper transition-transform ${s.loyalty ? "scale-100" : "scale-0"}`}>✓</span>
                    </span>
                    <span>
                      <span className="block font-medium">Redeem my free latte</span>
                      <span className="block text-[13.5px] text-forest/60">I have a full loyalty card (9 stamps). Bring it to pick-up.</span>
                    </span>
                  </label>
                )}
              </div>
            )}

            {/* ── STEP 4: review */}
            {step === 4 && (
              <div className="mt-8 space-y-4">
                {[
                  { k: "Order", v: s.kind ? KIND_LABEL[s.kind] : "", to: 0 },
                  {
                    k: s.kind === "event" ? "Event" : "Items",
                    v: s.kind === "event"
                      ? `${s.eventType} · ${s.guests} guests · ${PACKAGES.find((p) => p.id === s.pkg)?.title} · ${s.flavors.join(", ")}`
                      : lineItems(s).map((i) => `${i.qty}× ${i.name}`).join(", ") + (s.kind === "pickup" ? ` · ${s.milk} milk, ${s.sweetness.toLowerCase()}` : ""),
                    to: 1,
                  },
                  { k: "When", v: whenLabel(s) ?? "", to: 2 },
                  { k: "Where", v: whereLabel(s) ?? "", to: 3 },
                  { k: "You", v: `${s.name}${s.handle ? ` · ${s.handle}` : ""} · ${s.contact}`, to: 3 },
                  ...(s.note.trim() ? [{ k: "Note", v: s.note.trim(), to: 3 }] : []),
                ].map((r) => (
                  <div key={r.k} data-si className="flex items-start justify-between gap-4 rounded-[22px] bg-paper px-5 py-4 ring-1 ring-forest/10">
                    <div className="min-w-0">
                      <p className="label !text-[10px] text-forest/50">{r.k}</p>
                      <p className="mt-1 text-[16px]">{r.v}</p>
                    </div>
                    <button type="button" onClick={() => go(r.to)} className="label shrink-0 pt-1 !text-[10px] text-leaf underline-offset-4 hover:underline">Edit</button>
                  </div>
                ))}
                <div data-si className="flex items-center justify-between rounded-[22px] bg-forest px-6 py-5 text-milk">
                  <div>
                    <p className="label !text-[10px] text-matcha-soft">{s.kind === "event" ? "Estimate" : "Estimated total"} · demo</p>
                    <p className="mt-1 text-[13.5px] text-milk/70">
                      {s.loyalty ? "Includes your free latte. " : ""}Nothing is charged now — pay at pick-up with Scan 2 Pay{s.kind === "event" ? " or by quote" : ""}.
                    </p>
                  </div>
                  <p className="display text-4xl">{money(t.total)}</p>
                </div>
              </div>
            )}
          </div>

          {/* desktop actions */}
          <div className="mt-12 hidden items-center justify-between gap-4 md:flex">
            <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="label rounded-full px-5 py-4 text-forest/70 transition-colors hover:text-forest disabled:opacity-0">← Back</button>
            <div className="flex items-center gap-5">
              {!check.ok && <span className="text-[14px] text-forest/50">{check.hint}</span>}
              {step < 4 ? (
                <Button onClick={() => go(step + 1)} disabled={!check.ok} arrow>Continue</Button>
              ) : (
                <Button onClick={send} arrow>Send my request</Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* mobile ticket sheet */}
      {mobileTicket && (
        <div className="fixed inset-0 z-[95] flex items-end bg-forest/40 px-3 pb-[calc(96px+env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden" onClick={() => setMobileTicket(false)}>
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <Ticket s={s} compact />
          </div>
        </div>
      )}

      {/* mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-[96] px-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden">
        <div className="flex items-center gap-2 rounded-[26px] bg-paper/95 p-2 shadow-[0_-10px_50px_-20px_rgba(31,58,31,.45)] ring-1 ring-forest/10 backdrop-blur-md">
          <button type="button" onClick={() => go(step - 1)} disabled={step === 0} aria-label="Back" className="grid h-12 w-12 shrink-0 place-items-center rounded-full ring-1 ring-forest/15 disabled:opacity-30">←</button>
          <button type="button" onClick={() => setMobileTicket((v) => !v)} className="min-w-0 flex-1 px-1 text-left" aria-expanded={mobileTicket}>
            <span className="block text-[10px] font-semibold text-forest/50">{count > 0 ? `${count} ${s.kind === "event" ? "guests" : "items"} · tap for ticket` : check.ok ? "Ready" : check.hint}</span>
            <span className="display block text-xl leading-tight">{money(t.total)}</span>
          </button>
          {step < 4 ? (
            <button type="button" onClick={() => go(step + 1)} disabled={!check.ok} className="h-12 shrink-0 rounded-full bg-leaf px-6 text-[12px] font-semibold text-paper transition-opacity disabled:opacity-35">Continue</button>
          ) : (
            <button type="button" onClick={send} className="h-12 shrink-0 rounded-full bg-forest px-6 text-[12px] font-semibold text-milk">Send ✦</button>
          )}
        </div>
      </div>
    </section>
  );
}
