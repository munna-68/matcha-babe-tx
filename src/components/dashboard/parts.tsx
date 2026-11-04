"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { KIND_LABEL, type Enquiry, type EnquiryStatus } from "@/data/mock";
import { fmtDate } from "@/lib/dates";

export const STATUS_META: Record<EnquiryStatus, { label: string; cls: string; next?: { to: EnquiryStatus; label: string } }> = {
  new: { label: "New", cls: "bg-pink text-paper", next: { to: "quoted", label: "Send quote" } },
  quoted: { label: "Quoted", cls: "bg-lav text-forest", next: { to: "confirmed", label: "Confirm" } },
  confirmed: { label: "Confirmed", cls: "bg-matcha-soft text-forest", next: { to: "ready", label: "Mark ready" } },
  ready: { label: "Ready", cls: "bg-forest text-cream" },
};

export function StatusPill({ s }: { s: EnquiryStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${STATUS_META[s].cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STATUS_META[s].label}
    </span>
  );
}

export function Card({ children, className = "", title, action, ...rest }: { children: ReactNode; className?: string; title?: string; action?: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-dash className={`min-w-0 rounded-[24px] p-5 md:p-6 ${/\bbg-/.test(className) ? "" : "bg-paper ring-1 ring-forest/8"} ${className}`} {...rest}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-forest/60">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function DemoChip() {
  return <span className="rounded-full border border-current/25 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] opacity-60">demo data</span>;
}

/** Animated number that tweens when the value changes. */
export function Num({ value, className = "", decimals = 0, prefix = "" }: { value: number; className?: string; decimals?: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = { v: prev.current };
    const t = gsap.to(o, {
      v: value,
      duration: prefersReducedMotion() ? 0.01 : 1.4,
      ease: "power3.out",
      onUpdate: () => { el.textContent = `${prefix}${o.v.toFixed(decimals)}`; },
    });
    if (prev.current && value > prev.current && !prefersReducedMotion()) {
      gsap.fromTo(el, { color: "var(--color-pink)", scale: 1.15 }, { color: "inherit", scale: 1, duration: 1.2, ease: "babe" });
    }
    prev.current = value;
    return () => { t.kill(); };
  }, [value, decimals, prefix]);
  return <span ref={ref} className={`inline-block tabular-nums ${className}`}>{prefix}{value.toFixed(decimals)}</span>;
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-500 ${on ? "bg-kelly" : "bg-forest/15"}`}
    >
      <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-paper shadow transition-transform duration-500 ease-[var(--ease-babe)] ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

export function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

const KIND_DOT: Record<Enquiry["kind"], string> = { pickup: "bg-matcha", bottles: "bg-blush", event: "bg-lav" };

export function Avatar({ e }: { e: Enquiry }) {
  return (
    <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream font-mono text-[12px] font-medium text-forest ring-1 ring-forest/10">
      {initials(e.name)}
      <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-paper ${KIND_DOT[e.kind]}`} title={KIND_LABEL[e.kind]} />
    </span>
  );
}

export const itemsLine = (e: Enquiry) =>
  e.kind === "event" ? `${e.items[0]?.name ?? "Event"} · ${e.guests} guests` : e.items.map((i) => `${i.qty}× ${i.name}`).join(", ");

export const dateShort = (iso: string) => (iso ? fmtDate(iso, { weekday: "short", month: "short", day: "numeric" }) : "—");

/** Little toast stack (bottom-right desktop, top on mobile). */
export function useToasts() {
  const [toasts, setToasts] = useState<{ id: number; title: string; body?: string; tone?: "pink" | "forest" }[]>([]);
  const push = (title: string, body?: string, tone: "pink" | "forest" = "forest") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, title, body, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  };
  return { toasts, push };
}

export function Toasts({ toasts }: { toasts: ReturnType<typeof useToasts>["toasts"] }) {
  return (
    <div className="pointer-events-none fixed inset-x-3 top-3 z-[100] flex flex-col items-end gap-2 md:inset-x-auto md:bottom-6 md:right-6 md:top-auto">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto w-full max-w-sm animate-[toast-in_.6s_var(--ease-babe)] rounded-2xl px-5 py-4 shadow-[0_24px_60px_-24px_rgba(5,63,28,.7)] ${t.tone === "pink" ? "bg-pink text-paper" : "bg-forest text-cream"}`}
        >
          <p className="font-medium">{t.title}</p>
          {t.body && <p className="mt-0.5 text-[13.5px] opacity-80">{t.body}</p>}
        </div>
      ))}
      <style>{`@keyframes toast-in{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
