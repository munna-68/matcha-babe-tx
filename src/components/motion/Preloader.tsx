"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, fontsReady, prefersReducedMotion } from "@/lib/gsap";
import { openStage, claimHeroWord } from "@/lib/stage";
import { Wordmark, LeafShadow } from "@/components/brand/Brand";

// Decided once per page load (survives React strict-mode double effects).
let decision: "play" | "skip" | null = null;
let finished = false;

/** A wavy liquid surface as a clip-path polygon. level 0 = empty, 1 = full. */
function wave(level: number, phase: number, amp: number) {
  const top = 112 - level * 124; // from below the box to above it
  const pts: string[] = [];
  for (let x = -6; x <= 106; x += 4) {
    const y = top + Math.sin(x * 0.075 + phase) * amp + Math.sin(x * 0.21 + phase * 1.7) * amp * 0.35;
    pts.push(`${x}% ${y.toFixed(2)}%`);
  }
  pts.push("106% 115%", "-6% 115%");
  return `polygon(${pts.join(",")})`;
}

/**
 * PRELOADER — "Poured to order" (~3s, once per session)
 * 1. the MATCHA / BABE wordmark rises in as an outline on the cream wall
 * 2. matcha pours in: a wavy latte-green fill rises through the letters
 *    while the counter runs 000 → 100
 * 3. the fill settles into deep leaf ink, the letters do a little hop
 * 4. the word flies into its place in the hero (FLIP) while the wall
 *    fades away underneath — the preloader becomes the hero.
 *    On pages without a hero word, the cover lifts away instead.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const html = document.documentElement;
      if (decision === null) {
        decision = html.classList.contains("mb-seen") || html.classList.contains("motion-ready") ? "skip" : "play";
      }
      if (decision === "skip" || finished) {
        html.classList.add("mb-seen");
        setGone(true);
        openStage();
        return;
      }

      const target = document.querySelector<HTMLElement>("[data-hero-word] .puff");
      const reduced = prefersReducedMotion();
      if (target && !reduced) claimHeroWord();

      el.setAttribute("data-live", "");
      try { sessionStorage.setItem("mb-intro", "1"); } catch {}
      window.scrollTo(0, 0);
      html.style.overflow = "hidden";

      const q = gsap.utils.selector(el);
      const word = q("[data-pl-word]")[0] as HTMLElement;
      const fill = q("[data-pl-fill]")[0] as HTMLElement;
      const outline = q("[data-pl-outline]")[0] as HTMLElement;
      const counter = q("[data-count]")[0] as HTMLElement;
      const allChars = q("[data-wm-char]");
      const fillChars = q("[data-pl-fill] [data-wm-char]");

      const finish = () => {
        finished = true;
        html.classList.add("mb-seen");
        html.style.overflow = "";
        setGone(true);
      };

      if (reduced) {
        fill.style.clipPath = "none";
        fill.style.color = "var(--color-forest)";
        counter.textContent = "100";
        gsap.timeline({ delay: 0.6, onComplete: finish })
          .add(() => openStage())
          .to(el, { autoAlpha: 0, duration: 0.6, ease: "none" });
        return;
      }

      const liquid = { level: 0, phase: 0, amp: 5 };
      const draw = () => {
        fill.style.clipPath = wave(liquid.level, liquid.phase, liquid.amp);
        counter.textContent = String(Math.round(liquid.level * 100)).padStart(3, "0");
      };
      draw();
      gsap.set(allChars, { yPercent: 70, rotate: 9, opacity: 0 });
      const slosh = gsap.to(liquid, { phase: Math.PI * 6, duration: 3.2, ease: "none", repeat: -1, onUpdate: draw });

      const tl = gsap.timeline({ paused: true, onComplete: finish });
      // both layers share one stagger so outline and fill stay locked together
      const n = fillChars.length;
      tl.to(allChars, { yPercent: 0, rotate: 0, opacity: 1, duration: 0.9, stagger: (i: number) => (i % n) * 0.05, ease: "back.out(1.6)" }, 0)
        .to(liquid, { level: 1, duration: 1.45, ease: "power1.inOut" }, 0.3)
        .to(liquid, { amp: 0, duration: 0.5, ease: "power2.out" }, 1.4)
        .to(fill, { color: "var(--color-forest)", duration: 0.35, ease: "power1.out" }, 1.62)
        .to(outline, { opacity: 0, duration: 0.3 }, 1.62)
        .add(() => slosh.kill(), 1.9)
        // a little hop, letter by letter
        .to(fillChars, { yPercent: -10, duration: 0.17, stagger: 0.03, ease: "power2.out", yoyo: true, repeat: 1 }, 1.78)
        .to(q("[data-pl-meta]"), { opacity: 0, duration: 0.3 }, 2.0);

      if (target) {
        // FLIP into the hero word. Same component + em sizing = same proportions.
        tl.add(() => {
          openStage();
          const w = word.getBoundingClientRect();
          const p = (outline.querySelector(".puff") as HTMLElement).getBoundingClientRect();
          const b = target.getBoundingClientRect();
          const s = b.width / p.width;
          gsap.to(word, {
            x: b.left - w.left - (p.left - w.left) * s,
            y: b.top - w.top - (p.top - w.top) * s,
            scale: s,
            duration: 0.85,
            ease: "expo.inOut",
          });
        }, 2.12)
          .to(q("[data-pl-bg]"), { opacity: 0, duration: 0.55, ease: "power1.inOut" }, 2.4)
          .to({}, { duration: 0.01 }, 2.98);
      } else {
        tl.add(() => openStage(), 2.15)
          .to(word, { yPercent: -40, duration: 0.9, ease: "expo.inOut" }, 2.1)
          .to(el, { clipPath: "inset(0% 0% 100% 0% round 0 0 50% 50%)", duration: 0.9, ease: "expo.inOut" }, 2.1);
      }

      let alive = true;
      fontsReady(1200).then(() => {
        // fonts change the word's size: measure on the next frame
        requestAnimationFrame(() => alive && tl.play());
      });
      return () => {
        alive = false;
        slosh.kill();
        html.style.overflow = "";
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="preloader fixed inset-0 z-[130] overflow-hidden text-forest" aria-hidden style={{ clipPath: "inset(0% 0% 0% 0% round 0 0 0 0)" }}>
      <div data-pl-bg className="absolute inset-0 bg-cream">
        <LeafShadow className="-left-[6vw] -top-[4vw] w-[46vw] rotate-[8deg]" />
        <LeafShadow className="-bottom-[10vw] -right-[6vw] w-[40vw] rotate-[160deg]" />
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <div data-pl-word className="relative flex text-[min(22vw,26vh)] md:text-[min(17vw,27vh)]" style={{ transformOrigin: "0 0" }}>
          <div data-pl-outline className="flex [&_.puff]:text-transparent [&_.puff]:[-webkit-text-stroke:0.02em_var(--color-forest)]">
            <Wordmark />
          </div>
          <div data-pl-fill className="absolute inset-0 flex text-matcha" style={{ clipPath: "polygon(0 120%, 100% 120%, 100% 120%, 0 120%)" }}>
            <Wordmark />
          </div>
        </div>
      </div>

      <div data-pl-meta className="absolute inset-0 flex flex-col justify-between p-5 text-[13px] font-medium md:p-8 md:text-[14px]">
        <div className="flex items-start justify-between">
          <span className="eyebrow text-forest/75">McAllen, TX</span>
          <span className="hidden text-forest/70 sm:block">Organic ceremonial matcha</span>
        </div>
        <div className="flex items-end justify-between">
          <span data-count className="text-[clamp(2.4rem,5vw,4rem)] font-medium leading-none tabular-nums tracking-[-0.02em]">000</span>
          <span className="pb-1 text-forest/70">Whisking your matcha</span>
        </div>
      </div>
    </div>
  );
}
