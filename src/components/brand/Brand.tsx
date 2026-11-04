import { useId, type CSSProperties, type ReactNode } from "react";

/* ------------------------------------------------------------------
   Wordmark — MATCHA / BABE set in DynaPuff with a hand-set "jiggle":
   each letter sits a little off its neighbours, like the stamped logo
   on her cups. The jiggle lives on an inner span so GSAP can move the
   outer [data-wm-char] freely. One component everywhere (nav, hero,
   preloader, footer) so the preloader can fly into the hero exactly.
------------------------------------------------------------------- */
const JIGGLE: Record<string, [number, number][]> = {
  MATCHA: [[-4, 0], [2.5, -0.035], [-2, 0.02], [3, -0.02], [-3, 0.03], [2, -0.01]],
  BABE: [[3, 0.02], [-3, -0.025], [2.5, 0.03], [-2, 0]],
};

export function Wordmark({
  className = "",
  style,
  lineClass = "",
  still = false,
}: {
  className?: string;
  style?: CSSProperties;
  /** extra class on each line (e.g. overflow masks) */
  lineClass?: string;
  /** no jiggle (tiny sizes) */
  still?: boolean;
}) {
  return (
    <span className={`puff inline-flex flex-col ${className}`} style={style} role="img" aria-label="Matcha Babe">
      {(["MATCHA", "BABE"] as const).map((word, w) => (
        <span key={word} aria-hidden data-wm-line className={`flex ${w === 1 ? "pl-[0.32em]" : ""} ${lineClass}`}>
          {word.split("").map((c, i) => {
            const [r, y] = JIGGLE[word][i];
            return (
              <span key={i} data-wm-char className="inline-block">
                <span className="inline-block" style={still ? undefined : { transform: `translateY(${y}em) rotate(${r}deg)` }}>
                  {c}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

/** Round badge (dashboard): forest disc with the stacked wordmark. */
export function Badge({ className = "", style, ring = false }: { className?: string; style?: CSSProperties; ring?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} role="img" aria-label="Matcha Babe">
      <circle cx="100" cy="100" r="100" fill="var(--color-forest)" />
      {ring && <circle cx="100" cy="100" r="90" fill="none" stroke="var(--color-matcha-soft)" strokeOpacity=".35" strokeWidth="1.2" strokeDasharray="2 5" />}
      <g fill="var(--color-milk)" style={{ fontFamily: "var(--font-puff)", fontWeight: 700 }} textAnchor="middle">
        <text x="100" y="98" fontSize="46" textLength="146" lengthAdjust="spacingAndGlyphs" transform="rotate(-4 100 90)">MATCHA</text>
        <text x="104" y="146" fontSize="56" textLength="124" lengthAdjust="spacingAndGlyphs" transform="rotate(-4 100 130)">BABE</text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------
   Doodles: the hand-drawn marks from the reference (hearts, speed
   dashes, brush underline). Stroke = currentColor.
------------------------------------------------------------------- */
export function HeartDoodle({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path data-draw pathLength={1} d="M30 56 C14 42 5 31 8 19 C10 10 21 6 28 15 C31 19 32 23 32 26 C33 17 40 6 51 9 C61 12 60 27 50 38 C44 45 37 51 30 56 Z" />
      <path data-draw pathLength={1} d="M34 52 C42 44 50 36 52 27" opacity=".7" />
    </svg>
  );
}

export function SpeedDashes({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 80 70" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" aria-hidden>
      <path data-dash d="M10 26 L44 6" />
      <path data-dash d="M14 37 L66 35" />
      <path data-dash d="M12 48 L46 62" />
    </svg>
  );
}

export function BrushUnderline({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 220 22" className={className} style={style} fill="none" stroke="currentColor" strokeLinecap="round" preserveAspectRatio="none" aria-hidden>
      <path data-draw pathLength={1} d="M4 15 C48 6 120 4 216 9" strokeWidth="4.5" />
      <path data-draw pathLength={1} d="M30 19 C80 13 140 12 190 15" strokeWidth="2.2" opacity=".55" />
    </svg>
  );
}

export function Sparkle({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 20 20" className={className} style={style} aria-hidden>
      <path d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0Z" fill="currentColor" />
    </svg>
  );
}

/** Soft leaf silhouettes, blurred into shadows on the wall. */
export function LeafShadow({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 400 400" className={`leaf-shadow ${className}`} style={style} aria-hidden>
      <g className="leaf-sway" fill="currentColor">
        <path d="M0 40 C90 70 170 110 240 170 L246 162 C176 100 96 58 0 28 Z" />
        <path d="M70 62 C60 18 90 -8 128 2 C122 40 104 62 70 62 Z" />
        <path d="M122 84 C126 36 162 18 196 34 C180 70 158 88 122 84 Z" />
        <path d="M168 116 C186 72 226 66 252 90 C228 120 204 128 168 116 Z" />
        <path d="M84 76 C46 92 28 132 48 160 C78 140 90 112 84 76 Z" />
        <path d="M140 104 C108 128 100 170 126 194 C150 168 156 138 140 104 Z" />
        <path d="M196 138 C170 168 172 208 202 226 C220 196 220 166 196 138 Z" />
      </g>
    </svg>
  );
}

/* line icons for the hero's feature row (1.6 stroke) */
export function Icon({ name, className = "" }: { name: "leaf" | "whisk" | "heart" | "pin" | "cup" | "bag" | "arrow"; className?: string }) {
  const p = {
    leaf: <><path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15Z" /><path d="M5 19c3-4 6-7 10-10" /></>,
    whisk: <><path d="M12 3v7" /><path d="M12 10c-4 3-5 7-3 11h6c2-4 1-8-3-11Z" /><path d="M10.5 12.5 11 21M13.5 12.5 13 21" /></>,
    heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
    pin: <><path d="M12 21s-6-5.7-6-11a6 6 0 1 1 12 0c0 5.3-6 11-6 11Z" /><circle cx="12" cy="10" r="2.2" /></>,
    cup: <><path d="M6 7h12l-1.4 13H7.4L6 7Z" /><path d="M5 7h14" /><path d="m13 7 2-4" /></>,
    bag: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    arrow: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
  }[name];
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {p}
    </svg>
  );
}

/** Original little cup character (a nod to her mascot sticker, not a copy). */
export function Mascot({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 140" className={className} style={style} fill="none" stroke="var(--color-forest)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M48 100 L44 122 L34 124" />
      <path d="M72 100 L78 120 L89 117" />
      <path d="M26 56 Q10 54 12 38" />
      <path d="M8 38 L16 38 M12 38 V20 M9 24 Q12 14 15 24" />
      <path d="M94 56 Q110 52 108 36" />
      <path d="M108 36 L103 22 M108 36 L114 23" />
      <path d="M22 30 H98 L90 90 Q88 102 76 102 H44 Q32 102 30 90 Z" fill="var(--color-milk)" />
      <path d="M24 31 Q60 46 96 31 Z" fill="var(--color-matcha)" stroke="none" />
      <path d="M22 30 H98" />
      <ellipse cx="48" cy="60" rx="4.5" ry="6" fill="var(--color-forest)" stroke="none" />
      <ellipse cx="72" cy="60" rx="4.5" ry="6" fill="var(--color-forest)" stroke="none" />
      <circle cx="49.5" cy="58" r="1.4" fill="var(--color-milk)" stroke="none" />
      <circle cx="73.5" cy="58" r="1.4" fill="var(--color-milk)" stroke="none" />
      <circle cx="40" cy="72" r="4" fill="var(--color-blush)" stroke="none" />
      <circle cx="80" cy="72" r="4" fill="var(--color-blush)" stroke="none" />
      <path d="M53 72 Q60 80 67 72" />
    </svg>
  );
}

/** M / B heart stickers (forest "M", pink "B") — straight from her merch. */
export function HeartSticker({ letter = "B", className = "", style }: { letter?: "M" | "B"; className?: string; style?: CSSProperties }) {
  const pink = letter === "B";
  return (
    <svg viewBox="0 0 100 92" className={className} style={style} aria-hidden>
      <path
        d="M50 88 C20 66 4 50 4 30 C4 14 16 4 30 4 C40 4 46 10 50 17 C54 10 60 4 70 4 C84 4 96 14 96 30 C96 50 80 66 50 88 Z"
        fill={pink ? "var(--color-pink)" : "var(--color-forest)"}
        stroke="var(--color-milk)"
        strokeWidth="5"
      />
      <text x="50" y="58" textAnchor="middle" fontSize="40" fill={pink ? "var(--color-milk)" : "var(--color-matcha-soft)"} style={{ fontFamily: "var(--font-puff)", fontWeight: 700 }}>
        {letter}
      </text>
    </svg>
  );
}

/** Thin rule with a small heart in the middle. */
export function Ornament({ className = "", children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-current opacity-20" />
      <span className="flex items-center gap-2 opacity-60">{children ?? <HeartDoodle className="h-5 w-5" />}</span>
      <span className="h-px flex-1 bg-current opacity-20" />
    </div>
  );
}

/** Slowly spinning circular text badge. textLength makes the text fit the circle. */
export function SpinBadge({ text, className = "", children }: { text: string; className?: string; children?: ReactNode }) {
  const id = `spin-${useId().replace(/:/g, "")}`;
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="h-full w-full animate-[spin_24s_linear_infinite] motion-reduce:animate-none" aria-hidden>
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fontSize="15" fill="currentColor" style={{ fontFamily: "var(--font-figtree)", fontWeight: 600, textTransform: "uppercase" }}>
          <textPath href={`#${id}`} textLength="486" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/** "Demo" marker used on prices / data. */
export function DemoTag({ className = "", children = "demo" }: { className?: string; children?: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-current/8 px-2 py-[2px] text-[11px] font-medium opacity-60 ${className}`}>
      {children}
    </span>
  );
}

export function LimitedBadge({ children = "Limited time" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-milk px-3 py-1 text-[12px] font-semibold text-forest shadow-[0_6px_20px_-10px_rgba(31,58,31,.5)]">
      <span className="h-1.5 w-1.5 rounded-full bg-pink" />
      {children}
    </span>
  );
}
