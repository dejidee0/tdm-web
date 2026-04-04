"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CTACards() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-stone">
          {/* New to TBM Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative bg-[#0A0A0A] px-10 py-14 min-h-64 overflow-hidden"
          >
            <div className="absolute right-0 top-8 opacity-5">
              <Image src="/icons/about-vector1.svg" alt="" width={250} height={250} className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-4 block">New here</span>
              <h3 className="text-2xl sm:text-3xl font-primary font-bold text-white mb-3 tracking-tight">New to TBM?</h3>
              <p className="text-white/50 mb-6 leading-relaxed max-w-sm text-sm">
                Take a guided tour of our ecosystem and discover how easy renovation can be.
              </p>
              <button className="inline-flex items-center gap-3 bg-white text-[#0A0A0A] font-manrope font-semibold px-6 py-3 hover:bg-[#FAF8F5] transition-colors tracking-wide text-sm">
                Take a Tour
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Unsure of Your Style Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative bg-warm px-10 py-14 min-h-64 overflow-hidden"
          >
            <div className="absolute right-0 top-8 opacity-10">
              <Image src="/icons/about-vector2.png" alt="" width={200} height={200} className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-4 block">Style discovery</span>
              <h3 className="text-2xl sm:text-3xl font-primary font-bold text-[#0A0A0A] mb-3 tracking-tight">
                Unsure of your style?
              </h3>
              <p className="text-[#7A736C] mb-6 leading-relaxed max-w-sm text-sm">
                Take our 2-minute style quiz and let Ziora suggest the perfect palette for you.
              </p>
              <button className="inline-flex items-center gap-3 bg-[#0A0A0A] text-white font-manrope font-semibold px-6 py-3 hover:bg-[#1C1C1C] transition-colors tracking-wide text-sm">
                Find Your Style
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
