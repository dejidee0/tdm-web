"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ServicesHero() {
  return (
    <section className="pt-28 pb-20 sm:pt-40 sm:pb-28 bg-black relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 60%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <span className="inline-flex items-center gap-2.5 border border-white/12 text-white/50 text-xs font-manrope font-medium px-4 py-2 tracking-[0.15em] uppercase mb-7">
            <span className="w-1 h-1 bg-[#D4AF37]" />
            TBM Building Services
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-poppins font-bold text-white leading-tight tracking-tight mb-6">
            What We Do
          </h1>
          <p className="text-base sm:text-lg font-manrope text-white/50 max-w-xl mb-10">
            From full-scale renovation and interior fit-outs to maintenance and design consultation — TBM delivers expert execution at every stage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact?type=consultation">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 font-manrope font-bold px-8 py-4 text-black group hover:opacity-90 transition-opacity text-[11px] tracking-[0.18em] uppercase"
                style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
              >
                Book Inspection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/contact?type=estimate">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 border border-white/15 hover:border-white/35 text-white font-manrope font-semibold px-8 py-4 transition-all duration-200 text-[11px] tracking-[0.18em] uppercase"
              >
                Get Quote
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
