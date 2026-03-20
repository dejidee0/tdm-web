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
    <section className="py-12 sm:py-14 lg:py-16 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-primary font-bold text-primary mb-4 sm:mb-6"
          >
            One Platform. Design. Materials. Execution.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl font-inter text-gray-600 max-w-4xl mx-auto"
          >
            TBM Building Services brings together Ziora AI planning, Bogat materials supply, and expert project execution — guiding you from first design to finished build.
          </motion.p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 transition-shadow duration-300 border border-gray-100 group"
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: index * 0.15 + 0.3,
                  }}
                  className="mb-6"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -15, 15, -15, 0] }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 sm:w-14 sm:h-14 flex items-center justify-center bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors duration-300"
                  >
                    <Icon
                      className="w-8 h-8 sm:w-7 sm:h-7 text-primary"
                      strokeWidth={2}
                    />
                  </motion.div>
                </motion.div>

                {/* Content */}
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
                  className="text-xl sm:text-xl font-inter font-bold text-gray-900 mb-3 sm:mb-4"
                >
                  {service.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
                  className="text-base sm:text-lg font-inter text-gray-600 leading-relaxed"
                >
                  {service.description}
                </motion.p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
