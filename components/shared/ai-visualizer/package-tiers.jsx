"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Zap, Crown, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePricing } from "@/hooks/use-pricing";
import { useCurrentUser } from "@/hooks/use-auth";
import { useActivateEconomy, useSubscribePaid } from "@/hooks/use-subscription";

// ── Price display helpers ─────────────────────────────────────────────────

function PriceSkeleton() {
  return (
    <div className="space-y-2 mt-4">
      <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
    </div>
  );
}

function TierPrice({ tier, billing, pricing, discount }) {
  if (tier === "economy") {
    return (
      <div className="mt-4">
        <span className="text-4xl font-extrabold text-gray-900">Free</span>
        <p className="text-sm text-gray-500 mt-1">1 generation · no renewal</p>
      </div>
    );
  }

  const data = pricing?.[tier];
  if (!data) return <PriceSkeleton />;

  const isYearly = billing === "yearly";
  const basePrice = isYearly ? data.yearlyMonthlyEquiv : data.monthlyPrice;
  const annualTotal = data.annualPrice;

  const activeDiscount =
    discount &&
    discount.isActive &&
    (discount.tier === null || discount.tier === tier) &&
    (discount.billingCycle === null || discount.billingCycle === billing)
      ? discount
      : null;

  const discountedPrice = activeDiscount
    ? isYearly
      ? data.discountedYearlyMonthlyEquiv ?? null
      : data.discountedMonthlyPrice ?? null
    : null;

  return (
    <div className="mt-4">
      {activeDiscount && (
        <span className="inline-block mb-2 px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide">
          {activeDiscount.displayLabel || "Limited Offer"}
        </span>
      )}

      <div className="flex items-end gap-2">
        {activeDiscount && discountedPrice != null ? (
          <>
            <span className="text-4xl font-extrabold text-gray-900">
              ${Number(discountedPrice).toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 line-through mb-1.5">
              ${Number(basePrice).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-4xl font-extrabold text-gray-900">
            ${Number(basePrice).toFixed(2)}
          </span>
        )}
        <span className="text-sm text-gray-500 mb-1.5">/mo</span>
      </div>

      {isYearly && (
        <p className="text-sm text-gray-500 mt-1">
          ${Number(annualTotal).toFixed(2)} billed annually
        </p>
      )}

      {activeDiscount?.endDate && (
        <p className="text-xs text-amber-600 mt-1 font-medium">
          Ends {new Date(activeDiscount.endDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

// ── Tier config ───────────────────────────────────────────────────────────

const TIERS = [
  {
    id: "economy",
    label: "Economy",
    tagline: "Try it before you commit",
    icon: Zap,
    color: "from-gray-50 to-gray-100",
    border: "border-gray-200",
    badge: null,
    features: [
      "1 AI design generation",
      "Standard quality render",
      "Nigerian materials context",
      "Download as image",
    ],
    cta: "Activate Free",
    ctaStyle: "bg-gray-900 text-white hover:bg-gray-700",
  },
  {
    id: "premium",
    label: "Premium",
    tagline: "More designs, more control",
    icon: Sparkles,
    color: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    badge: "Most Popular",
    badgeColor: "bg-blue-600 text-white",
    features: [
      "50 generations per billing period",
      "Multiple style variations",
      "Style selection control",
      "Basic cost range estimate",
      "Priority rendering queue",
    ],
    cta: "Choose Premium",
    ctaStyle: "bg-blue-600 text-white hover:bg-blue-700",
  },
  {
    id: "luxury",
    label: "Luxury",
    tagline: "From vision to execution",
    icon: Crown,
    color: "from-purple-50 to-violet-50",
    border: "border-purple-300",
    badge: "Full Access",
    badgeColor: "bg-purple-700 text-white",
    features: [
      "Unlimited generations",
      "Full material mapping (BOQ)",
      "Detailed cost breakdown",
      "Start Project with TBM",
      "Buy Materials via Bogat",
      "Execution-ready output",
    ],
    cta: "Choose Luxury",
    ctaStyle: "bg-purple-700 text-white hover:bg-purple-800",
  },
];

// ── Main component ────────────────────────────────────────────────────────

export default function PackageTiers({ id, onSubscribed }) {
  const [billing, setBilling] = useState("monthly");
  const [pendingTier, setPendingTier] = useState(null);
  const [ctaError, setCtaError] = useState(null);

  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: pricingData, isLoading: priceLoading, isError: priceError } = usePricing();

  const activateEconomy = useActivateEconomy();
  const subscribePaid = useSubscribePaid();

  const pricing = pricingData
    ? { premium: pricingData.premium, luxury: pricingData.luxury }
    : null;
  const activeDiscount = pricingData?.activeDiscount ?? null;
  const yearlyDiscountPct =
    pricingData?.premium?.yearlyDiscountPct ??
    pricingData?.luxury?.yearlyDiscountPct ??
    null;

  const handleCTA = async (tierId) => {
    setCtaError(null);

    // Redirect unauthenticated users to sign in
    if (!user) {
      router.push(`/sign-in?from=${encodeURIComponent("/ai-visualizer#pricing")}`);
      return;
    }

    setPendingTier(tierId);
    try {
      if (tierId === "economy") {
        await activateEconomy.mutateAsync();
        onSubscribed?.("economy");
      } else {
        await subscribePaid.mutateAsync({ tier: tierId, billingCycle: billing });
        onSubscribed?.(tierId);
      }
    } catch (err) {
      setCtaError(err.message || "Something went wrong. Please try again.");
    } finally {
      setPendingTier(null);
    }
  };

  const isSubmitting = activateEconomy.isPending || subscribePaid.isPending;

  return (
    <section
      id={id}
      className="max-w-315 mx-auto px-4 sm:px-6 lg:px-8 py-16 font-manrope scroll-mt-20"
    >
      {/* Section header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
          <Sparkles className="w-3 h-3" /> Ziora Intelligence Plans
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-primary mt-3 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Start free and upgrade when you're ready for deeper design power,
          cost estimates, and full project execution.
        </p>
      </motion.div>

      {/* Billing toggle */}
      <motion.div
        className="flex items-center justify-center mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="inline-flex items-center gap-0 rounded-xl border border-gray-200 p-1 bg-gray-50">
          {["monthly", "yearly"].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBilling(cycle)}
              className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                billing === cycle
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {cycle === "monthly" ? "Monthly" : "Yearly"}
              {cycle === "yearly" && yearlyDiscountPct != null && (
                <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-green-100 text-green-700">
                  Save {Math.round(yearlyDiscountPct)}%
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* API error */}
      {priceError && (
        <div className="flex items-center justify-center gap-2 py-4 mb-6 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Unable to load pricing. Please refresh.
        </div>
      )}

      {/* CTA mutation error */}
      {ctaError && (
        <div className="flex items-center justify-center gap-2 py-3 mb-4 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {ctaError}
        </div>
      )}

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier, i) => {
          const Icon = tier.icon;
          const isHidden =
            tier.id !== "economy" && pricingData
              ? pricingData[tier.id]?.isActive === false
              : false;
          if (isHidden) return null;

          const isBusy = isSubmitting && pendingTier === tier.id;
          const ctaDisabled =
            isSubmitting ||
            (tier.id !== "economy" && priceLoading) ||
            priceError;

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-3xl border ${tier.border} bg-linear-to-br ${tier.color} p-8 shadow-sm hover:shadow-md transition-shadow`}
            >
              {tier.badge && (
                <span
                  className={`absolute top-5 right-5 px-2.5 py-1 text-[11px] font-bold rounded-full ${tier.badgeColor}`}
                >
                  {tier.badge}
                </span>
              )}

              <div className="w-10 h-10 rounded-xl bg-white/70 border border-white/50 flex items-center justify-center shadow-sm mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary">{tier.label}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{tier.tagline}</p>

              {priceLoading && tier.id !== "economy" ? (
                <PriceSkeleton />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${tier.id}-${billing}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TierPrice
                      tier={tier.id}
                      billing={billing}
                      pricing={pricing}
                      discount={activeDiscount}
                    />
                  </motion.div>
                </AnimatePresence>
              )}

              <div className="my-6 border-t border-gray-200" />

              <ul className="flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCTA(tier.id)}
                disabled={!!ctaDisabled}
                className={`mt-8 w-full py-3 px-6 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${tier.ctaStyle}`}
              >
                {isBusy && <Loader2 className="w-4 h-4 animate-spin" />}
                {isBusy ? "Processing…" : tier.cta}
              </button>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        className="text-center text-sm text-gray-400 mt-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        All plans include Nigerian materials context. Upgrade or cancel anytime.
        No credit card required for Economy.
      </motion.p>
    </section>
  );
}
