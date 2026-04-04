"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Crown, AlertCircle, Loader2, X } from "lucide-react";
import { usePricing } from "@/hooks/use-pricing";
import { useSubscribePaid } from "@/hooks/use-subscription";

function PriceSkeleton() {
  return <div className="h-8 w-24 bg-white/20 rounded-lg animate-pulse mt-3" />;
}

function CardPrice({ tier, billing, pricing, discount }) {
  const data = pricing?.[tier];
  if (!data) return <PriceSkeleton />;

  const isYearly = billing === "yearly";
  const basePrice = isYearly ? data.yearlyMonthlyEquiv : data.monthlyPrice;

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
    <div className="mt-3">
      <div className="flex items-end gap-1.5">
        {activeDiscount && discountedPrice != null ? (
          <>
            <span className="text-2xl font-extrabold text-white">
              ${Number(discountedPrice).toFixed(2)}
            </span>
            <span className="text-sm text-white/50 line-through mb-0.5">
              ${Number(basePrice).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-2xl font-extrabold text-white">
            ${Number(basePrice).toFixed(2)}
          </span>
        )}
        <span className="text-sm text-white/60 mb-0.5">/mo</span>
      </div>
      {isYearly && (
        <p className="text-xs text-white/50 mt-0.5">
          ${Number(data.annualPrice).toFixed(2)} billed annually
        </p>
      )}
    </div>
  );
}

const PAID_TIERS = [
  {
    id: "premium",
    label: "Premium",
    icon: Sparkles,
    tagline: "50 designs per period",
    features: ["50 generations", "Style variations", "Cost estimates"],
    cta: "Choose Premium",
    accent: "bg-blue-500 hover:bg-blue-400",
    border: "border-blue-400/30",
    bg: "bg-white/5",
  },
  {
    id: "luxury",
    label: "Luxury",
    icon: Crown,
    tagline: "Unlimited · full execution",
    features: ["Unlimited generations", "Full BOQ", "Start Project · Buy Materials"],
    cta: "Choose Luxury",
    accent: "bg-purple-500 hover:bg-purple-400",
    border: "border-purple-400/30",
    bg: "bg-white/10",
  },
];

export default function UpgradeWallModal({ isOpen, reason = "quota", onClose }) {
  const [billing, setBilling] = useState("monthly");
  const [pendingTier, setPendingTier] = useState(null);
  const [error, setError] = useState(null);

  const { data: pricingData, isLoading, isError } = usePricing();
  const subscribePaid = useSubscribePaid();

  // Escape key closes only when onClose is provided (per spec: not dismissible by default)
  useEffect(() => {
    if (!onClose || !isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const pricing = pricingData
    ? { premium: pricingData.premium, luxury: pricingData.luxury }
    : null;
  const activeDiscount = pricingData?.activeDiscount ?? null;
  const yearlyDiscountPct =
    pricingData?.premium?.yearlyDiscountPct ??
    pricingData?.luxury?.yearlyDiscountPct ??
    null;

  const heading =
    reason === "quota"
      ? "You've reached your limit"
      : reason === "expired"
      ? "Your access has ended"
      : "Upgrade to continue";

  const subtext =
    reason === "quota"
      ? "You've used your one free Economy generation. Upgrade to keep designing."
      : reason === "expired"
      ? "Your plan has expired. Renew or choose a new plan to regain access."
      : "Choose a plan to unlock the full Ziora experience.";

  const handleChoose = async (tierId) => {
    setError(null);
    setPendingTier(tierId);
    try {
      await subscribePaid.mutateAsync({ tier: tierId, billingCycle: billing });
      onClose?.();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setPendingTier(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl font-manrope"
              style={{
                background:
                  "linear-gradient(135deg, #0F172A 0%, #1B2D45 60%, #0F172A 100%)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{heading}</h2>
                    <p className="text-white/60 mt-1 text-sm leading-relaxed max-w-sm">
                      {subtext}
                    </p>
                  </div>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Billing toggle */}
                <div className="flex items-center gap-1 mt-5 bg-white/5 rounded-xl p-1 w-fit">
                  {["monthly", "yearly"].map((cycle) => (
                    <button
                      key={cycle}
                      onClick={() => setBilling(cycle)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                        billing === cycle
                          ? "bg-white text-primary"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {cycle === "monthly" ? "Monthly" : "Yearly"}
                      {cycle === "yearly" && yearlyDiscountPct != null && (
                        <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-green-500/20 text-green-300">
                          -{Math.round(yearlyDiscountPct)}%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isError && (
                  <div className="col-span-2 flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Unable to load pricing. Please refresh.
                  </div>
                )}

                {error && (
                  <div className="col-span-2 flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                {PAID_TIERS.map((tier) => {
                  const Icon = tier.icon;
                  const isBusy =
                    subscribePaid.isPending && pendingTier === tier.id;

                  return (
                    <div
                      key={tier.id}
                      className={`rounded-2xl border ${tier.border} ${tier.bg} p-6 flex flex-col`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-white/70" />
                        <span className="text-white font-bold">{tier.label}</span>
                      </div>
                      <p className="text-white/50 text-xs">{tier.tagline}</p>

                      {isLoading ? (
                        <PriceSkeleton />
                      ) : (
                        <CardPrice
                          tier={tier.id}
                          billing={billing}
                          pricing={pricing}
                          discount={activeDiscount}
                        />
                      )}

                      <ul className="mt-4 space-y-2 flex-1">
                        {tier.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2 text-xs text-white/70"
                          >
                            <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleChoose(tier.id)}
                        disabled={
                          subscribePaid.isPending ||
                          isLoading ||
                          isError
                        }
                        className={`mt-5 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${tier.accent}`}
                      >
                        {isBusy && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isBusy ? "Processing…" : tier.cta}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer note */}
              <p className="text-center text-xs text-white/30 pb-6">
                Cancel anytime. No hidden fees.
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
