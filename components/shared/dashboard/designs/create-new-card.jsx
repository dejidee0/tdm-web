// components/dashboard/designs/create-new-card.jsx
"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function CreateNewCard({
  index = 0,
  isList = false,
  onOpenModal,
}) {
  console.log("onOpenModal:", onOpenModal);

  if (isList) {
    return (
      // create-new-card.jsx — grid variant
      <motion.div
        layout
        onClick={onOpenModal}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white rounded-xl border-2 border-dashed border-[#d4d4d4] hover:border-[#1a1a1a] hover:bg-[#fafafa] transition-all group overflow-hidden cursor-pointer"
      >
        <div className="block w-full aspect-[4/3]">
          {" "}
          {/* change button → div */}
          <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#1a1a1a]/5 transition-colors">
              <Plus className="w-8 h-8 text-[#999999] group-hover:text-[#1a1a1a] transition-colors" />
            </div>
            <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">
              Create New
            </h3>
            <p className="text-[13px] text-[#666666]">
              Start a new AI generation
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      onClick={onOpenModal}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl border-2 border-dashed border-[#d4d4d4] hover:border-[#1a1a1a] hover:bg-[#fafafa] transition-all group overflow-hidden"
    >
      <div className="block w-full aspect-[4/3]">
        <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#1a1a1a]/5 transition-colors">
            <Plus className="w-8 h-8 text-[#999999] group-hover:text-[#1a1a1a] transition-colors" />
          </div>
          <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">
            Create New
          </h3>
          <p className="text-[13px] text-[#666666]">
            Start a new AI generation
          </p>
        </div>
      </div>
    </motion.div>
  );
}
