"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Zap, Crown, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePricing } from "@/hooks/use-pricing";
import { useCurrentUser } from "@/hooks/use-auth";
import { useActivateEconomy, useSubscribePaid } from "@/hooks/use-subscription";

function PriceSkeleton() {
  return (
    <div className="space-y-2 mt-4">
      <div className="h-9 w-32 bg-stone animate-pulse" />
      <div className="h-4 w-40 bg-stone animate-pulse" />
    </div>
  );
}

function TierPrice({ tier, billing, pricing, discount, dark }) {
  const textMuted = dark ? "text-white/50" : "text-[#7A736C]";
  const textMain = dark ? "text-white" : "text-[#0A0A0A]";

  if (tier === "economy") {
    return (
      <div className="mt-4">
        <span className={`text-4xl font-extrabold ${textMain}`}>Free</span>
        <p className={`text-sm ${textMuted} mt-1 font-manrope`}>1 generation · no renewal</p>
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
        <span className="inline-block mb-2 px-2.5 py-1 text-[11px] font-bold bg-warm text-[#0A0A0A] uppercase tracking-wide font-manrope">
          {activeDiscount.displayLabel || "Limited Offer"}
        </span>
      )}

      <div className="flex items-end gap-2">
        {activeDiscount && discountedPrice != null ? (
          <>
            <span className={`text-4xl font-extrabold ${textMain}`}>
              ${Number(discountedPrice).toFixed(2)}
            </span>
            <span className={`text-sm ${textMuted} line-through mb-1.5`}>
              ${Number(basePrice).toFixed(2)}
            </span>
          </>
        ) : (
          <span className={`text-4xl font-extrabold ${textMain}`}>
            ${Number(basePrice).toFixed(2)}
          </span>
        )}
        <span className={`text-sm ${textMuted} mb-1.5 font-manrope`}>/mo</span>
      </div>

      {isYearly && (
        <p className={`text-sm ${textMuted} mt-1 font-manrope`}>
          ${Number(annualTotal).toFixed(2)} billed annually
        </p>
      )}

      {activeDiscount?.endDate && (
        <p className="text-xs text-gold mt-1 font-medium font-manrope">
          Ends {new Date(activeDiscount.endDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

const TIERS = [
  {
    id: "economy",
    label: "Economy",
    tagline: "Try it before you commit",
    icon: Zap,
    dark: false,
    badge: null,
    features: [
      "1 AI design generation",
      "Standard quality render",
      "Nigerian materials context",
      "Download as image",
    ],
    cta: "Activate Free",
  },
  {
    id: "premium",
    label: "Premium",
    tagline: "More designs, more control",
    icon: Sparkles,
    dark: true,
    badge: "Most Popular",
    features: [
      "50 generations per billing period",
      "Multiple style variations",
      "Style selection control",
      "Basic cost range estimate",
      "Priority rendering queue",
    ],
    cta: "Choose Premium",
  },
  {
    id: "luxury",
    label: "Luxury",
    tagline: "From vision to execution",
    icon: Crown,
    dark: false,
    badge: "Full Access",
    features: [
      "Unlimited generations",
      "Full material mapping (BOQ)",
      "Detailed cost breakdown",
      "Start Project with TBM",
      "Buy Materials via Bogat",
      "Execution-ready output",
    ],
    cta: "Choose Luxury",
  },
];

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
      className="bg-[#FAF8F5] py-16 sm:py-20 font-manrope scroll-mt-20"
    >
      <div className="max-w-315 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3 h-3" /> Ziora Intelligence Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-4 tracking-tight font-primary">
            Choose Your Plan
          </h2>
          <p className="text-[#7A736C] text-base max-w-xl font-manrope">
            Start free and upgrade when you're ready for deeper design power,
            cost estimates, and full project execution.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          className="flex items-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-0 border border-stone p-1 bg-white">
            {["monthly", "yearly"].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBilling(cycle)}
                className={`relative px-5 py-2 text-sm font-semibold transition-colors font-manrope ${
                  billing === cycle
                    ? "bg-[#0A0A0A] text-white"
                    : "text-[#7A736C] hover:text-[#0A0A0A]"
                }`}
              >
                {cycle === "monthly" ? "Monthly" : "Yearly"}
                {cycle === "yearly" && yearlyDiscountPct != null && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-warm text-[#0A0A0A]">
                    Save {Math.round(yearlyDiscountPct)}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* API error */}
        {priceError && (
          <div className="flex items-center gap-2 py-4 mb-6 text-red-500 text-sm font-manrope">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Unable to load pricing. Please refresh.
          </div>
        )}

        {/* CTA mutation error */}
        {ctaError && (
          <div className="flex items-center gap-2 py-3 mb-4 text-red-500 text-sm font-manrope">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {ctaError}
          </div>
        )}

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone">
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

            const bg = tier.dark ? "bg-[#0A0A0A]" : "bg-white";
            const textMain = tier.dark ? "text-white" : "text-[#0A0A0A]";
            const textMuted = tier.dark ? "text-white/50" : "text-[#7A736C]";
            const divider = tier.dark ? "border-white/10" : "border-stone";
            const iconBorder = tier.dark ? "border-white/15" : "border-stone";
            const iconBg = tier.dark ? "bg-white/5" : "bg-[#FAF8F5]";
            const checkColor = tier.dark ? "text-gold" : "text-gold";
            const ctaClass = tier.dark
              ? "bg-white text-[#0A0A0A] hover:bg-[#FAF8F5]"
              : "bg-[#0A0A0A] text-white hover:bg-[#1C1C1C]";

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className={`relative flex flex-col p-8 ${bg}`}
              >
                {tier.badge && (
                  <span className="absolute top-5 right-5 px-2.5 py-1 text-[11px] font-bold bg-gold text-white uppercase tracking-wide font-manrope">
                    {tier.badge}
                  </span>
                )}

                <div className={`w-10 h-10 border ${iconBorder} ${iconBg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${tier.dark ? "text-gold" : "text-[#0A0A0A]"}`} />
                </div>
                <h3 className={`text-xl font-bold ${textMain} font-primary`}>{tier.label}</h3>
                <p className={`text-sm ${textMuted} mt-0.5 font-manrope`}>{tier.tagline}</p>

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
                        dark={tier.dark}
                      />
                    </motion.div>
                  </AnimatePresence>
                )}

                <div className={`my-6 border-t ${divider}`} />

                <ul className="flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${textMuted} font-manrope`}>
                      <Check className={`w-4 h-4 ${checkColor} mt-0.5 shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCTA(tier.id)}
                  disabled={!!ctaDisabled}
                  className={`mt-8 w-full py-3 px-6 font-manrope font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide ${ctaClass}`}
                >
                  {isBusy && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isBusy ? "Processing…" : tier.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          className="text-sm text-[#7A736C] mt-10 font-manrope"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          All plans include Nigerian materials context. Upgrade or cancel anytime.
          No credit card required for Economy.
        </motion.p>
      </div>
    </section>
  );
}
