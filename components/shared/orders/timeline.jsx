// components/orders/OrderTimeline.jsx
"use client";

import { motion } from "framer-motion";
import { Truck, Check, Home, Package } from "lucide-react";

const iconMap = {
  check: Check,
  truck: Truck,
  home: Home,
  package: Package,
};

export default function OrderTimeline({ estimatedDelivery, timeline }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-[#d1d5db] rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Truck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-[20px] font-semibold text-primary mb-1">
            Arriving by {estimatedDelivery?.date}
          </h2>
          <p className="text-[14px] text-[#666666]">
            Estimated time: {estimatedDelivery?.timeWindow}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Progress Line */}
        <div
          className="absolute top-6 left-6 right-6 h-0.5 bg-primary"
          style={{ width: "calc(66.66% - 24px)" }}
        />

        {/* Timeline Steps */}
        <div className="grid grid-cols-4 gap-4">
          {timeline?.map((step, index) => {
            const Icon = iconMap[step.icon] || Check;
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";
            const isPending = step.status === "pending";

            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center"
              >
                {/* Icon Circle */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-3 relative z-10
                    ${isCompleted ? "bg-primary" : ""}
                    ${isActive ? "bg-primary" : ""}
                    ${isPending ? "bg-[#e5e5e5]" : ""}
                  `}
                >
                  <Icon
                    className={`w-5 h-5 ${isPending ? "text-[#999999]" : "text-white"}`}
                  />
                </div>

                {/* Label */}
                <p
                  className={`text-[13px] font-medium text-center mb-1 ${
                    isPending ? "text-[#999999]" : "text-primary"
                  }`}
                >
                  {step.label}
                </p>

                {/* Date */}
                <p className="text-[12px] text-[#666666] text-center">
                  {step.date}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
