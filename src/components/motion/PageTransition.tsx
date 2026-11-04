"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type AnchorHTMLAttributes, type MouseEvent, type ReactNode,
} from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { closeStage, openStage } from "@/lib/stage";
import { getLenis, scrollToTopNow } from "./SmoothScroll";

type Ctx = { navigate: (href: string, label?: string) => void };
const TransitionCtx = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionCtx);

const LABELS: Record<string, string> = {
  "/": "Hi, Babe",
  "/menu": "The Menu",
  "/order": "Pre-order",
  "/gallery": "Gallery",
  "/dashboard": "Babe HQ",
};

const Wave = ({ flip = false, className = "" }: { flip?: boolean; className?: string }) => (
  <svg
    viewBox="0 0 1440 90"
    preserveAspectRatio="none"
    className={`absolute left-0 h-[70px] w-full md:h-[110px] ${flip ? "top-full rotate-180" : "bottom-full"} ${className}`}
    aria-hidden
  >
    <path
      d="M0 90V52C120 22 250 6 400 18s260 54 420 50 300-56 440-58c80-1 140 12 180 26v62z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Route transition: a pink "straw stripe" and a matcha-green pour sweep up
 * over the page, the destination name pops in, the route swaps underneath,
 * and the pour keeps rising to reveal the new page (whose entrance animations
 * start as the reveal begins, via the stage gate).
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pink = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const pendingPath = useRef<string | null>(null);
  const busy = useRef(false);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    gsap.set([pink.current, panel.current], { yPercent: 100, y: 120 });
  }, []);

  const reveal = useCallback(() => {
    if (fallback.current) clearTimeout(fallback.current);
    pendingPath.current = null;
    scrollToTopNow();
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      openStage();
      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
          gsap.set([pink.current, panel.current], { yPercent: 100, y: 120 });
        },
      });
      tl.to(labelRef.current, { yPercent: -60, opacity: 0, duration: 0.45, ease: "power2.in" }, 0)
        .to(panel.current, { yPercent: -100, y: -140, duration: 1.05, ease: "babeInOut" }, 0.05)
        .to(pink.current, { yPercent: -100, y: -140, duration: 1.05, ease: "babeInOut" }, 0.14);
      getLenis()?.start();
    });
  }, []);

  useEffect(() => {
    if (pendingPath.current && pathname === pendingPath.current) reveal();
  }, [pathname, reveal]);

  const navigate = useCallback(
    (href: string, l?: string) => {
      const path = href.split(/[?#]/)[0] || "/";
      if (busy.current) return;
      if (path === pathname && !href.includes("?")) {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      busy.current = true;
      setLabel(l ?? LABELS[path] ?? "Matcha Babe");
      closeStage();
      getLenis()?.stop();
      router.prefetch(href);
      const tl = gsap.timeline({
        onComplete: () => {
          pendingPath.current = path;
          router.push(href, { scroll: false });
          fallback.current = setTimeout(reveal, 2500);
        },
      });
      tl.fromTo(pink.current, { yPercent: 100, y: 120 }, { yPercent: 0, y: 0, duration: 0.85, ease: "babeInOut" }, 0)
        .fromTo(panel.current, { yPercent: 100, y: 120 }, { yPercent: 0, y: 0, duration: 0.85, ease: "babeInOut" }, 0.1)
        .fromTo(labelRef.current, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "babe" }, 0.55);
    },
    [pathname, reveal, router],
  );

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[110] overflow-hidden">
        <div ref={pink} className="absolute inset-0 bg-pink text-pink will-change-transform" style={{ transform: "translateY(120%)" }}>
          <Wave />
          <Wave flip />
        </div>
        <div ref={panel} className="absolute inset-0 bg-forest text-forest will-change-transform" style={{ transform: "translateY(120%)" }}>
          <Wave />
          <Wave flip />
          <div className="absolute inset-0 grid place-items-center">
            <div ref={labelRef} className="text-center opacity-0">
              <div className="label mb-4 text-matcha-soft">Whisking</div>
              <div className="display text-[clamp(3rem,10vw,9rem)] text-cream">{label}</div>
            </div>
          </div>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}

type TLProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { label?: string; children: ReactNode };

/** Drop-in replacement for <Link> that plays the route transition. */
export function TransitionLink({ href, label, onClick, children, ...rest }: TLProps) {
  const { navigate } = usePageTransition();
  const h = typeof href === "string" ? href : String((href as { pathname?: string }).pathname ?? "/");
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(h, label);
      }}
    >
      {children}
    </Link>
  );
}
