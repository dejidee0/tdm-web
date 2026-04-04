"use client";

import { motion } from "framer-motion";
import { Sparkles, Crown, Zap, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePricing } from "@/hooks/use-pricing";

function PricePill({ tier, pricing }) {
  const data = pricing?.[tier];
  if (!data) return <span className="text-white/60">—</span>;
  return (
    <span className="font-bold text-white">
      from ${Number(data.monthlyPrice).toFixed(2)}/mo
    </span>
  );
}

export default function SubscriptionUpgradeBanner({ currentTier = "economy" }) {
  const { data: pricingData, isLoading, isError } = usePricing();

  // Only show if user is on Economy (free) or has no paid plan
  if (currentTier !== "economy" && currentTier !== "none") return null;

  const pricing = pricingData ?? null;
  const activeDiscount = pricingData?.activeDiscount ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden border border-primary/20"
      style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1B2D45 60%, #0F172A 100%)",
      }}
    >
      <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-[17px] font-bold text-white font-manrope">
              Unlock the full Ziora experience
            </h3>
            {activeDiscount && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-400 text-amber-900">
                {activeDiscount.displayLabel || "Special Offer"}
              </span>
            )}
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            You're on the free Economy plan — 1 design only. Upgrade for
            unlimited renders, cost estimates, material lists, and project
            execution.
          </p>

          {/* Tier pills */}
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            {isLoading ? (
              <>
                <div className="h-5 w-28 rounded bg-white/10 animate-pulse" />
                <div className="h-5 w-28 rounded bg-white/10 animate-pulse" />
              </>
            ) : isError ? (
              <span className="flex items-center gap-1 text-red-400 text-xs">
                <AlertCircle className="w-3 h-3" /> Unable to load pricing
              </span>
            ) : (
              <>
                <span className="flex items-center gap-1.5 text-white/80">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold text-blue-300">Premium</span>
                  <span className="text-white/50">·</span>
                  <PricePill tier="premium" pricing={pricing} />
                </span>
                <span className="flex items-center gap-1.5 text-white/80">
                  <Crown className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-semibold text-purple-300">Luxury</span>
                  <span className="text-white/50">·</span>
                  <PricePill tier="luxury" pricing={pricing} />
                </span>
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3 shrink-0">
          <Link
            href="/ai-visualizer#pricing"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            View Plans
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
