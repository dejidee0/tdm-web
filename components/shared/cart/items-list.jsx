"use client";

import { motion, AnimatePresence } from "framer-motion";
import CartItem from "./item";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function CartItemsList({ cart, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
        <div className="space-y-0 divide-y divide-[#e5e5e5]">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 py-6 first:pt-0 last:pb-0"
            >
              {/* Image skeleton */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#f0f0f0] rounded-xl shrink-0 overflow-hidden relative">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
              {/* Text skeleton */}
              <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
                <div className="h-4 bg-[#f0f0f0] rounded-md w-3/4 overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite_0.1s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="h-3 bg-[#f0f0f0] rounded-md w-1/2 overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite_0.2s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="h-4 bg-[#f0f0f0] rounded-md w-1/4 mt-1 overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite_0.3s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
              </div>
              {/* Qty skeleton - hidden on mobile */}
              <div className="hidden md:flex items-center justify-center w-[120px]">
                <div className="h-9 w-28 bg-[#f0f0f0] rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite_0.15s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
              </div>
              {/* Price skeleton - hidden on mobile */}
              <div className="hidden md:flex items-center justify-end w-[140px]">
                <div className="h-4 w-16 bg-[#f0f0f0] rounded-md overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite_0.25s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
              </div>
              {/* Delete skeleton - hidden on mobile */}
              <div className="hidden md:flex items-center justify-center w-[40px]">
                <div className="h-8 w-8 bg-[#f0f0f0] rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite_0.35s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <style>{`
          @keyframes shimmer {
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white rounded-2xl border border-[#e5e5e5] px-6 py-16 sm:py-20 text-center flex flex-col items-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.15,
            duration: 0.4,
            type: "spring",
            stiffness: 200,
          }}
          className="w-16 h-16 rounded-2xl bg-[#f5f5f5] flex items-center justify-center mb-5"
        >
          <ShoppingBag size={28} className="text-[#cccccc]" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="text-[16px] font-semibold text-[#1a1a1a] mb-1.5"
        >
          Your cart is empty
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.35 }}
          className="text-[14px] text-[#888888] mb-8 max-w-[260px] leading-relaxed"
        >
          Browse our materials and add items to get started
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.35 }}
        >
          <Link
            href="/materials"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[14px] font-medium hover:bg-[#2a2a2a] transition-all duration-200 hover:gap-3 group"
          >
            Browse Materials
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  const itemCount = cart.items.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#e5e5e5]">
        {/* Desktop column labels */}
        <div className="hidden md:grid md:grid-cols-[1fr_120px_140px_40px] gap-4 w-full">
          <div className="text-[11px] font-semibold text-[#aaaaaa] uppercase tracking-widest">
            Product Details
          </div>
          <div className="text-[11px] font-semibold text-[#aaaaaa] uppercase tracking-widest text-center">
            Quantity
          </div>
          <div className="text-[11px] font-semibold text-[#aaaaaa] uppercase tracking-widest text-right">
            Price
          </div>
          <div />
        </div>

        {/* Mobile header */}
        <div className="flex md:hidden items-center justify-between w-full">
          <span className="text-[13px] font-semibold text-[#1a1a1a]">Cart</span>
          <span className="text-[12px] text-[#888888] font-medium">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-[#e5e5e5]">
        <AnimatePresence mode="popLayout" initial={false}>
          {cart.items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: 20,
                height: 0,
                transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
              }}
              transition={{
                layout: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.25, delay: index * 0.05 },
                x: { duration: 0.25, delay: index * 0.05 },
              }}
            >
              <CartItem item={item} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer item count — desktop only */}
      {itemCount > 0 && (
        <motion.div
          layout
          className="hidden md:flex items-center justify-between px-6 py-3.5 bg-[#fafafa] border-t border-[#e5e5e5]"
        >
          <span className="text-[12px] text-[#aaaaaa] font-medium">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </span>
          <Link
            href="/materials"
            className="text-[12px] text-primary font-medium hover:underline underline-offset-2 transition-all"
          >
            + Add more items
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
