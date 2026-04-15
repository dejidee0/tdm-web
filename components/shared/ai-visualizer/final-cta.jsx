"use client";
import React from "react";
import { motion } from "framer-motion";

const FinalCTA = () => {
  return (
    <section className="max-w-[1260px] mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-8 relative font-manrope">
      <motion.div
        className="relative bg-[#0A0A0A] px-8 md:px-16 py-16 md:py-20 overflow-hidden"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Gold top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gold opacity-40" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center justify-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2.5 border border-white/15 text-white/60 text-xs font-medium px-4 py-2 tracking-[0.15em] uppercase">
              <span className="w-1 h-1 bg-gold" />
              Limited Time Offer
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight font-primary leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Turn Your Ziora Vision into Reality
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-white/50 mb-10 max-w-2xl font-manrope"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Book a consultation with a TBM Designer today and get a{" "}
            <span className="font-semibold text-gold">
              free detailed material list
            </span>{" "}
            based on your Ziora design.
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-none font-manrope font-bold text-sm tracking-wide text-black hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
            >
              Book a Designer
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-transparent text-white border border-white/20 rounded-none font-manrope font-semibold text-sm tracking-wide hover:border-white/40 transition-colors"
            >
              Design with Ziora Again
            </motion.button>
          </motion.div>

          {/* Disclaimer Text */}
          <motion.p
            className="text-sm text-white/40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Offer ends in 7 days. No credit card required for booking.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCTA;
