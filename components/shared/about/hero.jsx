"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="min-h-screen bg-background md:min-h-[90vh] overflow-visible relative">
      <div className="max-w-[1275px] mx-auto h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4 relative min-h-[90vh] mt-20 md:mt-16">
        {/* Background Wrapper */}
        <div className="w-full min-h-[80vh] rounded-xl md:rounded-2xl overflow-hidden relative flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
          {/* Background Image */}
          <Image
            src="/about.svg"
            alt="About background"
            fill
            priority
            className="object-cover"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-3xl w-full text-center flex flex-col items-center"
          >
            {/* Pill */}
            <div className="mb-2">
              <div className="px-4 py-1.5 rounded-full font-manrope bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white tracking-widest">
                REIMAGINING SPACES
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-primary font-semibold tracking-tight text-white leading-tight">
              Designing the Future
              <span className="block text-white/90">of Homes</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-2 text-base sm:text-lg text-white/80 leading-relaxed font-manrope w-[80%]">
              Experience the revolution of home renovation. We blend
              cutting-edge AI visualization with world-class materials to bring
              your dream space to life before the first brick is laid.
            </p>

            {/* CTAs */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4 font-manrope">
              {/* Primary CTA */}
              <a
                href="#contact"
                className="px-7 py-3 rounded-full bg-white text-black font-medium text-sm sm:text-base transition hover:bg-white/90"
              >
                Start Your Journey
              </a>

              {/* Secondary CTA - Glassy */}
              <a
                href="#work"
                className="px-7 py-3 rounded-full font-medium text-sm sm:text-base text-white border border-white/30 bg-white/10 backdrop-blur-md transition hover:bg-white/20"
              >
                Watch Our Story
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
