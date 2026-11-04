"use client";

import Image from "next/image";
import { useState, type CSSProperties, type ReactNode } from "react";
import { IMAGES, type SlotId } from "@/data/images";
import { useImageSystem } from "./ImageProvider";
import { Placeholder } from "./Placeholder";

type Props = {
  slot: SlotId;
  className?: string;
  /** fill the parent instead of using the slot's aspect ratio */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
  /** extra bleed on the inner layer so parallax never shows edges */
  bleed?: boolean;
};

/**
 * Every image on the site goes through here.
 *
 * Structure (identical for real photos and placeholders, so every reveal,
 * parallax and hover animation works the same way):
 *   [data-brand-img]  ← frame: clip-path / scale reveals target this
 *     [data-img-inner] ← inner layer: scale-down + parallax target this
 *       <img> | <Placeholder>
 */
export function BrandImage({ slot, className = "", fill, sizes = "(min-width: 768px) 50vw, 100vw", priority, style, children, bleed = true }: Props) {
  const meta = IMAGES[slot];
  const { available, showLabels } = useImageSystem();
  const [failed, setFailed] = useState(false);
  const real = available.has(slot) && !failed;

  return (
    <div
      data-brand-img
      data-slot={slot}
      className={`relative overflow-hidden ${fill ? "h-full w-full" : ""} ${className}`}
      style={{ aspectRatio: fill ? undefined : meta.aspectRatio, ...style }}
    >
      <div
        data-img-inner
        className={`absolute will-change-transform ${bleed ? "-inset-y-[7%] inset-x-0" : "inset-0"}`}
      >
        {real ? (
          <Image
            src={meta.src}
            alt={meta.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <Placeholder slot={slot} />
        )}
      </div>
      {children}
      {showLabels && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-forest/85 px-2.5 py-1 font-mono text-[10px] tracking-wider text-cream">
          {slot}
          {real ? " ✓" : ""}
        </span>
      )}
    </div>
  );
}
