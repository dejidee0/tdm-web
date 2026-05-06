"use client";

import { motion } from "framer-motion";
import { Cpu, ReceiptText, Zap, Eye, MapPin, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    Icon: Cpu,
    title: "AI-Powered",
    desc: "Advanced AI creates realistic & stunning designs.",
  },
  {
    Icon: ReceiptText,
    title: "Accurate Estimates",
    desc: "Get precise project costs with detailed breakdown.",
  },
  {
    Icon: Zap,
    title: "Smart & Fast",
    desc: "Save weeks of back and forth. Get results in minutes.",
  },
  {
    Icon: Eye,
    title: "Better Decisions",
    desc: "Visualize, compare and choose the best option with confidence.",
  },
  {
    Icon: MapPin,
    title: "Built for You",
    desc: "Tailored to your style, budget and lifestyle.",
  },
  {
    Icon: ShieldCheck,
    title: "Trusted by Experts",
    desc: "Used by top architects, builders and homeowners.",
  },
];

export default function WhyChooseZiora() {
  return (
    <section className="bg-black py-20 sm:py-24 px-4 sm:px-6 font-manrope">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-gold text-18  font-bold uppercase tracking-[0.2em] block mb-3 font-manrope">
            Why Ziora
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Why Choose Ziora?
          </h2>
        </motion.div>

        {/* 6-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/05">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="p-8 border border-white/06 flex flex-col gap-4"
              style={{ background: "#0d0b08" }}
            >
              <div
                className="w-11 h-11 border border-white/10 flex items-center justify-center shrink-0"
                style={{ background: "rgba(212,175,55,0.06)" }}
              >
                <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-white text-base font-bold font-primary mb-1.5">
                  {title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
