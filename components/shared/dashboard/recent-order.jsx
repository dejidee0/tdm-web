// components/dashboard/RecentOrder.jsx
"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import Image from "next/image";
import { useRecentOrder } from "@/hooks/use-user-dashboard";

const cardClass = "rounded-2xl p-6 border border-white/08";
const cardStyle = { background: "#0d0b08" };

export default function RecentOrder() {
  const { data: order, isLoading, isError } = useRecentOrder();

  if (isLoading) {
    return (
      <div className={cardClass} style={cardStyle}>
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-white/30" />
          <h2 className="text-[16px] font-semibold text-white">Recent Order</h2>
        </div>
        <div className="animate-pulse">
          <div className="w-full h-24 bg-white/06 rounded-xl mb-4" />
          <div className="h-4 bg-white/06 rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/06 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className={cardClass} style={cardStyle}>
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-white/30" />
          <h2 className="text-[16px] font-semibold text-white">Recent Order</h2>
        </div>
        <p className="text-[14px] text-white/30 text-center py-8">
          No recent orders
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cardClass}
      style={cardStyle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-white/30" />
          <h2 className="text-[16px] font-semibold text-white">Recent Order</h2>
        </div>
        <button className="text-[13px] text-[#D4AF37] font-medium hover:text-[#D4AF37]/80 transition-colors">
          View All
        </button>
      </div>

      {/* Order Card */}
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 bg-[#1a1a1a] rounded-xl overflow-hidden">
            {order.image ? (
              <Image
                src={order.image}
                alt={order.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80px, 96px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75h18M3 19.5h18" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-white/30 mb-1">Order {order.id}</p>
            <h3 className="text-[15px] font-semibold text-white mb-2 truncate">
              {order.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className="inline-flex items-center px-2.5 py-1 text-[12px] font-medium rounded-full text-black"
                style={{ background: "rgba(212,175,55,0.80)" }}
              >
                {order.status}
              </span>
              <span className="text-[12px] text-white/40">
                {order.estimatedArrival}
              </span>
            </div>
          </div>
        </div>

        {order.trackingAvailable && (
          <button
            className="text-sm font-semibold px-6 py-2.5 rounded-lg cursor-pointer border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
          >
            Track Package
          </button>
        )}
      </div>
    </motion.div>
  );
}
