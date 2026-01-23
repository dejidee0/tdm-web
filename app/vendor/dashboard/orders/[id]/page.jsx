"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Printer,
  ChevronDown,
  Edit2,
  MessageSquare,
  MapPin,
  Copy,
  CheckCircle2,
  Circle,
  Calendar,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { orderDetailsAPI } from "@/lib/mock/order-details";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id;

  const [notes, setNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderDetailsAPI.getOrderDetails(orderId),
    enabled: !!orderId,
  });

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    await orderDetailsAPI.saveOrderNotes(orderId, notes);
    setIsSavingNotes(false);
  };

  const handleCopyTracking = () => {
    if (order?.delivery?.trackingNumber !== "Pending") {
      navigator.clipboard.writeText(order.delivery.trackingNumber);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E5E7EB] border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#64748B] font-manrope text-[14px]">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-[#64748B] font-manrope text-[14px]">
          Order not found
        </p>
      </div>
    );
  }

  const statusColors = {
    Processing: "bg-[#DBEAFE] text-[#1E40AF]",
    Shipped: "bg-[#DBEAFE] text-[#1E40AF]",
    Delivered: "bg-[#D1FAE5] text-[#065F46]",
    "Pending Approval": "bg-[#FEF3C7] text-[#92400E]",
    Cancelled: "bg-[#F1F5F9] text-[#475569]",
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#64748B] hover:text-primary font-manrope text-[14px] font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Orders
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <h1 className="font-manrope text-[28px] font-bold text-primary">
            Order #{order.orderNumber}
          </h1>
          <span
            className={`px-3 py-1.5 rounded-lg font-manrope text-[12px] font-bold ${
              statusColors[order.status]
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-primary hover:bg-[#F8FAFC] transition-colors"
          >
            <Printer size={16} />
            Print Invoice
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors"
          >
            Update Status
            <ChevronDown size={16} />
          </motion.button>
        </div>
      </motion.div>

      {/* Placed Date */}
      <p className="flex items-center gap-2 text-primary font-semibold font-manrope text-[13px] mb-8">
        <span className="w-6 h-6 bg-[#F1F5F9] rounded flex items-center justify-center">
          <Calendar className="text-primary " strokeWidth={2} size={30} />
        </span>
        Placed on {order.placedAt}
      </p>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Items & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Ordered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
          >
            <div className="px-6 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
              <h2 className="font-manrope text-[16px] font-bold text-primary">
                Items Ordered ({order.items.length})
              </h2>
              <button className="text-[#3B82F6] font-manrope text-[13px] font-medium hover:underline cursor-pointer">
                Edit Order
              </button>
            </div>

            {/* Table Header */}
            <div className="px-6 py-3 bg-[#F8FAFC] border-b border-[#E5E7EB]">
              <div className="grid grid-cols-[1fr_100px_80px_100px] gap-4">
                <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  PRODUCT
                </span>
                <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">
                  PRICE
                </span>
                <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-center">
                  QTY
                </span>
                <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">
                  TOTAL
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-[#E5E7EB]">
              {order.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6"
                >
                  <div className="grid grid-cols-[1fr_100px_80px_100px] gap-4 items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#F1F5F9] rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-[24px]">📦</span>
                      </div>
                      <div>
                        <h3 className="font-manrope text-[14px] font-medium text-primary mb-1">
                          {item.name}
                        </h3>
                        <p className="font-manrope text-[12px] text-primary">
                          {item.sku}
                        </p>
                      </div>
                    </div>
                    <span className="font-manrope text-[14px] text-primary text-right">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="font-manrope text-[14px] text-primary text-center">
                      {item.quantity}
                    </span>
                    <span className="font-manrope text-[14px] font-bold text-primary text-right">
                      ${item.total.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Totals */}
            <div className="p-6 bg-[#F8FAFC] border-t border-[#E5E7EB]">
              <div className="space-y-3 max-w-md ml-auto">
                <div className="flex items-center justify-between">
                  <span className="font-manrope text-[13px] text-[#64748B]">
                    Subtotal
                  </span>
                  <span className="font-manrope text-[14px] text-primary">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-manrope text-[13px] text-[#64748B]">
                    Shipping ({order.shippingType})
                  </span>
                  <span className="font-manrope text-[14px] text-primary">
                    ${order.shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-manrope text-[13px] text-[#64748B]">
                    Tax ({order.taxRate}%)
                  </span>
                  <span className="font-manrope text-[14px] text-primary">
                    ${order.tax.toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                  <span className="font-manrope text-[16px] font-bold text-primary">
                    Total
                  </span>
                  <span className="font-manrope text-[18px] font-bold text-primary">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-[#E5E7EB] p-6"
          >
            <h2 className="font-manrope text-[16px] font-bold text-primary mb-6">
              Order Activity
            </h2>

            <div className="space-y-6">
              {order.activity.map((activity, index) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {activity.completed ? (
                      <CheckCircle2
                        size={20}
                        className="text-[#10B981] flex-shrink-0"
                      />
                    ) : (
                      <Circle
                        size={20}
                        className="text-[#E5E7EB] flex-shrink-0"
                      />
                    )}
                    {index < order.activity.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 mt-2 ${
                          activity.completed ? "bg-[#10B981]" : "bg-[#E5E7EB]"
                        }`}
                        style={{ minHeight: "32px" }}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <h3 className="font-manrope text-[14px] font-bold text-primary mb-1">
                      {activity.status}
                    </h3>
                    <p className="font-manrope text-[12px] text-[#64748B] mb-1">
                      {activity.timestamp}
                    </p>
                    {activity.description && (
                      <p className="font-manrope text-[13px] text-[#64748B]">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Customer, Delivery, Payment, Notes */}
        <div className="space-y-6">
          {/* Customer Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl border border-[#E5E7EB] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-manrope text-[16px] font-bold text-primary">
                Customer Details
              </h2>
              <button className="text-[#64748B] hover:text-primary">
                <Edit2 size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#4F46E5] font-manrope text-[14px] font-bold">
                {order.customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-manrope text-[14px] font-bold text-primary">
                  {order.customer.name}
                </h3>
                <p className="font-manrope text-[12px] text-[#64748B]">
                  {order.customer.memberType}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-[16px] mt-0.5">📧</span>
                <div>
                  <p className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    EMAIL
                  </p>
                  <p className="font-manrope text-[13px] text-primary">
                    {order.customer.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[16px] mt-0.5">📱</span>
                <div>
                  <p className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    PHONE
                  </p>
                  <p className="font-manrope text-[13px] text-primary">
                    {order.customer.phone}
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-primary hover:bg-[#F1F5F9] transition-colors"
            >
              <MessageSquare size={16} />
              Message Customer
            </motion.button>
          </motion.div>

          {/* Delivery Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
          >
            {/* Map Placeholder */}
            <div className="h-[180px] bg-[#E5E7EB] relative">
              <div className="absolute inset-0 flex items-center justify-center text-[#94A3B8]">
                <MapPin size={48} />
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-white rounded text-[10px] font-manrope font-medium text-[#64748B]">
                Google Maps
              </div>
            </div>

            <div className="p-6">
              <h2 className="font-manrope text-[16px] font-bold text-primary mb-4">
                Delivery Address
              </h2>

              <div className="space-y-1 mb-4">
                <p className="font-manrope text-[14px] text-primary">
                  {order.delivery.address}
                </p>
                <p className="font-manrope text-[14px] text-primary">
                  {order.delivery.suite}
                </p>
                <p className="font-manrope text-[14px] text-primary">
                  {order.delivery.city}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    CARRIER
                  </span>
                  <span className="font-manrope text-[13px] text-primary">
                    {order.delivery.carrier}
                  </span>
                  <span className="px-2 py-1 bg-[#D1FAE5] text-[#065F46] rounded text-[11px] font-manrope font-bold">
                    {order.delivery.carrierStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    TRACKING NUMBER
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-manrope text-[13px] text-[#64748B]">
                      {order.delivery.trackingNumber}
                    </span>
                    <button
                      onClick={handleCopyTracking}
                      disabled={order.delivery.trackingNumber === "Pending"}
                      className="text-[#64748B] hover:text-primary disabled:opacity-30"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full mt-4 px-4 py-2.5 bg-primary text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors"
              >
                Assign Delivery
              </motion.button>
            </div>
          </motion.div>

          {/* Payment Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-xl border border-[#E5E7EB] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-manrope text-[16px] font-bold text-primary">
                Payment Status
              </h2>
              <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-[11px] font-manrope font-bold flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                {order.payment.status}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-8 bg-[#1A1F71] rounded flex items-center justify-center text-white text-[10px] font-bold">
                VISA
              </div>
              <div>
                <p className="font-manrope text-[14px] font-medium text-primary">
                  {order.payment.method}
                </p>
                <p className="font-manrope text-[12px] text-[#64748B]">
                  {order.payment.expiry}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-manrope text-[13px] text-[#64748B]">
                  Transaction ID
                </span>
                <span className="font-manrope text-[13px] font-medium text-primary">
                  {order.payment.transactionId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-manrope text-[13px] text-[#64748B]">
                  Payment Date
                </span>
                <span className="font-manrope text-[13px] font-medium text-primary">
                  {order.payment.paymentDate}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Internal Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-[#E5E7EB] px-6 py-3"
          >
            <h2 className="font-manrope text-[16px] font-bold text-primary mb-4">
              Internal Notes
            </h2>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note for the operations team..."
              className="w-full h-24 px-4 py-3 bg-primary/20 border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="w-full mt-3 px-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-primary hover:bg-primary/30 transition-colors disabled:opacity-50"
            >
              {isSavingNotes ? "Saving..." : "SAVE NOTE"}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
