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
    <section className="py-20 sm:py-24 lg:py-32 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="inline-block text-gold text-xs font-manrope font-semibold uppercase tracking-[0.2em] mb-4">
            Why choose TBM
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-primary font-bold text-[#0A0A0A] leading-tight tracking-tight">
            Built Different.<br className="hidden sm:block" /> Built Better.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#7A736C] font-manrope max-w-xl">
            Premium materials, intelligent planning tools, and real execution capability — one seamless platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white p-7 hover:bg-warm transition-colors duration-300"
              >
                <div className="w-10 h-10 border border-stone group-hover:border-gold flex items-center justify-center mb-5 transition-colors duration-300">
                  <Icon className="w-4 h-4 text-[#3D3833]" strokeWidth={1.6} />
                </div>
                <h3 className="text-base font-manrope font-bold text-[#0A0A0A] mb-2 tracking-wide">
                  {reason.title}
                </h3>
                <p className="text-sm font-manrope text-[#7A736C] leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
