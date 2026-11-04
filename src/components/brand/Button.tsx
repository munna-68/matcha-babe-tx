"use client";

import type { ReactNode, ButtonHTMLAttributes } from "react";
import { TransitionLink } from "@/components/motion/PageTransition";

type Variant = "pink" | "forest" | "ghost" | "cream";

const STYLES: Record<Variant, string> = {
  pink: "bg-pink text-paper",
  forest: "bg-forest text-cream",
  ghost: "border border-forest/30 text-forest",
  cream: "bg-cream text-forest",
};

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      {/* fill that floods up from the bottom on hover */}
      <span className="absolute inset-0 translate-y-[101%] rounded-full bg-forest-deep transition-transform duration-700 ease-[var(--ease-babe)] group-hover:translate-y-0" />
      <span className="relative flex items-center gap-3 transition-colors duration-500 group-hover:text-cream">
        {children}
        {arrow && (
          <span className="relative h-4 w-4 overflow-hidden">
            <span className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-babe)] group-hover:translate-x-full">→</span>
            <span className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-[var(--ease-babe)] group-hover:translate-x-0">→</span>
          </span>
        )}
      </span>
    </>
  );
}

const base =
  "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-4 font-mono text-[12px] font-medium uppercase tracking-[0.18em] will-change-transform select-none";

/** Magnetic pill link (route transition aware). */
export function ButtonLink({
  href, children, variant = "pink", arrow = true, className = "", label, cursor,
}: { href: string; children: ReactNode; variant?: Variant; arrow?: boolean; className?: string; label?: string; cursor?: string }) {
  return (
    <TransitionLink href={href} label={label} data-magnetic="0.3" data-cursor={cursor} className={`${base} ${STYLES[variant]} ${className}`}>
      <Inner arrow={arrow}>{children}</Inner>
    </TransitionLink>
  );
}

export function Button({
  children, variant = "pink", arrow = false, className = "", ...rest
}: { children: ReactNode; variant?: Variant; arrow?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button data-magnetic="0.25" className={`${base} ${STYLES[variant]} disabled:pointer-events-none disabled:opacity-40 ${className}`} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}
