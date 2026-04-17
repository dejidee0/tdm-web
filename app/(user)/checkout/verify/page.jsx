"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { checkoutApi } from "@/lib/api/checkout";

export default function CheckoutVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { width, height } = useWindowSize();

  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const confirmedOrderId = searchParams.get("orderId");
  const alreadyConfirmed = searchParams.get("confirmed") === "true";

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "failed"
  const [orderId, setOrderId] = useState(confirmedOrderId || null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (alreadyConfirmed && confirmedOrderId) {
      setStatus("success");
      return;
    }

    if (!reference) {
      // No reference — likely navigated here directly
      router.replace("/checkout");
      return;
    }

    checkoutApi
      .verifyPaystackPayment(reference)
      .then((data) => {
        setOrderId(data?.orderId || data?.order?.id || null);
        setStatus("success");
      })
      .catch((err) => {
        setErrorMessage(err.message || "Payment could not be verified.");
        setStatus("failed");
      });
  }, [reference, alreadyConfirmed, confirmedOrderId, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-[15px] text-white/50">Verifying your payment…</p>
          <p className="text-[13px] text-white/25 mt-1">Please don&rsquo;t close this page</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-white/08 p-10 text-center max-w-md w-full"
          style={{ background: "#0d0b08" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(239,68,68,0.12)" }}
          >
            <XCircle className="w-9 h-9 text-red-400" />
          </div>
          <h2 className="text-[24px] font-bold text-white mb-2">Payment Failed</h2>
          <p className="text-[14px] text-white/45 mb-8 leading-relaxed">{errorMessage}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/checkout"
              className="px-6 py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
            >
              Try Again
            </Link>
            <Link
              href="/cart"
              className="px-6 py-3 rounded-lg font-medium border border-white/10 text-white hover:bg-white/05 transition-colors"
            >
              Back to Cart
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
      <div className="min-h-screen bg-black flex items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/08 p-12 text-center max-w-lg w-full"
          style={{ background: "#0d0b08" }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(212,175,55,0.12)" }}
          >
            <CheckCircle className="w-12 h-12 text-[#D4AF37]" />
          </div>

          <h2 className="text-[32px] font-bold text-white mb-2">Order Confirmed!</h2>

          {orderId && (
            <p className="text-[18px] font-semibold text-[#D4AF37] mb-4">Order #{orderId}</p>
          )}

          <p className="text-[15px] text-white/45 mb-8 max-w-md mx-auto leading-relaxed">
            Thank you for your purchase. We&rsquo;ve sent a confirmation email with your order details
            and tracking information.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={orderId ? `/dashboard/orders` : "/dashboard/orders"}
              className="px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 text-black"
              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
            >
              View Orders
            </Link>
            <Link
              href="/materials"
              className="px-6 py-3 rounded-lg font-medium border border-white/10 text-white hover:bg-white/05 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
