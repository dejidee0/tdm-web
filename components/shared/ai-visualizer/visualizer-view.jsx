"use client";

import { Suspense } from "react";
import PackageTiers from "./package-tiers";
import Hero from "./hero";
import HowItWorks from "./how-it-works";
import TransformationPath from "./transformation";
import AIMultiModeShowcase from "./show-case";
import CTAAndTestimonials from "./cta-testimonials";
import FinalCTA from "./final-cta";

export default function AIVisualizerView() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <TransformationPath />
      <AIMultiModeShowcase />
      <PackageTiers id="pricing" />
      <Suspense fallback={null}>
        <CTAAndTestimonials />
      </Suspense>
      <FinalCTA />
    </>
  );
}
