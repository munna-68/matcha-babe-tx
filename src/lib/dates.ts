/** Timezone-safe ISO date helpers (all dates are plain YYYY-MM-DD strings). */
const pad = (n: number) => String(n).padStart(2, "0");

export const isoOf = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

export function parseIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
}

export function addDays(iso: string, n: number) {
  const { y, m, d } = parseIso(iso);
  const dt = new Date(Date.UTC(y, m, d + n));
  return isoOf(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
}

export function weekday(iso: string) {
  const { y, m, d } = parseIso(iso);
  return new Date(Date.UTC(y, m, d)).getUTCDay();
}

export function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }) {
  const { y, m, d } = parseIso(iso);
  return new Date(Date.UTC(y, m, d, 12)).toLocaleDateString("en-US", { timeZone: "UTC", ...opts });
}

export function monthGrid(y: number, m: number) {
  const first = new Date(Date.UTC(y, m, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells: (string | null)[] = Array.from({ length: first }, () => null);
  for (let d = 1; d <= days; d++) cells.push(isoOf(y, m, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

export const monthLabel = (y: number, m: number) =>
  new Date(Date.UTC(y, m, 1, 12)).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
