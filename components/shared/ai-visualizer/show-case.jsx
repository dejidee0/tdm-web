"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";
import Image from "next/image";

const KITCHEN_IMAGE =
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=600&fit=crop";

export default function AIMultiModeShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress] = useState(0.52); // 00:15 / 00:30

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  });

  return (
    <section className="bg-white py-16 px-4 sm:px-6 font-manrope">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="text-center mb-12">
        <h2 className="text-primary text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
          AI Multi-Mode Showcase
        </h2>
        <p className="text-gray-500 text-sm sm:text-base max-w-xs mx-auto leading-relaxed">
          Experience the versatility of our next-gen visualization tools.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24">
        {/* ── TOP LEFT — Text to Image ── */}
        <motion.div {...fadeUp(0.1)} className="flex flex-col gap-5">
          {/* Label */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-primary" />
            <span className="text-primary text-xs font-bold tracking-[0.18em] uppercase">
              Text to Image
            </span>
          </div>

          {/* Heading */}
          <h3 className="text-primary text-3xl sm:text-4xl font-extrabold leading-tight">
            From your mind
            <br />
            to reality.
          </h3>

          {/* Prompt card */}
          <div className="relative bg-white border border-gray-200 rounded-2xl px-5 py-5 shadow-sm">
            {/* Quote badge */}
            <div className="absolute -top-3.5 left-4 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold leading-none">
                "
              </span>
            </div>
            <p className="text-primary text-sm sm:text-base leading-relaxed pt-2">
              "A mid-century modern living room with floor-to-ceiling windows,
              an emerald velvet sofa, exposed oak beams, and
              <br />
              soft evening sunlight filtering through."
            </p>
          </div>

          {/* CTA button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white rounded-xl py-4 flex items-center justify-center gap-2.5 font-semibold text-sm sm:text-base"
          >
            <Sparkles className="w-4 h-4" />
            Try Custom Prompt
          </motion.button>
        </motion.div>

        {/* ── TOP RIGHT — AI Generated Preview image ── */}
        <motion.div {...fadeUp(0.2)} className="relative">
          <div className="relative rounded-3xl overflow-hidden h-[280px] sm:h-[320px] lg:h-full min-h-[280px] shadow-sm">
            <Image
              src={KITCHEN_IMAGE}
              alt="AI Generated Preview"
              fill
              className="object-cover"
            />
            {/* Badge */}
            <div className="absolute bottom-4 left-4">
              <span className="bg-white text-primary text-xs font-bold px-4 py-2 rounded-full shadow-md tracking-wide">
                AI GENERATED PREVIEW
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── BOTTOM LEFT — Cinematic Video player ── */}
        <motion.div {...fadeUp(0.3)} className="relative">
          <div
            className="relative rounded-3xl overflow-hidden h-[280px] sm:h-[320px] shadow-sm group cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <Image
              src={KITCHEN_IMAGE}
              alt="Cinematic Render"
              fill
              className="object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl"
              >
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              </motion.div>
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
              {/* Label row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-white text-xs font-bold tracking-widest uppercase">
                    Cinematic Render
                  </span>
                </div>
                <span className="text-white text-xs font-medium tabular-nums">
                  00:15 / 00:30
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${progress * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── BOTTOM RIGHT — Cinematic Video text ── */}
        <motion.div
          {...fadeUp(0.35)}
          className="flex flex-col justify-center gap-5"
        >
          {/* Label */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-primary" />
            <span className="text-primary text-xs font-bold tracking-[0.18em] uppercase">
              Cinematic Video
            </span>
          </div>

          {/* Heading */}
          <h3 className="text-primary text-3xl sm:text-4xl font-extrabold leading-tight">
            Step into your
            <br />
            future.
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-sm">
            Static images only tell half the story. Our video generator creates
            immersive walkthroughs that show how light hits every corner and how
            the space flows.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-200 rounded-2xl px-5 py-4 text-center">
              <div className="text-primary text-2xl font-extrabold mb-0.5">
                4K
              </div>
              <div className="text-gray-400 text-xs font-bold tracking-[0.15em] uppercase">
                Resolution
              </div>
            </div>
            <div className="border border-gray-200 rounded-2xl px-5 py-4 text-center">
              <div className="text-primary text-2xl font-extrabold mb-0.5">
                360°
              </div>
              <div className="text-gray-400 text-xs font-bold tracking-[0.15em] uppercase">
                Rotation
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
