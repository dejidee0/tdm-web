"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle } from "lucide-react";

export default function InventoryStatsCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-[#E5E7EB] p-6 relative overflow-hidden group hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-manrope text-[13px] text-[#64748B] font-medium">
            {stats.totalProducts.label}
          </h3>
          <div className="flex items-center gap-1 px-2 py-1 bg-[#D1FAE5] rounded text-[#065F46]">
            <TrendingUp size={12} />
            <span className="font-manrope text-[11px] font-bold">
              {stats.totalProducts.change}%
            </span>
          </div>
        </div>
        <p className="font-manrope text-[32px] font-bold text-[#1E293B]">
          {stats.totalProducts.value.toLocaleString()}
        </p>
      </motion.div>

      {/* Low Stock Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-[#E5E7EB] p-6 relative overflow-hidden group hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-manrope text-[13px] text-[#64748B] font-medium">
            {stats.lowStockAlerts.label}
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#FEF2F2] rounded text-[#DC2626]">
            <AlertTriangle size={12} />
            <span className="font-manrope text-[11px] font-bold">
              {stats.lowStockAlerts.badge}
            </span>
          </div>
        </div>
        <p className="font-manrope text-[32px] font-bold text-[#1E293B]">
          {stats.lowStockAlerts.value}
        </p>
      </motion.div>

      {/* Inventory Value */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-[#E5E7EB] p-6 relative overflow-hidden group hover:shadow-lg transition-shadow"
      >
        <h3 className="font-manrope text-[13px] text-[#64748B] font-medium mb-4">
          {stats.inventoryValue.label}
        </h3>
        <p className="font-manrope text-[32px] font-bold text-[#1E293B]">
          {stats.inventoryValue.formatted}
        </p>
      </motion.div>
    </div>
  );
}
