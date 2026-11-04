"use client";

import type { ReactNode, ButtonHTMLAttributes } from "react";
import { TransitionLink } from "@/components/motion/PageTransition";
import { Icon } from "./Brand";

/** Old variant names still work: pink/forest → solid, cream → milk. */
type Variant = "solid" | "milk" | "ghost" | "ghost-light" | "pink" | "forest" | "cream";

const CLASS: Record<Variant, string> = {
  solid: "btn-solid",
  pink: "btn-solid",
  forest: "btn-solid",
  milk: "btn-milk",
  cream: "btn-milk",
  ghost: "btn-ghost",
  "ghost-light": "btn-ghost-light",
};

/** Label that rolls up on hover, plus an optional arrow. */
function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      {typeof children === "string" ? (
        <span className="roll">
          <span>{children}</span>
          <span aria-hidden>{children}</span>
        </span>
      ) : (
        children
      )}
      {arrow && <Icon name="arrow" className="arrow h-[1.1em] w-[1.1em]" />}
    </>
  );
}

/** Pill link (route-transition aware). `cursor` is accepted for old call sites and ignored. */
export function ButtonLink({
  href, children, variant = "solid", arrow = true, className = "", label,
}: { href: string; children: ReactNode; variant?: Variant; arrow?: boolean; className?: string; label?: string; cursor?: string }) {
  return (
    <TransitionLink href={href} label={label} className={`btn ${CLASS[variant]} ${className}`}>
      <Inner arrow={arrow}>{children}</Inner>
    </TransitionLink>
  );
}

export function Button({
  children, variant = "solid", arrow = false, className = "", ...rest
}: { children: ReactNode; variant?: Variant; arrow?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`btn ${CLASS[variant]} disabled:pointer-events-none disabled:opacity-40 ${className}`} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}
