// components/cart/CartItemsList.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import CartItem from "./item";

export default function CartItemsList({ cart, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-12 text-center">
        <p className="text-[16px] font-medium text-primary mb-2">
          Your cart is empty
        </p>
        <p className="text-[14px] text-[#666666]">
          Add items to get started with your project
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5]">
      {/* Table Header - Desktop Only */}
      <div className="hidden md:grid md:grid-cols-[1fr_120px_140px_40px] gap-4 px-6 py-4 border-b border-[#e5e5e5]">
        <div className="text-[12px] font-semibold text-[#999999] uppercase tracking-wider">
          Product Details
        </div>
        <div className="text-[12px] font-semibold text-[#999999] uppercase tracking-wider text-center">
          Quantity
        </div>
        <div className="text-[12px] font-semibold text-[#999999] uppercase tracking-wider text-right">
          Price
        </div>
        <div /> {/* Delete column */}
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-[#e5e5e5]">
        <AnimatePresence mode="popLayout">
          {cart.items.map((item, index) => (
            <CartItem key={item.id} item={item} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
