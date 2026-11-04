"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, fontsReady, prefersReducedMotion } from "@/lib/gsap";
import { openStage } from "@/lib/stage";
import { Sparkle } from "@/components/brand/Brand";

const CUP = "M24 50 L33 130 Q34 136 40 136 H60 Q66 136 67 130 L76 50 Z";
const LETTERS_1 = "MATCHA".split("");
const LETTERS_2 = "BABE".split("");

// Decided once per page load (survives React strict-mode double effects).
let decision: "play" | "skip" | null = null;
let finished = false;

/**
 * PRELOADER — "Whisked to order" (≈2.9s, once per session)
 * 1. a line-art iced cup draws itself on cream
 * 2. it fills: cream milk, then a wave of matcha rises; counter runs 00→100
 * 3. the cup collapses into a deep-green disc and the chunky MATCHA / BABE
 *    letters pop in — the badge
 * 4. the green floods the screen and pours away upward; the stage opens at
 *    that moment so the hero rises underneath the exit
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const html = document.documentElement;
      // Already seen this session, or the app booted on another route (e.g. /dashboard)
      // and we arrived here by client navigation: skip.
      if (decision === null) {
        decision = html.classList.contains("mb-seen") || html.classList.contains("motion-ready") ? "skip" : "play";
      }
      if (decision === "skip" || finished) {
        html.classList.add("mb-seen");
        setGone(true);
        openStage();
        return;
      }
      el.setAttribute("data-live", "");
      try { sessionStorage.setItem("mb-intro", "1"); } catch {}
      window.scrollTo(0, 0);
      html.style.overflow = "hidden";

      const q = gsap.utils.selector(el);
      const disc = q("[data-disc]")[0] as HTMLElement;
      const cup = q("[data-cup]")[0] as HTMLElement;
      const counter = q("[data-count]")[0] as HTMLElement;
      const finish = () => {
        finished = true;
        html.style.overflow = "";
        setGone(true);
      };

      if (prefersReducedMotion()) {
        gsap.set(q("[data-draw]"), { strokeDashoffset: 0 });
        gsap.set(q("[data-liquid]"), { y: 0 });
        const tl = gsap.timeline({ delay: 0.5, onComplete: finish });
        tl.add(() => openStage()).to(el, { autoAlpha: 0, duration: 0.6, ease: "none" });
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const discR = Math.min(vw, vh) * 0.3;
      const fullR = Math.hypot(vw, vh);

      gsap.set(q("[data-draw]"), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(q("[data-liquid]"), { y: 100 });
      gsap.set(q("[data-milk]"), { y: 100 });
      gsap.set(disc, { clipPath: "circle(0px at 50% 47%)" });
      gsap.set(q("[data-char]"), { yPercent: 110, rotate: 8 });
      gsap.set(q("[data-spark]"), { scale: 0, opacity: 0 });

      // gentle wave on the liquid surface
      gsap.to(q("[data-wave]"), { x: -50, duration: 1.1, ease: "none", repeat: -1 });

      const tl = gsap.timeline({ paused: true, onComplete: finish });
      const count = { v: 0 };
      tl.to(q("[data-draw]"), { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.12 }, 0)
        .to(q("[data-milk]"), { y: 52, duration: 0.7, ease: "power2.out" }, 0.45)
        .to(q("[data-liquid]"), { y: 18, duration: 1.05, ease: "power2.inOut" }, 0.65)
        .to(count, {
          v: 100, duration: 1.6, ease: "power2.inOut",
          onUpdate: () => { counter.textContent = String(Math.round(count.v)).padStart(2, "0"); },
        }, 0.2)
        // cup becomes the badge
        .to(disc, { clipPath: `circle(${discR}px at 50% 47%)`, duration: 0.7, ease: "expo.out" }, 1.72)
        .to(cup, { scale: 0.4, opacity: 0, duration: 0.45, ease: "power2.in" }, 1.68)
        .to(q("[data-char]"), { yPercent: 0, rotate: 0, duration: 0.7, ease: "back.out(2.4)", stagger: 0.035 }, 1.95)
        .to(q("[data-spark]"), { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.05 }, 2.05)
        .to(q("[data-spark]"), { scale: 0, opacity: 0, duration: 0.35, ease: "power2.in", stagger: 0.03 }, 2.5)
        .to(q("[data-meta]"), { opacity: 0, duration: 0.3 }, 2.4)
        // hand-off: the stage opens as the pour begins
        .add(() => openStage(), 2.62)
        .to(disc, { clipPath: `circle(${fullR}px at 50% 47%)`, duration: 0.7, ease: "power3.in" }, 2.55)
        .to(q("[data-badge]"), { scale: 1.08, opacity: 0, duration: 0.45, ease: "power2.in" }, 2.62)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.85, ease: "babeInOut" }, 2.95);

      let alive = true;
      fontsReady(900).then(() => {
        if (alive) tl.play();
      });
      return () => {
        alive = false;
        html.style.overflow = "";
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="preloader fixed inset-0 z-[130] overflow-hidden bg-cream text-forest" aria-hidden style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
      <div className="absolute inset-0 opacity-[0.12] mix-blend-multiply" style={{ backgroundImage: "var(--grain)" }} />

      {/* the cup */}
      <div className="absolute inset-0 grid place-items-center">
        <div data-cup className="relative -mt-[6vh] aspect-[100/140] w-[min(34vw,170px)]">
          <svg viewBox="0 0 100 140" className="h-full w-full overflow-visible">
            <defs>
              <clipPath id="pl-cup">
                <path d={CUP} />
              </clipPath>
            </defs>
            <g clipPath="url(#pl-cup)">
              <g data-milk>
                <rect x="0" y="0" width="100" height="140" fill="var(--color-paper)" />
              </g>
              <g data-liquid>
                <g data-wave>
                  <path d="M0 6 Q12.5 0 25 6 T50 6 T75 6 T100 6 T125 6 T150 6 V140 H0 Z" fill="var(--color-matcha)" />
                </g>
              </g>
              <rect x="38" y="84" width="11" height="11" rx="2" fill="none" stroke="var(--color-paper)" strokeOpacity=".7" strokeWidth="1.5" />
              <rect x="52" y="98" width="10" height="10" rx="2" fill="none" stroke="var(--color-paper)" strokeOpacity=".7" strokeWidth="1.5" transform="rotate(12 57 103)" />
            </g>
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path data-draw pathLength={1} d="M57 36 L68 2" stroke="var(--color-pink)" strokeWidth="4" />
              <path data-draw pathLength={1} d={CUP} stroke="var(--color-forest)" strokeWidth="2.4" />
              <path data-draw pathLength={1} d="M20 46 Q50 20 80 46" stroke="var(--color-forest)" strokeWidth="2.4" />
              <path data-draw pathLength={1} d="M16 47 H84" stroke="var(--color-forest)" strokeWidth="2.4" />
            </g>
          </svg>
        </div>
      </div>

      {/* green disc → badge → flood */}
      <div data-disc className="absolute inset-0 bg-forest">
        <div data-badge className="absolute inset-0 grid place-items-center">
          <div className="-mt-[6vh] text-center text-cream">
            <div className="display flex justify-center overflow-hidden text-[clamp(3rem,11vmin,6.6rem)] leading-[0.9]">
              {LETTERS_1.map((c, i) => (
                <span key={i} data-char className="inline-block">{c}</span>
              ))}
            </div>
            <div className="display flex justify-center overflow-hidden text-[clamp(3.9rem,14.5vmin,8.8rem)] leading-[0.9]">
              {LETTERS_2.map((c, i) => (
                <span key={i} data-char className="inline-block">{c}</span>
              ))}
            </div>
          </div>
          {[
            ["30%", "28%", 18, "text-blush"], ["68%", "24%", 12, "text-matcha-soft"], ["74%", "62%", 20, "text-pink"],
            ["24%", "64%", 14, "text-lav"], ["50%", "18%", 10, "text-cream"],
          ].map(([l, t, s, c], i) => (
            <span key={i} data-spark className={`absolute ${c}`} style={{ left: l as string, top: t as string }}>
              <Sparkle style={{ width: s as number, height: s as number }} />
            </span>
          ))}
        </div>
      </div>

      {/* meta */}
      <div data-meta className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-8">
        <div className="label">
          Whisking <span data-count className="tabular-nums">00</span>
        </div>
        <div className="label hidden text-right sm:block">Organic ceremonial · Handcrafted to order</div>
      </div>
    </div>
  );
}
