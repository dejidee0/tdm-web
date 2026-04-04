"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Crown,
  Zap,
  ArrowUpRight,
  RefreshCw,
  CreditCard,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useSubscriptionState, useRenewSubscription } from "@/hooks/use-subscription";
import CancelModal from "./cancel-modal";

// ── Status badge ──────────────────────────────────────────────────────────

function StatusBadge({ status, quotaExhausted }) {
  if (quotaExhausted)
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
        Quota Used
      </span>
    );

  const map = {
    active: "bg-green-100 text-green-700",
    expired: "bg-red-100 text-red-700",
    canceled: "bg-yellow-100 text-yellow-700",
    paused: "bg-red-100 text-red-700",
  };
  const label = {
    active: "Active",
    expired: "Expired",
    canceled: "Canceled",
    paused: "Paused",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-bold ${map[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {label[status] ?? status}
    </span>
  );
}

// ── Tier icon + color ─────────────────────────────────────────────────────

function TierIcon({ tier }) {
  if (tier === "luxury")
    return <Crown className="w-5 h-5 text-purple-600" />;
  if (tier === "premium")
    return <Sparkles className="w-5 h-5 text-blue-600" />;
  return <Zap className="w-5 h-5 text-gray-500" />;
}

function tierLabel(tier) {
  if (tier === "luxury") return "Luxury";
  if (tier === "premium") return "Premium";
  if (tier === "economy") return "Economy — Free";
  return "No Plan";
}

function tierChipClass(tier) {
  if (tier === "luxury") return "bg-purple-100 text-purple-700";
  if (tier === "premium") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-600";
}

// ── Quota progress bar ────────────────────────────────────────────────────

function QuotaBar({ used, allowed }) {
  if (allowed === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
        <Crown className="w-4 h-4" /> Unlimited generations
      </div>
    );
  }
  const pct = Math.min((used / allowed) * 100, 100);
  const isHigh = pct >= 80;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Generations this period</span>
        <span className={`font-semibold ${isHigh ? "text-orange-600" : "text-primary"}`}>
          {used} / {allowed}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${
            isHigh ? "bg-orange-400" : "bg-primary"
          }`}
        />
      </div>
    </div>
  );
}

// ── Format date ───────────────────────────────────────────────────────────

function fmt(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ── Main panel ────────────────────────────────────────────────────────────

export default function SubscriptionPanel() {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const {
    sub,
    tier,
    status,
    isActive,
    isExpired,
    isCanceled,
    isPaused,
    isEconomy,
    isPremium,
    isLuxury,
    generationsUsed,
    generationsAllowed,
    quotaExhausted,
    noSubscription,
    isLoading,
    isError,
  } = useSubscriptionState();

  const renew = useRenewSubscription();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="space-y-3 animate-pulse">
          <div className="h-5 w-40 bg-gray-100 rounded" />
          <div className="h-4 w-28 bg-gray-100 rounded" />
          <div className="h-8 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 flex items-center gap-3 text-red-600 text-sm">
        <AlertCircle className="w-5 h-5 shrink-0" />
        Unable to load subscription status. Please refresh.
      </div>
    );
  }

  // No subscription at all
  if (noSubscription) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center"
      >
        <Zap className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-700 font-semibold mb-1">No active plan</p>
        <p className="text-gray-400 text-sm mb-4">
          Activate the free Economy plan or choose a paid tier to start generating.
        </p>
        <Link
          href="/ai-visualizer#pricing"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#273054] transition-colors"
        >
          View Plans <ArrowUpRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5"
      >
        {/* Top row — tier + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <TierIcon tier={tier} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${tierChipClass(tier)}`}
                >
                  {tierLabel(tier)}
                </span>
                <StatusBadge status={status} quotaExhausted={quotaExhausted} />
              </div>
              {sub?.billingCycle && (
                <p className="text-xs text-gray-400 mt-0.5 capitalize">
                  {sub.billingCycle} billing
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Renewal / access info */}
        {isActive && sub?.periodEnd && !quotaExhausted && (
          <p className="text-sm text-gray-500">
            Renews on{" "}
            <span className="font-semibold text-primary">
              {fmt(sub.periodEnd)}
            </span>
          </p>
        )}

        {isCanceled && sub?.accessUntil && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            Active until{" "}
            <span className="font-bold">{fmt(sub.accessUntil)}</span>
          </div>
        )}

        {isExpired && sub?.periodEnd && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            Access ended on{" "}
            <span className="font-bold">{fmt(sub.periodEnd)}</span>
          </div>
        )}

        {isPaused && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            We couldn't renew your subscription. Please update your payment method.
          </div>
        )}

        {/* Quota progress */}
        {isActive && (
          <QuotaBar used={generationsUsed} allowed={generationsAllowed} />
        )}

        {/* Economy exhausted message */}
        {isEconomy && quotaExhausted && (
          <p className="text-sm text-gray-500">
            You have used your one free generation.
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-1">
          {/* Upgrade CTA — economy, exhausted, expired */}
          {(isEconomy || isExpired || quotaExhausted) && (
            <Link
              href="/ai-visualizer#pricing"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#273054] transition-colors"
            >
              Upgrade Now <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}

          {/* Upgrade from Premium to Luxury */}
          {isPremium && isActive && (
            <Link
              href="/ai-visualizer#pricing"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-purple-300 text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-50 transition-colors"
            >
              <Crown className="w-4 h-4" /> Upgrade to Luxury
            </Link>
          )}

          {/* Reactivate — canceled within access period */}
          {isCanceled && (
            <button
              onClick={() => renew.mutate()}
              disabled={renew.isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#273054] transition-colors disabled:opacity-50"
            >
              {renew.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Reactivate
            </button>
          )}

          {/* Renew — expired */}
          {isExpired && (
            <button
              onClick={() => renew.mutate()}
              disabled={renew.isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#273054] transition-colors disabled:opacity-50"
            >
              {renew.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Renew Plan
            </button>
          )}

          {/* Update payment — paused */}
          {isPaused && (
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
              <CreditCard className="w-4 h-4" /> Update Payment Method
            </button>
          )}

          {/* Cancel — active paid only */}
          {isActive && (isPremium || isLuxury) && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Cancel Subscription
            </button>
          )}
        </div>

        {renew.isError && (
          <p className="text-red-500 text-xs">
            {renew.error?.message || "Renewal failed. Please try again."}
          </p>
        )}
      </motion.div>

      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        accessUntil={sub?.periodEnd}
      />
    </>
  );
}
