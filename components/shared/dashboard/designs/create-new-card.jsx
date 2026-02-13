// components/dashboard/designs/create-new-card.jsx
"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CreateNewCard({ index = 0, isList = false }) {
  if (isList) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Link
          href="/ai-visualizer"
          className="block bg-white rounded-xl border-2 border-dashed border-[#d4d4d4] p-4 hover:border-primary hover:bg-[#fafafa] transition-all group"
        >
          <div className="flex items-center gap-4 h-24">
            <div className="w-28 h-full shrink-0 bg-[#f5f5f5] rounded-lg flex items-center justify-center group-hover:bg-primary/5 transition-colors">
              <Plus className="w-8 h-8 text-[#999999] group-hover:text-primary transition-colors" />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-primary mb-1">
                Create New
              </h3>
              <p className="text-[13px] text-[#666666]">
                Start a new AI generation
              </p>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl border-2 border-dashed border-[#d4d4d4] hover:border-primary hover:bg-[#fafafa] transition-all group overflow-hidden flex items-center justify-center"
    >
      <Link href="/ai-visualizer" className="block aspect-[4/3] w-full">
        <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors">
            <Plus className="w-8 h-8 text-[#999999] group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-[16px] font-semibold text-primary mb-1">
            Create New
          </h3>
          <p className="text-[13px] text-[#666666]">
            Start a new AI generation
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
