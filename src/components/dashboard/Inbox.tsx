"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { KIND_LABEL, type Enquiry, type EnquiryStatus } from "@/data/mock";
import { Sparkle } from "@/components/brand/Brand";
import { Avatar, StatusPill, STATUS_META, itemsLine, dateShort } from "./parts";

type Filter = "all" | EnquiryStatus;

/**
 * Enquiry inbox. When `arrivingId` flips on, the existing rows FLIP down to
 * make room and the new row drops in at the top with a pink highlight sweep
 * and a sprinkle burst — the "it landed" moment.
 */
export function Inbox({
  items, arrivingId, onOpen, onAdvance, limit, showFilters = true,
}: {
  items: Enquiry[];
  arrivingId: string | null;
  onOpen: (e: Enquiry) => void;
  onAdvance: (e: Enquiry, to: EnquiryStatus) => void;
  limit?: number;
  showFilters?: boolean;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const list = useRef<HTMLUListElement>(null);
  const positions = useRef<Map<string, number>>(new Map());
  const shown = items.filter((e) => filter === "all" || e.status === filter).slice(0, limit);

  // Capture row positions every render so a FLIP can start from them.
  useLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    const prev = positions.current;
    const next = new Map<string, number>();
    el.querySelectorAll<HTMLElement>("[data-row]").forEach((r) => next.set(r.dataset.row!, r.offsetTop));
    const reduced = prefersReducedMotion();

    if (arrivingId && !prev.has(arrivingId) && next.has(arrivingId) && prev.size) {
      el.querySelectorAll<HTMLElement>("[data-row]").forEach((r) => {
        const id = r.dataset.row!;
        if (id === arrivingId) return;
        const from = prev.get(id);
        const to = next.get(id)!;
        if (from === undefined) {
          gsap.fromTo(r, { opacity: 0 }, { opacity: 1, duration: 0.5 });
          return;
        }
        if (!reduced) gsap.fromTo(r, { y: from - to }, { y: 0, duration: 1, ease: "babe" });
      });
      const row = el.querySelector<HTMLElement>(`[data-row="${arrivingId}"]`);
      if (row) {
        if (reduced) {
          gsap.fromTo(row, { opacity: 0 }, { opacity: 1, duration: 0.6 });
        } else {
          const tl = gsap.timeline();
          tl.fromTo(row, { clipPath: "inset(0% 0% 100% 0% round 18px)", y: -24, scale: 0.97 }, { clipPath: "inset(0% 0% 0% 0% round 18px)", y: 0, scale: 1, duration: 1.1, ease: "expo.out" }, 0.15)
            .fromTo(row.querySelector("[data-sweep]"), { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, 0.2)
            .to(row.querySelector("[data-sweep]"), { opacity: 0.18, duration: 1.6, ease: "power2.out" }, 1.4)
            .fromTo(row.querySelectorAll("[data-burst]"), { scale: 0, opacity: 1, x: 0, y: 0 }, {
              scale: 1,
              x: (i: number) => Math.cos((i / 8) * Math.PI * 2) * 34,
              y: (i: number) => Math.sin((i / 8) * Math.PI * 2) * 34,
              opacity: 0,
              rotate: 180,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.02,
            }, 0.6)
            .fromTo(row.querySelector("[data-justin]"), { scale: 0, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(3)" }, 0.8);
        }
      }
    }
    positions.current = next;
  });

  const counts = (s: Filter) => (s === "all" ? items.length : items.filter((e) => e.status === s).length);

  return (
    <div>
      {showFilters && (
        <div className="no-scrollbar -mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {(["all", "new", "quoted", "confirmed", "ready"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors ${filter === f ? "bg-forest text-cream" : "bg-cream text-forest/70 hover:text-forest"}`}
            >
              {f === "all" ? "All" : STATUS_META[f].label}
              <span className={`rounded-full px-1.5 py-px text-[10px] ${filter === f ? "bg-cream/20" : "bg-forest/8"}`}>{counts(f)}</span>
            </button>
          ))}
        </div>
      )}
      <ul ref={list} className="space-y-2">
        {shown.map((e) => {
          const next = STATUS_META[e.status].next;
          const isNew = e.id === arrivingId || e.fresh;
          return (
            <li key={e.id} data-row={e.id} className="relative">
              <div className={`group relative flex items-center gap-3 overflow-hidden rounded-[18px] p-3 transition-colors md:gap-4 md:p-3.5 ${isNew ? "ring-2 ring-pink/60" : "hover:bg-cream"}`}>
                <span data-sweep aria-hidden className={`pointer-events-none absolute inset-0 bg-blush ${isNew ? "opacity-[0.18]" : "opacity-0"}`} />
                <button type="button" onClick={() => onOpen(e)} className="relative flex min-w-0 flex-1 items-center gap-3 text-left md:gap-4" aria-label={`Open ${e.id} from ${e.name}`}>
                  <span className="relative">
                    <Avatar e={e} />
                    {isNew && (
                      <span className="absolute left-1/2 top-1/2" aria-hidden>
                        {Array.from({ length: 8 }).map((_, i) => (
                          <Sparkle key={i} className={`absolute -ml-1.5 -mt-1.5 h-3 w-3 scale-0 ${i % 2 ? "text-pink" : "text-matcha"}`} data-burst />
                        ))}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="font-medium">{e.name}</span>
                      <span className="font-mono text-[11px] text-forest/45">{e.id}</span>
                      {isNew && (
                        <span data-justin className="inline-flex items-center gap-1 rounded-full bg-pink px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-paper">
                          <Sparkle className="h-2 w-2" /> Just in
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-[13.5px] text-forest/65">
                      {KIND_LABEL[e.kind]} · {itemsLine(e)}
                    </span>
                  </span>
                  <span className="hidden w-28 shrink-0 text-right lg:block">
                    <span className="block text-[13.5px]">{dateShort(e.date)}</span>
                    <span className="block font-mono text-[10.5px] text-forest/45">{e.cups} cups</span>
                  </span>
                  <span className="hidden w-20 shrink-0 text-right font-mono text-[13px] sm:block">${e.total.toFixed(2)}</span>
                  <span className="hidden w-24 shrink-0 md:block"><StatusPill s={e.status} /></span>
                </button>
                <span className="relative shrink-0">
                  {next ? (
                    <button
                      type="button"
                      onClick={() => onAdvance(e, next.to)}
                      className="rounded-full bg-forest px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-cream transition-colors hover:bg-pink"
                    >
                      {next.label}
                    </button>
                  ) : (
                    <span className="md:hidden"><StatusPill s={e.status} /></span>
                  )}
                </span>
              </div>
              <span className="sr-only">Received {e.received}</span>
            </li>
          );
        })}
        {shown.length === 0 && <li className="rounded-[18px] bg-cream px-4 py-8 text-center text-forest/50">Nothing here yet.</li>}
      </ul>
    </div>
  );
}
