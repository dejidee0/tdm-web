// components/checkout/OrderConfirmation.jsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function OrderConfirmation({ orderId }) {
  const { width, height } = useWindowSize();

  return (
    <>
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.3}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-[#e5e5e5] p-12 text-center"
      >
        <div className="w-20 h-20 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-[#16a34a]" />
        </div>

        <h2 className="text-[32px] font-bold text-text-black mb-3">
          Order Confirmed!
        </h2>

        {orderId && (
          <p className="text-[18px] font-semibold text-primary mb-4">
            Order #{orderId}
          </p>
        )}

        <p className="text-[16px] text-[#666666] mb-8 max-w-md mx-auto">
          Thank you for your purchase. We&lsquo;ve sent a confirmation email
          with your order details and tracking information.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={orderId ? `/orders/${orderId}` : "/dashboard/orders"}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            View Order
          </Link>
          <Link
            href="/materials"
            className="px-6 py-3 bg-white border border-[#e5e5e5] text-text-black rounded-lg font-medium hover:bg-background transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </>
  );
}
