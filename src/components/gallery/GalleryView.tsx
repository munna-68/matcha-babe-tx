"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TrackedLabel, RevealImage, Tilt, ScriptWrite, type RevealVariant } from "@/components/motion/primitives";
import { BrandImage } from "@/components/image/BrandImage";
import { ButtonLink } from "@/components/brand/Button";
import { HeartSticker } from "@/components/brand/Brand";
import { getLenis } from "@/components/motion/SmoothScroll";
import { BRAND, GALLERY } from "@/data/mock";
import { IMAGES } from "@/data/images";

const VARIANTS: RevealVariant[] = ["curtain", "inset", "wipe", "arch", "inset", "curtain", "wipe", "inset"];

export function GalleryView() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <section className="px-5 pb-12 pt-32 md:px-10 md:pt-44">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <TrackedLabel trigger="stage" className="text-pink">{`Gallery · ${BRAND.handle}`}</TrackedLabel>
            <SplitReveal as="h1" trigger="stage" data-hero className="serif mt-6 text-[clamp(3.6rem,10vw,10rem)] leading-[0.88] tracking-[-0.03em] text-forest">
              Life of a <span data-kw className="display text-[0.92em] not-italic text-pink">Babe.</span>
            </SplitReveal>
          </div>
          <div className="max-w-sm pb-4">
            <ScriptWrite trigger="stage" delay={0.9} className="text-4xl text-kelly">pop-ups, picnics &amp; pink straws</ScriptWrite>
            <p className="mt-3 text-forest/70">Tap any photo to open it. Follow along on Instagram for the next drop.</p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 md:px-10 md:pb-36">
        <div className="mx-auto grid max-w-[1500px] auto-rows-[78vw] grid-cols-1 gap-4 sm:auto-rows-[42vw] sm:grid-cols-2 md:auto-rows-[17vw] md:grid-cols-12 md:gap-5">
          {GALLERY.map((g, i) => (
            <RevealImage key={g.slot} variant={VARIANTS[i]} start="top 92%" className={`relative ${g.span}`}>
              <Tilt cursor="View" max={3} className="h-full">
                <button
                  onClick={() => setOpen(i)}
                  className="group relative block h-full w-full text-left"
                  aria-label={`Open photo: ${g.caption}`}
                >
                  <BrandImage slot={g.slot} fill className={`${VARIANTS[i] === "arch" ? "rounded-t-full" : ""} rounded-[26px]`} sizes="(min-width: 768px) 40vw, 100vw" />
                  <span className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between rounded-full bg-paper/90 px-4 py-2 opacity-0 backdrop-blur transition-all duration-500 ease-[var(--ease-babe)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <span className="text-sm font-medium text-forest">{g.caption}</span>
                    <span className="font-mono text-[10px] text-forest/50">0{i + 1}</span>
                  </span>
                </button>
              </Tilt>
            </RevealImage>
          ))}
        </div>

        <div className="mx-auto mt-20 flex max-w-[1500px] flex-col items-center gap-6 text-center">
          <HeartSticker letter="M" className="h-14 w-14" />
          <p className="serif max-w-xl text-3xl leading-tight text-forest">See something you want? Every one of these is a pre-order away.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/order" cursor="Order">Pre-order</ButtonLink>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer"
              data-magnetic="0.3"
              className="inline-flex items-center rounded-full border border-forest/30 px-7 py-4 font-mono text-[12px] uppercase tracking-[0.18em] text-forest transition-colors hover:bg-forest hover:text-cream"
            >
              {BRAND.handle} ↗
            </a>
          </div>
        </div>
      </section>

      {open !== null && <Lightbox index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </>
  );
}

function Lightbox({ index, onClose, onIndex }: { index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const g = GALLERY[index];
  const meta = IMAGES[g.slot];
  const n = GALLERY.length;

  const close = useCallback(() => {
    const reduced = prefersReducedMotion();
    gsap.to(frame.current, { clipPath: "inset(8% 8% 8% 8% round 30px)", opacity: 0, duration: reduced ? 0.01 : 0.45, ease: "power2.in" });
    gsap.to(root.current, { opacity: 0, duration: reduced ? 0.01 : 0.45, delay: 0.1, onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    getLenis()?.stop();
    const reduced = prefersReducedMotion();
    gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: reduced ? 0.01 : 0.5 });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") onIndex((index + 1) % n);
      if (e.key === "ArrowLeft") onIndex((index - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
    };
  }, [close, index, n, onIndex]);

  // image change animation
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const inner = frame.current?.querySelector("[data-img-inner]");
    gsap.fromTo(frame.current, { clipPath: "inset(10% 10% 10% 10% round 30px)", opacity: 0.4 }, { clipPath: "inset(0% 0% 0% 0% round 26px)", opacity: 1, duration: 0.9, ease: "expo.out" });
    if (inner) gsap.fromTo(inner, { scale: 1.2 }, { scale: 1, duration: 1.2, ease: "expo.out" });
  }, [index]);

  const ratio = meta.width / meta.height;

  return (
    <div ref={root} role="dialog" aria-modal="true" aria-label={g.caption} className="fixed inset-0 z-[105] flex flex-col bg-forest/95 text-cream backdrop-blur-sm" onClick={close}>
      <div className="flex items-center justify-between px-5 py-5 md:px-10">
        <span className="label text-matcha-soft">0{index + 1} / 0{n}</span>
        <button onClick={close} className="label rounded-full border border-cream/25 px-4 py-2 transition-colors hover:bg-cream hover:text-forest" autoFocus>
          Close ✕
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-5 md:px-24" onClick={(e) => e.stopPropagation()}>
        <div ref={frame} className="relative max-h-full" style={{ aspectRatio: `${meta.width} / ${meta.height}`, width: `min(100%, calc((100dvh - 190px) * ${ratio}))` }}>
          <BrandImage slot={g.slot} fill className="rounded-[26px]" bleed={false} sizes="90vw" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-6 md:px-10" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onIndex((index - 1 + n) % n)} className="label rounded-full border border-cream/25 px-4 py-3 transition-colors hover:bg-cream hover:text-forest" aria-label="Previous photo">
          ← Prev
        </button>
        <div className="min-w-0 text-center">
          <p className="serif text-2xl md:text-3xl">{g.caption}</p>
          <p className="mt-1 hidden truncate text-sm text-cream/60 md:block">{meta.alt}</p>
        </div>
        <button onClick={() => onIndex((index + 1) % n)} className="label rounded-full border border-cream/25 px-4 py-3 transition-colors hover:bg-cream hover:text-forest" aria-label="Next photo">
          Next →
        </button>
      </div>
    </div>
  );
}
