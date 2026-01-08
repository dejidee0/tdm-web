"use client";
import React from "react";
import { motion } from "framer-motion";

const FinalCTA = () => {
  return (
    <section className="max-w-[1260px] mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-8 relative font-manrope">
      <motion.div
        className="relative bg-linear-to-br from-white via-gray-50 to-gray-200 rounded-3xl border border-gray-300 px-8 md:px-16 py-16 md:py-10 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background subtle pattern/gradient effect */}
        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/30 to-gray-400/50 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Limited Time Offer Badge */}
          <motion.div
            className="inline-flex items-center justify-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="bg-gray-400 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
              Limited Time Offer
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            className="text-4xl md:text-5xl lg:text-5xl font-bold text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Turn Your AI Vision into Reality
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Book a consultation with a TBM Designer today and get a{" "}
            <span className="font-semibold text-primary">
              free detailed material list
            </span>{" "}
            based on your AI visualization.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-white rounded-xl font-semibold text-base shadow-lg hover:bg-[#1e2d3d] transition-colors"
            >
              Book a Designer
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-[#2d3e54] border-2 border-gray-300 rounded-xl font-semibold text-base hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Try Visualizer Again
            </motion.button>
          </motion.div>

          {/* Disclaimer Text */}
          <motion.p
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Offer ends in 7 days. No credit card required for booking.
          </motion.p>
        </div>

        {/* Decorative gradient orbs (optional subtle effect) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-200/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      </motion.div>
    </section>
  );
};

export default FinalCTA;
