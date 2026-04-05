"use client";

import React from "react";
import { motion } from "framer-motion";
import { Store, Sparkles, Users } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Store,
      title: "Bogat Materials",
      description:
        "Source certified renovation and construction materials — tiles, plumbing, electrical, and more — delivered directly to your site.",
    },
    {
      icon: Sparkles,
      title: "Design with Ziora",
      description:
        "Upload your space, choose a style, and let Ziora Intelligence generate a premium design vision before you spend a single naira.",
    },
    {
      icon: Users,
      title: "TBM Project Execution",
      description:
        "From estimate to completion — TBM connects you with verified contractors and manages your renovation or construction project end-to-end.",
    },
  ];

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 sm:mb-18"
        >
          <span className="inline-block text-gold text-xs font-manrope font-semibold uppercase tracking-[0.2em] mb-4">
            What we offer
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-primary font-bold text-[#0A0A0A] mb-5 leading-tight tracking-tight"
          >
            One Platform.<br className="hidden sm:block" /> Design. Materials. Execution.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg font-manrope text-[#7A736C] max-w-2xl"
          >
            TBM brings together AI planning, materials supply, and expert execution — from first design to finished build.
          </motion.p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white p-8 sm:p-10 group hover:bg-[#FAF8F5] transition-colors duration-300"
              >
                {/* Icon */}
                <div className="mb-8">
                  <div className="w-12 h-12 flex items-center justify-center border border-stone group-hover:border-gold transition-colors duration-300">
                    <Icon
                      className="w-5 h-5 text-[#0A0A0A]"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-manrope font-bold text-[#0A0A0A] mb-4 leading-snug">
                  {service.title}
                </h3>
                <p className="text-base font-manrope text-[#7A736C] leading-relaxed">
                  {service.description}
                </p>

                {/* Understated gold accent line */}
                <div className="mt-8 w-8 h-px bg-gold group-hover:w-16 transition-all duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
