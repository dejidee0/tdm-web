"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Package, Phone, ArrowRight } from "lucide-react";

const LINKS = [
  {
    Icon: Home,
    label: "Back to Home",
    desc: "Return to the main page",
    href: "/",
  },
  {
    Icon: Package,
    label: "Browse Materials",
    desc: "Explore the Bogat collection",
    href: "/bogat/materials",
  },
  {
    Icon: Phone,
    label: "Contact Us",
    desc: "Talk to our team directly",
    href: "/contact",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-manrope px-4 py-20"
      style={{ background: "#0d0b08" }}
    >
      {/* Blueprint grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="nf-grid"
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 64 0 L 0 0 0 64"
                fill="none"
                stroke="rgba(212,175,55,0.045)"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nf-grid)" />
        </svg>
      </div>

      {/* Ambient 404 behind content */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center"
      >
        <span
          className="font-primary font-bold leading-none"
          style={{
            fontSize: "clamp(12rem, 30vw, 36rem)",
            color: "rgba(212,175,55,0.032)",
            userSelect: "none",
            letterSpacing: "-0.04em",
          }}
        >
          404
        </span>
      </div>

      {/* Animated floor-plan sketch */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.1 }}
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <svg
          width="640"
          height="420"
          viewBox="0 0 640 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer boundary */}
          <motion.rect
            x="80"
            y="60"
            width="480"
            height="280"
            stroke="rgba(212,175,55,0.14)"
            strokeWidth="0.8"
            strokeDasharray="10 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.8, delay: 0.4, ease: "easeInOut" }}
          />
          {/* Room A */}
          <motion.rect
            x="130"
            y="110"
            width="150"
            height="120"
            stroke="rgba(212,175,55,0.18)"
            strokeWidth="0.7"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: 1.0, ease: "easeInOut" }}
          />
          {/* Room B — dashed, "missing" */}
          <motion.rect
            x="340"
            y="110"
            width="160"
            height="120"
            stroke="rgba(212,175,55,0.1)"
            strokeWidth="0.7"
            strokeDasharray="5 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: 1.5, ease: "easeInOut" }}
          />
          {/* Question mark in missing room */}
          <motion.text
            x="420"
            y="178"
            textAnchor="middle"
            fill="rgba(212,175,55,0.12)"
            fontSize="42"
            fontWeight="300"
            fontFamily="sans-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.8 }}
          >
            ?
          </motion.text>
          {/* Corridor */}
          <motion.line
            x1="280"
            y1="110"
            x2="340"
            y2="110"
            stroke="rgba(212,175,55,0.1)"
            strokeWidth="0.6"
            strokeDasharray="4 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 2.0 }}
          />
          <motion.line
            x1="280"
            y1="230"
            x2="340"
            y2="230"
            stroke="rgba(212,175,55,0.1)"
            strokeWidth="0.6"
            strokeDasharray="4 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 2.1 }}
          />
          {/* Dimension line bottom */}
          <motion.line
            x1="80"
            y1="370"
            x2="560"
            y2="370"
            stroke="rgba(212,175,55,0.1)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 2.3 }}
          />
          <motion.line
            x1="80"
            y1="365"
            x2="80"
            y2="375"
            stroke="rgba(212,175,55,0.1)"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.9 }}
          />
          <motion.line
            x1="560"
            y1="365"
            x2="560"
            y2="375"
            stroke="rgba(212,175,55,0.1)"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.9 }}
          />
        </svg>
      </motion.div>

      {/* ── Main content ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center max-w-md w-full"
      >
        {/* Overline */}
        <motion.p
          variants={item}
          className="text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.32em] mb-5 font-manrope"
        >
          Error · 404
        </motion.p>

        {/* Heading */}
        <motion.h1
          variants={item}
          className="font-primary font-bold text-4xl sm:text-5xl text-white leading-tight tracking-tight mb-4"
        >
          Page not found
        </motion.h1>

        {/* Gold rule */}
        <motion.div
          variants={item}
          className="mx-auto mb-5 h-px w-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, #D4AF37, transparent)",
          }}
        />

        {/* Description */}
        <motion.p
          variants={item}
          className="text-white/40 text-sm sm:text-base font-manrope leading-relaxed mb-10"
        >
          This space is missing from our blueprint. The page you&apos;re
          looking for may have been moved or doesn&apos;t exist.
        </motion.p>

        {/* Action links */}
        <motion.div variants={item} className="flex flex-col gap-2.5">
          {LINKS.map(({ Icon, label, desc, href }) => (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 border border-white/[0.07] hover:border-[#D4AF37]/30 cursor-pointer transition-colors duration-200 group text-left"
                style={{ background: "rgba(255,255,255,0.015)" }}
              >
                <div className="w-9 h-9 border border-white/10 group-hover:border-[#D4AF37]/50 flex items-center justify-center shrink-0 transition-colors">
                  <Icon
                    className="w-4 h-4 text-white/45 group-hover:text-[#D4AF37] transition-colors"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-manrope font-semibold text-white text-sm">
                    {label}
                  </p>
                  <p className="text-white/35 text-xs font-manrope mt-0.5">
                    {desc}
                  </p>
                </div>
                <ArrowRight
                  className="w-4 h-4 text-white/15 group-hover:text-white/45 group-hover:translate-x-1 transition-all duration-200 shrink-0"
                />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
