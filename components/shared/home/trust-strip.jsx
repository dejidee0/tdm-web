"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Package, Cpu, HardHat, Zap, HeadphonesIcon } from "lucide-react";

const TRUST_ITEMS = [
  { icon: MapPin, label: "Abuja & Lagos Projects" },
  { icon: Package, label: "Premium Materials" },
  { icon: Cpu, label: "AI Visualization" },
  { icon: HardHat, label: "Expert Execution" },
  { icon: Zap, label: "Fast Project Delivery" },
  { icon: HeadphonesIcon, label: "After-Sales Support" },
];

export default function TrustStrip() {
  return (
    <section className="bg-primary py-4 sm:py-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
          {TRUST_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="flex items-center gap-2 text-white"
              >
                <Icon className="w-4 h-4 text-white/70 shrink-0" strokeWidth={1.8} />
                <span className="text-xs sm:text-sm font-manrope font-medium whitespace-nowrap">
                  {item.label}
                </span>
                {index < TRUST_ITEMS.length - 1 && (
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-white/30 ml-4 sm:ml-6" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
