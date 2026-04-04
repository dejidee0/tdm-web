"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarCheck, Calculator, ShoppingBag, ArrowRight } from "lucide-react";

const ACTIONS = [
  {
    icon: CalendarCheck,
    label: "Book Consultation",
    desc: "Talk to a renovation expert",
    href: "/contact?type=consultation",
  },
  {
    icon: Calculator,
    label: "Get Estimate",
    desc: "Price your project for free",
    href: "/contact?type=estimate",
  },
  {
    icon: ShoppingBag,
    label: "Shop Materials",
    desc: "Browse the Bogat store",
    href: "/materials",
  },
];

export default function CTASection() {
  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary rounded-3xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — copy */}
            <div className="px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 flex flex-col justify-center">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-white/60 font-inter text-xs font-semibold uppercase tracking-widest mb-4"
              >
                Ready when you are
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-primary font-bold text-white leading-tight mb-5"
              >
                Ready to transform your space?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-white/70 font-inter text-base sm:text-lg max-w-md mb-10"
              >
                Book a consultation, get a free project estimate, or start shopping premium materials — all in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <Link href="/contact?type=consultation">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-white text-primary font-inter font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                  >
                    Book Consultation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Right — action cards */}
            <div className="bg-white/5 border-l border-white/10 px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 flex flex-col justify-center gap-4">
              {ACTIONS.map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.2 + i * 0.1 }}
                  >
                    <Link href={action.href}>
                      <motion.div
                        whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.12)" }}
                        className="flex items-center gap-5 p-5 rounded-2xl border border-white/10 bg-white/5 cursor-pointer transition-colors duration-200 group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                          <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                        </div>
                        <div className="flex-1">
                          <p className="font-inter font-bold text-white text-sm sm:text-base">
                            {action.label}
                          </p>
                          <p className="text-white/50 text-xs sm:text-sm font-inter mt-0.5">
                            {action.desc}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-200" />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
