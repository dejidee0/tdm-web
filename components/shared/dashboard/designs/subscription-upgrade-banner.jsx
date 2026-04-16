"use client";

import { motion } from "framer-motion";
import { Sparkles, Crown, Zap, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePricing } from "@/hooks/use-pricing";

function PricePill({ tier, pricing }) {
  const data = pricing?.[tier];
  if (!data) return <span className="text-white/40">—</span>;
  return (
    <span className="font-bold text-white">
      from ₦{Number(data.monthlyPrice).toLocaleString()}/mo
    </span>
  );
}

export default function SubscriptionUpgradeBanner({ currentTier = "economy" }) {
  const { data: pricingData, isLoading, isError } = usePricing();

  if (currentTier !== "economy" && currentTier !== "none") return null;

  const pricing = pricingData ?? null;
  const activeDiscount = pricingData?.activeDiscount ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden border"
      style={{
        background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(184,150,46,0.05) 60%, rgba(212,175,55,0.08) 100%)",
        borderColor: "rgba(212,175,55,0.20)",
      }}
    >
      <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(212,175,55,0.12)" }}
        >
          <Sparkles className="w-6 h-6 text-[#D4AF37]" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-[17px] font-bold text-white font-manrope">
              Unlock the full Ziora experience
            </h3>
            {activeDiscount && (
              <span
                className="px-2 py-0.5 text-[11px] font-bold rounded-full text-black"
                style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
              >
                {activeDiscount.displayLabel || "Special Offer"}
              </span>
            )}
          </div>
          <p className="text-sm text-white/50 leading-relaxed">
            You&apos;re on the free Economy plan — 1 design only. Upgrade for unlimited
            renders, cost estimates, material lists, and project execution.
          </p>

          {/* Tier pills */}
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            {isLoading ? (
              <>
                <div className="h-5 w-28 rounded bg-white/08 animate-pulse" />
                <div className="h-5 w-28 rounded bg-white/08 animate-pulse" />
              </>
            ) : isError ? (
              <span className="flex items-center gap-1 text-red-400 text-xs">
                <AlertCircle className="w-3 h-3" /> Unable to load pricing
              </span>
            ) : (
              <>
                <span className="flex items-center gap-1.5 text-white/70">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold text-blue-300">Premium</span>
                  <span className="text-white/30">·</span>
                  <PricePill tier="premium" pricing={pricing} />
                </span>
                <span className="flex items-center gap-1.5 text-white/70">
                  <Crown className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-semibold text-purple-300">Luxury</span>
                  <span className="text-white/30">·</span>
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all text-black hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
          >
            View Plans
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
