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
      className="rounded-2xl border border-white/08 p-6"
      style={{ background: "#0d0b08" }}
    >
      {/* Shipping Address */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-[16px] font-semibold text-white">Shipping Details</h3>
        </div>

        <div className="text-[14px] leading-relaxed">
          <p className="font-semibold text-white mb-1">{shipping?.recipient}</p>
          <p className="text-white/45">
            {shipping?.address.line1}<br />
            {shipping?.address.city}, {shipping?.address.country}
          </p>
        </div>
      </div>

      {/* Tracking Information */}
      <div className="pt-6 border-t border-white/06">
        <h4 className="text-[13px] font-semibold text-white/30 uppercase tracking-widest mb-3">
          Carrier Tracking
        </h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[15px] font-semibold text-white">
              {tracking?.carrier}: {tracking?.trackingNumber}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-[13px] font-medium text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-md transition-colors flex items-center gap-1"
          >
            {copied ? (
              <><Check className="w-4 h-4" /> Copied</>
            ) : (
              <><Copy className="w-4 h-4" /> COPY</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
