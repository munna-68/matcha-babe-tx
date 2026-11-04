import { IMAGES, type ImageSlot, type SlotId } from "@/data/images";

const TONES: Record<ImageSlot["tone"], { a: string; b: string; glow: string; ink: string; inkOpacity: number }> = {
  forest: { a: "#0b5229", b: "#033519", glow: "rgba(200,217,156,.32)", ink: "#f3ede0", inkOpacity: 0.32 },
  kelly: { a: "#1f8a4c", b: "#0a6332", glow: "rgba(243,237,224,.30)", ink: "#f3ede0", inkOpacity: 0.34 },
  matcha: { a: "#bcd08a", b: "#86a646", glow: "rgba(251,248,241,.55)", ink: "#053f1c", inkOpacity: 0.26 },
  blush: { a: "#fadbe3", b: "#eeaabc", glow: "rgba(251,248,241,.6)", ink: "#053f1c", inkOpacity: 0.24 },
  cream: { a: "#f4ecdc", b: "#dccbb0", glow: "rgba(255,255,255,.6)", ink: "#053f1c", inkOpacity: 0.22 },
  lav: { a: "#e6dbf5", b: "#bea7e2", glow: "rgba(251,248,241,.55)", ink: "#053f1c", inkOpacity: 0.24 },
};

function Motif({ m }: { m: ImageSlot["motif"] }) {
  switch (m) {
    case "cup":
      return (
        <>
          <path d="M22 46 Q50 22 78 46" />
          <path d="M18 46 H82" />
          <path d="M57 34 L67 4" strokeWidth={3} />
          <path d="M24 50 L33 130 Q34 136 40 136 H60 Q66 136 67 130 L76 50" />
          <path d="M28 78 Q50 70 72 78" />
          <rect x="36" y="86" width="12" height="12" rx="2" />
          <rect x="52" y="96" width="11" height="11" rx="2" transform="rotate(12 57 101)" />
        </>
      );
    case "bottle":
      return (
        <>
          <rect x="40" y="18" width="20" height="13" rx="2" />
          <path d="M43 31 V52 M57 31 V52" />
          <circle cx="50" cy="94" r="38" />
          <path d="M18 92 Q50 84 82 92" />
          <circle cx="50" cy="104" r="11" />
        </>
      );
    case "whisk":
      return (
        <>
          <rect x="44" y="6" width="12" height="52" rx="5" />
          <path d="M50 58 Q24 88 34 128 M50 58 Q36 92 42 130 M50 58 Q50 94 50 132 M50 58 Q64 92 58 130 M50 58 Q76 88 66 128" />
          <path d="M34 128 Q50 140 66 128" />
        </>
      );
    case "bowl":
      return (
        <>
          <ellipse cx="50" cy="78" rx="38" ry="9" />
          <path d="M12 78 Q16 128 50 130 Q84 128 88 78" />
          <path d="M30 82 Q50 90 70 82" />
          <path d="M40 60 q-6 -10 0 -20 q6 -10 0 -20 M58 60 q-6 -10 0 -20 q6 -10 0 -20" />
        </>
      );
    case "bag":
      return (
        <>
          <path d="M20 52 H80 L86 136 H14 Z" />
          <path d="M36 52 Q36 22 50 22 Q64 22 64 52" />
          <circle cx="50" cy="94" r="14" />
        </>
      );
    case "star":
    default:
      return <path d="M50 18 C54 58 62 66 92 72 C62 78 54 86 50 126 C46 86 38 78 8 72 C38 66 46 58 50 18 Z" />;
  }
}

const Sparkle = ({ x, y, s }: { x: string; y: string; s: number }) => (
  <svg viewBox="0 0 20 20" className="absolute" style={{ left: x, top: y, width: s, height: s }} aria-hidden>
    <path d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0Z" fill="currentColor" />
  </svg>
);

/** Branded stand-in used until /public/images/<slot>.webp exists. */
export function Placeholder({ slot }: { slot: SlotId }) {
  const meta = IMAGES[slot];
  const t = TONES[meta.tone];
  return (
    <div
      role="img"
      aria-label={meta.alt}
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(120% 80% at 18% 8%, ${t.glow} 0%, transparent 55%),
          radial-gradient(90% 70% at 92% 100%, rgba(2,43,18,.22) 0%, transparent 60%),
          linear-gradient(160deg, ${t.a} 0%, ${t.b} 100%)`,
      }}
    >
      {/* window-light streaks */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{ background: "repeating-linear-gradient(115deg, rgba(255,255,255,.0) 0 60px, rgba(255,255,255,.35) 60px 120px, rgba(255,255,255,0) 120px 220px)" }}
      />
      {/* grain */}
      <div className="absolute inset-0 opacity-[0.35] mix-blend-multiply" style={{ backgroundImage: "var(--grain)" }} />
      {/* soft floor shadow + motif */}
      <div className="absolute left-1/2 top-[64%] h-[6%] w-[34%] -translate-x-1/2 rounded-[50%] bg-forest-deep/20 blur-md" />
      <svg
        viewBox="0 0 100 140"
        className="absolute left-1/2 top-1/2 h-[42%] max-h-[260px] -translate-x-1/2 -translate-y-[56%]"
        fill="none"
        stroke={t.ink}
        strokeOpacity={t.inkOpacity}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <Motif m={meta.motif} />
      </svg>
      <div style={{ color: t.ink, opacity: t.inkOpacity + 0.08 }}>
        <Sparkle x="16%" y="20%" s={14} />
        <Sparkle x="78%" y="30%" s={10} />
        <Sparkle x="70%" y="76%" s={16} />
      </div>
    </div>
  );
}
