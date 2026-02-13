// app/cart/page.jsx
"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/hooks/use-cart";
import DeliveryEstimate from "@/components/shared/cart/delivery-estimate";
import CartItemsList from "@/components/shared/cart/items-list";
import OrderSummary from "@/components/shared/cart/order-summary";
import RelatedProducts from "@/components/shared/cart/related";

export default function CartPage() {
  const { data: cart, isLoading } = useCart();

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-[13px]">
            <Link
              href="/"
              className="text-[#666666] hover:text-[#1a1a1a] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#999999]" />
            <span className="text-[#1a1a1a] font-medium">Shopping Cart</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-[#1a1a1a] leading-tight">
              Your Shopping Cart
            </h1>
            <p className="text-[15px] text-[#666666] mt-1">
              {isLoading
                ? "Loading..."
                : `${cart?.items?.length || 0} item${cart?.items?.length !== 1 ? "s" : ""} ready for secure checkout`}
            </p>
          </div>

          <Link
            href="/shop"
            className="text-[14px] text-[#3b82f6] font-medium hover:text-[#2563eb] transition-colors hidden md:block"
          >
            Continue Shopping
          </Link>
        </motion.div>

        {/* Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
          {/* Left Column - Cart Items */}
          <div className="space-y-6">
            <CartItemsList cart={cart} isLoading={isLoading} />
            <DeliveryEstimate estimate={cart?.estimatedDelivery} />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-6 h-fit">
            <OrderSummary cart={cart} isLoading={isLoading} />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts />
      </div>
    </div>
  );
}
