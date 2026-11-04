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
  "/menu": "The menu",
  "/order": "Pre-order",
  "/gallery": "Gallery",
  "/dashboard": "Babe HQ",
};

const ARCH_IN = "inset(100% 0% 0% 0% round 50% 50% 0% 0%)";
const COVER = "inset(0% 0% 0% 0% round 0% 0% 0% 0%)";
const ARCH_OUT = "inset(0% 0% 100% 0% round 0% 0% 50% 50%)";

// A tiny jiggle per letter, same spirit as the wordmark.
const JIG = [-4, 3, -2, 4, -3, 2, -3, 3, -2, 4];

/**
 * Route transition — "the arch":
 * a leaf-green panel rises from the bottom with a big rounded top (the
 * same arch as the hero disc), flattening as it covers the screen. The
 * destination name pops in letter by letter, the route swaps underneath,
 * then the panel keeps rising and leaves with a rounded bottom edge,
 * uncovering the new page (whose entrance starts as the reveal begins).
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const pendingPath = useRef<string | null>(null);
  const busy = useRef(false);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    gsap.set(panel.current, { clipPath: ARCH_IN, visibility: "hidden" });
  }, []);

  const reveal = useCallback(() => {
    if (fallback.current) clearTimeout(fallback.current);
    pendingPath.current = null;
    scrollToTopNow();
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      openStage();
      const chars = labelRef.current?.querySelectorAll("[data-t-char]") ?? [];
      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
          gsap.set(panel.current, { clipPath: ARCH_IN, visibility: "hidden" });
        },
      });
      tl.to(chars, { yPercent: -120, rotate: -6, duration: 0.45, stagger: 0.02, ease: "power3.in" }, 0)
        .to(panel.current, { clipPath: ARCH_OUT, duration: 0.95, ease: "expo.inOut" }, 0.12)
        .to(labelRef.current, { yPercent: -30, duration: 0.95, ease: "expo.inOut" }, 0.12);
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
      // wait one frame so the new label is rendered before we animate it
      requestAnimationFrame(() => {
        const chars = labelRef.current?.querySelectorAll("[data-t-char]") ?? [];
        const tl = gsap.timeline({
          onComplete: () => {
            pendingPath.current = path;
            router.push(href, { scroll: false });
            fallback.current = setTimeout(reveal, 2500);
          },
        });
        tl.set(panel.current, { visibility: "visible" })
          .fromTo(panel.current, { clipPath: ARCH_IN }, { clipPath: COVER, duration: 0.8, ease: "expo.inOut" }, 0)
          .set(labelRef.current, { yPercent: 0 }, 0)
          .fromTo(chars, { yPercent: 120, rotate: 10 }, { yPercent: 0, rotate: 0, duration: 0.7, stagger: 0.035, ease: "back.out(1.7)" }, 0.42)
          .to({}, { duration: 0.12 });
      });
    },
    [pathname, reveal, router],
  );

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[110] overflow-hidden">
        <div ref={panel} className="absolute inset-0 bg-leaf text-milk" style={{ clipPath: ARCH_IN, visibility: "hidden" }}>
          <div className="tiles absolute inset-0 opacity-[0.07]" />
          <div className="absolute inset-0 grid place-items-center px-6">
            <div ref={labelRef} className="text-center">
              <div className="display flex justify-center overflow-hidden whitespace-pre pb-[0.08em] text-[clamp(3.4rem,11vw,10rem)] leading-none [font-variation-settings:'wdth'_100] [font-weight:700]">
                {label.split("").map((c, i) => (
                  <span key={`${label}-${i}`} data-t-char className="inline-block">
                    <span className="inline-block" style={{ transform: `rotate(${JIG[i % JIG.length]}deg)` }}>{c}</span>
                  </span>
                ))}
              </div>
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
