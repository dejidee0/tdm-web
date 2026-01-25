// app/dashboard/orders/page.jsx
"use client";

import { motion } from "framer-motion";

import { useOrders } from "@/hooks/use-user-orders";
import { useState } from "react";
import { Download } from "lucide-react";
import DashboardLayout from "@/components/shared/dashboard/layout";
import OrdersFilters from "@/components/shared/dashboard/orders/filters";
import OrdersTable from "@/components/shared/dashboard/orders/table";

export default function OrdersPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: "last30",
    sortBy: "newest",
  });

  const { data: orders, isLoading, isError } = useOrders(filters);

  const handleExport = () => {
    // Export functionality
    console.log("Exporting orders...");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pt-4 md:pt-0  md:w-[60vw] w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-[28px] md:text-[32px] font-semibold text-[#1a1a1a] leading-tight">
              My Orders
            </h1>
            <p className="text-[14px] text-[#666666] mt-1">
              View your order history, check statuses, and track shipments.
            </p>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-lg text-[14px] font-medium text-[#1a1a1a] hover:bg-[#f8f8f8] transition-colors self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </motion.div>

        {/* Filters */}
        <OrdersFilters filters={filters} setFilters={setFilters} />

        {/* Orders Table/List */}
        <OrdersTable orders={orders} isLoading={isLoading} isError={isError} />
      </div>
    </DashboardLayout>
  );
}
