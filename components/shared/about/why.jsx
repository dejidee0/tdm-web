"use client";
import { motion } from "framer-motion";

const features = [
  {
    feature: "Design Visualization",
    tbm: "Instant AI Rendering",
    traditional: "Slow, manual sketches",
  },
  {
    feature: "Material Sourcing",
    tbm: "Direct Digital Catalog",
    traditional: "Showroom hopping",
  },
  {
    feature: "Cost Transparency",
    tbm: "Real-time Quotes",
    traditional: "Estimates & hidden fees",
  },
  {
    feature: "Project Management",
    tbm: "Centralized Dashboard",
    traditional: "Emails & Phone Tag",
  },
];

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-primary shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function WhyChooseTBM() {
  return (
    <section className="bg-[#FAF8F5] py-20 sm:py-24 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <span className="inline-block text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            The TBM difference
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A0A0A] font-primary tracking-tight">
            Why Choose TBM?
          </h2>
          <p className="text-[#7A736C] text-sm sm:text-base mt-4 max-w-lg">
            See how we stack up against traditional renovation services.
          </p>
        </motion.div>

        {/* ── DESKTOP TABLE (md+) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="hidden md:block border border-stone overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-3">
            <div className="p-5 lg:p-6 border-b border-stone">
              <span className="text-xs font-bold text-[#7A736C] uppercase tracking-[0.15em]">
                Feature
              </span>
            </div>
            <div className="p-5 lg:p-6 bg-[#0A0A0A] border-b border-[#0A0A0A]">
              <span className="text-sm lg:text-base font-bold text-white tracking-wide">
                TBM Platform
              </span>
            </div>
            <div className="p-5 lg:p-6 border-b border-stone">
              <span className="text-sm lg:text-base font-semibold text-[#7A736C]">
                Traditional Services
              </span>
            </div>
          </div>

          {/* Table Rows */}
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className={`grid grid-cols-3 ${index !== features.length - 1 ? "border-b border-stone" : ""}`}
            >
              <div className="p-5 lg:p-6 flex items-center">
                <span className="text-[#0A0A0A] font-medium text-sm lg:text-base">
                  {item.feature}
                </span>
              </div>
              <div className="p-5 lg:p-6 bg-warm flex items-center gap-2.5">
                <CheckIcon />
                <span className="text-[#0A0A0A] font-semibold text-sm lg:text-base">
                  {item.tbm}
                </span>
              </div>
              <div className="p-5 lg:p-6 flex items-center">
                <span className="text-[#7A736C] text-sm lg:text-base">
                  {item.traditional}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── MOBILE CARDS (< md) ── */}
        <div className="md:hidden space-y-px bg-stone">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
              viewport={{ once: true }}
              className="bg-white overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-stone">
                <span className="text-[10px] font-bold text-[#7A736C] uppercase tracking-[0.15em]">Feature</span>
                <p className="text-[#0A0A0A] font-semibold text-sm mt-0.5">{item.feature}</p>
              </div>
              <div className="grid grid-cols-2">
                <div className="bg-warm px-4 py-4 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider">TBM</span>
                  <div className="flex items-start gap-1.5">
                    <CheckIcon />
                    <span className="text-[#0A0A0A] font-semibold text-sm leading-snug">{item.tbm}</span>
                  </div>
                </div>
                <div className="px-4 py-4 flex flex-col gap-1.5 border-l border-stone">
                  <span className="text-[10px] font-bold text-[#7A736C] uppercase tracking-wider">Traditional</span>
                  <span className="text-[#7A736C] text-sm leading-snug">{item.traditional}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
