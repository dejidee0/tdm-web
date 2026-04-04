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
    <section className="py-16 sm:py-20 lg:py-24 bg-primary overflow-hidden relative">
      {/* decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white/90 text-xs font-inter font-medium px-4 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              Ziora Intelligence
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-primary font-bold text-white leading-tight mb-4">
              Try your space before <br className="hidden sm:block" /> you build it.
            </h2>
            <p className="text-white/80 font-inter text-base sm:text-lg max-w-lg mb-10">
              Upload a photo of your room, choose a style, and Ziora AI generates a premium design concept in seconds — before you spend a single naira.
            </p>

            {/* Flow steps */}
            <div className="flex flex-wrap gap-3 mb-10">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2"
                  >
                    <Icon className="w-3.5 h-3.5 text-white/70" strokeWidth={2} />
                    <span className="text-xs text-white font-inter font-medium">{step.text}</span>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/ai-visualizer">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white text-primary font-inter font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  Start With Ziora
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/ai-visualizer#examples">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-inter font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-200"
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
            <div className="grid grid-cols-3 gap-4">
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
                  className={`rounded-2xl p-5 flex flex-col gap-3 ${
                    pkg.featured
                      ? "bg-white text-primary shadow-2xl scale-105 ring-2 ring-white/50"
                      : "bg-white/10 border border-white/20 text-white"
                  }`}
                >
                  <p className={`text-xs font-inter font-bold uppercase tracking-widest ${pkg.featured ? "text-primary/60" : "text-white/60"}`}>
                    {pkg.tier}
                  </p>
                  <p className={`text-sm font-inter leading-snug ${pkg.featured ? "text-gray-700" : "text-white/80"}`}>
                    {pkg.desc}
                  </p>
                  <Link href="/ai-visualizer">
                    <span className={`text-xs font-inter font-semibold underline underline-offset-2 ${pkg.featured ? "text-primary" : "text-white/70 hover:text-white"}`}>
                      {pkg.cta}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* After CTA nudge */}
            <div className="mt-6 bg-white/10 border border-white/20 rounded-2xl p-5">
              <p className="text-white/80 text-sm font-inter mb-3">After your Ziora concept, continue to:</p>
              <div className="flex flex-wrap gap-2">
                {["Get estimate", "Shop matching products", "Book consultation", "Start project"].map((a) => (
                  <span key={a} className="text-xs bg-white/15 border border-white/20 text-white font-inter px-3 py-1.5 rounded-full">
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
