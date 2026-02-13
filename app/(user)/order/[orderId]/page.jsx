// app/orders/[orderId]/page.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Headphones } from "lucide-react";
import { use } from "react";

import { useOrderDetails, useDownloadInvoice } from "@/hooks/use-order-details";
import OrderTimeline from "@/components/shared/orders/timeline";
import OrderItems from "@/components/shared/orders/items";
import ShippingDetails from "@/components/shared/orders/shipping-details";
import AIVisualizerPromo from "@/components/shared/orders/ai-promo";
import HelpSection from "@/components/shared/orders/help";

export default function OrderDetailsPage({ params }) {
  const { orderId } = use(params);
  const { data: order, isLoading } = useOrderDetails(orderId);
  const downloadInvoice = useDownloadInvoice();

  const handleDownloadInvoice = () => {
    downloadInvoice.mutate(orderId, {
      onSuccess: (data) => {
        window.open(data.url, "_blank");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[14px] text-[#666666]">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[13px]">
            <Link
              href="/"
              className="text-[#999999] hover:text-[#666666] transition-colors"
            >
              Home
            </Link>
            <span className="text-[#999999]">/</span>
            <Link
              href="/dashboard"
              className="text-[#999999] hover:text-[#666666] transition-colors"
            >
              Account
            </Link>
            <span className="text-[#999999]">/</span>
            <Link
              href="/dashboard/orders"
              className="text-[#999999] hover:text-[#666666] transition-colors"
            >
              Orders
            </Link>
            <span className="text-[#999999]">/</span>
            <span className="text-primary font-medium">
              Order {order?.orderNumber}
            </span>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-[40px] md:text-[48px] font-bold text-primary leading-tight">
              Order {order?.orderNumber}
            </h1>
            <p className="text-[14px] text-[#666666] mt-2">
              Placed on {order?.placedDate} • Total:{" "}
              <span className="font-semibold text-primary">
                ${order?.total.toFixed(2)}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadInvoice}
              disabled={downloadInvoice.isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-lg text-[14px] font-medium text-primary hover:bg-[#f8f8f8] transition-colors disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              Invoice
            </button>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-[14px] font-medium hover:bg-[#2a2a2a] transition-colors"
            >
              <Headphones className="w-4 h-4" />
              Support
            </Link>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Delivery Timeline */}
            <OrderTimeline
              estimatedDelivery={order?.estimatedDelivery}
              timeline={order?.timeline}
            />

            {/* Order Items */}
            <OrderItems items={order?.items} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Shipping Details */}
            <ShippingDetails
              shipping={order?.shipping}
              tracking={order?.tracking}
            />

            {/* AI Visualizer Promo */}
            <AIVisualizerPromo items={order?.items} />

            {/* Help Section */}
            <HelpSection />
          </div>
        </div>
      </div>
    </div>
  );
}
