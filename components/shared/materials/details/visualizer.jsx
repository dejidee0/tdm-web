"use client";

import { motion } from "framer-motion";
import { Sparkles, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function AIVisualizer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-linear-to-tr from-white to-primary/10 rounded-xl p-4 border border-gray-100"
    >
      {/* Header with Badges */}
      <div className="flex items-center gap-2 mb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary text-white text-xs font-semibold rounded-xl">
          PRO FEATURE
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-primary text-xs font-semibold ">
          UNLOCK POTENTIAL
        </div>
      </div>

      {/* Title & Description */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Visualize this tile in your own room with AI.
        </h3>
      </div>

      {/* Launch Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 bg-white border border-gray-300 text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-6"
      >
        <Sparkles className="w-5 h-5 text-primary" />
        Launch AI Visualizer
      </motion.button>

      {/* Consultant Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg p-2 flex items-start gap-3"
      >
        <div className="shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <Image
              src="/consultant.svg"
              alt="Design Consultant"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900">
              Unsure about sizing?
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Book a free 15-min consult.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-primary" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
