// components/orders/AIVisualizerPromo.jsx
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function AIVisualizerPromo({ items }) {
  // Check if order contains materials that can be visualized
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
      className="bg-linear-to-br from-primary/80 to-primary rounded-2xl p-6 text-white overflow-hidden relative"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5" />
          <span className="text-[12px] font-semibold uppercase tracking-wide">
            AI Design
          </span>
        </div>

        <h3 className="text-[20px] font-bold mb-2">Visualize your space</h3>
        <p className="text-[14px] text-white/90 mb-6 leading-relaxed">
          While you wait, see how the Italian Carrara Marble looks in your
          actual kitchen using our AI tool.
        </p>

        <Link
          href="/visualizer"
          className="block w-full bg-white text-primary text-center py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
        >
          Try AI Visualization
        </Link>
      </div>
    </motion.div>
  );
}
