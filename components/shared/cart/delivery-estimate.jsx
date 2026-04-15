"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

export default function DeliveryEstimate({ estimate }) {
  if (!estimate) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl p-5 border"
      style={{
        background: "rgba(212,175,55,0.06)",
        borderColor: "rgba(212,175,55,0.20)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(212,175,55,0.12)" }}
        >
          <Truck className="w-6 h-6 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-white mb-1">
            Estimated Delivery
          </h3>
          <p className="text-[14px] text-white/50">
            Order now and receive items by {estimate.earliest} –{" "}
            {estimate.latest}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
