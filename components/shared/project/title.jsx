"use client";

import { motion } from "framer-motion";

export default function Title() {
  return (
    <section className="w-full bg-[#0A0A0A] pt-28 sm:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2.5 border border-white/15 text-white/60 text-xs font-manrope font-medium px-4 py-2 tracking-[0.15em] uppercase mb-7">
            <span className="w-1 h-1 bg-gold" />
            TBM Building Services
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-primary font-bold text-white leading-tight tracking-tight mb-6">
            Our Masterpieces
          </h1>
          <p className="text-base sm:text-lg font-manrope text-white/55 max-w-xl">
            See how we transform spaces and bring design visions to life. Filter
            by style, budget, or room type to find your next inspiration.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
