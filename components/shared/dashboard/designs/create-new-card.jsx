// components/dashboard/designs/create-new-card.jsx
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function CreateNewCard({
  index = 0,
  isList = false,
  onOpenModal,
}) {
  const sharedMotion = {
    layout: true,
    onClick: onOpenModal,
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, delay: index * 0.05 },
  };

  const iconRing = (
    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
      <Sparkles className="w-6 h-6 text-primary" />
    </div>
  );

  if (isList) {
    return (
      <motion.div
        {...sharedMotion}
        className="bg-primary/5 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/10 transition-all group overflow-hidden cursor-pointer"
      >
        <div className="w-full aspect-4/3 flex flex-col items-center justify-center p-6 text-center">
          {iconRing}
          <h3 className="text-[16px] font-semibold text-primary mb-1">
            Create New
          </h3>
          <p className="text-[13px] text-primary/50">
            Start a new AI generation
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...sharedMotion}
      className="bg-primary/5 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/10 transition-all group overflow-hidden cursor-pointer"
    >
      <div className="w-full aspect-4/3 flex flex-col items-center justify-center p-6 text-center">
        {iconRing}
        <h3 className="text-[16px] font-semibold text-primary mb-1">
          Create New
        </h3>
        <p className="text-[13px] text-primary/50">
          Start a new AI generation
        </p>
      </div>
    </motion.div>
  );
}
