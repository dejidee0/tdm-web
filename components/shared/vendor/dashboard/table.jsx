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
    bg: "bg-[#D1FAE5]",
    text: "text-[#065F46]",
    dot: "bg-[#10B981]",
  },
  info: {
    bg: "bg-[#DBEAFE]",
    text: "text-[#1E40AF]",
    dot: "bg-[#3B82F6]",
  },
  warning: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    dot: "bg-[#F59E0B]",
  },
  neutral: {
    bg: "bg-[#F1F5F9]",
    text: "text-[#475569]",
    dot: "bg-[#94A3B8]",
  },
};

export default function OrdersTable({ orders, isLoading }) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB]">
        <div className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-[#1E293B] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#64748B] font-manrope text-[14px]">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
        <p className="text-[#64748B] font-manrope text-[14px]">
          No orders found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto table-scroll">
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E5E7EB] min-w-[1020px]">
          <div className="grid grid-cols-[140px_240px_120px_140px_120px_140px_120px] justify-between gap-4">
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              ORDER ID
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              CUSTOMER
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              DATE
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              TYPE
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              TOTAL
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              STATUS
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              ACTIONS
            </span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#E5E7EB] overflow-x-auto">
          {orders.map((order, index) => {
            const TypeIcon = typeIcons[order.typeIcon];
            const statusStyle = statusStyles[order.statusColor];

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="px-6 py-4 hover:bg-[#F8FAFC] transition-colors min-w-[1020px]"
              >
                <div className="grid grid-cols-[140px_240px_120px_140px_120px_140px_120px] gap-4 justify-between items-center">
                  {/* Order ID */}
                  <span className="font-manrope text-[14px] font-bold text-[#1E293B]">
                    #{order.id}
                  </span>

                  {/* Customer */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-manrope text-[13px] font-bold flex-shrink-0"
                      style={{
                        backgroundColor: order.customer.bgColor,
                        color: order.customer.textColor,
                      }}
                    >
                      {order.customer.initials}
                    </div>
                    <span className="font-manrope text-[14px] text-[#1E293B] truncate">
                      {order.customer.name}
                    </span>
                  </div>

                  {/* Date */}
                  <span className="font-manrope text-[13px] text-[#64748B]">
                    {order.date}
                  </span>

                  {/* Type */}
                  <div className="flex items-center gap-2">
                    <TypeIcon size={16} className="text-[#F59E0B]" />
                    <span className="font-manrope text-[13px] text-[#1E293B]">
                      {order.type}
                    </span>
                  </div>

                  {/* Total */}
                  <span className="font-manrope text-[14px] font-bold text-[#1E293B]">
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
                    onClick={() => router.push(`/vendor/orders/${order.id}`)}
                    className="px-4 py-2 bg-[#1E293B] text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors"
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
