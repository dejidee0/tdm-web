"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Hammer, ShoppingBag } from "lucide-react";

const typeIcons = {
  renovation: Hammer,
  ecommerce: ShoppingBag,
};

const statusStyles = {
  success: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success-solid",
  },
  info: {
    bg: "bg-info/10",
    text: "text-info",
    dot: "bg-info",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
  },
  neutral: {
    bg: "bg-white/08",
    text: "text-muted",
    dot: "bg-muted",
  },
};

export default function OrdersTable({ orders, isLoading }) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl border border-white/08">
        <div className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-white/08 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted font-manrope text-[14px]">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-white/08 p-12 text-center">
        <p className="text-muted font-manrope text-[14px]">
          No orders found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-white/08 overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto table-scroll">
        <div className="px-6 py-4 bg-white/05 border-b border-white/08 min-w-255">
          <div className="grid grid-cols-[140px_240px_120px_140px_120px_140px_120px] justify-between gap-4">
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              ORDER ID
            </span>
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              CUSTOMER
            </span>
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              DATE
            </span>
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              TYPE
            </span>
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              TOTAL
            </span>
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              STATUS
            </span>
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              ACTIONS
            </span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/08 overflow-x-auto">
          {orders.map((order, index) => {
            const TypeIcon = typeIcons[order.typeIcon];
            const statusStyle = statusStyles[order.statusColor];

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="px-6 py-4 hover:bg-white/05 transition-colors min-w-255"
              >
                <div className="grid grid-cols-[140px_240px_120px_140px_120px_140px_120px] gap-4 justify-between items-center">
                  {/* Order ID */}
                  <span className="font-manrope text-[14px] font-bold text-white">
                    #{order.id}
                  </span>

                  {/* Customer */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-manrope text-[13px] font-bold shrink-0"
                      style={{
                        backgroundColor: order.customer.bgColor,
                        color: order.customer.textColor,
                      }}
                    >
                      {order.customer.initials}
                    </div>
                    <span className="font-manrope text-[14px] text-white truncate">
                      {order.customer.name}
                    </span>
                  </div>

                  {/* Date */}
                  <span className="font-manrope text-[13px] text-muted">
                    {order.date}
                  </span>

                  {/* Type */}
                  <div className="flex items-center gap-2">
                    <TypeIcon size={16} className="text-warning" />
                    <span className="font-manrope text-[13px] text-white">
                      {order.type}
                    </span>
                  </div>

                  {/* Total */}
                  <span className="font-manrope text-[14px] font-bold text-white">
                    ${order.total.toFixed(2)}
                  </span>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${statusStyle.dot}`}
                    />
                    <span
                      className={`
                      px-3 py-1 rounded-full font-manrope text-[11px] font-bold
                      ${statusStyle.bg} ${statusStyle.text}
                    `}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      router.push(`/vendor/dashboard/orders/${order.id}`)
                    }
                    className="px-4 py-2 bg-accent-solid text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-white/10 transition-colors"
                  >
                    View Order
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
