// components/orders/ShippingDetails.jsx
"use client";

import { motion } from "framer-motion";
import { MapPin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useCopyTracking } from "@/hooks/use-order-details";

export default function ShippingDetails({ shipping, tracking }) {
  const [copied, setCopied] = useState(false);
  const copyTracking = useCopyTracking();

  const handleCopy = () => {
    copyTracking.mutate(tracking?.trackingNumber, {
      onSuccess: () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl border border-[#e5e5e5] p-6"
    >
      {/* Shipping Address */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-[16px] font-semibold text-primary">
            Shipping Details
          </h3>
        </div>

        <div className="text-[14px] leading-relaxed">
          <p className="font-semibold text-primary mb-1">
            {shipping?.recipient}
          </p>
          <p className="text-[#666666]">
            {shipping?.address.line1}
            <br />
            {shipping?.address.city}, {shipping?.address.country}
          </p>
        </div>
      </div>

      {/* Tracking Information */}
      <div className="pt-6 border-t border-[#e5e5e5]">
        <h4 className="text-[13px] font-semibold text-[#999999] uppercase tracking-wide mb-3">
          Carrier Tracking
        </h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[15px] font-semibold text-primary">
              {tracking?.carrier}: {tracking?.trackingNumber}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-[13px] font-medium text-[#3b82f6] hover:bg-[#eff6ff] rounded-md transition-colors flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                COPY
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
