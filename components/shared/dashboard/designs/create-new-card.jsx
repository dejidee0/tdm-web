// components/dashboard/designs/create-new-card.jsx
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function CreateNewCard({ index = 0, isList = false, onOpenModal }) {
  const sharedMotion = {
    layout: true,
    onClick: onOpenModal,
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, delay: index * 0.05 },
  };

  const iconRing = (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:opacity-80 transition-opacity"
      style={{ background: "rgba(212,175,55,0.12)" }}
    >
      <Sparkles className="w-6 h-6 text-[#D4AF37]" />
    </div>
  );

  const content = (
    <div className="w-full aspect-4/3 flex flex-col items-center justify-center p-6 text-center">
      {iconRing}
      <h3 className="text-[16px] font-semibold text-[#D4AF37] mb-1">Create New</h3>
      <p className="text-[13px] text-[#D4AF37]/50">Start a new AI generation</p>
    </div>
  );

  return (
    <motion.div
      {...sharedMotion}
      className="rounded-xl border-2 border-dashed transition-all group overflow-hidden cursor-pointer"
      style={{
        background: "rgba(212,175,55,0.04)",
        borderColor: "rgba(212,175,55,0.25)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.55)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)")}
    >
      {content}
    </motion.div>
  );
}
