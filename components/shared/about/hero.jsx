"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="min-h-screen bg-background md:min-h-[90vh] overflow-visible relative">
      <div className="max-w-[1275px] mx-auto h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4 relative min-h-[90vh] mt-20 md:mt-16">
        {/* Background Wrapper */}
        <div className="w-full min-h-[80vh] overflow-hidden relative flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
          {/* Background Image */}
          <Image
            src="/about.svg"
            alt="About background"
            fill
            priority
            className="object-cover"
          />

          {/* Deep warm dark overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/70" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-4xl w-full flex flex-col items-start"
          >
            {/* Label */}
            <div className="mb-5">
              <span className="inline-flex items-center gap-2 border border-white/20 text-white/70 text-xs font-manrope font-medium px-4 py-2 tracking-[0.2em] uppercase">
                <span className="w-1 h-1 bg-gold" />
                Reimagining Spaces
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-primary font-bold tracking-tight text-white leading-[1.02] mb-6">
              Designing the Future
              <span className="block text-white/80">of Nigerian Homes</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/60 leading-relaxed font-manrope max-w-xl mb-8">
              We blend AI visualization with world-class materials and expert execution — bringing your dream space to life before the first brick is laid.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-3 font-manrope">
              <a
                href="#contact"
                className="px-8 py-4 bg-white text-[#0A0A0A] font-semibold text-sm tracking-widest uppercase transition hover:bg-[#FAF8F5]"
              >
                Start Your Journey
              </a>
              <a
                href="#work"
                className="px-8 py-4 font-semibold text-sm text-white border border-white/25 hover:border-white/50 tracking-widest uppercase transition"
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
