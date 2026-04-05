"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { UploadCloud, Home, Palette, Sparkles, ArrowRight } from "lucide-react";

const STEPS = [
  { icon: UploadCloud, text: "Upload a room photo" },
  { icon: Home, text: "Select room type" },
  { icon: Palette, text: "Select your style" },
  { icon: Sparkles, text: "Generate concept" },
];

export default function ZioraTeaser() {
  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-[#0A0A0A] overflow-hidden relative">
      {/* Subtle gold grain texture overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/2 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2.5 border border-white/15 text-white/70 text-xs font-manrope font-medium px-4 py-2 tracking-[0.15em] uppercase mb-6">
              <span className="w-1.5 h-1.5 bg-gold animate-pulse" />
              Ziora Intelligence
            </span>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-primary font-bold text-white leading-tight tracking-tight mb-5">
              Try your space before <br className="hidden sm:block" /> you build it.
            </h2>
            <p className="text-white/60 font-manrope text-base sm:text-lg max-w-lg mb-10">
              Upload a photo of your room, choose a style, and Ziora AI generates a premium design concept in seconds — before you spend a single naira.
            </p>

            {/* Flow steps */}
            <div className="flex flex-wrap gap-2 mb-10">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-2 border border-white/10 px-4 py-2"
                  >
                    <span className="text-[10px] font-manrope font-bold text-gold tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                    <Icon className="w-3 h-3 text-white/40" strokeWidth={1.5} />
                    <span className="text-xs text-white/60 font-manrope">{step.text}</span>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/ai-visualizer">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 bg-white text-[#0A0A0A] font-manrope font-bold px-8 py-4 rounded-none shadow-lg hover:bg-[#FAF8F5] transition-all duration-200 group tracking-wide"
                >
                  Start With Ziora
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/ai-visualizer#examples">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 border border-white/20 hover:border-white/40 text-white font-manrope font-semibold px-8 py-4 rounded-none transition-all duration-200 tracking-wide"
                >
                  See Sample Results
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Visual panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Packages */}
            <div className="grid grid-cols-3 gap-px bg-white/10">
              {[
                { tier: "Economy", desc: "Free trial — limited renders", cta: "Try free" },
                { tier: "Premium", desc: "Full renders + material match", cta: "Get Premium", featured: true },
                { tier: "Luxury", desc: "Unlimited + concierge design", cta: "Go Luxury" },
              ].map((pkg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className={`p-6 flex flex-col gap-4 ${
                    pkg.featured
                      ? "bg-[#FAF8F5] text-[#0A0A0A]"
                      : "bg-white/5 text-white"
                  }`}
                >
                  <p className={`text-[10px] font-manrope font-bold uppercase tracking-[0.2em] ${pkg.featured ? "text-gold" : "text-white/40"}`}>
                    {pkg.tier}
                  </p>
                  <p className={`text-sm font-manrope leading-snug ${pkg.featured ? "text-[#3D3833]" : "text-white/60"}`}>
                    {pkg.desc}
                  </p>
                  <Link href="/ai-visualizer">
                    <span className={`text-xs font-manrope font-semibold tracking-wide underline underline-offset-4 ${pkg.featured ? "text-[#0A0A0A]" : "text-white/50 hover:text-white"}`}>
                      {pkg.cta}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* After CTA nudge */}
            <div className="mt-px bg-white/5 border-t border-white/5 p-5">
              <p className="text-white/40 text-xs font-manrope mb-3 uppercase tracking-[0.15em]">After your Ziora concept, continue to:</p>
              <div className="flex flex-wrap gap-2">
                {["Get estimate", "Shop matching products", "Book consultation", "Start project"].map((a) => (
                  <span key={a} className="text-xs border border-white/10 text-white/50 font-manrope px-3 py-1.5 tracking-wide">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
