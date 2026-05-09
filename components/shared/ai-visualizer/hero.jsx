"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Calculator,
  Sparkles,
  Clock,
  Play,
  ArrowRight,
} from "lucide-react";

const ESTIMATE_LINES = [
  { label: "Construction", value: "₦ 16,850,000" },
  { label: "Finishing", value: "₦ 6,450,000" },
  { label: "Materials", value: "₦ 4,400,000" },
  { label: "Others", value: "₦ 750,000" },
];

const FEATURES = [
  {
    Icon: Box,
    label: "3D Designs",
    desc: "Realistic & detailed visualizations",
  },
  {
    Icon: Calculator,
    label: "Accurate Estimate",
    desc: "Get precise project costs instantly",
  },
  {
    Icon: Sparkles,
    label: "Smart Recommendations",
    desc: "AI-powered design suggestions",
  },
  {
    Icon: Clock,
    label: "Save Time & Money",
    desc: "Plan better & build with confidence",
  },
];

export default function Hero() {
  return (
    <section className="relative bg-black overflow-hidden">
      {/* ── Full-width background image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kitchen.png"
          alt="Luxury interior"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Left-heavy gradient so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* ── Main hero content overlaid ── */}
      <div className="relative z-10 max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12 min-h-[85vh] py-28 lg:py-36">
          {/* Left: text block */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="w-full lg:max-w-xl space-y-5"
          >
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-gold text-18 font-bold tracking-[0.22em] uppercase font-manrope"
            >
              Ziora AI
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.75 }}
              className="font-primary font-extrabold text-[2.6rem] sm:text-[3.25rem] lg:text-[4rem] xl:text-[4.75rem] tracking-tight leading-none uppercase"
            >
              <span className="text-white block">Design It.</span>
              <span className="text-white block">Visualize It.</span>
              <span className="text-gold block">Know the Cost.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-white font-bold text-xl sm:text-2xl font-manrope"
            >
              Before You Build.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-white/55 text-sm sm:text-base leading-relaxed max-w-lg font-manrope"
            >
              Ziora AI helps you create stunning 3D designs and get accurate
              project estimates in minutes. <br />
              Smart. Fast. Accurate.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <Link href="/dashboard/ai-designs">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-manrope font-extrabold text-sm tracking-widest uppercase text-black cursor-pointer hover:opacity-90 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)",
                  }}
                >
                  Start Designing <ArrowRight size={14} />
                </motion.span>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 px-7 py-3.5 font-manrope font-semibold text-sm tracking-widest uppercase text-white border border-white/25 hover:border-white/45 transition-colors"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <Play size={12} className="fill-white" />
                See How It Works
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right: floating Project Estimate card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.65, duration: 0.7, ease: "easeOut" }}
            className="w-full lg:w-auto lg:shrink-0"
          >
            <div
              className="border border-white/12 p-6 w-full lg:w-80"
              style={{
                background: "rgba(8,7,4,0.94)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 24px 72px rgba(0,0,0,0.7)",
              }}
            >
              <p className="text-white/80 text-[18px] font-bold tracking-[0.15em] uppercase font-manrope mb-0.5">
                Project Estimate
              </p>
              <p className="text-white/50 text-[12px] tracking-[0.15em] uppercase font-manrope mb-3">
                Total Estimate
              </p>
              <p className="text-white text-[2rem] font-extrabold font-primary mb-4 leading-none">
                ₦ 28,450,000
              </p>
              <div className="space-y-2.5 pb-5 mb-5 border-b border-white/08">
                {ESTIMATE_LINES.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-white/45 text-sm font-manrope">
                      {label}
                    </span>
                    <span className="text-white/70 text-xs font-medium font-manrope">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className="w-full py-2.5 text-[14px] font-extrabold tracking-[0.18em] uppercase text-black hover:opacity-90 transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)",
                }}
              >
                View Full Estimate
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Feature strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        className="relative z-10 border-t border-white/08"
        style={{ background: "rgba(5,4,2,0.92)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ Icon, label, desc }, i) => (
              <div
                key={label}
                className={`flex items-center gap-3.5 px-5 sm:px-7 py-5 border-white/08 ${
                  i % 2 === 0 ? "border-r" : ""
                } ${i < 2 ? "border-b lg:border-b-0" : ""} lg:border-r last:lg:border-r-0`}
              >
                <Icon
                  className="w-8 h-8 text-gold shrink-0"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-gold text-[14px] font-bold tracking-[0.14em] uppercase font-manrope leading-none mb-0.5">
                    {label}
                  </p>
                  <p className="text-white/45 text-[12px] font-manrope leading-snug hidden sm:block">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
