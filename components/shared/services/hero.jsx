"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ServicesHero() {
  return (
    <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white/90 text-xs font-inter font-medium px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
            TBM Building Services
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-primary font-bold text-white leading-tight mb-6">
            What We Do
          </h1>
          <p className="text-lg sm:text-xl font-inter text-white/80 max-w-2xl mb-10">
            From full-scale renovation and interior fit-outs to maintenance and design consultation — TBM delivers expert execution at every stage of your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact?type=consultation">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-white text-primary font-inter font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                Book Inspection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/contact?type=estimate">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-inter font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-200"
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
