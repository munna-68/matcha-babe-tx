import type { Metadata, Viewport } from "next";
import fs from "node:fs";
import path from "node:path";
import { DynaPuff, Figtree } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// Display: DynaPuff, a puffy rounded face close to the Matcha Babe wordmark.
// Width axis lets headings run a touch narrower than the hero word.
const puff = DynaPuff({ variable: "--font-puff", subsets: ["latin"], axes: ["wdth"], display: "swap" });
// Text + UI: Figtree, a friendly geometric sans.
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], display: "swap" });

const hasOg = fs.existsSync(path.join(process.cwd(), "public", "images", "og-image.webp"));

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: { default: "Matcha Babe · Organic ceremonial matcha, handcrafted to order", template: "%s · Matcha Babe" },
  description: "For the Babes. Organic ceremonial matcha, handcrafted to order at pop-ups and private events across the Rio Grande Valley. (Concept demo.)",
  openGraph: {
    title: "Matcha Babe",
    description: "Organic ceremonial matcha, handcrafted to order.",
    images: hasOg ? [{ url: "/images/og-image.webp", width: 1200, height: 630 }] : undefined,
  },
};

export const viewport: Viewport = { themeColor: "#eee6cf" };

/** Which image slots have a real file in /public/images (read on the server). */
function availableSlots(): string[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "public", "images"))
      .filter((f) => f.endsWith(".webp"))
      .map((f) => f.replace(/\.webp$/, ""));
  } catch {
    return [];
  }
}

// Runs before first paint: flags JS, repeat visits (skip preloader), reduced motion.
const BOOT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('mb-intro'))d.classList.add('mb-seen')}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${puff.variable} ${figtree.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        <Providers available={availableSlots()}>{children}</Providers>
      </body>
    </html>
  );
}
