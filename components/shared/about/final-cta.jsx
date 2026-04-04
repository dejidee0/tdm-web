"use client";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="bg-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-[#0A0A0A]"
        >
          {/* Subtle gold edge accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gold opacity-40" />

          <div className="relative z-10 py-20 px-8 sm:px-16 text-center">
            <span className="inline-block text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-6">
              Let&apos;s build something great
            </span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight font-primary leading-tight"
            >
              Ready to Create Your Dream Space?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-white/50 text-base sm:text-lg mb-12 max-w-xl mx-auto font-manrope"
            >
              Don&apos;t just imagine it. See it, build it, and live in it with TBM.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <button className="inline-flex items-center justify-center bg-white text-[#0A0A0A] font-manrope font-semibold px-8 py-4 hover:bg-[#FAF8F5] transition-colors w-full sm:w-auto tracking-wide">
                Start Your Project
              </button>
              <button className="inline-flex items-center justify-center bg-transparent text-white font-manrope font-semibold px-8 py-4 border border-white/20 hover:border-white/40 transition-colors w-full sm:w-auto tracking-wide">
                Book a Free Consultation
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
