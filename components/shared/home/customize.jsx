"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const CustomizeSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-16 bg-gray-50">
      <div className="">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-slate-400 overflow-hidden relative min-h-[200px] sm:min-h-[450px] md:min-h-[300px]"
        >
          {/* Overlay for better text readability */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="absolute inset-0 bg-slate-500/40"
          />

          {/* Content Container */}
          <div className="relative z-10 h-full flex items-center">
            <div className="w-full md:w-1/2 px-8 sm:px-12 md:px-16 lg:px-20 py-12 sm:py-16">
              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-primary font-bold text-white mb-4 sm:mb-6 leading-tight"
              >
                Customize your furniture and build your space with TBM
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                className="text-base sm:text-lg md:text-xl font-inter text-white/90 mb-8 sm:mb-10 max-w-xl"
              >
                Allows you to view our showrooms containing our latest furniture
                collections
              </motion.p>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 sm:px-10 py-3 sm:py-4 rounded-lg transition-colors duration-200 text-base sm:text-lg shadow-lg"
              >
                Browse Materials
              </motion.button>
            </div>

            {/* Chair Image - Hidden on mobile, visible on larger screens */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: "easeOut",
              }}
              className="hidden md:block absolute right-12 lg:right-20 -bottom-10 w-[400px] lg:w-[500px] h-[400px] lg:h-[500px]"
            >
              <Image
                src="/chair.png"
                alt="Modern green chair"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomizeSection;
