"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { SEED_ENQUIRIES, MENU, CAPACITY, type Enquiry, type EnquiryStatus } from "@/data/mock";

/**
 * In-memory demo state shared by the site and the dashboard.
 * Lives in the root layout, so it survives client-side navigation
 * (order form → dashboard) but resets on a full reload. No backend.
 */
type Store = {
  enquiries: Enquiry[];
  /** id of an enquiry submitted from the site that the dashboard hasn't "received" yet */
  incomingId: string | null;
  submitEnquiry: (e: Omit<Enquiry, "id" | "status" | "received">) => Enquiry;
  acknowledgeIncoming: () => void;
  setStatus: (id: string, s: EnquiryStatus) => void;
  menuOn: Record<string, boolean>;
  toggleMenu: (id: string) => void;
  bookedCups: number;
};

const Ctx = createContext<Store | null>(null);

let counter = 142;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(SEED_ENQUIRIES);
  const [incomingId, setIncomingId] = useState<string | null>(null);
  const [menuOn, setMenuOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(MENU.map((m) => [m.id, true])),
  );

  const submitEnquiry = useCallback<Store["submitEnquiry"]>((e) => {
    const full: Enquiry = {
      ...e,
      id: `MB-${String(counter++).padStart(4, "0")}`,
      status: "new",
      received: "Just now",
      fresh: true,
    };
    setEnquiries((prev) => [full, ...prev.map((p) => ({ ...p, fresh: false }))]);
    setIncomingId(full.id);
    return full;
  }, []);

  const acknowledgeIncoming = useCallback(() => setIncomingId(null), []);

  const setStatus = useCallback((id: string, s: EnquiryStatus) => {
    setEnquiries((prev) => prev.map((p) => (p.id === id ? { ...p, status: s } : p)));
  }, []);

  const toggleMenu = useCallback((id: string) => {
    setMenuOn((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const bookedCups = useMemo(() => {
    const extra = enquiries
      .filter((e) => !SEED_ENQUIRIES.some((s) => s.id === e.id))
      .filter((e) => e.date >= "2026-11-02" && e.date <= "2026-11-08")
      .reduce((a, e) => a + e.cups, 0);
    return CAPACITY.bookedCups + extra;
  }, [enquiries]);

  const value = useMemo(
    () => ({ enquiries, incomingId, submitEnquiry, acknowledgeIncoming, setStatus, menuOn, toggleMenu, bookedCups }),
    [enquiries, incomingId, submitEnquiry, acknowledgeIncoming, setStatus, menuOn, toggleMenu, bookedCups],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside StoreProvider");
  return v;
}
