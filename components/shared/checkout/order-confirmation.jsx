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
        colors={["#D4AF37", "#b8962e", "#fff", "#ffffff80"]}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/08 p-12 text-center"
        style={{ background: "#0d0b08" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(212,175,55,0.12)" }}
        >
          <CheckCircle className="w-12 h-12 text-[#D4AF37]" />
        </div>

        <h2 className="text-[32px] font-bold text-white mb-3">
          Order Confirmed!
        </h2>

        {orderId && (
          <p className="text-[18px] font-semibold text-[#D4AF37] mb-4">
            Order #{orderId}
          </p>
        )}

        <p className="text-[16px] text-white/50 mb-8 max-w-md mx-auto">
          Thank you for your purchase. We&lsquo;ve sent a confirmation email
          with your order details and tracking information.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={orderId ? `/orders/${orderId}` : "/dashboard/orders"}
            className="px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90 text-black"
            style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
          >
            View Order
          </Link>
          <Link
            href="/materials"
            className="px-6 py-3 rounded-lg font-medium border border-white/10 text-white hover:bg-white/05 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </>
  );
}
