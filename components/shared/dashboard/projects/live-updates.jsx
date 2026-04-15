// components/shared/dashboard/projects/live-updates.jsx
"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const MOCK_UPDATES = [
  { id: 1, text: "Electrical inspection passed yesterday morning. No issues found.", active: true },
  { id: 2, text: "Flooring delivery rescheduled for Nov 2nd due to freight delays.", active: true },
  { id: 3, text: "Client meeting scheduled for Friday 3PM via Zoom.", active: false },
];

export default function LiveUpdates({ updates, budget, isLoading }) {
  const items = updates ?? MOCK_UPDATES;
  const displayBudget = budget ?? "₦428,500.00";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25 }}
      className="rounded-2xl overflow-hidden border"
      style={{
        background: "linear-gradient(160deg, rgba(212,175,55,0.10) 0%, rgba(184,150,46,0.05) 100%)",
        borderColor: "rgba(212,175,55,0.20)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-[15px] font-bold text-white">Live Updates</h2>
        <button
          className="text-[12px] font-semibold text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors px-3 py-1 rounded-lg"
          style={{ border: "1px solid rgba(212,175,55,0.25)" }}
        >
          View
        </button>
      </div>

      {/* Updates list */}
      <div className="px-5 pb-4 space-y-3">
        {isLoading
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white/15 mt-1.5 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-2.5 bg-white/08 rounded w-full" />
                  <div className="h-2.5 bg-white/08 rounded w-3/4" />
                </div>
              </div>
            ))
          : items.map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.3 + index * 0.07 }}
                className="flex items-start gap-2.5"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: update.active ? "#4ade80" : "rgba(255,255,255,0.20)" }}
                />
                <p className="text-[12.5px] text-white/60 leading-relaxed">{update.text}</p>
              </motion.div>
            ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/08 mx-5" />

      {/* Budget footer */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">
            Total Budget Spent
          </p>
          <p className="text-[22px] font-extrabold text-white leading-tight">{displayBudget}</p>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(212,175,55,0.12)" }}>
          <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
        </div>
      </div>
    </motion.div>
  );
}
