/**
 * ALL MOCK DATA FOR THE DEMO LIVES HERE.
 * Real facts (from @matchababetx Instagram screenshots) are marked `real: true`
 * or noted in comments. Prices, customers, orders and stats are placeholders.
 */
import type { SlotId } from "./images";

export const BRAND = {
  name: "Matcha Babe",
  handle: "@matchababetx",
  instagram: "https://www.instagram.com/matchababetx/",
  tagline: "Organic ceremonial matcha, handcrafted to order.", // bio (real)
  hello: "For the Babes", // bio (real)
  services: "Pop-ups · Private events", // bio (real)
  area: "McAllen · Rio Grande Valley, TX",
  loyalty: "Grab 9 iced matcha lattes and your 10th is on us!", // loyalty card (real)
};

/** Today in the demo world. */
export const DEMO_TODAY = "2026-11-04";
/** Last day to place holiday orders. */
export const HOLIDAY_CUTOFF = "2026-12-19";
/** Closed for the holiday break (inclusive). */
export const HOLIDAY_BREAK = { from: "2026-12-20", to: "2027-01-03" };

// ───────────────────────────────────────────────────────── Menu

export type MenuCategory = "lattes" | "seasonal" | "bottles";

export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  notes: string[];
  price: number; // DEMO price
  priceNote?: string;
  slot: SlotId;
  limited?: boolean;
  badge?: string;
  /** the drink name appears on her real posts */
  real?: boolean;
};

export const MENU: MenuItem[] = [
  // Core lattes — names are real (drink-names post), descriptions written for the demo
  { id: "og-babe", name: "OG Babe", category: "lattes", real: true, slot: "latte-og-babe", price: 6,
    description: "The signature. Organic ceremonial matcha whisked to order and poured over milk and ice.",
    notes: ["Ceremonial grade", "Any milk"] },
  { id: "strawberry-cutie", name: "Strawberry Cutie", category: "lattes", real: true, slot: "latte-strawberry-cutie", price: 7,
    description: "Strawberry purée underneath, a bright matcha float on top. Pink and green.",
    notes: ["Fan favorite", "Layered"] },
  { id: "lavender-haze", name: "Lavender Haze", category: "lattes", real: true, slot: "latte-lavender-haze", price: 7,
    description: "A creamy matcha latte under a soft cloud of lavender cold foam.",
    notes: ["Cold foam", "Floral"] },
  { id: "blue-coconut", name: "Blue Coconut", category: "lattes", real: true, slot: "latte-blue-coconut", price: 7,
    description: "Coconut milk with an ocean-blue swirl and matcha poured on top.",
    notes: ["Coconut milk", "Dairy-free"] },
  { id: "lucky-charms", name: "Lucky Charms", category: "lattes", real: true, slot: "latte-lucky-charms", price: 7.5,
    description: "Cereal-milk cold foam and a crown of marshmallow charms. Pure nostalgia.",
    notes: ["Cold foam", "Sweet"] },
  { id: "mexican-vanilla", name: "Mexican Vanilla", category: "lattes", real: true, slot: "latte-mexican-vanilla", price: 6.5,
    description: "Mexican vanilla and oat milk. Softly sweet, very smooth.",
    notes: ["Oat milk", "Dairy-free"] },

  // Fall specials — limited time. "2 yrs of MB" + pumpkin are from real posts; the rest invented for the demo
  { id: "birthday-cake", name: "Birthday Cake Babe", category: "seasonal", limited: true, real: true, slot: "season-birthday-cake", price: 7.5,
    badge: "2 years of MB", description: "Vanilla cake cold foam and rainbow star sprinkles. Our second birthday in a cup.",
    notes: ["Cold foam", "Sprinkles"] },
  { id: "pumpkin-cream", name: "Pumpkin Cream Babe", category: "seasonal", limited: true, slot: "season-pumpkin-cream", price: 7.5,
    description: "Matcha latte topped with pumpkin spice cold foam and a dusting of cinnamon.",
    notes: ["Cold foam", "Spiced"] },
  { id: "maple-pecan", name: "Maple Pecan", category: "seasonal", limited: true, slot: "season-maple-pecan", price: 7.5,
    description: "Real maple, toasted pecan and oat milk under a ceremonial matcha pour.",
    notes: ["Oat milk", "Nutty"] },
  { id: "horchata", name: "Horchata Babe", category: "seasonal", limited: true, slot: "season-horchata", price: 7,
    description: "Cinnamon rice-milk horchata layered with matcha. A Valley classic.",
    notes: ["Dairy-free", "Cinnamon"] },
  { id: "chai-spice", name: "Chai Spice Babe", category: "seasonal", limited: true, slot: "season-chai-spice", price: 7,
    description: "Warm chai spices whisked into matcha with a splash of oat.",
    notes: ["Spiced", "Iced or hot"] },
  { id: "peppermint", name: "Peppermint White Mocha", category: "seasonal", limited: true, slot: "season-peppermint", price: 7.5,
    badge: "From Nov 21", description: "White chocolate, a hint of peppermint and crushed candy cane. A holiday preview.",
    notes: ["Holiday", "Sweet"] },

  // Bottles & bundles — bottle formats are real (round + shot bottles, favour bottles); prices demo
  { id: "signature-bottle", name: "Signature Bottle", category: "bottles", real: true, slot: "bottle-signature", price: 9,
    description: "A 12 oz round bottle of any latte, sealed cold for the fridge. Best within 24 hours.",
    notes: ["12 oz", "Any flavor"] },
  { id: "babe-shots", name: "Babe Shots · 6-pack", category: "bottles", real: true, slot: "bottle-shots-six", price: 24,
    description: "Six 2 oz matcha shots in a kraft bag. Made for brunch tables and gym bags.",
    notes: ["6 × 2 oz", "Mix flavors"] },
  { id: "favour-bottles", name: "Party Favor Bottles", category: "bottles", real: true, slot: "bottle-favours", price: 5.5,
    priceNote: "each · min. 24", description: "Ribbon-tied round bottles with a custom tag, for showers, weddings and birthdays.",
    notes: ["Custom tags", "Min. 24"] },
];

export const ADD_ONS = [
  { name: "Oat, almond or coconut milk", price: 0.75 },
  { name: "Cold foam", price: 1 },
  { name: "Extra ceremonial shot", price: 1.5 },
];

export const MILKS = ["Whole", "Oat", "Almond", "Coconut"] as const;
export const SWEETNESS = ["Less sweet", "Regular", "Extra sweet"] as const;

export const CATEGORY_META: Record<MenuCategory, { label: string; blurb: string }> = {
  lattes: { label: "Lattes", blurb: "The everyday line-up. Iced, whisked to order, any milk." },
  seasonal: { label: "Fall specials", blurb: "Limited time only. Here for the season, then gone." },
  bottles: { label: "Bottles & bundles", blurb: "Matcha to take home, share, or tie with a ribbon." },
};

// ───────────────────────────────────────────────────────── Drops (pop-ups / pick-ups)

export type Drop = {
  id: string;
  date: string; // ISO
  day: string;
  time: string;
  title: string;
  place: string;
  real?: boolean;
};

export const DROPS: Drop[] = [
  // real — from the "Fall Events" post
  { id: "d-1107", date: "2026-11-07", day: "Sat", time: "5–9pm", title: "Fall Market", place: "The Lakes Family Dental, Edinburg", real: true },
  // demo
  { id: "d-1115", date: "2026-11-15", day: "Sun", time: "12–4pm", title: "Matcha Pick-up", place: "McAllen (address sent on confirm)" },
  { id: "d-1121", date: "2026-11-21", day: "Sat", time: "10am–3pm", title: "Holiday menu launch", place: "Partner café, McAllen" },
  { id: "d-1206", date: "2026-12-06", day: "Sun", time: "12–4pm", title: "Matcha Pick-up", place: "McAllen (address sent on confirm)" },
  { id: "d-1212", date: "2026-12-12", day: "Sat", time: "11am–4pm", title: "Holiday Market", place: "Mission, TX" },
];

/** Real past moments, used for copy. */
export const PAST_MOMENTS = [
  "Weekend residency at Casa Vibra, McAllen — Oct 3–4 & 10–11",
  "2 years of Matcha Babe, celebrated Oct 10–11",
  "Yoga House RGV · Sky Mind & Body · Fall Market, Weslaco",
];

export const FLAVOR_MARQUEE = [
  "OG Babe", "Strawberry Cutie", "Lavender Haze", "Blue Coconut",
  "Lucky Charms", "Mexican Vanilla", "Birthday Cake Babe", "Pumpkin Cream",
];

export const HOW_IT_WORKS = [
  { n: "01", title: "Pick your drop", body: "Choose an upcoming pop-up or pick-up day — or tell us about your event.", tone: "paper" },
  { n: "02", title: "Build your order", body: "Drinks, milk, sweetness, notes. Everything in one request, no back-and-forth DMs.", tone: "matcha" },
  { n: "03", title: "Grab & glow", body: "Skip the line at pick-up. Scan 2 Pay, collect your loyalty stamp, sip.", tone: "blush" },
] as const;

// ───────────────────────────────────────────────────────── Gallery

export const GALLERY: { slot: SlotId; caption: string; span: string }[] = [
  { slot: "gallery-01", caption: "Checkerboard & ceremonial", span: "md:col-span-5 md:row-span-2" },
  { slot: "gallery-02", caption: "Two for the road", span: "md:col-span-4" },
  { slot: "gallery-03", caption: "The pop-up bar", span: "md:col-span-3 md:row-span-2" },
  { slot: "gallery-05", caption: "Matcha affogato", span: "md:col-span-4" },
  { slot: "gallery-06", caption: "Picnic season", span: "md:col-span-7" },
  { slot: "gallery-04", caption: "A tote full of bottles", span: "md:col-span-5 md:row-span-2" },
  { slot: "gallery-07", caption: "Pumpkin patch Babe", span: "md:col-span-3 md:row-span-2" },
  { slot: "gallery-08", caption: "Merch drop", span: "md:col-span-4" },
];

// ───────────────────────────────────────────────────────── Dashboard (DEMO DATA)

export type EnquiryKind = "pickup" | "bottles" | "event";
export type EnquiryStatus = "new" | "quoted" | "confirmed" | "ready";

export type Enquiry = {
  id: string;
  name: string;
  handle: string;
  kind: EnquiryKind;
  status: EnquiryStatus;
  items: { name: string; qty: number }[];
  date: string; // ISO date needed
  where: string;
  guests?: number;
  note?: string;
  loyalty?: boolean;
  total: number;
  cups: number;
  received: string; // display label
  milk?: string;
  sweetness?: string;
  fresh?: boolean;
};

export const KIND_LABEL: Record<EnquiryKind, string> = {
  pickup: "Pick-up pre-order",
  bottles: "Bottles & bundles",
  event: "Private event",
};

export const STATUS_FLOW: EnquiryStatus[] = ["new", "quoted", "confirmed", "ready"];

export const SEED_ENQUIRIES: Enquiry[] = [
  { id: "MB-0141", name: "Alex P.", handle: "@demo.alex", kind: "pickup", status: "new",
    items: [{ name: "OG Babe", qty: 2 }, { name: "Pumpkin Cream Babe", qty: 1 }], date: "2026-11-15",
    where: "Matcha Pick-up · McAllen", total: 19.5, cups: 3, received: "Today, 9:12am", milk: "Oat", sweetness: "Regular" },
  { id: "MB-0140", name: "Dani C.", handle: "@demo.dani", kind: "event", status: "new",
    items: [{ name: "Matcha bar · 2 hrs", qty: 1 }], date: "2026-12-05", guests: 40,
    where: "Yoga studio · McAllen", note: "Morning class + brunch. Lavender Haze a must!", total: 420, cups: 40, received: "Yesterday, 6:40pm" },
  { id: "MB-0139", name: "Taylor R.", handle: "@demo.taylor", kind: "pickup", status: "ready",
    items: [{ name: "Strawberry Cutie", qty: 1 }, { name: "Blue Coconut", qty: 1 }], date: "2026-11-07",
    where: "Fall Market · Edinburg", total: 14, cups: 2, received: "Mon, 2:05pm", milk: "Whole", sweetness: "Less sweet" },
  { id: "MB-0138", name: "Marisol G.", handle: "@demo.marisol", kind: "bottles", status: "quoted",
    items: [{ name: "Babe Shots · 6-pack", qty: 2 }], date: "2026-11-11",
    where: "Pick-up · McAllen", total: 48, cups: 12, received: "Mon, 10:21am" },
  { id: "MB-0137", name: "Jordan L.", handle: "@demo.jordan", kind: "event", status: "quoted",
    items: [{ name: "Party Favor Bottles", qty: 30 }], date: "2026-11-28", guests: 30,
    where: "Baby shower · Mission", note: "Cream ribbon, tags that say 'Sip sip hooray'.", total: 165, cups: 30, received: "Sun, 4:48pm" },
  { id: "MB-0136", name: "Priya S.", handle: "@demo.priya", kind: "pickup", status: "confirmed", loyalty: true,
    items: [{ name: "Lavender Haze", qty: 2 }, { name: "OG Babe", qty: 2 }], date: "2026-11-07",
    where: "Fall Market · Edinburg", total: 20, cups: 4, received: "Sat, 11:30am", milk: "Oat", sweetness: "Regular" },
];

export const WEEK = {
  label: "Nov 2 – Nov 8",
  days: [
    { iso: "2026-11-02", d: "Mon", n: 2 },
    { iso: "2026-11-03", d: "Tue", n: 3 },
    { iso: "2026-11-04", d: "Wed", n: 4 },
    { iso: "2026-11-05", d: "Thu", n: 5 },
    { iso: "2026-11-06", d: "Fri", n: 6 },
    { iso: "2026-11-07", d: "Sat", n: 7 },
    { iso: "2026-11-08", d: "Sun", n: 8 },
  ],
  blocks: [
    { iso: "2026-11-03", title: "Bottle pick-up", meta: "MB-0133 · 6 bottles", tone: "cream" },
    { iso: "2026-11-04", title: "Fall menu tasting", meta: "Prep · 2 hrs", tone: "lav" },
    { iso: "2026-11-05", title: "Syrups & cold foam", meta: "Prep day", tone: "cream" },
    { iso: "2026-11-06", title: "Bottle batch", meta: "18 bottles", tone: "matcha" },
    { iso: "2026-11-07", title: "Fall Market", meta: "Edinburg · 5–9pm", tone: "forest" },
    { iso: "2026-11-07", title: "Pre-orders", meta: "2 orders · 6 cups", tone: "blush" },
    { iso: "2026-11-08", title: "Rest day", meta: "Babe is off", tone: "ghost" },
  ],
};

export const CAPACITY = { weekCups: 120, bookedCups: 78 };

export const STATS = {
  enquiriesThisWeek: 6,
  avgReply: "1h 40m",
  loyaltyRedemptions: 3,
  siteVisits: 312,
};
