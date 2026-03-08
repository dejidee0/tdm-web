import CTAAndTestimonials from "@/components/shared/ai-visualizer/cta-testimonials";
import FinalCTA from "@/components/shared/ai-visualizer/final-cta";
import Hero from "@/components/shared/ai-visualizer/hero";
import HowItWorks from "@/components/shared/ai-visualizer/how-it-works";

import AIMultiModeShowcase from "@/components/shared/ai-visualizer/show-case";
import TransformationPath from "@/components/shared/ai-visualizer/transformation";
import React, { Suspense } from "react";

const AIVisualizer = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <TransformationPath />

      <AIMultiModeShowcase />

      <Suspense fallback="Loading">
        <CTAAndTestimonials />
      </Suspense>
      <FinalCTA />
    </div>
  );
};

export default AIVisualizer;
