// components/checkout/OrderSummary.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Lock, ArrowRight } from "lucide-react";

export default function OrderSummary({
  checkout,
  currentStep,
  onSubmitPayment,
}) {
  if (!checkout) return null;

  const subtotal = checkout.subtotal || 0;
  const shipping = checkout.shipping || 0;
  const tax = checkout.tax || 0;
  const total = checkout.total || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl border border-[#e5e5e5] p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-semibold text-text-black">
          Order Summary
        </h2>
        <span className="text-[13px] text-[#666666]">
          {checkout.items?.length || 0} items
        </span>
      </div>

      {/* Order Items */}
      <div className="space-y-4 mb-6 pb-6 border-b border-[#e5e5e5]">
        {checkout.items?.map((item) => (
          <div key={item.id} className="flex gap-3">
            {/* Item Image */}
            <div className="relative w-16 h-16 flex-shrink-0 bg-[#f5f5f5] rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-semibold text-text-black mb-1 line-clamp-1">
                {item.name}
              </h3>
              <p className="text-[12px] text-[#666666] mb-2">
                {item.description}
              </p>
              <p className="text-[12px] text-[#999999]">
                Qty: {item.quantity}
                {item.unit ? ` ${item.unit}` : ""}
                {item.pricePerUnit && (
                  <span className="ml-2">
                    @ ${item.pricePerUnit.toFixed(2)}/{item.unit || "ea"}
                  </span>
                )}
              </p>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <p className="text-[15px] font-bold text-text-black">
                $
                {item.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-[14px]">
          <span className="text-[#666666]">Subtotal</span>
          <span className="font-medium text-text-black">
            $
            {subtotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex justify-between text-[14px]">
          <span className="text-[#666666]">Shipping</span>
          <span className="font-medium text-[#16a34a]">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-[14px]">
          <span className="text-[#666666]">Estimated Tax</span>
          <span className="font-medium text-text-black">
            $
            {tax.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-baseline mb-6 pb-6 border-b border-[#e5e5e5]">
        <span className="text-[16px] font-semibold text-text-black">Total</span>
        <div className="text-right">
          <p className="text-[28px] font-bold text-text-black">
            $
            {total.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-[12px] text-[#999999]">USD</p>
        </div>
      </div>

      {/* Confirm Button */}
      {currentStep === 2 && (
        <button
          onClick={onSubmitPayment}
          className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group"
        >
          <Lock className="w-5 h-5" />
          <span>Confirm & Pay</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* Security Note */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-[#999999]">
        <Lock className="w-4 h-4" />
        <span>256-bit SSL Encrypted Payment</span>
      </div>
    </motion.div>
  );
}
