"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle } from "lucide-react";
import Image from "next/image";
import totalProductsIcon from "@/public/assets/svgs/vendor/inventory/totalProducts.svg";
import lowStockAlertsIcon from "@/public/assets/svgs/vendor/inventory/lowStockAlerts.svg";
import inventoryValueIcon from "@/public/assets/svgs/vendor/inventory/inventoryValue.svg";

export default function InventoryStatsCards({ stats }) {
  // Provide default values if stats is undefined or missing properties
  const safeStats = {
    totalProducts: {
      label: stats?.totalProducts?.label || "Total Products",
      value: stats?.totalProducts?.value || 0,
      change: stats?.totalProducts?.change || 0,
    },
    lowStockAlerts: {
      label: stats?.lowStockAlerts?.label || "Low Stock Alerts",
      value: stats?.lowStockAlerts?.value || 0,
      badge: stats?.lowStockAlerts?.badge || "None",
    },
    inventoryValue: {
      label: stats?.inventoryValue?.label || "Total Inventory Value",
      formatted: stats?.inventoryValue?.formatted || "$0.00",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[6.96px] border-[0.59px] border-[#273054]/10 p-6 relative overflow-hidden group hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-inter text-[11.84px] text-[#273054] font-medium leading-[16.91px]">
            {safeStats.totalProducts.label}
          </h3>
          <div className="flex items-center gap-1 px-2 py-1 bg-[#D1FAE5] rounded-[3.48px] text-[#065F46]">
            <TrendingUp size={12} />
            <span className="font-inter text-[10.45px] font-bold">
              {safeStats.totalProducts.change}%
            </span>
          </div>
        </div>
        <p className="font-inter text-[25.37px] font-bold text-[#273054] leading-[30.45px] tracking-[-0.63px]">
          {safeStats.totalProducts.value.toLocaleString()}
        </p>
        <Image src={totalProductsIcon} alt="" width={68} height={82} className="absolute right-4 bottom-0 pointer-events-none" />
      </motion.div>

      {/* Low Stock Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[6.96px] border-[0.59px] border-[#273054]/10 p-6 relative overflow-hidden group hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-inter text-[11.84px] text-[#273054] font-medium leading-[16.91px]">
            {safeStats.lowStockAlerts.label}
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#FEF2F2] rounded-[3.48px] text-[#DC2626]">
            <AlertTriangle size={12} />
            <span className="font-inter text-[10.45px] font-bold">
              {safeStats.lowStockAlerts.badge}
            </span>
          </div>
        </div>
        <p className="font-inter text-[25.37px] font-bold text-[#273054] leading-[30.45px] tracking-[-0.63px]">
          {safeStats.lowStockAlerts.value}
        </p>
        <Image src={lowStockAlertsIcon} alt="" width={68} height={82} className="absolute right-4 bottom-0 pointer-events-none" />
      </motion.div>

      {/* Inventory Value */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[6.96px] border-[0.59px] border-[#273054]/10 p-6 relative overflow-hidden group hover:shadow-lg transition-shadow"
      >
        <h3 className="font-inter text-[11.84px] text-[#273054] font-medium leading-[16.91px] mb-4">
          {safeStats.inventoryValue.label}
        </h3>
        <p className="font-inter text-[25.37px] font-bold text-[#273054] leading-[30.45px] tracking-[-0.63px]">
          {safeStats.inventoryValue.formatted}
        </p>
        <Image src={inventoryValueIcon} alt="" width={68} height={82} className="absolute right-3 bottom-2 pointer-events-none" />
      </motion.div>
    </div>
  );
}
