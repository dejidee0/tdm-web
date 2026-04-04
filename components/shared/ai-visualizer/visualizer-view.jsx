"use client";

import { Suspense } from "react";
import { useSubscriptionState } from "@/hooks/use-subscription";
import { useIsAuthenticated } from "@/hooks/use-auth";

import Hero from "./hero";
import HowItWorks from "./how-it-works";
import TransformationPath from "./transformation";
import AIMultiModeShowcase from "./show-case";
import PackageTiers from "./package-tiers";
import CTAAndTestimonials from "./cta-testimonials";
import FinalCTA from "./final-cta";
import ZioraStudio from "./ziora-studio";
import UpgradeWallModal from "./upgrade-wall-modal";

function MarketingPage() {
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

export default function AIVisualizerView() {
  const { isAuthenticated, isLoading: authLoading } = useIsAuthenticated();
  const {
    canGenerate,
    showUpgradeWall,
    noSubscription,
    isExpired,
    isLoading: subLoading,
  } = useSubscriptionState();

  // While auth is resolving, show the marketing page (avoids flash of wrong content)
  if (authLoading || (isAuthenticated && subLoading)) {
    return <MarketingPage />;
  }

  // Not logged in — always show marketing
  if (!isAuthenticated) {
    return <MarketingPage />;
  }

  // Logged in, no subscription yet — show marketing + package tiers
  if (noSubscription) {
    return <MarketingPage />;
  }

  // Quota exhausted or expired — show upgrade wall over the studio
  if (showUpgradeWall) {
    return (
      <>
        <ZioraStudio />
        <UpgradeWallModal
          isOpen={true}
          reason={isExpired ? "expired" : "quota"}
          // Not dismissible per spec — user must choose a plan or press Escape
          onClose={undefined}
        />
      </>
    );
  }

  // Active subscription — show generation studio
  if (canGenerate) {
    return <ZioraStudio />;
  }

  // Fallback — show marketing
  return <MarketingPage />;
}
