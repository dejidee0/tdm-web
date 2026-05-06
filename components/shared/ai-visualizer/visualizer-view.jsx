"use client";

import { Suspense } from "react";
import Hero from "./hero";
import HowItWorks from "./how-it-works";
import AppShowcase from "./show-case";
import WhyChooseZiora from "./transformation";
import PackageTiers from "./package-tiers";
import CTAAndTestimonials from "./cta-testimonials";
import FinalCTA from "./final-cta";

export default function AIVisualizerView() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <AppShowcase />
      <WhyChooseZiora />
      <PackageTiers id="pricing" />
      <Suspense fallback={null}>
        <CTAAndTestimonials />
      </Suspense>
      <FinalCTA />
    </>
  );
}
