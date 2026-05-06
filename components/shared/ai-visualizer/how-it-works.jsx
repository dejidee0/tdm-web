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
      className="py-20 sm:py-24 px-4 sm:px-6 font-manrope"
      style={{ background: "#080704" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Centered header ── */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-lg font-bold uppercase tracking-[0.22em] block mb-4 font-manrope">
            How Ziora Works
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            From Idea to Estimate in 4 Simple Steps
          </h2>
        </motion.div>

        {/* ── Steps: horizontal flow with connectors ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 relative">
          {/* Horizontal dashed connector line — desktop only */}
          {/* top: step-number(1rem) + mb-3(0.75rem) + half-circle(2.5rem) = 4.25rem */}
          <div
            className="hidden lg:block absolute z-0"
            style={{
              top: "4.25rem",
              left: "calc(12.5% + 2.5rem)",
              right: "calc(12.5% + 2.5rem)",
              height: "1px",
              borderTop: "1px dashed rgba(255,255,255,0.12)",
            }}
          />

          {/* Arrow icons at column boundaries — desktop only */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="hidden lg:flex absolute items-center justify-center z-[5]"
              style={{
                top: "4.25rem",
                left: `${i * 25}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <ArrowRight className="w-3.5 h-3.5 text-white/25" />
            </div>
          ))}

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
              className="flex flex-col items-center text-center relative z-10 px-4"
            >
              {/* Step number */}
              <span className="text-white/30 text-xs font-bold tracking-[0.15em] uppercase font-manrope mb-3">
                {number}
              </span>

              {/* Circular icon container */}
              <div
                className="w-20 h-20 rounded-full border border-white/15 flex items-center justify-center mb-5 relative"
                style={{ background: "rgba(212,175,55,0.05)" }}
              >
                <Icon className="w-7 h-7 text-gold" strokeWidth={1.4} />

                {/* Arrow connector between steps — desktop */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-[calc(50%+1rem)] top-1/2 -translate-y-1/2 items-center gap-0.5 pointer-events-none">
                    <ArrowRight className="w-4 h-4 text-white/20" />
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-white text-sm font-bold font-primary mb-2 uppercase tracking-wide">
                {title}
              </h3>

              {/* Description */}
              <p className="text-white/40 text-xs leading-relaxed max-w-40">
                {desc}
              </p>

              {cta && (
                <Link
                  href="/dashboard/ai-designs"
                  className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-gold hover:opacity-75 transition-opacity tracking-[0.15em] uppercase"
                >
                  Learn More <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
