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
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block text-primary text-xs sm:text-sm font-inter font-semibold uppercase tracking-widest mb-3">
            Simple process
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-primary font-bold text-primary leading-tight">
            How TBM Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-500 font-inter max-w-2xl mx-auto">
            From first idea to final build — every step is guided, transparent, and designed around you.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* connector line — desktop only */}
          <div className="hidden lg:block absolute top-10 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-gray-200 z-0" />

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
                  className="flex flex-col items-center text-center group"
                >
                  {/* icon ring */}
                  <motion.div
                    whileHover={{ scale: 1.08, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="relative mb-6"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center group-hover:border-primary/20 group-hover:shadow-xl transition-all duration-300">
                      <Icon className="w-9 h-9 text-primary" strokeWidth={1.5} />
                    </div>
                    {/* number badge */}
                    <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold font-inter flex items-center justify-center">
                      {index + 1}
                    </span>
                  </motion.div>

                  <h3 className="text-base sm:text-lg font-inter font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 font-inter text-sm leading-relaxed max-w-55">
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
