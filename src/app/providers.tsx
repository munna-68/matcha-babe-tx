"use client";

import { useEffect, type ReactNode } from "react";
import "@/lib/gsap";
import { StoreProvider } from "@/lib/store";
import { ImageProvider } from "@/components/image/ImageProvider";
import { PageTransitionProvider } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";

/** Children's layout effects (which set initial animation states) run before this. */
function MotionReady() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
  }, []);
  return null;
}

export function Providers({ available, children }: { available: string[]; children: ReactNode }) {
  return (
    <StoreProvider>
      <ImageProvider available={available}>
        <PageTransitionProvider>
          <SmoothScroll />
          {children}
          <Cursor />
          <MotionReady />
        </PageTransitionProvider>
      </ImageProvider>
    </StoreProvider>
  );
}
