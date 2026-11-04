import { MENU, DROPS, DEMO_TODAY, HOLIDAY_CUTOFF, type EnquiryKind, type Enquiry } from "@/data/mock";
import { addDays, fmtDate } from "@/lib/dates";

export type Pkg = "bar" | "favors" | "both";

export type OrderState = {
  kind: EnquiryKind | null;
  qty: Record<string, number>;
  milk: string;
  sweetness: string;
  eventType: string;
  guests: number;
  pkg: Pkg;
  flavors: string[];
  dropId: string | null;
  date: string | null;
  timeWindow: string;
  name: string;
  handle: string;
  contact: string;
  spot: string;
  venue: string;
  note: string;
  loyalty: boolean;
};

export const INITIAL: OrderState = {
  kind: null,
  qty: {},
  milk: "Whole",
  sweetness: "Regular",
  eventType: "",
  guests: 30,
  pkg: "bar",
  flavors: [],
  dropId: null,
  date: null,
  timeWindow: "Morning",
  name: "",
  handle: "",
  contact: "",
  spot: "McAllen",
  venue: "",
  note: "",
  loyalty: false,
};

export const EVENT_TYPES = ["Baby shower", "Birthday", "Wedding", "Studio class", "Office morning", "Something else"];
export const PACKAGES: { id: Pkg; title: string; body: string; perGuest: number }[] = [
  { id: "bar", title: "Matcha bar · 2 hrs", body: "We set up, whisk to order, you mingle.", perGuest: 10.5 },
  { id: "favors", title: "Favor bottles", body: "Ribbon-tied round bottles with custom tags.", perGuest: 5.5 },
  { id: "both", title: "Bar + favors", body: "The full Babe experience.", perGuest: 15 },
];
export const SPOTS = ["McAllen", "Edinburg", "Mission"];
export const TIME_WINDOWS = ["Morning", "Afternoon", "Evening"];

export const STEP_TITLES = (k: EnquiryKind | null) => [
  "What are you ordering?",
  k === "event" ? "Tell us about your event" : "Build your order",
  k === "pickup" ? "Pick your drop" : "When do you need it?",
  "Where & who",
  "Look good, Babe?",
];
export const STEP_SHORT = ["Type", "Order", "When", "Details", "Review"];

export const itemsFor = (k: EnquiryKind | null) =>
  k === "bottles" ? MENU.filter((m) => m.category === "bottles") : MENU.filter((m) => m.category !== "bottles");

export const leadDays = (k: EnquiryKind | null) => (k === "event" ? 10 : 3);
export const earliestDate = (k: EnquiryKind | null) => addDays(DEMO_TODAY, leadDays(k));
export const latestDate = () => "2027-01-31";
export const isHolidayWindow = (iso: string | null) => !!iso && iso <= HOLIDAY_CUTOFF && iso >= "2026-11-26";

export function lineItems(s: OrderState) {
  if (s.kind === "event") {
    const p = PACKAGES.find((x) => x.id === s.pkg)!;
    return [{ name: p.title, qty: 1, price: p.perGuest * s.guests, detail: `${s.guests} guests` }];
  }
  return Object.entries(s.qty)
    .filter(([, q]) => q > 0)
    .map(([id, q]) => {
      const m = MENU.find((x) => x.id === id)!;
      return { name: m.name, qty: q, price: m.price * q, detail: "" };
    });
}

export function cups(s: OrderState) {
  if (s.kind === "event") return s.pkg === "favors" ? s.guests : s.guests + (s.pkg === "both" ? s.guests : 0);
  return Object.entries(s.qty).reduce((a, [id, q]) => a + q * (id === "babe-shots" ? 6 : 1), 0);
}

export function totals(s: OrderState) {
  const items = lineItems(s);
  const sub = items.reduce((a, i) => a + i.price, 0);
  const drinks = s.kind === "pickup" ? items.reduce((a, i) => a + i.qty, 0) : 0;
  const milk = s.kind === "pickup" && s.milk !== "Whole" ? drinks * 0.75 : 0;
  const loyalty = s.kind === "pickup" && s.loyalty && drinks > 0 ? -6 : 0;
  return { sub, milk, loyalty, total: Math.max(0, sub + milk + loyalty) };
}

export const money = (n: number) => `$${n.toFixed(2)}`;

export function whenLabel(s: OrderState) {
  if (s.kind === "pickup") {
    const d = DROPS.find((x) => x.id === s.dropId);
    return d ? `${fmtDate(d.date)} · ${d.time}` : null;
  }
  return s.date ? `${fmtDate(s.date)}${s.kind === "event" ? ` · ${s.timeWindow}` : ""}` : null;
}

export function whereLabel(s: OrderState) {
  if (s.kind === "pickup") {
    const d = DROPS.find((x) => x.id === s.dropId);
    return d ? `${d.title} · ${d.place.split(" (")[0]}` : null;
  }
  if (s.kind === "bottles") return `Pick-up · ${s.spot}`;
  if (s.kind === "event") return s.venue ? `${s.eventType || "Event"} · ${s.venue}` : null;
  return null;
}

export function canContinue(step: number, s: OrderState): { ok: boolean; hint: string } {
  switch (step) {
    case 0:
      return { ok: !!s.kind, hint: "Choose one to continue" };
    case 1:
      if (s.kind === "event") {
        if (!s.eventType) return { ok: false, hint: "Pick the kind of event" };
        if (s.flavors.length === 0) return { ok: false, hint: "Choose at least one flavor" };
        return { ok: true, hint: "" };
      }
      return { ok: lineItems(s).length > 0, hint: "Add at least one item" };
    case 2:
      return s.kind === "pickup" ? { ok: !!s.dropId, hint: "Choose a drop" } : { ok: !!s.date, hint: "Choose a date" };
    case 3:
      if (s.name.trim().length < 2) return { ok: false, hint: "Add your name" };
      if (s.contact.trim().length < 5) return { ok: false, hint: "Add a phone or email" };
      if (s.kind === "event" && s.venue.trim().length < 2) return { ok: false, hint: "Add the venue or city" };
      return { ok: true, hint: "" };
    default:
      return { ok: true, hint: "" };
  }
}

export function toEnquiry(s: OrderState): Omit<Enquiry, "id" | "status" | "received"> {
  const items = s.kind === "event" ? [{ name: PACKAGES.find((p) => p.id === s.pkg)!.title, qty: 1 }] : lineItems(s).map((i) => ({ name: i.name, qty: i.qty }));
  const date = s.kind === "pickup" ? DROPS.find((d) => d.id === s.dropId)?.date ?? "" : s.date ?? "";
  const noteBits = [s.kind === "event" && s.flavors.length ? `Flavors: ${s.flavors.join(", ")}` : "", s.note.trim()].filter(Boolean);
  return {
    name: s.name.trim(),
    handle: s.handle.trim() ? (s.handle.startsWith("@") ? s.handle.trim() : `@${s.handle.trim()}`) : "—",
    kind: s.kind!,
    items,
    date,
    where: whereLabel(s) ?? "",
    guests: s.kind === "event" ? s.guests : undefined,
    note: noteBits.join(" · ") || undefined,
    loyalty: s.loyalty,
    total: Math.round(totals(s).total * 100) / 100,
    cups: cups(s),
    milk: s.kind === "pickup" ? s.milk : undefined,
    sweetness: s.kind === "pickup" ? s.sweetness : undefined,
  };
}
