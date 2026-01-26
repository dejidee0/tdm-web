// components/dashboard/RecentOrder.jsx
"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import Image from "next/image";
import { useRecentOrder } from "@/hooks/use-user-dashboard";

export default function RecentOrder() {
  const { data: order, isLoading, isError } = useRecentOrder();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e5e5e5]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#666666]" />
            <h2 className="text-[16px] font-semibold text-[#1a1a1a]">
              Recent Order
            </h2>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="w-full h-24 bg-gray-200 rounded-xl mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e5e5e5]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#666666]" />
            <h2 className="text-[16px] font-semibold text-[#1a1a1a]">
              Recent Order
            </h2>
          </div>
        </div>
        <p className="text-[14px] text-[#999999] text-center py-8">
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
      className="bg-white rounded-2xl p-6 border border-[#e5e5e5]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-400" />
          <h2 className="text-[16px] font-semibold text-[#1a1a1a]">
            Recent Order
          </h2>
        </div>
        <button className="text-[13px] text-[#3b82f6] font-medium hover:text-[#2563eb] transition-colors">
          View All
        </button>
      </div>

      {/* Order Card */}
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          {/* Order Image */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 bg-[#f5f5f5] rounded-xl overflow-hidden">
            <Image
              src={order.image}
              alt={order.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80px, 96px"
            />
          </div>

          {/* Order Details */}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-[#999999] mb-1">Order {order.id}</p>
            <h3 className="text-[15px] font-semibold text-[#1a1a1a] mb-2 truncate">
              {order.title}
            </h3>

            {/* Status Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary text-[12px] font-medium rounded-full">
                {order.status}
              </span>
              <span className="text-[12px] text-[#666666]">
                {order.estimatedArrival}
              </span>
            </div>

            {/* Track Package Button */}
          </div>
        </div>

        {order.trackingAvailable && (
          <button className="text-sm text-primary font-semibold hover:text-primary transition-colors border border-primary/30 hover:bg-primary/30 px-6 py-2.5 rounded-lg cursor-pointer ">
            Track Package
          </button>
        )}
      </div>
    </motion.div>
  );
}
