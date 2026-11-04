import type { Metadata, Viewport } from "next";
import fs from "node:fs";
import path from "node:path";
import { Bagel_Fat_One, Instrument_Serif, Caveat, DM_Mono, DM_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const bagel = Bagel_Fat_One({ variable: "--font-bagel", weight: "400", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Serif({ variable: "--font-instrument", weight: "400", style: ["normal", "italic"], subsets: ["latin"], display: "swap" });
const caveat = Caveat({ variable: "--font-caveat", weight: ["500", "700"], subsets: ["latin"], display: "swap" });
const dmMono = DM_Mono({ variable: "--font-dm-mono", weight: ["400", "500"], subsets: ["latin"], display: "swap" });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });

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

export const viewport: Viewport = { themeColor: "#053f1c" };

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
      className={`${bagel.variable} ${instrument.variable} ${caveat.variable} ${dmMono.variable} ${dmSans.variable}`}
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
