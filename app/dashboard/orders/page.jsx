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

  const { data: orders, isLoading, isError } = useOrders();

  const handleExport = () => {
    if (!orders || orders.length === 0) return;

    const rows = [
      ["Order ID", "Date", "Items", "Total", "Status"],
      ...orders.map((order) => [
        order.id,
        order.date,
        order.items.map((i) => i.name).join(" | "),
        order.total.toFixed(2),
        order.status,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pt-10 md:pt-0 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-[28px] md:text-[32px] font-semibold text-white leading-tight">
              My Orders
            </h1>
            <p className="text-[14px] text-white/50 mt-1">
              View your order history, check statuses, and track shipments.
            </p>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={!orders || orders.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-[14px] font-medium text-white/60 hover:bg-white/05 hover:text-white transition-colors self-start sm:self-auto disabled:opacity-40 disabled:cursor-not-allowed"
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
