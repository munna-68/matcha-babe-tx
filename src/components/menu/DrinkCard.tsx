"use client";

import { BrandImage } from "@/components/image/BrandImage";
import { TransitionLink } from "@/components/motion/PageTransition";
import { LimitedBadge } from "@/components/brand/Brand";
import type { MenuItem } from "@/data/mock";

const money = (n: number) => `$${n % 1 ? n.toFixed(2) : n}`;

/** One drink: tinted tile with the photo, name, price and a round add button. */
export function DrinkCard({ item, on = true, sizes = "(min-width: 1024px) 31vw, 48vw" }: { item: MenuItem; on?: boolean; sizes?: string }) {
  const href = on ? `/order?item=${item.id}` : "/menu";
  return (
    <TransitionLink
      href={href}
      className={`group block ${on ? "" : "pointer-events-none"}`}
      aria-label={on ? `Pre-order ${item.name}` : `${item.name}, paused today`}
    >
      <div className={`relative aspect-[4/5] overflow-hidden rounded-[24px] md:rounded-[32px] ${on ? "" : "grayscale-[60%]"}`}>
        <BrandImage slot={item.slot} fill className="h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-babe)] group-hover:scale-[1.03]" sizes={sizes} />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-2 md:left-5 md:top-5">
          {item.limited && <LimitedBadge>{item.badge ?? "Limited time"}</LimitedBadge>}
          {!on && <span className="rounded-full bg-forest px-3 py-1 text-[12px] font-semibold text-milk">Paused today</span>}
        </div>
        {on && (
          <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-milk text-forest shadow-[0_10px_24px_-12px_rgba(31,58,31,.6)] transition-colors duration-500 group-hover:bg-forest group-hover:text-milk md:bottom-5 md:right-5 md:h-14 md:w-14">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3 md:mt-5">
        <h3 className="display text-[clamp(1.25rem,2.1vw,2rem)]">{item.name}</h3>
        <span className="shrink-0 text-right text-[15px] font-semibold tabular-nums md:text-[17px]">
          {money(item.price)}
          {item.priceNote && <span className="block text-[12px] font-normal text-forest/55">{item.priceNote}</span>}
        </span>
      </div>
      <p className="mt-1.5 line-clamp-2 max-w-[36ch] text-[14px] text-forest/65 md:text-[15px]">{item.description}</p>
    </TransitionLink>
  );
}
