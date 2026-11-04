import type { Metadata } from "next";
import { GalleryView } from "@/components/gallery/GalleryView";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return <GalleryView />;
}
