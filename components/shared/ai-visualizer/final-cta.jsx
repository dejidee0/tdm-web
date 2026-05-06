"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare,
  Award,
  TrendingUp,
  CheckCircle,
  MapPin,
} from "lucide-react";

// ── Swap this path to your Ziora app screenshot when ready ──────────────────
const APP_SCREENSHOT = "/kitchen.png";
// ────────────────────────────────────────────────────────────────────────────

const STATS = [
  { Icon: Award, value: "700+", label: "Projects Designed" },
  { Icon: TrendingUp, value: "10,000+", label: "Designs Generated" },
  { Icon: CheckCircle, value: "98%", label: "Estimate Accuracy" },
  { Icon: MapPin, value: "Abuja & Lagos", label: "Proudly Serving" },
];

/**
 * CSS tablet mockup — landscape iPad silhouette.
 * Replace APP_SCREENSHOT above with the real Ziora app screenshot path.
 * Styled with a 3D perspective tilt to match the reference design.
 */
function TabletMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.85, ease: "easeOut" }}
      className="relative flex items-center justify-center select-none"
      style={{
        transform: "perspective(1400px) rotateY(10deg) rotateX(-3deg)",
        transformOrigin: "left center",
      }}
    >
      {/* Ambient glow behind device */}
      <div
        className="absolute inset-0 -z-10 blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 40% 50%, rgba(212,175,55,0.35) 0%, transparent 65%)",
        }}
      />

      {/* Outer device chassis — landscape iPad proportions */}
      <div
        className="relative rounded-[1.75rem]"
        style={{
          width: "460px",
          padding: "14px 14px 18px",
          background:
            "linear-gradient(160deg, #3a3a3a 0%, #1c1c1c 60%, #141414 100%)",
          boxShadow: [
            "0 48px 120px rgba(0,0,0,0.95)",
            "0 0 0 1px rgba(212,175,55,0.10)",
            "inset 0 1px 0 rgba(255,255,255,0.08)",
            "inset 0 -1px 0 rgba(0,0,0,0.6)",
          ].join(", "),
        }}
      >
        {/* Front camera — sits at top center in landscape */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: "6px", height: "6px", background: "#2a2a2a" }}
        />

        {/* Screen bezel inner lip */}
        <div
          className="rounded-[1.1rem] overflow-hidden"
          style={{
            aspectRatio: "4 / 3",
            background: "#000",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.8)",
          }}
        >
          {/* App screenshot */}
          <div className="relative w-full h-full">
            <Image
              src={APP_SCREENSHOT}
              alt="Ziora AI app interface"
              fill
              className="object-cover"
              sizes="460px"
            />
            {/* Subtle screen glare */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(130deg, rgba(255,255,255,0.05) 0%, transparent 45%)",
              }}
            />
          </div>
        </div>

        {/* Home indicator bar */}
        <div
          className="mx-auto mt-3 rounded-full"
          style={{ width: "44px", height: "4px", background: "#383838" }}
        />

        {/* Side volume buttons — left short edge in landscape */}
        <div
          className="absolute rounded-r-sm"
          style={{
            left: "-3px",
            top: "30%",
            width: "3px",
            height: "24px",
            background: "#303030",
          }}
        />
        <div
          className="absolute rounded-r-sm"
          style={{
            left: "-3px",
            top: "calc(30% + 32px)",
            width: "3px",
            height: "24px",
            background: "#303030",
          }}
        />

        {/* Power button — right short edge */}
        <div
          className="absolute rounded-l-sm"
          style={{
            right: "-3px",
            top: "35%",
            width: "3px",
            height: "32px",
            background: "#303030",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function FinalCTA() {
  return (
    <section className="bg-black font-manrope overflow-hidden">
      {/* ── CTA block ── */}
      <div
        className="relative border-y border-white/06"
        style={{ background: "#080705" }}
      >
        {/* Gold hairline top */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-35"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_0.4fr] items-center  gap-10 py-16 md:py-20">
            {/* ── Left: tablet mockup ── */}
            <div className="hidden lg:flex items-center justify-start overflow-visible -ml-2">
              <TabletMockup />
            </div>

            {/* ── Center: text + CTAs ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="space-y-5"
            >
              <p className="text-gold text-[18px] font-bold tracking-[0.22em] uppercase font-manrope">
                Ready to Bring Your Dream Space to Life?
              </p>

              <h2 className="font-primary text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-white tracking-tight leading-tight">
                Start Designing with
                <br className="hidden sm:block" /> Ziora AI Today.
              </h2>

              <p className="text-white/40 text-sm leading-relaxed max-w-lg">
                Create stunning 3D designs and get your project estimate in
                minutes.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/dashboard/ai-designs">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 font-manrope font-bold text-sm tracking-widest uppercase text-black cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)",
                    }}
                  >
                    Start Designing Now →
                  </motion.span>
                </Link>

                <Link href="/contact">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white font-manrope font-semibold text-sm tracking-widest uppercase hover:border-white/30 transition-colors cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <MessageSquare size={14} />
                    Book a Consultation
                  </motion.span>
                </Link>
              </div>
            </motion.div>

            {/* ── Right: decorative side ── */}
            {/*
              To add the armchair image from the reference design:
              Replace this div with:
              <div className="hidden lg:block relative h-72 overflow-hidden">
                <Image src="/chair.jpg" alt="" fill className="object-cover object-left-bottom" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              </div>
            */}
            <div
              className="hidden lg:block h-72 relative rounded-sm overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse at 40% 70%, rgba(212,175,55,0.04) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <motion.div
        className="border-t border-white/06"
        style={{ background: "#060503" }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/06">
            {STATS.map(({ Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center px-6 py-10 text-center gap-2"
              >
                <Icon className="w-5 h-5 text-gold/55" strokeWidth={1.5} />
                <span className="text-white text-2xl sm:text-3xl font-extrabold font-primary leading-none">
                  {value}
                </span>
                <span className="text-white/30 text-xs font-manrope tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
