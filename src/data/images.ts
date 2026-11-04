/**
 * IMAGE MANIFEST — every image on the site comes from a slot here.
 *
 * To add a real photo: save it as /public/images/<slot-id>.webp
 * (width × height below, i.e. 2× the largest display size). No code changes.
 * Until a file exists, <BrandImage> renders a branded placeholder.
 * Run `npm run images:check` to list slots that are still missing files.
 *
 * Keep keys in the `"slot-id": {` form on their own line — the check script
 * reads this file with a regex.
 */

export type ImageSlot = {
  src: string;
  alt: string;
  /** CSS aspect-ratio, e.g. "4 / 5" */
  aspectRatio: string;
  width: number;
  height: number;
  /** where it appears (for humans + the image brief) */
  usage: string;
  /** placeholder art: which line drawing + palette to use */
  motif: "cup" | "bottle" | "whisk" | "bag" | "star" | "bowl";
  tone: "forest" | "matcha" | "blush" | "cream" | "lav" | "kelly";
};

export const IMAGES = {
  // ── Home ───────────────────────────────────────────────
  "home-hero": {
    src: "/images/home-hero.webp",
    alt: "An iced ceremonial matcha latte with a pink straw, held up in warm window light",
    aspectRatio: "3 / 4", width: 1200, height: 1600,
    usage: "Home hero, tall arch frame (right column)",
    motif: "cup", tone: "matcha",
  },
  "season-feature": {
    src: "/images/season-feature.webp",
    alt: "Birthday Cake Babe matcha topped with vanilla cold foam and rainbow sprinkles",
    aspectRatio: "4 / 5", width: 1280, height: 1600,
    usage: "Home — 'This season / Two years of Matcha Babe' feature",
    motif: "cup", tone: "blush",
  },
  "cat-events": {
    src: "/images/cat-events.webp",
    alt: "A green matcha bar set up for a private event with bottles, straws and a menu card",
    aspectRatio: "4 / 5", width: 1200, height: 1500,
    usage: "Home category card 'Private events' + order step 1 option",
    motif: "whisk", tone: "forest",
  },
  "packaging-bundle": {
    src: "/images/packaging-bundle.webp",
    alt: "A kraft pick-up bag filled with matcha shot bottles, a loyalty card and stickers",
    aspectRatio: "4 / 3", width: 1600, height: 1200,
    usage: "Home 'How it works' step card",
    motif: "bag", tone: "cream",
  },

  // ── Fall menu (seasonal, limited) ─────────────────────
  "season-birthday-cake": {
    src: "/images/season-birthday-cake.webp",
    alt: "Iced matcha latte crowned with vanilla cold foam and rainbow star sprinkles",
    aspectRatio: "3 / 4", width: 900, height: 1200,
    usage: "Home pinned fall menu + Menu 'Fall specials'",
    motif: "cup", tone: "blush",
  },
  "season-pumpkin-cream": {
    src: "/images/season-pumpkin-cream.webp",
    alt: "Matcha latte with pumpkin spice cold foam beside small pumpkins on straw",
    aspectRatio: "3 / 4", width: 900, height: 1200,
    usage: "Home pinned fall menu + Menu 'Fall specials'",
    motif: "cup", tone: "cream",
  },
  "season-maple-pecan": {
    src: "/images/season-maple-pecan.webp",
    alt: "Iced matcha with a maple drizzle and crushed pecans on top",
    aspectRatio: "3 / 4", width: 900, height: 1200,
    usage: "Home pinned fall menu + Menu 'Fall specials'",
    motif: "cup", tone: "matcha",
  },
  "season-horchata": {
    src: "/images/season-horchata.webp",
    alt: "Layered horchata matcha latte dusted with cinnamon",
    aspectRatio: "3 / 4", width: 900, height: 1200,
    usage: "Home pinned fall menu + Menu 'Fall specials'",
    motif: "cup", tone: "cream",
  },
  "season-chai-spice": {
    src: "/images/season-chai-spice.webp",
    alt: "Chai-spiced matcha latte with a cinnamon stick on a linen napkin",
    aspectRatio: "3 / 4", width: 900, height: 1200,
    usage: "Home pinned fall menu + Menu 'Fall specials'",
    motif: "cup", tone: "kelly",
  },
  "season-peppermint": {
    src: "/images/season-peppermint.webp",
    alt: "Peppermint white mocha matcha with crushed candy cane on whipped foam",
    aspectRatio: "3 / 4", width: 900, height: 1200,
    usage: "Home pinned fall menu + Menu 'Fall specials' (holiday preview)",
    motif: "cup", tone: "blush",
  },

  // ── Core lattes ───────────────────────────────────────
  "latte-og-babe": {
    src: "/images/latte-og-babe.webp",
    alt: "The OG Babe: a classic iced ceremonial matcha latte in a clear cup",
    aspectRatio: "4 / 5", width: 1000, height: 1250,
    usage: "Menu 'Lattes' + Home category card 'Lattes'",
    motif: "cup", tone: "matcha",
  },
  "latte-strawberry-cutie": {
    src: "/images/latte-strawberry-cutie.webp",
    alt: "Strawberry Cutie: strawberry purée layered under a matcha float",
    aspectRatio: "4 / 5", width: 1000, height: 1250,
    usage: "Menu 'Lattes'",
    motif: "cup", tone: "blush",
  },
  "latte-lavender-haze": {
    src: "/images/latte-lavender-haze.webp",
    alt: "Lavender Haze: matcha latte topped with pale lavender cold foam",
    aspectRatio: "4 / 5", width: 1000, height: 1250,
    usage: "Menu 'Lattes'",
    motif: "cup", tone: "lav",
  },
  "latte-blue-coconut": {
    src: "/images/latte-blue-coconut.webp",
    alt: "Blue Coconut: coconut milk with a blue swirl under bright green matcha",
    aspectRatio: "4 / 5", width: 1000, height: 1250,
    usage: "Menu 'Lattes'",
    motif: "cup", tone: "kelly",
  },
  "latte-lucky-charms": {
    src: "/images/latte-lucky-charms.webp",
    alt: "Lucky Charms: cereal-milk matcha with colorful marshmallow charms on top",
    aspectRatio: "4 / 5", width: 1000, height: 1250,
    usage: "Menu 'Lattes'",
    motif: "cup", tone: "blush",
  },
  "latte-mexican-vanilla": {
    src: "/images/latte-mexican-vanilla.webp",
    alt: "Mexican vanilla oat milk matcha in a round bottle tied with a handwritten tag",
    aspectRatio: "4 / 5", width: 1000, height: 1250,
    usage: "Menu 'Lattes'",
    motif: "bottle", tone: "cream",
  },

  // ── Bottles & bundles ─────────────────────────────────
  "bottle-signature": {
    src: "/images/bottle-signature.webp",
    alt: "A round glass bottle of matcha latte with a silver cap on a green tiled surface",
    aspectRatio: "4 / 5", width: 1000, height: 1250,
    usage: "Menu 'Bottles & bundles' + Home category card 'Bottles'",
    motif: "bottle", tone: "kelly",
  },
  "bottle-shots-six": {
    src: "/images/bottle-shots-six.webp",
    alt: "Six small matcha shot bottles packed in a kraft paper bag",
    aspectRatio: "4 / 5", width: 1000, height: 1250,
    usage: "Menu 'Bottles & bundles'",
    motif: "bag", tone: "cream",
  },
  "bottle-favours": {
    src: "/images/bottle-favours.webp",
    alt: "Round matcha favor bottles tied with cream ribbon in a silver bowl",
    aspectRatio: "4 / 5", width: 1000, height: 1250,
    usage: "Menu 'Bottles & bundles' (party favors)",
    motif: "bottle", tone: "forest",
  },

  // ── Order flow ────────────────────────────────────────
  "order-backdrop-1": {
    src: "/images/order-backdrop-1.webp",
    alt: "Overhead view of iced matcha lattes in a cardboard carrier with pink straws",
    aspectRatio: "3 / 4", width: 1200, height: 1600,
    usage: "Order flow side panel — steps 1–2",
    motif: "whisk", tone: "matcha",
  },
  "order-backdrop-2": {
    src: "/images/order-backdrop-2.webp",
    alt: "A ceremonial matcha bowl and bamboo whisk on dark green tiles",
    aspectRatio: "3 / 4", width: 1200, height: 1600,
    usage: "Order flow side panel — steps 3–5 and confirmation",
    motif: "bowl", tone: "forest",
  },

  // ── Gallery ───────────────────────────────────────────
  "gallery-01": {
    src: "/images/gallery-01.webp",
    alt: "Iced matcha seen from above on a green and white checkerboard cloth",
    aspectRatio: "4 / 5", width: 1200, height: 1500,
    usage: "Gallery tile (large)", motif: "cup", tone: "kelly",
  },
  "gallery-02": {
    src: "/images/gallery-02.webp",
    alt: "Two iced matcha lattes with pink straws in a cardboard cup carrier on asphalt",
    aspectRatio: "1 / 1", width: 1200, height: 1200,
    usage: "Gallery tile", motif: "cup", tone: "blush",
  },
  "gallery-03": {
    src: "/images/gallery-03.webp",
    alt: "A green pop-up matcha bar under a white canopy at an outdoor market",
    aspectRatio: "3 / 4", width: 1200, height: 1600,
    usage: "Gallery tile (tall)", motif: "whisk", tone: "forest",
  },
  "gallery-04": {
    src: "/images/gallery-04.webp",
    alt: "A canvas tote full of matcha bottles resting on fresh grass",
    aspectRatio: "4 / 5", width: 1200, height: 1500,
    usage: "Gallery tile", motif: "bag", tone: "matcha",
  },
  "gallery-05": {
    src: "/images/gallery-05.webp",
    alt: "A matcha affogato: vanilla ice cream drowned in bright green matcha in a short glass",
    aspectRatio: "1 / 1", width: 1200, height: 1200,
    usage: "Gallery tile", motif: "bowl", tone: "cream",
  },
  "gallery-06": {
    src: "/images/gallery-06.webp",
    alt: "A picnic blanket with an iced matcha in a red cooler, sliced kiwi and grapes",
    aspectRatio: "16 / 10", width: 1600, height: 1000,
    usage: "Gallery tile (wide)", motif: "cup", tone: "blush",
  },
  "gallery-07": {
    src: "/images/gallery-07.webp",
    alt: "A pumpkin spice matcha latte standing on hay next to a large orange pumpkin",
    aspectRatio: "3 / 4", width: 1200, height: 1600,
    usage: "Gallery tile (tall)", motif: "cup", tone: "cream",
  },
  "gallery-08": {
    src: "/images/gallery-08.webp",
    alt: "A dark green cap and an iced matcha on a green tiled table",
    aspectRatio: "4 / 5", width: 1200, height: 1500,
    usage: "Gallery tile", motif: "star", tone: "forest",
  },

  // ── Social ────────────────────────────────────────────
  "og-image": {
    src: "/images/og-image.webp",
    alt: "Matcha Babe iced matcha lattes arranged on cream linen",
    aspectRatio: "1200 / 630", width: 2400, height: 1260,
    usage: "Open Graph / link preview image (1200×630 shown)",
    motif: "cup", tone: "cream",
  },
} satisfies Record<string, ImageSlot>;

export type SlotId = keyof typeof IMAGES;
export const SLOT_IDS = Object.keys(IMAGES) as SlotId[];
