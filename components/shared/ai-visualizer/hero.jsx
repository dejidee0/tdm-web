"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Upload, RefreshCcw, Sparkles, PlayCircle } from "lucide-react";

export default function Hero() {
  return (
    <div className="min-h-screen bg-black md:min-h-[90vh] overflow-visible relative">
      <div className="max-w-318.75 mx-auto h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4 relative min-h-[90vh] mt-20 md:mt-16">
        <div className="w-full min-h-[80vh] bg-text-black flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4 sm:space-y-6 md:space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex"
              >
                <div className="px-4 py-2 border border-white/15">
                  <span className="flex items-center gap-2 text-white/60 text-xs font-medium tracking-[0.15em] uppercase font-manrope">
                    <span className="w-1 h-1 bg-gold inline-block shrink-0" />
                    See Before You Start
                  </span>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-primary font-bold tracking-tight text-white leading-tight"
              >
                Reimagine Your <br className="hidden sm:block" /> Home in
                Seconds
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-white/55 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-manrope"
              >
                Don&lsquo;t just imagine it — see it. Upload a photo, choose a
                style, and watch Ziora transform your space instantly.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-none font-manrope font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-black"
                  style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
                >
                  <Upload size={18} className="sm:w-5 sm:h-5" />
                  Upload Photo
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white rounded-none font-manrope font-semibold text-sm tracking-wide flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 transition-colors"
                >
                  <PlayCircle size={18} className="sm:w-5 sm:h-5" />
                  Watch Demo
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Content - Visualizer Window */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative mt-8 lg:mt-0"
            >
              {/* Browser Window */}
              <motion.div
                className="overflow-hidden border border-white/08"
                style={{ background: "#0d0b08" }}
              >
                {/* Window Header */}
                <div
                  className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between w-full border-b border-white/06"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <div className="flex gap-1.5 sm:gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-white/30 text-xs sm:text-sm font-normal font-manrope">
                    Ziora 2.0
                  </span>
                  <div className="w-8 sm:w-16" />
                </div>

                {/* AI Suggestion Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="absolute top-10 sm:top-12 -right-2 sm:-right-8 border px-3 sm:px-4 py-2 sm:py-3 z-10 max-w-45 sm:max-w-none"
                  style={{
                    background: "#0d0b08",
                    borderColor: "rgba(212,175,55,0.25)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.40)",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <Sparkles
                      size={16}
                      className="sm:w-5 sm:h-5 text-gold mt-0.5 shrink-0"
                    />
                    <div className="font-manrope">
                      <p className="font-semibold text-white text-xs sm:text-sm">
                        Ziora Suggestion
                      </p>
                      <p className="text-white/40 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                        Try &quot;Scandi-Boho&quot; for this light.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Kitchen Image */}
                <div className="p-2 sm:p-3 md:p-3.5">
                  <div className="relative aspect-6/3 sm:aspect-3/2 bg-white/06 overflow-hidden">
                    <Image
                      src="/kitchen.png"
                      alt="Kitchen visualization"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    />

                    {/* Rendering Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="inline-flex items-center font-manrope justify-center w-3 h-3 sm:w-4 sm:h-4 origin-center"
                      >
                        <RefreshCcw className="w-full h-full" />
                      </motion.span>
                      Rendering Style...
                    </motion.div>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div
                  className="px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between border-t border-white/06"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="flex gap-2 sm:gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 border-2 cursor-pointer"
                      style={{ borderColor: "#D4AF37" }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 border-2 border-transparent cursor-pointer"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 border-2 border-transparent cursor-pointer"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-black text-xs sm:text-sm font-semibold font-manrope hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
                  >
                    Save
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Progress Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 mb-2 w-full max-w-4xl"
        >
          <div
            className="px-8 py-4 font-manrope border border-white/06"
            style={{ background: "#0d0b08" }}
          >
            <div className="flex items-center justify-between relative">
              {/* Progress Line Background */}
              <div className="absolute left-0 right-0 top-5 h-px bg-white/08 z-0" />

              {/* Progress Line Active */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "0%" }}
                className="absolute left-0 top-5 h-px z-0"
                style={{ background: "rgba(212,175,55,0.60)" }}
              />

              {/* Step 1 - UPLOAD */}
              <div className="flex flex-col items-center gap-2 relative z-10 pr-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  className="w-10 h-10 flex items-center justify-center text-black font-semibold text-sm"
                  style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
                >
                  1
                </motion.div>
                <span className="text-[#D4AF37] font-semibold text-xs tracking-[0.15em] uppercase">
                  UPLOAD
                </span>
              </div>

              {/* Step 2 - STYLE */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
                  className="w-10 h-10 flex items-center justify-center text-white/25 font-semibold text-sm"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  2
                </motion.div>
                <span className="text-white/25 font-medium text-xs tracking-[0.15em] uppercase">
                  STYLE
                </span>
              </div>

              {/* Step 3 - PREVIEW */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                  className="w-10 h-10 flex items-center justify-center text-white/25 font-semibold text-sm"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  3
                </motion.div>
                <span className="text-white/25 font-medium text-xs tracking-[0.15em] uppercase">
                  PREVIEW
                </span>
              </div>

              {/* Step 4 - SAVE */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                  className="w-10 h-10 flex items-center justify-center text-white/25 font-semibold text-sm"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  4
                </motion.div>
                <span className="text-white/25 font-medium text-xs tracking-[0.15em] uppercase">
                  SAVE
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
