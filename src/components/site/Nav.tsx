"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onStage } from "@/lib/stage";
import { TransitionLink } from "@/components/motion/PageTransition";
import { Wordmark, Icon } from "@/components/brand/Brand";
import { getLenis } from "@/components/motion/SmoothScroll";
import { DROPS } from "@/data/mock";

const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Pre-order" },
  { href: "/gallery", label: "Gallery" },
  { href: "/order?type=event", label: "Events" },
];

/**
 * Reference layout: wordmark left, links centred, a round bag button right,
 * and a hairline rule under the whole bar. Hides on scroll down, returns
 * on scroll up with a solid cream ground.
 */
export function Nav() {
  const pathname = usePathname();
  const bar = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const next = DROPS[0];

  useGSAP(
    (_c, contextSafe) => {
      const el = bar.current;
      if (!el || !contextSafe) return;
      const items = el.querySelectorAll("[data-nav-in]");
      const rule = el.querySelector("[data-nav-rule]");
      if (!prefersReducedMotion()) {
        gsap.set(items, { yPercent: -140, opacity: 0 });
        gsap.set(rule, { scaleX: 0 });
      }
      const un = onStage(
        contextSafe(() => {
          gsap.to(items, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.06, delay: 0.25, ease: "expo.out" });
          gsap.to(rule, { scaleX: 1, duration: 1.4, delay: 0.2, ease: "expo.inOut" });
        }),
      );
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          setScrolled(self.scroll() > 40);
          if (self.scroll() < 120) return gsap.to(el, { yPercent: 0, duration: 0.6, overwrite: "auto" });
          gsap.to(el, { yPercent: self.direction === 1 ? -120 : 0, duration: 0.6, ease: "babe", overwrite: "auto" });
        },
      });
      return () => {
        un();
        st.kill();
      };
    },
    { scope: bar },
  );

  // mobile sheet: a forest arch rises from the bottom
  useEffect(() => {
    const el = sheet.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-sheet-item]");
    const reduced = prefersReducedMotion();
    if (open) {
      getLenis()?.stop();
      gsap.set(el, { display: "flex" });
      gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0% round 50% 50% 0 0)" }, { clipPath: "inset(0% 0% 0% 0% round 0% 0% 0 0)", duration: reduced ? 0.01 : 0.8, ease: "expo.inOut" });
      gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06, delay: reduced ? 0 : 0.3, ease: "expo.out" });
    } else {
      getLenis()?.start();
      gsap.to(el, { clipPath: "inset(0% 0% 100% 0% round 0 0 50% 50%)", duration: reduced ? 0.01 : 0.6, ease: "expo.inOut", onComplete: () => { gsap.set(el, { display: "none" }); } });
    }
  }, [open]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the sheet on route change
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => href.split("?")[0] === pathname && !href.includes("?");

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-[100]">
        <div className={`transition-[background-color] duration-500 ${scrolled ? "bg-cream/95" : "bg-transparent"}`}>
          <nav className="relative mx-auto flex max-w-[1440px] items-center justify-between px-[var(--gutter)] py-4 md:py-5" aria-label="Main">
            <TransitionLink href="/" aria-label="Matcha Babe home" data-nav-in className="relative z-[102] block text-forest">
              <Wordmark className={`text-[25px] transition-colors md:text-[29px] ${open ? "text-milk" : ""}`} />
            </TransitionLink>

            <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
              {LINKS.map((l) => (
                <li key={l.href} data-nav-in>
                  <TransitionLink
                    href={l.href}
                    className={`group relative block rounded-full px-4 py-2 text-[16px] font-medium ${isActive(l.href) ? "text-forest" : "text-forest/80 hover:text-forest"}`}
                  >
                    <span className="roll">
                      <span>{l.label}</span>
                      <span aria-hidden>{l.label}</span>
                    </span>
                    <span className={`absolute inset-x-4 -bottom-0.5 h-[2px] origin-left rounded-full bg-forest transition-transform duration-500 ease-[var(--ease-babe)] ${isActive(l.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                  </TransitionLink>
                </li>
              ))}
            </ul>

            <div className="relative z-[102] flex items-center gap-2 md:gap-3">
              <TransitionLink
                href="/dashboard"
                data-nav-in
                className="hidden rounded-full px-3 py-2 text-[14px] font-medium text-forest/60 transition-colors hover:text-forest lg:block"
              >
                Babe HQ
              </TransitionLink>
              <span data-nav-in className="block">
                <TransitionLink
                  href="/order"
                  aria-label="Start a pre-order"
                  title="Pre-order"
                  className="grid h-12 w-12 place-items-center rounded-full bg-milk text-forest shadow-[0_10px_30px_-14px_rgba(31,58,31,.45)] transition-[translate] duration-500 hover:-translate-y-0.5 md:h-14 md:w-14"
                >
                  <Icon name="bag" className="h-[22px] w-[22px]" />
                </TransitionLink>
              </span>
              <button
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className={`grid h-12 w-12 place-items-center rounded-full transition-colors md:hidden ${open ? "bg-milk text-forest" : "bg-forest text-milk"}`}
              >
                <span className={`absolute h-[2px] w-5 rounded bg-current transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
                <span className={`absolute h-[2px] w-5 rounded bg-current transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
              </button>
            </div>
          </nav>
          <div className="mx-auto max-w-[1440px] px-[var(--gutter)]">
            <div data-nav-rule className="h-px origin-left bg-forest/25" />
          </div>
        </div>
      </header>

      {/* mobile sheet */}
      <div ref={sheet} className="fixed inset-0 z-[101] hidden flex-col justify-between bg-forest px-6 pb-8 pt-28 text-milk md:hidden" style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
        <ul className="space-y-1">
          {[{ href: "/", label: "Home" }, ...LINKS, { href: "/dashboard", label: "Babe HQ" }].map((l) => (
            <li key={l.href} className="overflow-hidden">
              <TransitionLink href={l.href} data-sheet-item className={`display block text-[13vw] leading-[1.1] ${isActive(l.href) ? "text-matcha-soft" : ""}`}>
                {l.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-milk/20 pt-5">
          <p className="text-sm text-milk/60">Next pop-up</p>
          <p className="display text-2xl">
            {next.day} {new Date(next.date + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {next.title}
          </p>
          <p className="text-sm text-milk/70">{next.place}, {next.time}</p>
        </div>
      </div>
    </>
  );
}
