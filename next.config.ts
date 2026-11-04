import type { NextConfig } from "next";

// Note: cacheComponents is intentionally OFF. With it on, Next keeps the
// previous route mounted inside a hidden <Activity>, which would leave GSAP
// ScrollTriggers / pins alive across route transitions.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
