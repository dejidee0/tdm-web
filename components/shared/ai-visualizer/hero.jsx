"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Upload, Play, Sparkles, RefreshCcw, PlayCircle } from "lucide-react";

export default function Hero() {
  return (
    <div className="min-h-screen bg-background md:min-h-[90vh] overflow-visible relative">
      <div className="max-w-[1275px] mx-auto h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4 relative min-h-[90vh] mt-20 md:mt-16">
        <div className="w-full min-h-[80vh] bg-linear-to-br from-[#0a1628] via-[#0f1e32] to-[#1a2332] flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 rounded-xl md:rounded-2xl">
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
                <div className="px-2.5 sm:px-3 py-1 rounded-full border border-white bg-white/5 backdrop-blur-sm">
                  <span className="flex items-center gap-1.5 sm:gap-2 text-white text-[10px] sm:text-xs font-medium tracking-wider sm:tracking-widest font-manrope">
                    <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-white inline-block shrink-0" />
                    SEE BEFORE YOU START
                  </span>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-primary font-bold tracking-wide text-white leading-tight"
              >
                Reimagine Your <br className="hidden sm:block" /> Home in
                Seconds
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-inter"
              >
                Don&lsquo;t just imagine it — see it. Upload a photo, choose a
                style, and watch our AI transform your space instantly.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 font-inter"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#0a1628] rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Upload size={18} className="sm:w-5 sm:h-5" />
                  Upload Photo
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#1e3a52] text-white rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 border border-white/10 hover:bg-[#2a4a62] transition-colors"
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
              <motion.div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
                {/* Window Header */}
                <div className="bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between w-full border-b border-gray-200">
                  <div className="flex gap-1.5 sm:gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-gray-500 text-xs sm:text-sm font-normal font-inter">
                    TBM Visualizer 2.0
                  </span>
                  <div className="w-8 sm:w-16" />
                </div>

                {/* AI Suggestion Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="absolute top-10 sm:top-12 -right-2 sm:-right-8 bg-white rounded-lg shadow-xl px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 z-10 max-w-[180px] sm:max-w-none"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles
                      size={16}
                      className="sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0"
                    />
                    <div className="font-inter">
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                        AI Suggestion
                      </p>
                      <p className="text-gray-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                        Try &quot;Scandi-Boho&quot; for this light.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Kitchen Image */}
                <div className="p-2 sm:p-3 md:p-3.5">
                  <div className="relative aspect-[6/3] sm:aspect-[3/2] bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden">
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
                      className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
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
                <div className="bg-gray-50 px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex gap-2 sm:gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gray-200 border-2 border-teal-400 cursor-pointer"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gray-200 border-2 border-transparent cursor-pointer"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gray-200 border-2 border-transparent cursor-pointer"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-[#2a3a4a] transition-colors"
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
          className="mt-6 mb-2 w-full max-w-4xl "
        >
          <div className=" px-8 py-4 bg-background font-inter">
            <div className="flex items-center justify-between relative ">
              {/* Progress Line Background */}
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200 z-0" />

              {/* Progress Line Active */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "0%" }}
                className="absolute left-0 top-5 h-0.5 bg-[#1e2a3a] z-0"
              />

              {/* Step 1 - UPLOAD */}
              <div className="flex flex-col items-center gap-2 relative z-10 pr-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  className="w-10 h-10 rounded-full bg-[#1e2a3a] flex items-center justify-center text-white font-semibold text-sm shadow-md"
                >
                  1
                </motion.div>
                <span className="text-[#1e2a3a] font-semibold text-xs tracking-wider">
                  UPLOAD
                </span>
              </div>

              {/* Step 2 - STYLE */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-sm"
                >
                  2
                </motion.div>
                <span className="text-gray-400 font-medium text-xs tracking-wider">
                  STYLE
                </span>
              </div>

              {/* Step 3 - PREVIEW */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-sm"
                >
                  3
                </motion.div>
                <span className="text-gray-400 font-medium text-xs tracking-wider">
                  PREVIEW
                </span>
              </div>

              {/* Step 4 - SAVE */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-sm"
                >
                  4
                </motion.div>
                <span className="text-gray-400 font-medium text-xs tracking-wider">
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
