import CoreValues from "@/components/shared/about/core-values";
import CTACards from "@/components/shared/about/cta-cards";
import FinalCTA from "@/components/shared/about/final-cta";
import Hero from "@/components/shared/about/hero";
import TBMJourney from "@/components/shared/about/journey";
import MissionVision from "@/components/shared/about/mission";
import WhyChooseTBM from "@/components/shared/about/why";
import React from "react";

const AboutPage = () => {
  return (
    <div>
      <Hero />
      <MissionVision />
      <TBMJourney />
      <CoreValues />
      <WhyChooseTBM />
      <CTACards />
      <FinalCTA />
    </div>
  );
};

export default AboutPage;
