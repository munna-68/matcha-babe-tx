"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { usePageTransition } from "@/components/motion/PageTransition";
import { ButtonLink } from "@/components/brand/Button";
import { HeartSticker, Sparkle } from "@/components/brand/Brand";
import { KIND_LABEL, type Enquiry } from "@/data/mock";
import { fmtDate } from "@/lib/dates";

const COLORS = ["var(--color-pink)", "var(--color-lav)", "var(--color-blue)", "var(--color-matcha)", "var(--color-blush)", "#f2c84b"];
const CUP = "M24 50 L33 130 Q34 136 40 136 H60 Q66 136 67 130 L76 50 Z";

export function Confirmation({ enquiry }: { enquiry: Enquiry }) {
  const ref = useRef<HTMLElement>(null);
  const ticket = useRef<HTMLDivElement>(null);
  const { navigate } = usePageTransition();

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const reduced = prefersReducedMotion();
      if (reduced) {
        gsap.from(q("[data-c]"), { opacity: 0, duration: 0.6, stagger: 0.08 });
        gsap.set(q("[data-fill]"), { y: 14 });
        return;
      }
      gsap.set(q("[data-fill]"), { y: 100 });
      gsap.set(q("[data-sprinkle]"), { x: 0, y: 0, opacity: 0, scale: 0 });
      const tl = gsap.timeline({ defaults: { ease: "babe" } });
      tl.from(q("[data-cup]"), { scale: 0.6, opacity: 0, rotate: -10, duration: 0.9, ease: "back.out(2)" }, 0)
        .to(q("[data-fill]"), { y: 14, duration: 1.2, ease: "power2.inOut" }, 0.25)
        .from(q("[data-head] span"), { yPercent: 110, rotate: 8, duration: 0.9, stagger: 0.04, ease: "back.out(2)" }, 0.4)
        .from(q("[data-c]"), { y: 40, opacity: 0, duration: 1, stagger: 0.08 }, 0.7)
        .from(ticket.current, { y: 60, rotate: 6, opacity: 0, duration: 1.2, ease: "back.out(1.4)" }, 0.8);
      // sprinkle burst from the cup's lid
      q("[data-sprinkle]").forEach((el, i) => {
        const a = (Math.PI * 2 * i) / 26 - Math.PI / 2 + gsap.utils.random(-0.4, 0.4);
        const r = gsap.utils.random(90, 220);
        tl.to(el, { opacity: 1, scale: 1, duration: 0.01 }, 1.35)
          .to(el, { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.8 - 40, rotate: gsap.utils.random(-260, 260), duration: 0.9, ease: "expo.out" }, 1.35)
          .to(el, { y: `+=${gsap.utils.random(120, 220)}`, opacity: 0, duration: 1.1, ease: "power2.in" }, 2.1);
      });
      gsap.to(q("[data-wave]"), { x: -50, duration: 1.2, ease: "none", repeat: -1 });
    },
    { scope: ref },
  );

  const goDashboard = () => {
    if (prefersReducedMotion()) return navigate("/dashboard", "Babe HQ");
    gsap.to(ticket.current, {
      y: -140, x: 60, rotate: -10, scale: 0.7, opacity: 0, duration: 0.7, ease: "power3.in",
      onComplete: () => navigate("/dashboard", "Sending to Babe HQ"),
    });
  };

  return (
    <section ref={ref} className="relative overflow-hidden px-5 pb-32 pt-28 md:px-10 md:pt-36">
      <div className="tiles pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="relative mx-auto grid max-w-[1300px] items-center gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="relative mb-8 h-40 w-28 md:h-52 md:w-36" data-cup>
            <svg viewBox="0 0 100 140" className="h-full w-full overflow-visible" aria-hidden>
              <defs>
                <clipPath id="conf-cup"><path d={CUP} /></clipPath>
              </defs>
              <g clipPath="url(#conf-cup)">
                <rect width="100" height="140" fill="var(--color-paper)" />
                <g data-fill>
                  <g data-wave>
                    <path d="M0 40 Q12.5 34 25 40 T50 40 T75 40 T100 40 T125 40 T150 40 V140 H0 Z" fill="var(--color-matcha)" />
                  </g>
                </g>
              </g>
              <g fill="none" stroke="var(--color-forest)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d={CUP} />
                <path d="M20 46 Q50 20 80 46" />
                <path d="M16 47 H84" />
              </g>
              <path d="M57 36 L68 2" stroke="var(--color-pink)" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="absolute left-1/2 top-[18%]">
              {Array.from({ length: 26 }).map((_, i) => (
                <span
                  key={i}
                  data-sprinkle
                  className="absolute block opacity-0"
                  style={{
                    width: i % 3 === 0 ? 12 : 5,
                    height: i % 3 === 0 ? 12 : 14,
                    borderRadius: i % 3 === 0 ? 0 : 4,
                    background: i % 3 === 0 ? "none" : COLORS[i % COLORS.length],
                    color: COLORS[i % COLORS.length],
                  }}
                >
                  {i % 3 === 0 && <Sparkle className="h-full w-full" />}
                </span>
              ))}
            </div>
          </div>

          <h1 data-head className="display flex flex-wrap overflow-hidden text-[clamp(3.6rem,9vw,8.6rem)] text-forest" aria-label="Sent, Babe!">
            {"Sent, Babe!".split("").map((c, i) => (
              <span key={i} className={`inline-block ${c === " " ? "w-[0.3em]" : ""} ${i > 5 ? "text-leaf" : ""}`} aria-hidden>{c}</span>
            ))}
          </h1>
          <p data-c className="serif mt-6 max-w-xl text-[clamp(1.5rem,2.2vw,2rem)] leading-snug text-forest/85">
            Your request is in her inbox with everything she needs — no back-and-forth. She&rsquo;ll confirm by your
            preferred contact, usually the same day.
          </p>
          <ol data-c className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["01", "She reviews", "Checks the date and her cup count for the day."],
              ["02", "You get a yes", "Confirmation (and a quote for events)."],
              ["03", "Grab & glow", "Pick up, Scan 2 Pay, collect your stamp."],
            ].map(([n, t, b]) => (
              <li key={n} className="rounded-[22px] bg-paper p-5 ring-1 ring-forest/10">
                <span className="font-mono text-[11px] text-leaf">{n}</span>
                <p className="display mt-2 text-xl leading-none">{t}</p>
                <p className="mt-2 text-[14px] text-forest/65">{b}</p>
              </li>
            ))}
          </ol>
          <div data-c className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={goDashboard}
              data-magnetic="0.3"
              data-cursor="Watch"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-forest px-7 py-4 text-[12px] font-semibold text-milk"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-leaf transition-transform duration-700 ease-[var(--ease-babe)] group-hover:translate-y-0" />
              <span className="relative">Watch it land in Babe HQ</span>
              <span className="relative transition-transform duration-500 group-hover:translate-x-1">→</span>
            </button>
            <ButtonLink href="/" variant="ghost" arrow={false}>Back home</ButtonLink>
          </div>
          <p data-c className="mt-6 text-[10.5px] font-semibold text-forest/45">
            Demo · nothing was actually sent. Saved in this tab only.
          </p>
        </div>

        <div className="md:col-span-5">
          <div ref={ticket} className="relative mx-auto max-w-sm rotate-[3deg] rounded-[26px] bg-paper p-7 shadow-[0_50px_90px_-50px_rgba(31,58,31,.8)] ring-1 ring-forest/10">
            <div className="flex items-center justify-between">
              <span className="label !text-[10px] text-forest/50">Request</span>
              <span className="rounded-full bg-leaf px-3 py-1 text-[10px] font-semibold text-paper">New</span>
            </div>
            <p className="display mt-3 text-5xl text-forest">{enquiry.id}</p>
            <div className="my-5 border-t-2 border-dashed border-forest/15" />
            <dl className="space-y-3 text-[15px]">
              <div className="flex justify-between gap-4"><dt className="text-forest/50">Type</dt><dd className="text-right">{KIND_LABEL[enquiry.kind]}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-forest/50">For</dt><dd className="text-right">{enquiry.name}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-forest/50">When</dt><dd className="text-right">{enquiry.date ? fmtDate(enquiry.date) : "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-forest/50">Where</dt><dd className="truncate text-right">{enquiry.where}</dd></div>
              <div className="flex justify-between gap-4">
                <dt className="text-forest/50">Items</dt>
                <dd className="text-right">{enquiry.items.map((i) => `${enquiry.kind === "event" ? "" : `${i.qty}× `}${i.name}`).join(", ")}</dd>
              </div>
            </dl>
            <div className="mt-5 flex items-end justify-between border-t border-forest/15 pt-4">
              <span className="label !text-[10px] text-forest/50">Est. · demo</span>
              <span className="display text-3xl">${enquiry.total.toFixed(2)}</span>
            </div>
            <HeartSticker letter="B" className="absolute -right-5 -top-5 h-14 w-14 rotate-12" />
            <div aria-hidden className="absolute -left-2.5 top-[118px] h-5 w-5 rounded-full bg-cream" />
            <div aria-hidden className="absolute -right-2.5 top-[118px] h-5 w-5 rounded-full bg-cream" />
          </div>
        </div>
      </div>
    </section>
  );
}
