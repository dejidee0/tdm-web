"use client";

import React from "react";
import { motion } from "framer-motion";
import { UploadCloud, ClipboardList, CheckSquare, Hammer } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UploadCloud,
    title: "Upload, Book, or Describe",
    description:
      "Share a photo of your space, describe what you want, or book an inspection. Ziora AI or our team will assess your project needs.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Get Concept, Estimate & Recommendations",
    description:
      "Receive an AI-generated design concept, full project estimate, and material recommendations tailored to your budget and style.",
  },
  {
    number: "03",
    icon: CheckSquare,
    title: "Approve Materials and Scope",
    description:
      "Review and approve your shortlisted materials from Bogat, confirm the project scope, timeline, and team — before any work begins.",
  },
  {
    number: "04",
    icon: Hammer,
    title: "TBM Executes and Delivers",
    description:
      "Our expert team handles everything from delivery to installation and finishing — on schedule, on budget, to premium standards.",
  },
];

const ProcessSection = () => {
  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 sm:mb-20"
        >
          <span className="inline-block text-gold text-xs font-manrope font-semibold uppercase tracking-[0.2em] mb-4">
            Simple process
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-primary font-bold text-[#0A0A0A] leading-tight tracking-tight">
            How TBM Works
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#7A736C] font-manrope max-w-xl">
            From first idea to final build — every step is guided, transparent, and designed around you.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* connector line — desktop only */}
          <div className="hidden lg:block absolute top-9 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-stone z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: index * 0.15 }}
                  className="flex flex-col group"
                >
                  {/* icon */}
                  <motion.div
                    whileHover={{ scale: 1.06, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="relative mb-7 self-start"
                  >
                    <div className="w-18 h-18 bg-white border border-stone flex items-center justify-center group-hover:border-gold group-hover:shadow-lg transition-all duration-300">
                      <Icon className="w-8 h-8 text-[#0A0A0A]" strokeWidth={1.4} />
                    </div>
                    {/* number badge */}
                    <span className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-[#0A0A0A] text-white text-xs font-bold font-manrope flex items-center justify-center">
                      {index + 1}
                    </span>
                  </motion.div>

                  <h3 className="text-base sm:text-lg font-manrope font-bold text-[#0A0A0A] mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[#7A736C] font-manrope text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
