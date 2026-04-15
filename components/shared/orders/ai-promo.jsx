// components/orders/AIVisualizerPromo.jsx
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function AIVisualizerPromo({ items }) {
  const hasVisualizableItems = items?.some(
    (item) =>
      item.name.toLowerCase().includes("tile") ||
      item.name.toLowerCase().includes("marble"),
  );

  if (!hasVisualizableItems) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl p-6 overflow-hidden relative border"
      style={{
        background: "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(184,150,46,0.06) 100%)",
        borderColor: "rgba(212,175,55,0.25)",
      }}
    >
      {/* Decorative rings */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full border-2 border-[#D4AF37] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full border-2 border-[#D4AF37] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-[12px] font-semibold uppercase tracking-wide text-[#D4AF37]">Ziora</span>
        </div>

        <h3 className="text-[20px] font-bold text-white mb-2">Visualize your space</h3>
        <p className="text-[14px] text-white/60 mb-6 leading-relaxed">
          While you wait, see how the Italian Carrara Marble looks in your actual kitchen using Ziora.
        </p>

        <Link
          href="/visualizer"
          className="block w-full text-black text-center py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
        >
          Design with Ziora
        </Link>
      </div>
    </motion.div>
  );
}
