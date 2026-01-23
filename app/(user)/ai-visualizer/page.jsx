import FindYourAesthetic from "@/components/shared/ai-visualizer/aesthetics";
import CTAAndTestimonials from "@/components/shared/ai-visualizer/cta-testimonials";
import FinalCTA from "@/components/shared/ai-visualizer/final-cta";
import Hero from "@/components/shared/ai-visualizer/hero";
import HowItWorks from "@/components/shared/ai-visualizer/how-it-works";
import InteractiveStudio from "@/components/shared/ai-visualizer/interactive-studio";
import React, { Suspense } from "react";

const AIVisualizer = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <FindYourAesthetic />
      <InteractiveStudio />
      <Suspense fallback="Loading">
        <CTAAndTestimonials />
      </Suspense>
      <FinalCTA />
    </div>
  );
};

export default AIVisualizer;
