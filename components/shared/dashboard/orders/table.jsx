// components/dashboard/orders/OrdersTable.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const statusConfig = {
  processing: {
    bg: "bg-[#dbeafe]",
    text: "text-[#1e40af]",
    label: "Processing",
  },
  shipped: {
    bg: "bg-[#e9d5ff]",
    text: "text-[#6b21a8]",
    label: "Shipped",
  },
  delivered: {
    bg: "bg-[#dcfce7]",
    text: "text-[#166534]",
    label: "Delivered",
  },
  cancelled: {
    bg: "bg-[#fee2e2]",
    text: "text-[#991b1b]",
    label: "Cancelled",
  },
};

export default function OrdersTable({ orders, isLoading, isError }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !orders || orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-12 border border-[#e5e5e5] text-center"
      >
        <p className="text-[14px] text-[#999999]">
          {isError ? "Failed to load orders" : "No orders found"}
        </p>
      </motion.div>
    );
  }

  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden"
    >
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e5e5]">
              <th className="text-left px-6 py-4 text-[12px] font-semibold text-[#999999] uppercase tracking-wider">
                Order ID
              </th>
              <th className="text-left px-6 py-4 text-[12px] font-semibold text-[#999999] uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-6 py-4 text-[12px] font-semibold text-[#999999] uppercase tracking-wider">
                Items
              </th>
              <th className="text-right px-6 py-4 text-[12px] font-semibold text-[#999999] uppercase tracking-wider">
                Total
              </th>
              <th className="text-left px-6 py-4 text-[12px] font-semibold text-[#999999] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-[#e5e5e5] last:border-0 hover:bg-[#f8f8f8] transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <span className="text-[14px] font-semibold text-[#1a1a1a]">
                    {order.id}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] text-[#666666]">
                    {order.date}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-[#f5f5f5] rounded-lg overflow-hidden">
                      <Image
                        src={order.items[0].image}
                        alt={order.items[0].name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#1a1a1a] line-clamp-1">
                        {order.items[0].name}
                      </p>
                      {order.items.length > 1 && (
                        <p className="text-[12px] text-[#999999] mt-0.5">
                          + {order.items.length - 1} other item
                          {order.items.length - 1 > 1 ? "s" : ""}
                        </p>
                      )}
                      {order.items[0].details && (
                        <p className="text-[12px] text-[#999999] mt-0.5">
                          {order.items[0].details}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-[15px] font-semibold text-[#1a1a1a]">
                    $
                    {order.total.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-[#e5e5e5]">
        {currentOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 hover:bg-[#f8f8f8] transition-colors cursor-pointer"
          >
            {/* Order Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[15px] font-semibold text-[#1a1a1a]">
                  {order.id}
                </span>
                <p className="text-[13px] text-[#666666] mt-0.5">
                  {order.date}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Order Items */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-16 h-16 flex-shrink-0 bg-[#f5f5f5] rounded-lg overflow-hidden">
                <Image
                  src={order.items[0].image}
                  alt={order.items[0].name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[#1a1a1a] line-clamp-1">
                  {order.items[0].name}
                </p>
                {order.items.length > 1 && (
                  <p className="text-[12px] text-[#999999] mt-1">
                    + {order.items.length - 1} other item
                    {order.items.length - 1 > 1 ? "s" : ""}
                  </p>
                )}
                {order.items[0].details && (
                  <p className="text-[12px] text-[#999999] mt-1">
                    {order.items[0].details}
                  </p>
                )}
              </div>
            </div>

            {/* Order Total */}
            <div className="flex items-center justify-between pt-3 border-t border-[#e5e5e5]">
              <span className="text-[13px] text-[#666666]">Total</span>
              <span className="text-[16px] font-semibold text-[#1a1a1a]">
                $
                {order.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-[#e5e5e5]">
        <p className="text-[13px] text-[#666666]">
          Showing{" "}
          <span className="font-medium text-[#1a1a1a]">{startIndex + 1}</span>{" "}
          to{" "}
          <span className="font-medium text-[#1a1a1a]">
            {Math.min(endIndex, totalOrders)}
          </span>{" "}
          of <span className="font-medium text-[#1a1a1a]">{totalOrders}</span>{" "}
          orders
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded-lg border border-[#e5e5e5] text-[13px] font-medium transition-all ${
              currentPage === 1
                ? "text-[#999999] cursor-not-allowed"
                : "text-[#1a1a1a] hover:bg-[#f5f5f5]"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[13px] text-[#666666] px-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded-lg border border-[#e5e5e5] text-[13px] font-medium transition-all ${
              currentPage === totalPages
                ? "text-[#999999] cursor-not-allowed"
                : "text-[#1a1a1a] hover:bg-[#f5f5f5]"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.processing;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 ${config.bg} ${config.text} text-[12px] font-medium rounded-md`}
    >
      {config.label}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
      {/* Desktop Skeleton */}
      <div className="hidden md:block p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-6 bg-gray-200 rounded w-24" />
          </div>
        ))}
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden divide-y divide-[#e5e5e5]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
              <div className="h-6 bg-gray-200 rounded w-20" />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
