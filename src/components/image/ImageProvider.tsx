"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Ctx = { available: Set<string>; showLabels: boolean };
const ImageCtx = createContext<Ctx>({ available: new Set(), showLabels: false });
export const useImageSystem = () => useContext(ImageCtx);

/**
 * `available` is computed on the server (root layout reads /public/images),
 * so a dropped-in file is picked up on the next request in dev, or on the
 * next build in production. `?labels=1` shows slot IDs on every image.
 */
export function ImageProvider({ available, children }: { available: string[]; children: ReactNode }) {
  const [showLabels, setShowLabels] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read URL once on the client
    setShowLabels(new URLSearchParams(window.location.search).get("labels") === "1");
  }, []);
  const value = useMemo(() => ({ available: new Set(available), showLabels }), [available, showLabels]);
  return <ImageCtx.Provider value={value}>{children}</ImageCtx.Provider>;
}
