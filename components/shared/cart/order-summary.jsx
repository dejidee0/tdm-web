// components/cart/OrderSummary.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Lock, Shield, CheckCircle } from "lucide-react";
import { useApplyPromoCode } from "@/hooks/use-cart";
import Link from "next/link";

export default function OrderSummary({ cart, isLoading }) {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const applyPromo = useApplyPromoCode();

  const handleApplyPromo = () => {
    setPromoError("");
    applyPromo.mutate(promoCode, {
      onSuccess: (data) => {
        setAppliedPromo(data);
        setPromoCode("");
      },
      onError: () => {
        setPromoError("Invalid promo code. Try SAVE10, FIRST20, or FLAT50.");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/08 p-6" style={{ background: "#0d0b08" }}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/08 rounded w-1/2" />
          <div className="h-12 bg-white/08 rounded" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-white/08 rounded" />
            ))}
          </div>
          <div className="h-12 bg-white/08 rounded" />
        </div>
      </div>
    );
  }

  const subtotal = cart?.subtotal ?? 0;
  const shipping = cart?.shipping ?? 0;
  const taxRate = cart?.taxRate ?? 0.0875;

  const discount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? subtotal * appliedPromo.discount
      : appliedPromo.discount
    : 0;

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = discountedSubtotal * taxRate;
  const total = discountedSubtotal + shipping + tax;

  const fmt = (n) =>
    `₦${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-white/08 p-6 space-y-6"
      style={{ background: "#0d0b08" }}
    >
      <h2 className="text-[20px] font-semibold text-white">Order Summary</h2>

      {/* Promo Code */}
      <div>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value.toUpperCase());
              setPromoError("");
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && promoCode && handleApplyPromo()
            }
            placeholder="Promo code"
            className="flex-1 px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-[14px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#D4AF37]/50"
          />
          <button
            onClick={handleApplyPromo}
            disabled={!promoCode || applyPromo.isPending}
            className="px-4 py-2.5 rounded-lg text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-black"
              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
          >
            {applyPromo.isPending ? "…" : "Apply"}
          </button>
        </div>
        {appliedPromo && (
          <div className="mt-2 flex items-center gap-2 text-[13px] text-[#16a34a]">
            <CheckCircle className="w-4 h-4" />
            <span>Code &quot;{appliedPromo.code}&quot; applied!</span>
          </div>
        )}
        {promoError && (
          <p className="mt-2 text-[13px] text-[#ef4444]">{promoError}</p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 py-4 border-y border-white/08">
        <div className="flex justify-between text-[14px]">
          <span className="text-white/45">Subtotal</span>
          <span className="font-medium text-white">{fmt(subtotal)}</span>
        </div>

        <div className="flex justify-between text-[14px]">
          <span className="text-white/45">Shipping</span>
          <span className="font-medium text-[#16a34a]">
            {shipping === 0 ? "Free" : fmt(shipping)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-[14px]">
            <span className="text-white/45">
              Discount ({appliedPromo.code})
            </span>
            <span className="font-medium text-[#ef4444]">-{fmt(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-[14px]">
          <span className="text-white/45">
            Tax ({(taxRate * 100).toFixed(2)}%)
          </span>
          <span className="font-medium text-white">{fmt(tax)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-baseline">
        <span className="text-[16px] font-semibold text-white">Total</span>
        <div className="text-right">
          <p className="text-[28px] font-bold text-white">{fmt(total)}</p>
          <p className="text-[12px] text-white/30">NGN</p>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        href="/checkout"
        className="block w-full text-center py-4 rounded-lg font-medium hover:opacity-90 transition-opacity text-black"
        style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
      >
        <div className="flex items-center justify-center gap-2">
          <Lock className="w-5 h-5" />
          <span>Proceed to Checkout</span>
        </div>
      </Link>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#e5e5e5]">
        <div className="text-center">
          <Shield className="w-6 h-6 text-white/45 mx-auto mb-1" />
          <p className="text-[10px] text-[#999999] uppercase tracking-wide">
            Secure
          </p>
        </div>
        <div className="text-center">
          <CheckCircle className="w-6 h-6 text-white/45 mx-auto mb-1" />
          <p className="text-[10px] text-[#999999] uppercase tracking-wide">
            Verified
          </p>
        </div>
        <div className="text-center">
          <Lock className="w-6 h-6 text-white/45 mx-auto mb-1" />
          <p className="text-[10px] text-[#999999] uppercase tracking-wide">
            Encrypted
          </p>
        </div>
      </div>

      <p className="text-[13px] text-center text-white/45 pt-2">
        Need help?{" "}
        <Link
          href="/contact"
          className="text-[#D4AF37] hover:text-[#D4AF37]/80 font-medium"
        >
          Contact Support
        </Link>
      </p>
    </motion.div>
  );
}
