// components/orders/OrderTimeline.jsx
"use client";

import { motion } from "framer-motion";
import { Truck, Check, Home, Package } from "lucide-react";

const iconMap = { check: Check, truck: Truck, home: Home, package: Package };

export default function OrderTimeline({ estimatedDelivery, timeline }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl p-6 border"
      style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.20)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
        >
          <Truck className="w-6 h-6 text-black" />
        </div>
        <div>
          <h2 className="text-[20px] font-semibold text-white mb-1">
            Arriving by {estimatedDelivery?.date}
          </h2>
          <p className="text-[14px] text-white/40">
            Estimated time: {estimatedDelivery?.timeWindow}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div
          className="absolute top-6 left-6 h-0.5"
          style={{ width: "calc(66.66% - 24px)", background: "linear-gradient(90deg, #D4AF37, #b8962e)" }}
        />

        <div className="grid grid-cols-4 gap-4">
          {timeline?.map((step) => {
            const Icon = iconMap[step.icon] || Check;
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";
            const isPending = step.status === "pending";

            return (
              <div key={step.id} className="relative flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3 relative z-10"
                  style={
                    isCompleted || isActive
                      ? { background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }
                      : { background: "rgba(255,255,255,0.08)" }
                  }
                >
                  <Icon className={`w-5 h-5 ${isPending ? "text-white/25" : "text-black"}`} />
                </div>

                <p className={`text-[13px] font-medium text-center mb-1 ${isPending ? "text-white/30" : "text-white"}`}>
                  {step.label}
                </p>
                <p className="text-[12px] text-white/35 text-center">{step.date}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
