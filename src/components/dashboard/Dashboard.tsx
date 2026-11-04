"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onStage } from "@/lib/stage";
import { useStore } from "@/lib/store";
import { TransitionLink } from "@/components/motion/PageTransition";
import { Badge, Sparkle, Mascot } from "@/components/brand/Brand";
import { getLenis } from "@/components/motion/SmoothScroll";
import { Inbox } from "./Inbox";
import { Card, DemoChip, Num, Toggle, Toasts, useToasts, StatusPill, STATUS_META, Avatar, itemsLine, dateShort } from "./parts";
import {
  CAPACITY, CATEGORY_META, DROPS, KIND_LABEL, MENU, SEED_ENQUIRIES, STATS, WEEK, STATUS_FLOW,
  type Enquiry, type EnquiryStatus, type MenuCategory,
} from "@/data/mock";
import { fmtDate } from "@/lib/dates";

type View = "overview" | "enquiries" | "calendar" | "menu" | "settings";
const NAV: { id: View; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" /> },
  { id: "enquiries", label: "Enquiries", icon: <path d="M4 6h16v12H4zM4 7l8 6 8-6" /> },
  { id: "calendar", label: "Calendar", icon: <path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5" /> },
  { id: "menu", label: "Menu", icon: <path d="M7 4h10l-1 16H8zM6 4h12M12 8v8" /> },
  { id: "settings", label: "Settings", icon: <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" /> },
];
const Icon = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
);

// last 7 days of enquiries (demo), Thu → Wed (today)
const LAST7 = [
  { d: "Thu", n: 0 }, { d: "Fri", n: 1 }, { d: "Sat", n: 1 }, { d: "Sun", n: 1 }, { d: "Mon", n: 2 }, { d: "Tue", n: 1 }, { d: "Wed", n: 1 },
];

export function Dashboard() {
  const { enquiries, incomingId, acknowledgeIncoming, setStatus, menuOn, toggleMenu, bookedCups } = useStore();
  const [view, setView] = useState<View>("overview");
  const [held, setHeld] = useState<string | null>(incomingId);
  const [arriving, setArriving] = useState<string | null>(null);
  const [open, setOpen] = useState<Enquiry | null>(null);
  const { toasts, push } = useToasts();
  const root = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  const heldEnquiry = enquiries.find((e) => e.id === held);
  const visible = useMemo(() => enquiries.filter((e) => e.id !== held), [enquiries, held]);
  const newCount = visible.filter((e) => e.status === "new").length;
  const extraToday = visible.filter((e) => !SEED_ENQUIRIES.some((s) => s.id === e.id)).length;
  const inWeek = (iso: string) => iso >= WEEK.days[0].iso && iso <= WEEK.days[6].iso;
  const cups = bookedCups - (heldEnquiry && inWeek(heldEnquiry.date) ? heldEnquiry.cups : 0);

  // ── the arrival moment
  useEffect(() => {
    if (!held) return;
    const id = held;
    let timer: ReturnType<typeof setTimeout>;
    const un = onStage(() => {
      timer = setTimeout(() => {
        const e = enquiries.find((x) => x.id === id);
        setHeld(null);
        setArriving(id);
        acknowledgeIncoming();
        if (e) push(`New ${KIND_LABEL[e.kind].toLowerCase()} just landed`, `${e.name} · ${e.id} · from your website`, "pink");
        if (badgeRef.current && !prefersReducedMotion())
          gsap.fromTo(badgeRef.current, { scale: 0.4 }, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
      }, 1150);
    });
    return () => {
      un();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [held]);

  // entrance
  useGSAP(
    (_c, contextSafe) => {
      if (!contextSafe) return;
      const q = gsap.utils.selector(root);
      const reduced = prefersReducedMotion();
      gsap.set(q("[data-side]"), { opacity: 0, x: reduced ? 0 : -30 });
      gsap.set(q("[data-dash]"), { opacity: 0, y: reduced ? 0 : 30 });
      return onStage(
        contextSafe(() => {
          gsap.to(q("[data-side]"), { opacity: 1, x: 0, duration: 1, stagger: 0.05, ease: "babe" });
          gsap.to(q("[data-dash]"), { opacity: 1, y: 0, duration: 1, stagger: 0.06, delay: 0.15, ease: "babe", clearProps: "transform" });
        }),
      );
    },
    { scope: root },
  );

  // view change: quick re-stagger
  useEffect(() => {
    const q = gsap.utils.selector(root);
    if (prefersReducedMotion()) return;
    gsap.fromTo(q("[data-view] [data-dash]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "babe", clearProps: "transform" });
  }, [view]);

  const advance = (e: Enquiry, to: EnquiryStatus) => {
    setStatus(e.id, to);
    if (open?.id === e.id) setOpen({ ...e, status: to });
    const msg: Record<EnquiryStatus, string> = { new: "", quoted: "Quote sent", confirmed: "Order confirmed", ready: "Marked ready for pick-up" };
    push(msg[to], `${e.id} · ${e.name}`);
  };

  const copy = async (text: string, title: string) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    push(title, "Copied to your clipboard");
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div ref={root} className="min-h-dvh bg-cream text-forest lg:pl-[264px]">
      {/* ── sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col bg-forest p-5 text-milk lg:flex">
        <div data-side className="flex items-center gap-3 px-2">
          <Badge className="h-11 w-11 [&_circle]:!fill-[var(--color-forest-deep)]" ring />
          <div>
            <p className="display text-xl leading-none">Babe HQ</p>
            <p className="text-[9.5px] font-semibold text-matcha-soft">Owner dashboard</p>
          </div>
        </div>
        <nav className="mt-10 space-y-1" aria-label="Dashboard">
          {NAV.map((n) => (
            <button
              key={n.id}
              data-side
              type="button"
              onClick={() => setView(n.id)}
              aria-current={view === n.id ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-[15px] transition-colors ${view === n.id ? "bg-cream text-forest" : "text-milk/75 hover:bg-cream/8 hover:text-milk"}`}
            >
              <Icon>{n.icon}</Icon>
              {n.label}
              {n.id === "enquiries" && newCount > 0 && (
                <span ref={badgeRef} className="ml-auto rounded-full bg-leaf px-2 py-0.5 font-mono text-[10.5px] text-paper">{newCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div data-side className="mt-auto space-y-3">
          <div className="relative overflow-hidden rounded-2xl bg-forest-deep p-4">
            <p className="text-[10px] font-semibold text-matcha-soft">Next drop</p>
            <p className="mt-1 font-medium">{fmtDate(DROPS[0].date)} · {DROPS[0].time}</p>
            <p className="text-[13px] text-milk/60">{DROPS[0].title}, Edinburg</p>
            <Mascot className="absolute -bottom-3 -right-3 h-16 w-auto opacity-80 [&_*]:[stroke:var(--color-matcha-soft)]" />
          </div>
          <TransitionLink href="/" className="flex items-center justify-between rounded-2xl px-3.5 py-3 text-[14px] text-milk/70 ring-1 ring-cream/15 transition-colors hover:bg-cream hover:text-forest">
            View website <span>↗</span>
          </TransitionLink>
          <p className="px-2 text-[9.5px] font-semibold text-milk/40">Demo data · resets on reload</p>
        </div>
      </aside>

      {/* ── mobile top bar */}
      <div className="sticky top-0 z-30 border-b border-forest/10 bg-cream/90 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Badge className="h-9 w-9" />
            <span className="display text-lg">Babe HQ</span>
          </div>
          <TransitionLink href="/" className="rounded-full px-3 py-2 text-[10px] font-semibold ring-1 ring-forest/15">Site ↗</TransitionLink>
        </div>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-3">
          {NAV.map((n) => (
            <button key={n.id} type="button" onClick={() => setView(n.id)} className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] ${view === n.id ? "bg-forest text-milk" : "bg-paper text-forest/70"}`}>
              {n.label}
              {n.id === "enquiries" && newCount > 0 && <span className="rounded-full bg-leaf px-1.5 font-mono text-[10px] text-paper">{newCount}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── main */}
      <main className="px-4 pb-16 pt-6 md:px-8 md:pt-8 xl:px-12">
        <header data-dash className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold text-forest/55">{fmtDate("2026-11-04", { weekday: "long", month: "long", day: "numeric" })} · <DemoChip /></p>
            <h1 className="display mt-3 text-[clamp(2.4rem,4.4vw,3.8rem)] leading-none">
              {greeting}, <span className="text-leaf">Babe.</span>
            </h1>
            <p className="mt-2 text-forest/65">
              {newCount > 0 ? `${newCount} new ${newCount === 1 ? "request needs" : "requests need"} a reply.` : "You're all caught up."} Everything below came in through your website — no DMs to chase.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => copy(`${window.location.origin}/order`, "Pre-order link copied")} className="rounded-full bg-paper px-4 py-3 text-[10.5px] font-semibold ring-1 ring-forest/12 transition-colors hover:ring-forest/40">
              Copy pre-order link
            </button>
            <TransitionLink href="/order" className="rounded-full bg-forest px-5 py-3 text-[10.5px] font-semibold text-milk transition-colors hover:bg-leaf">
              + New order
            </TransitionLink>
          </div>
        </header>

        <div data-view key={view} className="mt-8">
          {view === "overview" && (
            <div className="grid gap-4 md:gap-5 xl:grid-cols-12">
              {/* stat tiles */}
              <div className="grid grid-cols-2 gap-4 md:gap-5 xl:col-span-12 xl:grid-cols-4">
                <Card>
                  <p className="text-[10.5px] font-semibold text-forest/55">New requests</p>
                  <p className="display mt-3 text-5xl leading-none"><Num value={newCount} /></p>
                  <p className="mt-2 text-[13px] text-forest/55">{STATS.enquiriesThisWeek + extraToday} this week</p>
                </Card>
                <Card>
                  <p className="text-[10.5px] font-semibold text-forest/55">Cups booked</p>
                  <p className="display mt-3 text-5xl leading-none"><Num value={cups} /><span className="text-2xl text-forest/35"> / {CAPACITY.weekCups}</span></p>
                  <p className="mt-2 text-[13px] text-forest/55">This week, Nov 2–8</p>
                </Card>
                <Card>
                  <p className="text-[10.5px] font-semibold text-forest/55">Avg. reply time</p>
                  <p className="display mt-3 text-5xl leading-none">1h 40m</p>
                  <p className="mt-2 text-[13px] text-forest/55">No info-gathering DMs</p>
                </Card>
                <Card className="bg-forest text-milk ring-0">
                  <p className="text-[10.5px] font-semibold text-matcha-soft">Next drop</p>
                  <p className="display mt-3 text-3xl leading-none">{fmtDate(DROPS[0].date, { weekday: "short", month: "short", day: "numeric" })}</p>
                  <p className="mt-2 text-[13px] text-milk/65">{DROPS[0].title} · Edinburg · {DROPS[0].time}</p>
                </Card>
              </div>

              <Card className="xl:col-span-8" title="Inbox" action={<button type="button" onClick={() => setView("enquiries")} className="text-[10.5px] font-semibold text-leaf">View all →</button>}>
                <Inbox items={visible} arrivingId={arriving} onOpen={setOpen} onAdvance={advance} limit={6} />
              </Card>

              <div className="grid gap-4 md:gap-5 xl:col-span-4">
                <CapacityMeter cups={cups} />
                <Card title="Requests · last 7 days">
                  <MiniBars extraToday={extraToday} />
                </Card>
              </div>

              <Card className="xl:col-span-8" title={`This week · ${WEEK.label}`} action={<button type="button" onClick={() => setView("calendar")} className="text-[10.5px] font-semibold text-leaf">Calendar →</button>}>
                <WeekView enquiries={visible} onOpen={setOpen} compact />
              </Card>
              <Card className="xl:col-span-4" title="Fall menu · on the site" action={<span className="font-mono text-[10px] text-forest/45">live toggles</span>}>
                <MenuToggles category="seasonal" menuOn={menuOn} toggle={(id, name) => { toggleMenu(id); push(menuOn[id] ? `${name} paused` : `${name} is back on`, "Updated on your website"); }} />
              </Card>
            </div>
          )}

          {view === "enquiries" && (
            <Card title="All requests" action={<DemoChip />}>
              <Inbox items={visible} arrivingId={arriving} onOpen={setOpen} onAdvance={advance} />
            </Card>
          )}

          {view === "calendar" && (
            <div className="grid gap-5 xl:grid-cols-12">
              <Card className="xl:col-span-8" title={`Week of ${WEEK.label}`}>
                <WeekView enquiries={visible} onOpen={setOpen} />
              </Card>
              <div className="grid gap-5 xl:col-span-4">
                <CapacityMeter cups={cups} />
                <Card title="Upcoming drops">
                  <ul className="space-y-2">
                    {DROPS.map((d) => (
                      <li key={d.id} className="flex items-center gap-3 rounded-2xl bg-cream p-3">
                        <span className="display w-10 text-2xl leading-none">{d.date.slice(8)}</span>
                        <span className="min-w-0">
                          <span className="block truncate text-[14.5px] font-medium">{d.title}</span>
                          <span className="block truncate text-[12.5px] text-forest/55">{d.day} · {d.time} · {d.place.split(" (")[0]}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {view === "menu" && (
            <div className="grid gap-5 lg:grid-cols-3">
              {(["seasonal", "lattes", "bottles"] as MenuCategory[]).map((c) => (
                <Card key={c} title={CATEGORY_META[c].label}>
                  <MenuToggles category={c} menuOn={menuOn} toggle={(id, name) => { toggleMenu(id); push(menuOn[id] ? `${name} paused` : `${name} is back on`, "Updated on your website"); }} />
                </Card>
              ))}
              <p data-dash className="text-[13.5px] text-forest/55 lg:col-span-3">
                Toggles update the menu, the fall-menu scroller and the pre-order form instantly (in this demo tab).
              </p>
            </div>
          )}

          {view === "settings" && <Settings onSave={() => push("Settings saved", "Demo only — nothing left this tab")} />}
        </div>
      </main>

      <Drawer e={open} onClose={() => setOpen(null)} onAdvance={advance} onCopy={copy} />
      <Toasts toasts={toasts} />
    </div>
  );
}

// ───────────────────────────────────────────── capacity
function CapacityMeter({ cups }: { cups: number }) {
  const pct = Math.min(1, cups / CAPACITY.weekCups);
  const left = Math.max(0, CAPACITY.weekCups - cups);
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    gsap.to(bar.current, { scaleX: pct, duration: prefersReducedMotion() ? 0.01 : 1.4, ease: "babe", delay: 0.3 });
  }, [pct]);
  return (
    <Card title="Weekly capacity">
      <div className="flex items-end justify-between">
        <p className="display text-5xl leading-none"><Num value={Math.round(pct * 100)} />%</p>
        <p className="pb-1 text-right text-[13px] text-forest/60"><Num value={left} /> cups left<br />of {CAPACITY.weekCups}</p>
      </div>
      <div className="relative mt-5 h-4 overflow-hidden rounded-full bg-cream" role="meter" aria-valuemin={0} aria-valuemax={CAPACITY.weekCups} aria-valuenow={cups} aria-label="Cups booked this week">
        <span ref={bar} className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 rounded-full bg-kelly" />
        {/* 80% soft limit tick */}
        <span className="absolute inset-y-0 left-[80%] w-0.5 bg-paper" />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-forest/45">
        <span>0</span><span className="ml-[62%]">80% soft limit</span><span>{CAPACITY.weekCups}</span>
      </div>
      {pct >= 0.8 && <p className="mt-3 text-[13px] text-leaf">✦ Nearly full — new requests will show as waitlist.</p>}
    </Card>
  );
}

// ───────────────────────────────────────────── mini bar chart (single series)
function MiniBars({ extraToday }: { extraToday: number }) {
  const data = LAST7.map((d, i) => ({ ...d, n: d.n + (i === 6 ? extraToday : 0) }));
  const max = Math.max(3, ...data.map((d) => d.n));
  const total = data.reduce((a, d) => a + d.n, 0);
  return (
    <div>
      <p className="display text-4xl leading-none"><Num value={total} /> <span className="font-sans text-[13px] font-normal text-forest/55">requests</span></p>
      <div className="mt-5 flex h-28 items-end gap-2" role="img" aria-label={`Requests per day: ${data.map((d) => `${d.d} ${d.n}`).join(", ")}`}>
        {data.map((d, i) => (
          <div key={d.d} className="group relative flex h-full flex-1 flex-col items-center justify-end">
            <span className="pointer-events-none absolute -top-7 whitespace-nowrap rounded-md bg-forest px-2 py-1 font-mono text-[10px] text-milk opacity-0 transition-opacity group-hover:opacity-100">
              {d.d} · {d.n}
            </span>
            <span
              className={`w-full max-w-[22px] rounded-t-[4px] transition-[height] duration-700 ease-[var(--ease-babe)] ${i === 6 ? "bg-leaf" : "bg-forest"}`}
              style={{ height: `${Math.max(3, (d.n / max) * 100)}%`, opacity: d.n ? 1 : 0.18 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 border-t border-forest/10 pt-2">
        {data.map((d, i) => (
          <span key={d.d} className={`flex-1 text-center font-mono text-[9.5px] ${i === 6 ? "text-leaf" : "text-forest/45"}`}>{i === 6 ? "Today" : d.d}</span>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────── week view
const TONE: Record<string, string> = {
  cream: "bg-cream text-forest",
  lav: "bg-lav/70 text-forest",
  matcha: "bg-matcha-soft text-forest",
  forest: "bg-forest text-milk",
  blush: "bg-blush text-forest",
  ghost: "bg-transparent text-forest/45 ring-1 ring-dashed ring-forest/15",
};

function WeekView({ enquiries, onOpen, compact = false }: { enquiries: Enquiry[]; onOpen: (e: Enquiry) => void; compact?: boolean }) {
  return (
    <div className="no-scrollbar -mx-1 overflow-x-auto px-1" data-lenis-prevent>
      <div className="grid min-w-[720px] grid-cols-7 gap-2">
        {WEEK.days.map((d) => {
          const today = d.iso === "2026-11-04";
          const blocks = WEEK.blocks.filter((b) => b.iso === d.iso);
          const orders = enquiries.filter((e) => e.date === d.iso);
          return (
            <div key={d.iso} className={`rounded-2xl p-2 ${today ? "bg-blush-soft ring-1 ring-leaf/40" : "bg-cream/70"} ${compact ? "min-h-40" : "min-h-72"}`}>
              <div className="mb-2 flex items-baseline justify-between px-1">
                <span className="text-[10px] font-semibold text-forest/55">{d.d}</span>
                <span className={`display text-xl ${today ? "text-leaf" : ""}`}>{d.n}</span>
              </div>
              <div className="space-y-1.5">
                {blocks.map((b, i) => (
                  <div key={i} className={`rounded-xl px-2.5 py-2 ${TONE[b.tone]}`}>
                    <p className="text-[12.5px] font-medium leading-tight">{b.title}</p>
                    <p className="text-[11px] opacity-70">{b.meta}</p>
                  </div>
                ))}
                {orders.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => onOpen(e)}
                    className={`block w-full rounded-xl px-2.5 py-2 text-left transition-transform hover:-translate-y-0.5 ${e.status === "new" || e.status === "quoted" ? "border border-dashed border-leaf/60 bg-paper" : "bg-blush"}`}
                  >
                    <p className="text-[12px] font-medium leading-tight">{e.name}</p>
                    <p className="text-[10.5px] opacity-70">{e.id} · {e.cups} cups</p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 flex flex-wrap gap-4 text-[12px] text-forest/55">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-blush" /> Confirmed order</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-dashed border-leaf" /> Awaiting reply</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-forest" /> Pop-up</span>
      </p>
    </div>
  );
}

// ───────────────────────────────────────────── menu toggles
function MenuToggles({ category, menuOn, toggle }: { category: MenuCategory; menuOn: Record<string, boolean>; toggle: (id: string, name: string) => void }) {
  return (
    <ul className="space-y-1">
      {MENU.filter((m) => m.category === category).map((m) => (
        <li key={m.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 hover:bg-cream">
          <span className="min-w-0">
            <span className={`block truncate text-[14.5px] ${menuOn[m.id] ? "" : "text-forest/40 line-through"}`}>{m.name}</span>
            <span className="block text-[10px] font-semibold text-forest/45">{m.limited ? "Limited time" : CATEGORY_META[m.category].label} · ${m.price}</span>
          </span>
          <Toggle on={menuOn[m.id]} onChange={() => toggle(m.id, m.name)} label={`${m.name} on the website`} />
        </li>
      ))}
    </ul>
  );
}

// ───────────────────────────────────────────── settings
function Settings({ onSave }: { onSave: () => void }) {
  const [lead, setLead] = useState(10);
  const [cap, setCap] = useState(CAPACITY.weekCups);
  const [notify, setNotify] = useState({ email: true, summary: false, waitlist: true });
  const field = "w-full rounded-2xl bg-cream px-4 py-3.5 text-[16px] outline-none ring-1 ring-forest/10 focus:ring-2 focus:ring-leaf";
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="Ordering rules">
        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-[13.5px] text-forest/65">Pick-up note shown on confirmations</span>
            <textarea className={`${field} min-h-24 resize-none`} defaultValue="Address is sent once your order is confirmed. Look for the green bar and the pink straws!" />
          </label>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[14.5px]">Event notice (days)</span>
            <span className="flex items-center gap-2">
              <button type="button" onClick={() => setLead((v) => Math.max(3, v - 1))} className="h-10 w-10 rounded-full ring-1 ring-forest/15">−</button>
              <span className="w-8 text-center font-mono">{lead}</span>
              <button type="button" onClick={() => setLead((v) => v + 1)} className="h-10 w-10 rounded-full bg-forest text-milk">+</button>
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[14.5px]">Weekly cup capacity</span>
            <span className="flex items-center gap-2">
              <button type="button" onClick={() => setCap((v) => Math.max(40, v - 10))} className="h-10 w-10 rounded-full ring-1 ring-forest/15">−</button>
              <span className="w-10 text-center font-mono">{cap}</span>
              <button type="button" onClick={() => setCap((v) => v + 10)} className="h-10 w-10 rounded-full bg-forest text-milk">+</button>
            </span>
          </div>
          <label className="block">
            <span className="mb-2 block text-[13.5px] text-forest/65">Holiday last-order date</span>
            <input className={field} defaultValue="Sat, Dec 19, 2026" />
          </label>
        </div>
      </Card>
      <Card title="Notifications">
        <ul className="space-y-1">
          {([
            ["email", "Email me when a request comes in"],
            ["summary", "Morning summary of today's pick-ups"],
            ["waitlist", "Waitlist new requests when nearly full"],
          ] as const).map(([k, l]) => (
            <li key={k} className="flex items-center justify-between gap-4 rounded-xl px-2 py-3 hover:bg-cream">
              <span className="text-[14.5px]">{l}</span>
              <Toggle on={notify[k]} onChange={() => setNotify((n) => ({ ...n, [k]: !n[k] }))} label={l} />
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-forest/10 pt-5">
          <DemoChip />
          <button type="button" onClick={onSave} className="rounded-full bg-leaf px-6 py-3 text-[11px] font-semibold text-paper transition-colors hover:bg-forest">Save changes</button>
        </div>
      </Card>
    </div>
  );
}

// ───────────────────────────────────────────── detail drawer
function Drawer({ e, onClose, onAdvance, onCopy }: { e: Enquiry | null; onClose: () => void; onAdvance: (e: Enquiry, to: EnquiryStatus) => void; onCopy: (t: string, title: string) => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<Enquiry | null>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    if (e) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- keep content mounted during the exit animation
      setShown(e);
      getLenis()?.stop();
      requestAnimationFrame(() => {
        gsap.fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: reduced ? 0.01 : 0.8, ease: "babe" });
        gsap.fromTo(shade.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      });
    } else if (shown) {
      getLenis()?.start();
      gsap.to(panel.current, { xPercent: 100, duration: reduced ? 0.01 : 0.55, ease: "power3.in" });
      gsap.to(shade.current, { opacity: 0, duration: 0.4, onComplete: () => setShown(null) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [e]);

  useEffect(() => {
    const k = (ev: KeyboardEvent) => ev.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  if (!shown) return null;
  const d = e ?? shown;
  const next = STATUS_META[d.status].next;
  const reply = `Hi ${d.name.split(" ")[0]}! 💚 Your ${KIND_LABEL[d.kind].toLowerCase()} (${d.id}) is ${d.status === "new" ? "received" : d.status} for ${d.date ? fmtDate(d.date, { weekday: "long", month: "short", day: "numeric" }) : "your date"}. Estimated total $${d.total.toFixed(2)} — pay at pick-up with Scan 2 Pay. See you soon, Babe!`;

  return (
    <div className="fixed inset-0 z-50">
      <div ref={shade} className="absolute inset-0 bg-forest/35 backdrop-blur-[2px]" onClick={onClose} />
      <div ref={panel} role="dialog" aria-modal="true" aria-label={`Request ${d.id}`} className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-2xl" data-lenis-prevent>
        <div className="flex items-center justify-between border-b border-forest/10 px-6 py-5">
          <div>
            <p className="font-mono text-[11px] text-forest/50">{d.id} · {d.received}</p>
            <p className="display mt-1 text-2xl leading-none">{KIND_LABEL[d.kind]}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-forest/15 hover:bg-forest hover:text-milk" aria-label="Close" autoFocus>✕</button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Avatar e={d} />
            <div>
              <p className="font-medium">{d.name}</p>
              <p className="text-[13.5px] text-forest/55">{d.handle}</p>
            </div>
            <span className="ml-auto"><StatusPill s={d.status} /></span>
          </div>
          {/* status track */}
          <ol className="grid grid-cols-4 gap-1.5">
            {STATUS_FLOW.map((s, i) => {
              const reached = STATUS_FLOW.indexOf(d.status) >= i;
              return (
                <li key={s}>
                  <span className={`block h-1.5 rounded-full ${reached ? "bg-kelly" : "bg-forest/10"}`} />
                  <span className={`mt-1.5 block text-[9.5px] font-semibold ${reached ? "text-forest" : "text-forest/40"}`}>{STATUS_META[s].label}</span>
                </li>
              );
            })}
          </ol>
          <dl className="space-y-3 rounded-2xl bg-cream p-4 text-[14.5px]">
            <div className="flex justify-between gap-4"><dt className="text-forest/55">Needed</dt><dd className="text-right">{dateShort(d.date)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-forest/55">Where</dt><dd className="text-right">{d.where}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-forest/55">Order</dt><dd className="text-right">{itemsLine(d)}</dd></div>
            {d.milk && <div className="flex justify-between gap-4"><dt className="text-forest/55">Milk / sweet</dt><dd className="text-right">{d.milk} · {d.sweetness}</dd></div>}
            <div className="flex justify-between gap-4"><dt className="text-forest/55">Cups</dt><dd className="text-right">{d.cups}</dd></div>
            {d.loyalty && <div className="flex justify-between gap-4"><dt className="text-forest/55">Loyalty</dt><dd className="text-right text-leaf">Redeeming free latte</dd></div>}
            <div className="flex justify-between gap-4 border-t border-forest/10 pt-3"><dt className="text-forest/55">Est. total</dt><dd className="display text-2xl">${d.total.toFixed(2)}</dd></div>
          </dl>
          {d.note && (
            <div>
              <p className="text-[10.5px] font-semibold text-forest/50">Note</p>
              <p className="serif mt-2 text-xl leading-snug">&ldquo;{d.note}&rdquo;</p>
            </div>
          )}
          <div className="rounded-2xl bg-matcha-mist p-4">
            <p className="text-[10.5px] font-semibold text-forest/60">Suggested reply</p>
            <p className="mt-2 text-[14px] leading-relaxed text-forest/80">{reply}</p>
          </div>
        </div>
        <div className="flex gap-2 border-t border-forest/10 px-6 py-5">
          <button type="button" onClick={() => onCopy(reply, "Reply copied")} className="flex-1 rounded-full px-4 py-3.5 text-[10.5px] font-semibold ring-1 ring-forest/15 transition-colors hover:bg-cream">Copy reply</button>
          {next ? (
            <button type="button" onClick={() => onAdvance(d, next.to)} className="flex-1 rounded-full bg-forest px-4 py-3.5 text-[10.5px] font-semibold text-milk transition-colors hover:bg-leaf">
              {next.label} <Sparkle className="ml-1 inline h-3 w-3" />
            </button>
          ) : (
            <span className="flex-1 rounded-full bg-matcha-soft px-4 py-3.5 text-center text-[10.5px] font-semibold">Ready for pick-up ✓</span>
          )}
        </div>
      </div>
    </div>
  );
}
