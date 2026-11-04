import { Hero } from "@/components/home/Hero";
import { Statement, Signatures, FallMenuScroller, HowItWorks, Loyalty, FindUs, Events, PhotoStrip } from "@/components/home/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <Signatures />
      <FallMenuScroller />
      <HowItWorks />
      <Loyalty />
      <FindUs />
      <Events />
      <PhotoStrip />
    </>
  );
}
