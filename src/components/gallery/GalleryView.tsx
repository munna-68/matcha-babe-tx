"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { RevealImage, type RevealVariant } from "@/components/motion/primitives";
import { PageHeader } from "@/components/site/PageHeader";
import { BrandImage } from "@/components/image/BrandImage";
import { ButtonLink } from "@/components/brand/Button";
import { HeartDoodle, Icon } from "@/components/brand/Brand";
import { getLenis } from "@/components/motion/SmoothScroll";
import { BRAND, GALLERY } from "@/data/mock";
import { IMAGES } from "@/data/images";

const VARIANTS: RevealVariant[] = ["inset", "curtain", "inset", "arch", "inset", "curtain", "inset", "inset"];

export function GalleryView() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <PageHeader
        eyebrow={`On Instagram · ${BRAND.handle}`}
        word="Gallery"
        aside={<p className="text-[14px] text-forest/60">Tap any photo to open it.</p>}
      >
        Pop-ups, picnics and pink straws. Follow along for the next drop.
      </PageHeader>

      <section className="px-[var(--gutter)] pb-24 md:pb-36">
        <div className="mx-auto grid max-w-[1500px] auto-rows-[78vw] grid-cols-1 gap-4 sm:auto-rows-[42vw] sm:grid-cols-2 md:auto-rows-[17vw] md:grid-cols-12 md:gap-5">
          {GALLERY.map((g, i) => (
            <RevealImage key={g.slot} variant={VARIANTS[i]} start="top 92%" className={`relative ${g.span}`}>
              <div className="h-full">
                <button
                  onClick={() => setOpen(i)}
                  className="group relative block h-full w-full text-left"
                  aria-label={`Open photo: ${g.caption}`}
                >
                  <BrandImage slot={g.slot} fill className={`${VARIANTS[i] === "arch" ? "rounded-t-full" : ""} rounded-[28px]`} sizes="(min-width: 768px) 40vw, 100vw" />
                  <span className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between rounded-full bg-milk px-4 py-2 opacity-0 transition-all duration-500 ease-[var(--ease-babe)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <span className="text-sm font-medium text-forest">{g.caption}</span>
                    <Icon name="arrow" className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </RevealImage>
          ))}
        </div>

        <div className="mx-auto mt-20 flex max-w-[1500px] flex-col items-center gap-6 text-center">
          <HeartDoodle className="h-10 w-10 text-leaf" />
          <p className="display max-w-xl text-[clamp(1.8rem,3vw,2.6rem)] text-forest">See something you want? Every one of these is a pre-order away.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/order" cursor="Order">Pre-order</ButtonLink>
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="btn btn-ghost">
              <span className="roll"><span>{BRAND.handle}</span><span aria-hidden>{BRAND.handle}</span></span>
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
    <div ref={root} role="dialog" aria-modal="true" aria-label={g.caption} className="fixed inset-0 z-[105] flex flex-col bg-forest text-milk" onClick={close}>
      <div className="flex items-center justify-between px-5 py-5 md:px-10">
        <span className="text-[14px] font-semibold tabular-nums text-matcha-soft">{index + 1} / {n}</span>
        <button onClick={close} className="rounded-full border border-milk/30 px-5 py-2.5 text-[14px] font-semibold transition-colors hover:bg-milk hover:text-forest" autoFocus>
          Close
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-5 md:px-24" onClick={(e) => e.stopPropagation()}>
        <div ref={frame} className="relative max-h-full" style={{ aspectRatio: `${meta.width} / ${meta.height}`, width: `min(100%, calc((100dvh - 190px) * ${ratio}))` }}>
          <BrandImage slot={g.slot} fill className="rounded-[26px]" bleed={false} sizes="90vw" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-6 md:px-10" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onIndex((index - 1 + n) % n)} className="rounded-full border border-milk/30 px-5 py-3 text-[14px] font-semibold transition-colors hover:bg-milk hover:text-forest" aria-label="Previous photo">
          Previous
        </button>
        <div className="min-w-0 text-center">
          <p className="display text-2xl md:text-3xl">{g.caption}</p>
          <p className="mt-1 hidden truncate text-sm text-milk/60 md:block">{meta.alt}</p>
        </div>
        <button onClick={() => onIndex((index + 1) % n)} className="rounded-full border border-milk/30 px-5 py-3 text-[14px] font-semibold transition-colors hover:bg-milk hover:text-forest" aria-label="Next photo">
          Next
        </button>
      </div>
    </div>
  );
}
