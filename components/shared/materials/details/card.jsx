"use client";

import { motion } from "framer-motion";

export default function ProjectCard({ title, description, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-lg p-2.5 flex items-start gap-4 border transition-colors"
      style={{
        background: "rgba(212,175,55,0.04)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: "rgba(212,175,55,0.10)" }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-base font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-white/50 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
