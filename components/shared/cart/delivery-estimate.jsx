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
      className="bg-[#e0f2fe] border border-[#bae6fd] rounded-xl p-5"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#0284c7] rounded-lg flex items-center justify-center shrink-0">
          <Truck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-[#0c4a6e] mb-1">
            Estimated Delivery
          </h3>
          <p className="text-[14px] text-[#075985]">
            Order now and receive items by {estimate.earliest} -{" "}
            {estimate.latest}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
