"use client";

import { motion } from "framer-motion";

export default function Title() {
  return (
    <section className="w-full bg-background py-16 h-[50vh] flex items-center justify-center px-4 pt-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-[40px] leading-[48px] font-primary font-semibold text-[#1A1A1A] mb-3">
            Explore Our Masterpieces
          </h2>
          <p className="text-[16px] leading-[24px] font-normal text-[#666666] font-manrope max-w-[600px] mx-auto">
            See how we transform spaces and bring design visions to life. Filter
            by style, budget, or room type to find your next inspiration.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
