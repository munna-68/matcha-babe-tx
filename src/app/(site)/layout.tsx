import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Preloader } from "@/components/motion/Preloader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
