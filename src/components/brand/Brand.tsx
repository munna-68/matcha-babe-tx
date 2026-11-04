import { useId, type CSSProperties, type ReactNode } from "react";

/**
 * Tribute badge (recreated in SVG, not her logo file): a deep-green disc
 * with chunky cream "MATCHA / BABE" set in a soft, fat display face.
 */
export function Badge({ className = "", style, ring = false }: { className?: string; style?: CSSProperties; ring?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} role="img" aria-label="Matcha Babe">
      <circle cx="100" cy="100" r="100" fill="var(--color-forest)" />
      {ring && <circle cx="100" cy="100" r="90" fill="none" stroke="var(--color-matcha-soft)" strokeOpacity=".35" strokeWidth="1.2" strokeDasharray="2 5" />}
      <g fill="var(--color-cream)" style={{ fontFamily: "var(--font-bagel)" }} textAnchor="middle">
        <text x="100" y="98" fontSize="44" textLength="150" lengthAdjust="spacingAndGlyphs" transform="rotate(-3 100 90)">
          MATCHA
        </text>
        <text x="102" y="146" fontSize="56" textLength="138" lengthAdjust="spacingAndGlyphs" transform="rotate(-3 100 130)">
          BABE
        </text>
      </g>
    </svg>
  );
}

/** Inline chunky wordmark for nav / footer. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`display inline-flex flex-col leading-[0.82] ${className}`} aria-label="Matcha Babe">
      <span aria-hidden>MATCHA</span>
      <span aria-hidden className="text-[1.18em]">BABE</span>
    </span>
  );
}

/** Original little cup character (a nod to her mascot sticker, not a copy). */
export function Mascot({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 140" className={className} style={style} fill="none" stroke="var(--color-forest)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* legs */}
      <path d="M48 100 L44 122 L34 124" />
      <path d="M72 100 L78 120 L89 117" />
      {/* arms: whisk + peace sign */}
      <path d="M26 56 Q10 54 12 38" />
      <path d="M8 38 L16 38 M12 38 V20 M9 24 Q12 14 15 24" />
      <path d="M94 56 Q110 52 108 36" />
      <path d="M108 36 L103 22 M108 36 L114 23" />
      {/* cup */}
      <path d="M22 30 H98 L90 90 Q88 102 76 102 H44 Q32 102 30 90 Z" fill="var(--color-paper)" />
      <path d="M24 31 Q60 46 96 31 Z" fill="var(--color-matcha)" stroke="none" />
      <path d="M22 30 H98" />
      {/* face */}
      <ellipse cx="48" cy="60" rx="4.5" ry="6" fill="var(--color-forest)" stroke="none" />
      <ellipse cx="72" cy="60" rx="4.5" ry="6" fill="var(--color-forest)" stroke="none" />
      <circle cx="49.5" cy="58" r="1.4" fill="var(--color-paper)" stroke="none" />
      <circle cx="73.5" cy="58" r="1.4" fill="var(--color-paper)" stroke="none" />
      <circle cx="40" cy="72" r="4" fill="var(--color-blush)" stroke="none" />
      <circle cx="80" cy="72" r="4" fill="var(--color-blush)" stroke="none" />
      <path d="M53 72 Q60 80 67 72" />
    </svg>
  );
}

/** M / B heart stickers (forest "M", pink "B"). */
export function HeartSticker({ letter = "B", className = "", style }: { letter?: "M" | "B"; className?: string; style?: CSSProperties }) {
  const pink = letter === "B";
  return (
    <svg viewBox="0 0 100 92" className={className} style={style} aria-hidden>
      <path
        d="M50 88 C20 66 4 50 4 30 C4 14 16 4 30 4 C40 4 46 10 50 17 C54 10 60 4 70 4 C84 4 96 14 96 30 C96 50 80 66 50 88 Z"
        fill={pink ? "var(--color-pink)" : "var(--color-forest)"}
        stroke="var(--color-paper)"
        strokeWidth="5"
      />
      <text x="50" y="58" textAnchor="middle" fontSize="40" fill={pink ? "var(--color-paper)" : "var(--color-matcha-soft)"} style={{ fontFamily: "var(--font-bagel)" }}>
        {letter}
      </text>
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

/** Thin double rule with a tiny centred ornament. */
export function Ornament({ className = "", children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden>
      <span className="flex flex-1 flex-col gap-[3px]">
        <span className="h-px bg-current opacity-40" />
        <span className="h-px bg-current opacity-40" />
      </span>
      <span className="flex items-center gap-2 text-pink">{children ?? <Sparkle className="h-3 w-3" />}</span>
      <span className="flex flex-1 flex-col gap-[3px]">
        <span className="h-px bg-current opacity-40" />
        <span className="h-px bg-current opacity-40" />
      </span>
    </div>
  );
}

/** Slowly spinning circular text badge. */
export function SpinBadge({ text, className = "", children }: { text: string; className?: string; children?: ReactNode }) {
  const id = `spin-${useId().replace(/:/g, "")}`;
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="h-full w-full animate-[spin_22s_linear_infinite] motion-reduce:animate-none" aria-hidden>
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fontSize="15.5" letterSpacing="4.2" fill="currentColor" style={{ fontFamily: "var(--font-dm-mono)", textTransform: "uppercase" }}>
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/** "Demo" marker used on prices / data. */
export function DemoTag({ className = "", children = "demo" }: { className?: string; children?: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-current/30 px-2 py-[2px] font-mono text-[9.5px] uppercase tracking-[0.16em] opacity-70 ${className}`}>
      {children}
    </span>
  );
}

export function LimitedBadge({ children = "Limited time" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-pink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper">
      <Sparkle className="h-2.5 w-2.5" />
      {children}
    </span>
  );
}
