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
      <div className="flex items-center justify-center min-h-[60vh] bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/08 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted font-manrope text-[14px]">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted font-manrope text-[14px]">
          Order not found
        </p>
      </div>
    );
  }

  const statusColors = {
    Processing: "bg-info/10 text-info",
    Shipped: "bg-info/10 text-info",
    Delivered: "bg-success/10 text-success",
    "Pending Approval": "bg-warning/10 text-warning",
    Cancelled: "bg-white/08 text-muted",
  };

  return (
    <div className="max-w-360 mx-auto bg-background">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted hover:text-white font-manrope text-[14px] font-medium mb-6 transition-colors"
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
          <h1 className="font-manrope text-[28px] font-bold text-white">
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
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-raised border border-white/10 rounded-lg font-manrope text-[13px] font-medium text-white hover:bg-white/05 transition-colors"
          >
            <Printer size={16} />
            Print Invoice
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent-solid text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-white/10 transition-colors"
          >
            Update Status
            <ChevronDown size={16} />
          </motion.button>
        </div>
      </motion.div>

      {/* Placed Date */}
      <p className="flex items-center gap-2 text-white font-semibold font-manrope text-[13px] mb-8">
        <span className="w-6 h-6 bg-white/08 rounded flex items-center justify-center">
          <Calendar className="text-white " strokeWidth={2} size={30} />
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
            className="bg-surface rounded-xl border border-white/08 overflow-hidden"
          >
            <div className="px-6 py-3 border-b border-white/08 flex items-center justify-between">
              <h2 className="font-manrope text-[16px] font-bold text-white">
                Items Ordered ({order.items.length})
              </h2>
              <button className="text-info font-manrope text-[13px] font-medium hover:underline cursor-pointer">
                Edit Order
              </button>
            </div>

            {/* Table Header */}
            <div className="px-6 py-3 bg-white/05 border-b border-white/08">
              <div className="grid grid-cols-[1fr_100px_80px_100px] gap-4">
                <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
                  PRODUCT
                </span>
                <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider text-right">
                  PRICE
                </span>
                <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider text-center">
                  QTY
                </span>
                <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider text-right">
                  TOTAL
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-white/08">
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
                      <div className="w-14 h-14 bg-white/08 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-[24px]">📦</span>
                      </div>
                      <div>
                        <h3 className="font-manrope text-[14px] font-medium text-white mb-1">
                          {item.name}
                        </h3>
                        <p className="font-manrope text-[12px] text-white">
                          {item.sku}
                        </p>
                      </div>
                    </div>
                    <span className="font-manrope text-[14px] text-white text-right">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="font-manrope text-[14px] text-white text-center">
                      {item.quantity}
                    </span>
                    <span className="font-manrope text-[14px] font-bold text-white text-right">
                      ${item.total.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Totals */}
            <div className="p-6 bg-white/05 border-t border-white/08">
              <div className="space-y-3 max-w-md ml-auto">
                <div className="flex items-center justify-between">
                  <span className="font-manrope text-[13px] text-muted">
                    Subtotal
                  </span>
                  <span className="font-manrope text-[14px] text-white">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-manrope text-[13px] text-muted">
                    Shipping ({order.shippingType})
                  </span>
                  <span className="font-manrope text-[14px] text-white">
                    ${order.shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-manrope text-[13px] text-muted">
                    Tax ({order.taxRate}%)
                  </span>
                  <span className="font-manrope text-[14px] text-white">
                    ${order.tax.toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-white/08 flex items-center justify-between">
                  <span className="font-manrope text-[16px] font-bold text-white">
                    Total
                  </span>
                  <span className="font-manrope text-[18px] font-bold text-white">
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
            className="bg-surface rounded-xl border border-white/08 p-6"
          >
            <h2 className="font-manrope text-[16px] font-bold text-white mb-6">
              Order Activity
            </h2>

            <div className="space-y-6">
              {order.activity.map((activity, index) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {activity.completed ? (
                      <CheckCircle2
                        size={20}
                        className="text-success flex-shrink-0"
                      />
                    ) : (
                      <Circle
                        size={20}
                        className="text-muted flex-shrink-0"
                      />
                    )}
                    {index < order.activity.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 mt-2 ${
                          activity.completed ? "bg-success-solid" : "bg-white/10"
                        }`}
                        style={{ minHeight: "32px" }}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <h3 className="font-manrope text-[14px] font-bold text-white mb-1">
                      {activity.status}
                    </h3>
                    <p className="font-manrope text-[12px] text-muted mb-1">
                      {activity.timestamp}
                    </p>
                    {activity.description && (
                      <p className="font-manrope text-[13px] text-muted">
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
            className="bg-surface rounded-xl border border-white/08 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-manrope text-[16px] font-bold text-white">
                Customer Details
              </h2>
              <button className="text-muted hover:text-white">
                <Edit2 size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-chart-1/10 rounded-full flex items-center justify-center text-chart-1 font-manrope text-[14px] font-bold">
                {order.customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-manrope text-[14px] font-bold text-white">
                  {order.customer.name}
                </h3>
                <p className="font-manrope text-[12px] text-muted">
                  {order.customer.memberType}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-[16px] mt-0.5">📧</span>
                <div>
                  <p className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                    EMAIL
                  </p>
                  <p className="font-manrope text-[13px] text-white">
                    {order.customer.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[16px] mt-0.5">📱</span>
                <div>
                  <p className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                    PHONE
                  </p>
                  <p className="font-manrope text-[13px] text-white">
                    {order.customer.phone}
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/05 border border-white/08 rounded-lg font-manrope text-[13px] font-medium text-white hover:bg-white/08 transition-colors"
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
            className="bg-surface rounded-xl border border-white/08 overflow-hidden"
          >
            {/* Map Placeholder */}
            <div className="h-[180px] bg-white/10 relative">
              <div className="absolute inset-0 flex items-center justify-center text-muted">
                <MapPin size={48} />
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-surface rounded text-[16px] font-manrope font-medium text-muted">
                Google Maps
              </div>
            </div>

            <div className="p-6">
              <h2 className="font-manrope text-[16px] font-bold text-white mb-4">
                Delivery Address
              </h2>

              <div className="space-y-1 mb-4">
                <p className="font-manrope text-[14px] text-white">
                  {order.delivery.address}
                </p>
                <p className="font-manrope text-[14px] text-white">
                  {order.delivery.suite}
                </p>
                <p className="font-manrope text-[14px] text-white">
                  {order.delivery.city}
                </p>
              </div>

              <div className="pt-4 border-t border-white/08 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
                    CARRIER
                  </span>
                  <span className="font-manrope text-[13px] text-white">
                    {order.delivery.carrier}
                  </span>
                  <span className="px-2 py-1 bg-success/10 text-success rounded text-[11px] font-manrope font-bold">
                    {order.delivery.carrierStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
                    TRACKING NUMBER
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-manrope text-[13px] text-muted">
                      {order.delivery.trackingNumber}
                    </span>
                    <button
                      onClick={handleCopyTracking}
                      disabled={order.delivery.trackingNumber === "Pending"}
                      className="text-muted hover:text-white disabled:opacity-30"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full mt-4 px-4 py-2.5 bg-accent-solid text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-white/10 transition-colors"
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
            className="bg-surface rounded-xl border border-white/08 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-manrope text-[16px] font-bold text-white">
                Payment Status
              </h2>
              <span className="px-3 py-1 bg-success/10 text-success rounded-full text-[11px] font-manrope font-bold flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                {order.payment.status}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-8 bg-[#1A1F71] rounded flex items-center justify-center text-white text-[16px] font-bold">
                VISA
              </div>
              <div>
                <p className="font-manrope text-[14px] font-medium text-white">
                  {order.payment.method}
                </p>
                <p className="font-manrope text-[12px] text-muted">
                  {order.payment.expiry}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-manrope text-[13px] text-muted">
                  Transaction ID
                </span>
                <span className="font-manrope text-[13px] font-medium text-white">
                  {order.payment.transactionId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-manrope text-[13px] text-muted">
                  Payment Date
                </span>
                <span className="font-manrope text-[13px] font-medium text-white">
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
            className="bg-surface rounded-xl border border-white/08 px-6 py-3"
          >
            <h2 className="font-manrope text-[16px] font-bold text-white mb-4">
              Internal Notes
            </h2>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note for the operations team..."
              className="w-full h-24 px-4 py-3 bg-white/10 border border-white/08 rounded-lg font-manrope text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-transparent resize-none"
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="w-full mt-3 px-4 py-2.5 bg-white/05 border border-white/08 rounded-lg font-manrope text-[13px] font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {isSavingNotes ? "Saving..." : "SAVE NOTE"}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
