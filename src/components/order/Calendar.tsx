"use client";

import { useState } from "react";
import { monthGrid, monthLabel, parseIso, weekday } from "@/lib/dates";
import { DROPS, HOLIDAY_BREAK, HOLIDAY_CUTOFF } from "@/data/mock";

type Props = {
  value: string | null;
  onChange: (iso: string) => void;
  earliest: string; // first selectable date
  latest: string; // last selectable date
};

export function Calendar({ value, onChange, earliest, latest }: Props) {
  const start = parseIso(value ?? earliest);
  const [ym, setYm] = useState({ y: start.y, m: start.m });
  const cells = monthGrid(ym.y, ym.m);
  const minYm = parseIso(earliest);
  const maxYm = parseIso(latest);
  const canPrev = ym.y > minYm.y || (ym.y === minYm.y && ym.m > minYm.m);
  const canNext = ym.y < maxYm.y || (ym.y === maxYm.y && ym.m < maxYm.m);
  const shift = (n: number) => setYm(({ y, m }) => ({ y: m + n > 11 ? y + 1 : m + n < 0 ? y - 1 : y, m: (m + n + 12) % 12 }));

  return (
    <div className="rounded-[26px] bg-paper p-4 ring-1 ring-forest/10 sm:p-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} disabled={!canPrev} className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-forest/15 transition-colors hover:bg-forest hover:text-milk disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-forest" aria-label="Previous month">←</button>
        <p className="display text-2xl text-forest">{monthLabel(ym.y, ym.m)}</p>
        <button type="button" onClick={() => shift(1)} disabled={!canNext} className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-forest/15 transition-colors hover:bg-forest hover:text-milk disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-forest" aria-label="Next month">→</button>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="pb-2 text-[10px] font-semibold text-forest/45">{d}</span>
        ))}
        {cells.map((iso, i) => {
          if (!iso) return <span key={i} />;
          const onBreak = iso >= HOLIDAY_BREAK.from && iso <= HOLIDAY_BREAK.to;
          const disabled = iso < earliest || iso > latest || onBreak || weekday(iso) === 1; // closed Mondays (demo)
          const selected = iso === value;
          const drop = DROPS.some((d) => d.date === iso);
          const cutoff = iso === HOLIDAY_CUTOFF;
          return (
            <button
              type="button"
              key={iso}
              disabled={disabled}
              onClick={() => onChange(iso)}
              aria-pressed={selected}
              aria-label={`${iso}${disabled ? " unavailable" : ""}${cutoff ? ", last day for holiday orders" : ""}`}
              className={`relative aspect-square rounded-full text-[15px] transition-all duration-300 ${
                selected
                  ? "scale-105 bg-leaf font-medium text-paper shadow-[0_10px_24px_-10px_rgba(217,67,107,.8)]"
                  : disabled
                    ? onBreak
                      ? "text-forest/25 line-through decoration-pink/50"
                      : "text-forest/25"
                    : "text-forest hover:bg-matcha-mist"
              } ${cutoff && !selected ? "ring-2 ring-leaf/60" : ""}`}
            >
              {parseIso(iso).d}
              {drop && <span className={`absolute bottom-[14%] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${selected ? "bg-paper" : "bg-kelly"}`} />}
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-forest/10 pt-4 text-[12.5px] text-forest/65">
        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-kelly" /> Pop-up day</span>
        <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full ring-2 ring-leaf/60" /> Holiday cutoff</span>
        <span className="flex items-center gap-2"><span className="text-forest/30 line-through decoration-pink/50">20</span> Holiday break</span>
        <span>Closed Mondays</span>
      </div>
    </div>
  );
}
