"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Upload, Cpu, ReceiptText, Hammer, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    Icon: Upload,
    title: "Upload Your Space",
    desc: "Upload your floor plan, sketch, or room photo.",
  },
  {
    number: "02",
    Icon: Cpu,
    title: "AI Generates Designs",
    desc: "Ziora AI instantly creates multiple 3D design options.",
  },
  {
    number: "03",
    Icon: ReceiptText,
    title: "Get Project Estimate",
    desc: "Receive accurate cost estimates for your project.",
  },
  {
    number: "04",
    Icon: Hammer,
    title: "Plan & Build",
    desc: "Review, refine and move forward with confidence.",
    cta: true,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 font-manrope"
      style={{ background: "#080704" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-xs font-bold uppercase tracking-[0.22em] block mb-4 font-manrope">
            How Ziora Works
          </span>
          <h2 className="font-primary text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            From Idea to Estimate in 4 Simple Steps
          </h2>
        </motion.div>

        {/* ── Steps ── */}
        <div className="relative">
          {/* Dashed connector — desktop only, sits behind the circles */}
          <div
            className="hidden lg:block absolute z-0 pointer-events-none"
            style={{
              top: "calc(1rem + 0.75rem + 2.5rem)" /* step-num + mb-3 + half-circle-h */,
              left: "calc(12.5% + 2.5rem)",
              right: "calc(12.5% + 2.5rem)",
              height: "1px",
              borderTop: "1px dashed rgba(255,255,255,0.14)",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 lg:gap-0">
            {STEPS.map(({ number, Icon, title, desc, cta }, i) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center text-center relative z-10 px-2 sm:px-4"
              >
                {/* Step number */}
                <span className="text-white/30 text-[16px] font-bold tracking-[0.18em] uppercase font-manrope mb-3">
                  {number}
                </span>

                {/* Circle icon */}
                <div
                  className="w-20 h-20 rounded-full border border-white/15 flex items-center justify-center mb-5 relative shrink-0"
                  style={{ background: "rgba(212,175,55,0.05)" }}
                >
                  <Icon className="w-7 h-7 text-gold" strokeWidth={1.4} />

                  {/* Arrow at right edge — points to next step, desktop only */}
                  {i < STEPS.length - 1 && (
                    <span className="hidden lg:flex absolute -right-8 top-1/2 -translate-y-1/2 items-center pointer-events-none">
                      <ArrowRight className="w-3.5 h-3.5 text-white/22" />
                    </span>
                  )}
                </div>

                <h3 className="text-white text-sm font-bold font-primary mb-2 uppercase tracking-wide">
                  {title}
                </h3>

                <p className="text-white/40 text-xs leading-relaxed max-w-40">
                  {desc}
                </p>

                {cta && (
                  <Link
                    href="/dashboard/ai-designs"
                    className="mt-4 inline-flex items-center gap-1.5 text-[16px] font-bold text-gold hover:opacity-75 transition-opacity tracking-[0.15em] uppercase"
                  >
                    Learn More <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
