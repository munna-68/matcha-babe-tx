import { IMAGES, type ImageSlot, type SlotId } from "@/data/images";

/* ------------------------------------------------------------------
   Placeholder "product shots" — used until /public/images/<slot>.webp
   exists. Each drink is drawn with its own layers, foam and toppings on
   a flat tinted tile, stamped with the wordmark like her real cups, so
   the menu reads clearly before photography arrives.
------------------------------------------------------------------- */

type Layer = [color: string, from: number, to: number];
type Drink = {
  bg: string;
  layers: Layer[];
  top?: "sprinkles" | "charms" | "cinnamon" | "candy";
  straw?: string;
};

const MATCHA = "#86ab3f";
const MILK = "#f7f3e8";
const C = {
  matchaSoft: "#cadb9e", blush: "#f4c9d5", lav: "#d9cbef", sand: "#e3d8ba", sky: "#c4d3ec",
  butter: "#f2dfae", peach: "#f0c8a2", latte: "#e6cfa9", rose: "#f1d0d4", leaf: "#3d6a33",
};

const DRINKS: Partial<Record<SlotId, Drink>> = {
  "latte-og-babe": { bg: C.matchaSoft, layers: [[MATCHA, 0.1, 0.55], [MILK, 0.55, 1]] },
  "latte-strawberry-cutie": { bg: C.blush, layers: [[MATCHA, 0.1, 0.44], [MILK, 0.44, 0.7], ["#e3607f", 0.7, 1]] },
  "latte-lavender-haze": { bg: C.lav, layers: [["#e8dcf8", 0.04, 0.24], [MATCHA, 0.24, 0.6], [MILK, 0.6, 1]], straw: "#9b7fd0" },
  "latte-blue-coconut": { bg: C.sky, layers: [[MATCHA, 0.1, 0.4], [MILK, 0.4, 0.64], ["#2c5da8", 0.64, 1]], straw: "#f7f3e8" },
  "latte-lucky-charms": { bg: C.butter, layers: [[MILK, 0.04, 0.24], [MATCHA, 0.24, 0.6], [MILK, 0.6, 1]], top: "charms" },
  "latte-mexican-vanilla": { bg: C.sand, layers: [[MATCHA, 0.12, 0.5], ["#eedcb6", 0.5, 1]] },
  "season-feature": { bg: C.blush, layers: [[MILK, 0.04, 0.24], [MATCHA, 0.24, 0.62], [MILK, 0.62, 1]], top: "sprinkles" },
  "season-birthday-cake": { bg: C.rose, layers: [[MILK, 0.04, 0.24], [MATCHA, 0.24, 0.62], [MILK, 0.62, 1]], top: "sprinkles" },
  "season-pumpkin-cream": { bg: C.peach, layers: [["#eca866", 0.04, 0.22], [MATCHA, 0.22, 0.6], [MILK, 0.6, 1]], top: "cinnamon", straw: "#3d6a33" },
  "season-maple-pecan": { bg: C.latte, layers: [[MATCHA, 0.1, 0.5], [MILK, 0.5, 0.74], ["#c98a4b", 0.74, 1]], straw: "#3d6a33" },
  "season-horchata": { bg: "#efe3c9", layers: [[MATCHA, 0.1, 0.46], ["#f2e8d4", 0.46, 1]], top: "cinnamon" },
  "season-chai-spice": { bg: "#e2c7a8", layers: [[MATCHA, 0.1, 0.48], ["#cfa983", 0.48, 1]], straw: "#3d6a33" },
  "season-peppermint": { bg: C.rose, layers: [[MILK, 0.04, 0.22], [MATCHA, 0.22, 0.6], [MILK, 0.6, 1]], top: "candy" },
  "order-backdrop-1": { bg: C.matchaSoft, layers: [[MATCHA, 0.1, 0.55], [MILK, 0.55, 1]] },
  "order-backdrop-2": { bg: C.blush, layers: [[MATCHA, 0.1, 0.44], [MILK, 0.44, 0.7], ["#e3607f", 0.7, 1]] },
};

const TONE_BG: Record<ImageSlot["tone"], string> = {
  forest: C.leaf, kelly: "#4f7d3f", matcha: C.matchaSoft, blush: C.blush, cream: C.sand, lav: C.lav,
};

/** Toppings scattered over the foam. */
function Toppings({ kind }: { kind: NonNullable<Drink["top"]> }) {
  const spots = [[72, 70], [84, 64], [96, 71], [108, 63], [120, 69], [130, 64], [90, 77], [114, 76], [78, 78], [102, 66], [125, 76]];
  const palette =
    kind === "sprinkles" ? ["#e0507a", "#2c5da8", "#f2c94c", "#8db045", "#9b7fd0"] :
    kind === "candy" ? ["#d8343f", "#f7f3e8", "#d8343f"] :
    kind === "charms" ? ["#e0507a", "#f2c94c", "#9b7fd0", "#8db045", "#2c5da8"] : ["#8a5a32"];
  return (
    <g>
      {spots.map(([x, y], i) =>
        kind === "cinnamon" ? (
          <circle key={i} cx={x} cy={y + 2} r={1.6} fill={palette[0]} opacity={0.7} />
        ) : kind === "charms" ? (
          <path key={i} d={`M${x} ${y - 4} l3.5 6 h-7 z`} fill={palette[i % palette.length]} transform={`rotate(${i * 37} ${x} ${y})`} />
        ) : (
          <rect key={i} x={x - 4} y={y - 1.4} width={8} height={2.8} rx={1.4} fill={palette[i % palette.length]} transform={`rotate(${(i * 53) % 180} ${x} ${y})`} />
        ),
      )}
    </g>
  );
}

const CUP = "M54 62 H146 L134 214 Q133 224 122 224 H78 Q67 224 66 214 Z";

/** The iced cup, with layered drink, ice, lid, straw and the stamped wordmark. */
function Cup({ d, id, x = 0, y = 0, s = 1 }: { d: Drink; id: string; x?: number; y?: number; s?: number }) {
  const top = 66;
  const h = 158;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id={`${id}-cup`}>
          <path d={CUP} />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="228" rx="50" ry="7" fill="#1f3a1f" opacity=".16" />
      {/* straw behind the lid */}
      <rect x="112" y="4" width="9" height="120" rx="4.5" fill={d.straw ?? "#e0507a"} transform="rotate(14 116 64)" />
      <g clipPath={`url(#${id}-cup)`}>
        <rect x="40" y="56" width="120" height="180" fill="#ffffff" opacity=".35" />
        {d.layers.map(([color, from, to], i) => {
          const y0 = top + from * h;
          const y1 = top + to * h + 2;
          return (
            <path
              key={i}
              d={`M40 ${y0} Q70 ${y0 - 5} 100 ${y0} T160 ${y0} V${y1} H40 Z`}
              fill={color}
            />
          );
        })}
        {/* ice */}
        <g fill="none" stroke="#ffffff" strokeOpacity=".55" strokeWidth="2.5">
          <rect x="72" y="92" width="22" height="22" rx="5" transform="rotate(-12 83 103)" />
          <rect x="104" y="100" width="20" height="20" rx="5" transform="rotate(16 114 110)" />
          <rect x="86" y="124" width="18" height="18" rx="4" transform="rotate(6 95 133)" />
        </g>
        {/* the stamp, like the logo printed on her cups */}
        <g fill="#1f3a1f" opacity=".82" style={{ fontFamily: "var(--font-puff)", fontWeight: 700 }} textAnchor="middle" transform="rotate(-6 100 168)">
          <text x="100" y="166" fontSize="19" textLength="66" lengthAdjust="spacingAndGlyphs">MATCHA</text>
          <text x="103" y="186" fontSize="22" textLength="52" lengthAdjust="spacingAndGlyphs">BABE</text>
        </g>
        {/* highlight */}
        <path d="M64 76 L74 206" stroke="#ffffff" strokeOpacity=".45" strokeWidth="6" strokeLinecap="round" />
      </g>
      {d.top && <Toppings kind={d.top} />}
      <path d={CUP} fill="none" stroke="#ffffff" strokeOpacity=".75" strokeWidth="2.5" strokeLinejoin="round" />
      {/* lid */}
      <path d="M50 60 Q100 26 150 60" fill="#ffffff" fillOpacity=".28" stroke="#ffffff" strokeOpacity=".85" strokeWidth="2.5" />
      <rect x="47" y="57" width="106" height="8" rx="4" fill="#ffffff" fillOpacity=".55" stroke="#ffffff" strokeOpacity=".9" strokeWidth="1.5" />
    </g>
  );
}

function Bottle({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <clipPath id={`${id}-b`}>
          <circle cx="100" cy="150" r="62" />
          <rect x="84" y="62" width="32" height="40" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="218" rx="54" ry="7" fill="#1f3a1f" opacity=".16" />
      <g clipPath={`url(#${id}-b)`}>
        <rect x="30" y="60" width="140" height="160" fill="#ffffff" opacity=".35" />
        <path d="M30 104 Q65 98 100 104 T170 104 V220 H30 Z" fill={MATCHA} />
        <g fill="#1f3a1f" opacity=".85" style={{ fontFamily: "var(--font-puff)", fontWeight: 700 }} textAnchor="middle" transform="rotate(-6 100 150)">
          <text x="100" y="150" fontSize="22" textLength="76" lengthAdjust="spacingAndGlyphs">MATCHA</text>
          <text x="103" y="174" fontSize="26" textLength="60" lengthAdjust="spacingAndGlyphs">BABE</text>
        </g>
        <path d="M58 124 Q54 150 64 176" stroke="#ffffff" strokeOpacity=".5" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
      <path d="M84 62 V96 A62 62 0 1 0 116 96 V62" fill="none" stroke="#ffffff" strokeOpacity=".8" strokeWidth="2.5" />
      <rect x="80" y="40" width="40" height="24" rx="5" fill="#f7f3e8" stroke="#ffffff" strokeWidth="1.5" />
      <path d="M86 46 V58 M93 46 V58 M100 46 V58 M107 46 V58 M114 46 V58" stroke="#1f3a1f" strokeOpacity=".15" strokeWidth="2" />
    </g>
  );
}

function Bag() {
  return (
    <g>
      <ellipse cx="100" cy="224" rx="62" ry="7" fill="#1f3a1f" opacity=".16" />
      <path d="M78 88 Q78 50 100 50 Q122 50 122 88" fill="none" stroke="#8a6a45" strokeWidth="5" />
      <path d="M46 88 H154 L162 222 H38 Z" fill="#c9a77c" />
      <path d="M46 88 H154 L156 104 H44 Z" fill="#b8956a" />
      <path d="M100 176 C82 164 74 156 74 144 C74 135 81 130 88 130 C94 130 98 134 100 138 C102 134 106 130 112 130 C119 130 126 135 126 144 C126 156 118 164 100 176 Z" fill="#1f3a1f" />
      <text x="100" y="157" textAnchor="middle" fontSize="20" fill="#cadb9e" style={{ fontFamily: "var(--font-puff)", fontWeight: 700 }}>M</text>
    </g>
  );
}

function Whisk() {
  return (
    <g>
      <ellipse cx="100" cy="222" rx="62" ry="7" fill="#1f3a1f" opacity=".16" />
      <path d="M44 150 Q48 214 100 216 Q152 214 156 150 Z" fill="#f7f3e8" />
      <ellipse cx="100" cy="150" rx="56" ry="11" fill={MATCHA} />
      <ellipse cx="100" cy="150" rx="56" ry="11" fill="none" stroke="#ffffff" strokeOpacity=".7" strokeWidth="2" />
      <rect x="92" y="24" width="16" height="64" rx="7" fill="#d9b77e" />
      <path d="M100 88 Q70 112 80 150 M100 88 Q84 116 90 150 M100 88 Q100 118 100 150 M100 88 Q116 116 110 150 M100 88 Q130 112 120 150" stroke="#d9b77e" strokeWidth="3" fill="none" />
    </g>
  );
}

/** Branded stand-in used until /public/images/<slot>.webp exists. */
export function Placeholder({ slot }: { slot: SlotId }) {
  const meta = IMAGES[slot];
  const drink = DRINKS[slot];
  const bg = drink?.bg ?? TONE_BG[meta.tone];
  const dark = !drink && (meta.tone === "forest" || meta.tone === "kelly");
  const id = `ph-${slot}`;
  const fallback: Drink = { bg, layers: [[MATCHA, 0.1, 0.55], [MILK, 0.55, 1]] };

  return (
    <div role="img" aria-label={meta.alt} className="absolute inset-0 overflow-hidden" style={{ background: bg }}>
      {/* window light */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(90% 70% at 22% 12%, rgba(255,255,255,${dark ? 0.12 : 0.45}) 0%, transparent 60%), radial-gradient(80% 60% at 90% 100%, rgba(31,58,31,${dark ? 0.25 : 0.1}) 0%, transparent 60%)` }}
      />
      {/* leaf shadow */}
      <svg viewBox="0 0 400 400" className="absolute -right-[10%] -top-[8%] w-[70%] opacity-[0.1] blur-[6px]" aria-hidden>
        <g fill="#1f3a1f">
          <path d="M400 30 C310 60 230 100 160 160 L154 152 C224 90 304 48 400 18 Z" />
          <path d="M330 52 C340 8 310 -18 272 -8 C278 30 296 52 330 52 Z" />
          <path d="M278 74 C274 26 238 8 204 24 C220 60 242 78 278 74 Z" />
          <path d="M232 106 C214 62 174 56 148 80 C172 110 196 118 232 106 Z" />
        </g>
      </svg>
      <div className="absolute inset-0 opacity-[0.3] mix-blend-multiply" style={{ backgroundImage: "var(--grain)" }} />
      <svg viewBox="0 0 200 250" className="absolute left-1/2 top-1/2 h-[66%] max-h-[520px] -translate-x-1/2 -translate-y-1/2 overflow-visible" aria-hidden>
        {slot === "cat-events" ? (
          <>
            <Cup d={{ bg, layers: [[MATCHA, 0.1, 0.44], [MILK, 0.44, 0.7], ["#e3607f", 0.7, 1]] }} id={`${id}-a`} x={-42} y={46} s={0.78} />
            <Cup d={{ bg, layers: [["#e8dcf8", 0.04, 0.24], [MATCHA, 0.24, 0.6], [MILK, 0.6, 1]], straw: "#9b7fd0" }} id={`${id}-c`} x={86} y={46} s={0.78} />
            <Cup d={fallback} id={`${id}-b`} x={8} y={14} s={0.9} />
          </>
        ) : !drink && meta.motif === "bottle" ? (
          <Bottle id={id} />
        ) : !drink && meta.motif === "bag" ? (
          <Bag />
        ) : !drink && (meta.motif === "whisk" || meta.motif === "bowl") ? (
          <Whisk />
        ) : (
          <Cup d={drink ?? fallback} id={id} />
        )}
      </svg>
    </div>
  );
}
