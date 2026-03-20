"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Cpu, PackageCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse & Discover",
    description:
      "Explore thousands of premium materials from trusted Nigerian and international brands — filtered to match your budget and style.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Design with Ziora",
    description:
      "Upload a photo of your space and let Ziora Intelligence generate a premium design — visualize the result before you spend a single naira.",
  },
  {
    number: "03",
    icon: PackageCheck,
    title: "Build with TBM",
    description:
      "Place your order through Bogat and kick off your project with TBM. We handle delivery and connect you with verified contractors — on schedule, on budget.",
  },
];

const ProcessSection = () => {
  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-background">
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
            How It Works
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* connector line — desktop only */}
          <div className="hidden lg:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gray-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 relative z-10">
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
                      <Icon
                        className="w-9 h-9 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                    {/* number badge */}
                    <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold font-inter flex items-center justify-center">
                      {index + 1}
                    </span>
                  </motion.div>

                  <h3 className="text-lg sm:text-xl font-inter font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 font-inter text-sm sm:text-base leading-relaxed max-w-xs">
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
