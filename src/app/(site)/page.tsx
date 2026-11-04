import { Hero } from "@/components/home/Hero";
import { Statement, SeasonFeature, FallMenuScroller, Categories, HowItWorks, FindUs, ClosingCTA } from "@/components/home/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <SeasonFeature />
      <FallMenuScroller />
      <Categories />
      <HowItWorks />
      <FindUs />
      <ClosingCTA />
    </>
  );
}
