"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onStage } from "@/lib/stage";
import { TransitionLink } from "@/components/motion/PageTransition";
import { Badge, Sparkle } from "@/components/brand/Brand";
import { getLenis } from "@/components/motion/SmoothScroll";
import { DROPS } from "@/data/mock";

const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/order", label: "Pre-order" },
];

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
      gsap.set(el, { yPercent: -120 });
      const un = onStage(contextSafe(() => gsap.to(el, { yPercent: 0, duration: 1.2, delay: 0.35, ease: "babe" })));
      // hide on scroll down, show on scroll up
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

  // mobile sheet
  useEffect(() => {
    const el = sheet.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-sheet-item]");
    const reduced = prefersReducedMotion();
    if (open) {
      getLenis()?.stop();
      gsap.set(el, { display: "flex" });
      gsap.fromTo(el, { clipPath: "circle(0% at 92% 4%)" }, { clipPath: "circle(150% at 92% 4%)", duration: reduced ? 0.01 : 0.9, ease: "babeInOut" });
      gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06, delay: 0.25, ease: "babe" });
    } else {
      getLenis()?.start();
      gsap.to(el, { clipPath: "circle(0% at 92% 4%)", duration: reduced ? 0.01 : 0.6, ease: "babeInOut", onComplete: () => { gsap.set(el, { display: "none" }); } });
    }
  }, [open]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the sheet on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 md:px-6 md:pt-4">
        <nav
          className={`mx-auto flex max-w-[1500px] items-center justify-between rounded-full py-2 pl-2 pr-2 transition-[background-color,box-shadow,backdrop-filter] duration-500 md:pr-3 ${
            scrolled ? "bg-paper/80 shadow-[0_10px_40px_-20px_rgba(5,63,28,.35)] backdrop-blur-md" : "bg-transparent"
          }`}
          aria-label="Main"
        >
          <TransitionLink href="/" className="flex items-center gap-3" aria-label="Matcha Babe home" data-cursor="Home">
            <Badge className="h-11 w-11 transition-transform duration-700 ease-[var(--ease-babe)] hover:rotate-[-12deg] md:h-12 md:w-12" />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="display text-[17px] text-forest">Matcha Babe</span>
              <span className="label !text-[9px] !tracking-[0.2em] text-forest/60">McAllen · RGV</span>
            </span>
          </TransitionLink>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <TransitionLink
                    href={l.href}
                    className={`group relative block overflow-hidden rounded-full px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.18em] ${active ? "text-pink" : "text-forest"}`}
                  >
                    <span className="block transition-transform duration-500 ease-[var(--ease-babe)] group-hover:-translate-y-full">{l.label}</span>
                    <span aria-hidden className="absolute inset-0 flex translate-y-full items-center justify-center text-pink transition-transform duration-500 ease-[var(--ease-babe)] group-hover:translate-y-0">
                      {l.label}
                    </span>
                    {active && <Sparkle className="absolute -right-0.5 top-1.5 h-2 w-2 text-pink" />}
                  </TransitionLink>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <TransitionLink
              href="/order"
              className="hidden items-center gap-2 rounded-full border border-forest/15 px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-forest/80 transition-colors hover:border-pink hover:text-pink lg:flex"
              data-cursor="Order"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pink" />
              </span>
              Next drop · {next.day} {next.date.slice(5).replace("-", "/")}
            </TransitionLink>
            <TransitionLink
              href="/dashboard"
              className="hidden rounded-full px-3 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-forest/55 transition-colors hover:text-forest md:block"
            >
              Babe HQ
            </TransitionLink>
            <TransitionLink
              href="/order"
              data-magnetic="0.3"
              className="hidden rounded-full bg-forest px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-cream transition-colors duration-500 hover:bg-pink sm:block"
            >
              Pre-order
            </TransitionLink>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-[102] grid h-11 w-11 place-items-center rounded-full bg-forest text-cream md:hidden"
            >
              <span className={`absolute h-[2px] w-5 bg-current transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute h-[2px] w-5 bg-current transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* mobile sheet */}
      <div ref={sheet} className="fixed inset-0 z-[101] hidden flex-col justify-between bg-forest px-6 pb-8 pt-28 text-cream md:hidden" style={{ clipPath: "circle(0% at 92% 4%)" }}>
        <ul className="space-y-1">
          {[{ href: "/", label: "Home" }, ...LINKS, { href: "/dashboard", label: "Babe HQ" }].map((l) => (
            <li key={l.href} className="overflow-hidden">
              <TransitionLink href={l.href} data-sheet-item className={`display block text-[16vw] leading-[1.02] ${pathname === l.href ? "text-pink" : ""}`}>
                {l.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <div className="space-y-2">
          <p className="label text-matcha-soft">Next drop</p>
          <p className="serif text-2xl">
            {next.day} {next.date.slice(5).replace("-", "/")} · {next.title}, {next.time}
          </p>
          <p className="text-sm text-cream/70">{next.place}</p>
        </div>
      </div>
    </>
  );
}
