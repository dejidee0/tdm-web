"use client";

import React from "react";
import { motion } from "framer-motion";
import { PackageSearch, Store, HardHat, Cpu, ClipboardCheck, MapPin } from "lucide-react";

const REASONS = [
  {
    icon: PackageSearch,
    title: "Premium Material Sourcing",
    description:
      "Every product in the Bogat store is sourced from certified suppliers — no compromises on quality, no fakes, no grey-market goods.",
  },
  {
    icon: Store,
    title: "Showroom Access",
    description:
      "See materials in person before you buy. Our Abuja showroom lets you feel the finishes, compare options, and make confident decisions.",
  },
  {
    icon: HardHat,
    title: "Real Project Execution Team",
    description:
      "We don't just sell — TBM manages your project with an on-ground team of verified contractors and site supervisors.",
  },
  {
    icon: Cpu,
    title: "AI-Assisted Planning",
    description:
      "Ziora Intelligence generates design concepts, estimates, and material recommendations before any money changes hands.",
  },
  {
    icon: ClipboardCheck,
    title: "Transparent Consultation Process",
    description:
      "Every engagement starts with a structured consultation — scope, budget, timeline — fully documented before work begins.",
  },
  {
    icon: MapPin,
    title: "Abuja & Lagos Capability",
    description:
      "Two-city delivery and execution capability, with plans to expand across Nigeria's major metro areas.",
  },
];

export default function WhyTBM() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-primary text-xs font-inter font-semibold uppercase tracking-widest mb-2">
            Why choose TBM
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-primary font-bold text-primary leading-tight">
            Built Different. Built Better.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-500 font-inter max-w-2xl mx-auto">
            We combine premium materials, intelligent planning tools, and real execution capability into one seamless platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-base font-inter font-bold text-gray-900 mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-sm font-inter text-gray-500 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
