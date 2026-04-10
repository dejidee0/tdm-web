"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  AlertCircle,
  Loader2,
  RefreshCw,
  BadgeCheck,
  CalendarClock,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePricing } from "@/hooks/use-pricing";
import { useCurrentUser } from "@/hooks/use-auth";
import {
  useSubscriptionState,
  useSubscribePaid,
  useRenewSubscription,
} from "@/hooks/use-subscription";
import CancelModal from "@/components/shared/dashboard/designs/cancel-modal";

// ── Helpers ───────────────────────────────────────────────────────────────

function fmt(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Returns the state of a tier card relative to the user's subscription.
 * "current-active" | "current-canceled" | "current-expired" | "current-paused"
 * | "has-other-active" | "none"
 */
function resolveTierState(tierId, sub, status, isActive, isCanceled, isExpired, isPaused) {
  if (!sub) return "none";
  const isCurrentTier = sub.tier === tierId;
  if (isCurrentTier) {
    if (isActive) return "current-active";
    if (isCanceled) return "current-canceled";
    if (isExpired) return "current-expired";
    if (isPaused) return "current-paused";
  }
  if (isActive) return "has-other-active";
  return "none";
}

// ── Price skeleton ────────────────────────────────────────────────────────

function PriceSkeleton() {
  return (
    <div className="space-y-2 mt-4">
      <div className="h-9 w-32 bg-stone animate-pulse" />
      <div className="h-4 w-40 bg-stone animate-pulse" />
    </div>
  );
}

// ── Tier price block ──────────────────────────────────────────────────────

function TierPrice({ tier, billing, pricing, discount, dark }) {
  const textMuted = dark ? "text-white/50" : "text-[#7A736C]";
  const textMain = dark ? "text-white" : "text-[#0A0A0A]";

  // Economy is always free
  if (tier === "economy") {
    return (
      <div className="mt-4">
        <span className={`text-4xl font-extrabold ${textMain}`}>Free</span>
        <span className={`text-sm ${textMuted} ml-1 font-manrope`}>forever</span>
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
              ₦{Number(discountedPrice).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-sm ${textMuted} line-through mb-1.5`}>
              ₦{Number(basePrice).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </>
        ) : (
          <span className={`text-4xl font-extrabold ${textMain}`}>
            ₦{Number(basePrice).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        )}
        <span className={`text-sm ${textMuted} mb-1.5 font-manrope`}>/mo</span>
      </div>
      {isYearly && (
        <p className={`text-sm ${textMuted} mt-1 font-manrope`}>
          ₦{Number(annualTotal).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} billed annually
        </p>
      )}
      {activeDiscount?.endDate && (
        <p className="text-xs text-gold mt-1 font-medium font-manrope">
          Offer ends {new Date(activeDiscount.endDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

// ── Quota bar (shown on active card) ─────────────────────────────────────

function QuotaBar({ used, allowed, dark }) {
  if (allowed === null) {
    const textColor = dark ? "text-white/70" : "text-[#7A736C]";
    return (
      <div className={`flex items-center gap-1.5 text-xs font-medium ${textColor} mt-4`}>
        <Crown className="w-3.5 h-3.5 text-gold" /> Unlimited generations
      </div>
    );
  }

  const pct = Math.min((used / allowed) * 100, 100);
  const isHigh = pct >= 80;
  const trackBg = dark ? "bg-white/10" : "bg-stone";
  const fillColor = isHigh ? "bg-orange-400" : dark ? "bg-gold" : "bg-[#0A0A0A]";
  const textColor = dark ? "text-white/70" : "text-[#7A736C]";
  const countColor = isHigh
    ? "text-orange-400"
    : dark ? "text-white" : "text-[#0A0A0A]";

  return (
    <div className="mt-4 space-y-1.5">
      <div className={`flex items-center justify-between text-xs ${textColor} font-manrope`}>
        <span>Generations used</span>
        <span className={`font-bold ${countColor}`}>{used} / {allowed}</span>
      </div>
      <div className={`h-1.5 ${trackBg} overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${fillColor}`}
        />
      </div>
      {isHigh && (
        <p className="text-[11px] text-orange-400 font-manrope">
          Running low — consider upgrading.
        </p>
      )}
    </div>
  );
}

// ── Tier definitions ──────────────────────────────────────────────────────

const TIERS = [
  {
    id: "economy",
    label: "Economy",
    tagline: "Try it before you commit",
    icon: Zap,
    dark: false,
    badge: null,
    features: [
      "5 AI generations/month",
      "Standard quality renders",
      "Nigerian materials context",
      "Email support",
    ],
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
  },
];

// ── Main component ────────────────────────────────────────────────────────

export default function PackageTiers({ id, onSubscribed }) {
  const [billing, setBilling] = useState("monthly");
  const [pendingTier, setPendingTier] = useState(null);
  const [ctaError, setCtaError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: pricingData, isLoading: priceLoading, isError: priceError } = usePricing();

  const {
    sub,
    tier: currentTier,
    status,
    isActive,
    isCanceled,
    isExpired,
    isPaused,
    generationsUsed,
    generationsAllowed,
    isLoading: subLoading,
  } = useSubscriptionState();

  const subscribePaid = useSubscribePaid();
  const renew = useRenewSubscription();

  const pricing = pricingData
    ? { economy: pricingData.economy, premium: pricingData.premium, luxury: pricingData.luxury }
    : null;
  const activeDiscount = pricingData?.activeDiscount ?? null;
  const yearlyDiscountPct =
    pricingData?.premium?.yearlyDiscountPct ??
    pricingData?.luxury?.yearlyDiscountPct ??
    null;

  const TIER_ENUM = { economy: 0, premium: 1, luxury: 2 };
  const CYCLE_ENUM = { monthly: 0, yearly: 1 };

  const handleSubscribe = async (tierId) => {
    setCtaError(null);
    if (!user) {
      router.push(`/sign-in?from=${encodeURIComponent("/ai-visualizer#pricing")}`);
      return;
    }
    setPendingTier(tierId);
    try {
      await subscribePaid.mutateAsync({
        tier: TIER_ENUM[tierId],
        cycle: CYCLE_ENUM[billing],
        callbackUrl: `${window.location.origin}/ai-visualizer?subscription=success`,
      });
      onSubscribed?.(tierId);
    } catch (err) {
      setCtaError(err.message || "Something went wrong. Please try again.");
    } finally {
      setPendingTier(null);
    }
  };

  const handleRenew = async () => {
    setCtaError(null);
    try {
      await renew.mutateAsync();
    } catch (err) {
      setCtaError(err.message || "Renewal failed. Please try again.");
    }
  };

  const isSubmitting = subscribePaid.isPending || renew.isPending;

  return (
    <>
      <section id={id} className="bg-[#FAF8F5] py-16 sm:py-20 font-manrope scroll-mt-20">
        <div className="max-w-315 mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Section header ───────────────────────────────────── */}
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
              {currentTier && isActive ? "Your Plan" : "Choose Your Plan"}
            </h2>
            <p className="text-[#7A736C] text-base max-w-xl font-manrope">
              {currentTier && isActive
                ? "You're all set. Manage your subscription or upgrade below."
                : "Start free and upgrade when you're ready for deeper design power, cost estimates, and full project execution."}
            </p>
          </motion.div>

          {/* ── Billing toggle (hide when user has active paid plan — cycle is locked) ── */}
          {!(isActive && currentTier && currentTier !== "economy") && (
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
              {isActive && currentTier && currentTier !== "economy" && (
                <p className="ml-4 text-xs text-[#7A736C]">
                  Billing cycle is locked to your current plan.
                </p>
              )}
            </motion.div>
          )}

          {/* ── Errors ───────────────────────────────────────────── */}
          {priceError && (
            <div className="flex items-center gap-2 py-4 mb-6 text-red-500 text-sm font-manrope">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Unable to load pricing. Please refresh.
            </div>
          )}

          {ctaError && (
            <div className="flex items-start gap-3 p-4 mb-6 bg-amber-50 border border-amber-200 font-manrope">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">{ctaError}</p>
            </div>
          )}

          {/* ── Tier cards ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone">
            {TIERS.map((tier, i) => {
              const Icon = tier.icon;
              const isHidden =
                tier.id !== "economy" && pricingData
                  ? pricingData[tier.id]?.isActive === false
                  : false;
              if (isHidden) return null;

              const tierState = resolveTierState(
                tier.id, sub, status, isActive, isCanceled, isExpired, isPaused
              );

              const isCurrentActive = tierState === "current-active";
              const isCurrentCanceled = tierState === "current-canceled";
              const isCurrentExpired = tierState === "current-expired";
              const isCurrentPaused = tierState === "current-paused";
              const hasOtherActive = tierState === "has-other-active";
              const isCurrent = isCurrentActive || isCurrentCanceled || isCurrentExpired || isCurrentPaused;

              const isBusy = isSubmitting && pendingTier === tier.id;

              const bg = tier.dark ? "bg-[#0A0A0A]" : "bg-white";
              const textMain = tier.dark ? "text-white" : "text-[#0A0A0A]";
              const textMuted = tier.dark ? "text-white/50" : "text-[#7A736C]";
              const divider = tier.dark ? "border-white/10" : "border-stone";
              const iconBorder = tier.dark ? "border-white/15" : "border-stone";
              const iconBg = tier.dark ? "bg-white/5" : "bg-[#FAF8F5]";

              // Outer ring for current plan
              const ringClass = isCurrentActive
                ? tier.dark
                  ? "ring-2 ring-white ring-inset"
                  : "ring-2 ring-[#0A0A0A] ring-inset"
                : isCurrentCanceled
                ? "ring-2 ring-amber-400 ring-inset"
                : isCurrentExpired || isCurrentPaused
                ? "ring-2 ring-red-300 ring-inset"
                : "";

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  className={`relative flex flex-col p-8 ${bg} ${ringClass} ${
                    hasOtherActive ? "opacity-60" : ""
                  }`}
                >
                  {/* ── Top badges ── */}
                  <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5">
                    {/* Current plan badge */}
                    {isCurrentActive && (
                      <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-[#0A0A0A] text-white uppercase tracking-wide font-manrope">
                        <BadgeCheck className="w-3 h-3" /> Your Plan
                      </span>
                    )}
                    {isCurrentCanceled && (
                      <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-400 text-white uppercase tracking-wide font-manrope">
                        Canceling
                      </span>
                    )}
                    {isCurrentExpired && (
                      <span className="px-2.5 py-1 text-[11px] font-bold bg-red-400 text-white uppercase tracking-wide font-manrope">
                        Expired
                      </span>
                    )}
                    {isCurrentPaused && (
                      <span className="px-2.5 py-1 text-[11px] font-bold bg-red-500 text-white uppercase tracking-wide font-manrope">
                        Paused
                      </span>
                    )}
                    {/* Regular tier badge — only show if not current plan */}
                    {!isCurrent && tier.badge && (
                      <span className="px-2.5 py-1 text-[11px] font-bold bg-gold text-white uppercase tracking-wide font-manrope">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  {/* Icon + title */}
                  <div className={`w-10 h-10 border ${iconBorder} ${iconBg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${tier.dark ? "text-gold" : "text-[#0A0A0A]"}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${textMain} font-primary`}>{tier.label}</h3>
                  <p className={`text-sm ${textMuted} mt-0.5 font-manrope`}>{tier.tagline}</p>

                  {/* Price */}
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

                  {/* Quota bar — only on active current plan */}
                  {isCurrentActive && (
                    <QuotaBar
                      used={generationsUsed}
                      allowed={generationsAllowed}
                      dark={tier.dark}
                    />
                  )}

                  {/* Subscription status info */}
                  {isCurrentActive && sub?.endDate && (
                    <div className={`flex items-center gap-1.5 mt-3 text-xs ${textMuted} font-manrope`}>
                      <CalendarClock className="w-3.5 h-3.5 shrink-0" />
                      Renews {fmt(sub.endDate)}
                    </div>
                  )}

                  {isCurrentCanceled && sub?.endDate && (
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-amber-600 font-manrope">
                      <CalendarClock className="w-3.5 h-3.5 shrink-0" />
                      Access until {fmt(sub.endDate)}
                    </div>
                  )}

                  {isCurrentExpired && sub?.endDate && (
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-red-500 font-manrope">
                      <CalendarClock className="w-3.5 h-3.5 shrink-0" />
                      Expired {fmt(sub.endDate)}
                    </div>
                  )}

                  <div className={`my-6 border-t ${divider}`} />

                  {/* Features list */}
                  <ul className="flex-1 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2.5 text-sm ${textMuted} font-manrope`}>
                        <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* ── CTA area ── */}
                  <div className="mt-8 space-y-2">

                    {/* ACTIVE current plan */}
                    {isCurrentActive && (
                      <>
                        {/* Economy: no cancel — just a status indicator */}
                        {tier.id === "economy" ? (
                          <div className={`w-full py-3 px-6 font-manrope font-semibold text-sm flex items-center justify-center gap-2 border ${divider} ${textMuted}`}>
                            <BadgeCheck className="w-4 h-4" /> Active Plan
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowCancelModal(true)}
                            disabled={isSubmitting}
                            className="w-full py-3 px-6 font-manrope font-semibold text-sm transition-colors flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
                          >
                            Cancel Plan
                          </button>
                        )}
                      </>
                    )}

                    {/* CANCELED current plan — reactivate */}
                    {isCurrentCanceled && (
                      <button
                        onClick={handleRenew}
                        disabled={renew.isPending}
                        className="w-full py-3 px-6 font-manrope font-semibold text-sm transition-colors flex items-center justify-center gap-2 bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
                      >
                        {renew.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        Reactivate Plan
                      </button>
                    )}

                    {/* EXPIRED or PAUSED current plan — renew */}
                    {(isCurrentExpired || isCurrentPaused) && (
                      <button
                        onClick={handleRenew}
                        disabled={renew.isPending}
                        className="w-full py-3 px-6 font-manrope font-semibold text-sm transition-colors flex items-center justify-center gap-2 bg-[#0A0A0A] text-white hover:bg-[#1C1C1C] disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
                      >
                        {renew.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        Renew Plan
                      </button>
                    )}

                    {/* HAS OTHER ACTIVE plan — show switch hint */}
                    {hasOtherActive && (
                      <div className="space-y-1.5">
                        <button
                          onClick={() => handleSubscribe(tier.id)}
                          disabled={isSubmitting || priceLoading || !!priceError}
                          className={`w-full py-3 px-6 font-manrope font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed tracking-wide ${
                            tier.dark
                              ? "bg-white text-[#0A0A0A] hover:bg-[#FAF8F5]"
                              : "bg-[#0A0A0A] text-white hover:bg-[#1C1C1C]"
                          }`}
                        >
                          {isBusy && <Loader2 className="w-4 h-4 animate-spin" />}
                          {isBusy ? "Processing…" : `Switch to ${tier.label}`}
                          {!isBusy && <ChevronRight className="w-4 h-4" />}
                        </button>
                        <p className={`text-[11px] text-center ${textMuted} font-manrope`}>
                          Your current plan will be canceled first.
                        </p>
                      </div>
                    )}

                    {/* NO subscription — normal CTA */}
                    {tierState === "none" && !subLoading && (
                      <button
                        onClick={() => handleSubscribe(tier.id)}
                        disabled={isSubmitting || (tier.id !== "economy" && (priceLoading || !!priceError))}
                        className={`w-full py-3 px-6 font-manrope font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed tracking-wide ${
                          tier.dark
                            ? "bg-white text-[#0A0A0A] hover:bg-[#FAF8F5]"
                            : "bg-[#0A0A0A] text-white hover:bg-[#1C1C1C]"
                        }`}
                      >
                        {isBusy && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isBusy ? "Processing…" : `Choose ${tier.label}`}
                      </button>
                    )}

                    {/* Subscription loading skeleton for CTA */}
                    {subLoading && (
                      <div className="w-full h-11 bg-stone animate-pulse" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Footer note ──────────────────────────────────────── */}
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

      {/* Cancel modal — shared from dashboard */}
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        accessUntil={sub?.endDate}
      />
    </>
  );
}
