"use client";

import { motion } from "framer-motion";

export default function ProjectCard({ title, description, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-primary/10 rounded-lg p-2.5 border border-gray-200 flex items-start gap-4 hover:border-gray-300 transition-colors"
    >
      <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-base font-semibold text-black mb-1">{title}</h4>
        <p className="text-sm text-black leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
