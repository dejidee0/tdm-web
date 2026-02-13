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
  const applyPromo = useApplyPromoCode();

  const handleApplyPromo = () => {
    applyPromo.mutate(promoCode, {
      onSuccess: (data) => {
        setAppliedPromo(data);
        setPromoCode("");
      },
      onError: () => {
        alert("Invalid promo code");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const subtotal = cart?.subtotal || 0;
  const shipping = cart?.shipping || 0;
  const discount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? subtotal * appliedPromo.discount
      : appliedPromo.discount
    : 0;
  const total = subtotal + shipping - discount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl border border-[#e5e5e5] p-6 space-y-6"
    >
      <h2 className="text-[20px] font-semibold text-primary">Order Summary</h2>

      {/* Promo Code */}
      <div>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Promo code"
            className="flex-1 px-4 py-2.5 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] focus:outline-none focus:border-[#3b82f6] focus:bg-white"
          />
          <button
            onClick={handleApplyPromo}
            disabled={!promoCode || applyPromo.isPending}
            className="px-4 py-2.5 bg-primary text-white rounded-lg text-[14px] font-medium hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
        {appliedPromo && (
          <div className="mt-2 flex items-center gap-2 text-[13px] text-[#16a34a]">
            <CheckCircle className="w-4 h-4" />
            <span>Promo code "{appliedPromo.code}" applied!</span>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 py-4 border-y border-[#e5e5e5]">
        <div className="flex justify-between text-[14px]">
          <span className="text-[#666666]">Subtotal</span>
          <span className="font-medium text-primary">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-[14px]">
          <span className="text-[#666666]">Shipping</span>
          <span className="font-medium text-[#16a34a]">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-[14px]">
            <span className="text-[#666666]">Discount</span>
            <span className="font-medium text-[#ef4444]">
              -${discount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-[14px]">
          <span className="text-[#666666]">Tax Estimate</span>
          <span className="text-[#666666] text-[13px]">
            Calculated at checkout
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-baseline">
        <span className="text-[16px] font-semibold text-primary">Total</span>
        <div className="text-right">
          <p className="text-[28px] font-bold text-primary">
            ${total.toFixed(2)}
          </p>
          <p className="text-[12px] text-[#999999]">USD</p>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        href="/checkout"
        className="block w-full bg-primary text-white text-center py-4 rounded-lg font-medium hover:bg-[#2a2a2a] transition-colors"
      >
        <div className="flex items-center justify-center gap-2">
          <Lock className="w-5 h-5" />
          <span>Proceed to Checkout</span>
        </div>
      </Link>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#e5e5e5]">
        <div className="text-center">
          <Shield className="w-6 h-6 text-[#666666] mx-auto mb-1" />
          <p className="text-[10px] text-[#999999] uppercase tracking-wide">
            Secure
          </p>
        </div>
        <div className="text-center">
          <CheckCircle className="w-6 h-6 text-[#666666] mx-auto mb-1" />
          <p className="text-[10px] text-[#999999] uppercase tracking-wide">
            Verified
          </p>
        </div>
        <div className="text-center">
          <Lock className="w-6 h-6 text-[#666666] mx-auto mb-1" />
          <p className="text-[10px] text-[#999999] uppercase tracking-wide">
            Encrypted
          </p>
        </div>
      </div>

      {/* Support Link */}
      <p className="text-[13px] text-center text-[#666666] pt-2">
        Need help?{" "}
        <Link
          href="/support"
          className="text-[#3b82f6] hover:text-[#2563eb] font-medium"
        >
          Contact Support
        </Link>
      </p>
    </motion.div>
  );
}
