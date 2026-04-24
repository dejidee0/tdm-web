"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Package, Zap, BarChart3, Truck } from "lucide-react";

// ─── Apple logo ───────────────────────────────────────────────────────────────
function AppleLogo() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

// ─── Google Play logo ─────────────────────────────────────────────────────────
function PlayLogo() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <path d="M3.18 23.76c.37.2.8.21 1.19.03l12.09-6.96-2.59-2.6-10.69 9.53z" fill="#EA4335" />
      <path d="M22.14 10.55 19.1 8.79l-2.92 2.92 2.92 2.92 3.07-1.77c.88-.5.88-1.81-.03-2.31z" fill="#FBBC04" />
      <path d="M3.18.24C2.8.06 2.38.08 2.02.3L13.6 11.88l2.59-2.6L4.37.27C4.01.07 3.57.04 3.18.24z" fill="#4285F4" />
      <path d="M2.02.3C1.4.68 1 1.35 1 2.14v19.72c0 .79.4 1.46 1.02 1.84l11.58-11.58L2.02.3z" fill="#34A853" />
    </svg>
  );
}

// ─── Store badge ──────────────────────────────────────────────────────────────
function StoreBadge({ platform, href = "#" }) {
  const isApple = platform === "apple";
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2, boxShadow: "0 6px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.2)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className="group relative flex items-center gap-3.5 overflow-hidden cursor-pointer"
      style={{
        background: "#0d0b08",
        border: "1px solid rgba(255,255,255,0.11)",
        borderRadius: 13,
        padding: "12px 20px 12px 15px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, transparent 60%)" }}
      />
      <span className="text-white relative z-10 flex-shrink-0">
        {isApple ? <AppleLogo /> : <PlayLogo />}
      </span>
      <span className="relative z-10 flex flex-col leading-none">
        <span className="text-white/45 font-manrope" style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {isApple ? "Download on the" : "Get it on"}
        </span>
        <span className="text-white font-semibold font-manrope tracking-tight mt-0.5" style={{ fontSize: 15 }}>
          {isApple ? "App Store" : "Google Play"}
        </span>
      </span>
    </motion.a>
  );
}

// ─── Feature row ──────────────────────────────────────────────────────────────
function Feature({ icon: Icon, label, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-lg"
        style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}
      >
        <Icon size={13} color="#D4AF37" strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-white text-sm font-semibold font-poppins leading-tight">{label}</p>
        <p className="text-white/35 text-xs font-manrope leading-snug mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

// ─── Phone mockup with chips ──────────────────────────────────────────────────
function PhoneStage() {
  return (
    /*
     * Fixed-size wrapper: wide enough to contain the phone (220px)
     * plus the chips that extend ~80px on each side.
     * This prevents any overflow into adjacent columns.
     */
    <div
      className="relative mx-auto"
      style={{ width: 380, height: 500 }}
    >
      {/* Floor glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 280,
          height: 40,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(212,175,55,0.2) 0%, transparent 70%)",
          filter: "blur(14px)",
        }}
      />

      {/* Screen glow rising from behind phone */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 240,
          height: 300,
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse at 50% 80%, rgba(212,175,55,0.13) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* ── Phone ── */}
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute"
        style={{
          width: 220,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Bezel */}
        <div
          style={{
            width: 220,
            background: "#111010",
            borderRadius: 40,
            padding: "13px 9px 16px",
            boxShadow:
              "0 0 0 1.5px rgba(255,255,255,0.09)," +
              "inset 0 0 0 1px rgba(255,255,255,0.03)," +
              "0 40px 80px rgba(0,0,0,0.9)," +
              "0 0 60px rgba(212,175,55,0.07)",
          }}
        >
          {/* Dynamic island */}
          <div className="flex justify-center mb-2.5">
            <div
              style={{
                width: 76,
                height: 22,
                borderRadius: 18,
                background: "#000",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)",
              }}
            />
          </div>

          {/* Screen */}
          <div
            style={{
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              background: "#0a0a0a",
              aspectRatio: "9/19",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {/* Subtle gold radial glow behind logo */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 90% 35% at 50% 50%, rgba(212,175,55,0.14) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            {/* TBM logo */}
            <Image
              src="/tbm-logo-v2.png"
              alt="TBM"
              width={110}
              height={55}
              className="relative z-10 object-contain opacity-90"
              priority
            />
            {/* Tagline */}
            <p
              className="relative z-10 font-manrope text-center"
              style={{
                fontSize: 8,
                letterSpacing: "0.22em",
                color: "rgba(212,175,55,0.55)",
                textTransform: "uppercase",
              }}
            >
              Design Digitally, Build Reality
            </p>
            {/* Glass glare */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 30%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Home bar */}
          <div className="flex justify-center mt-3">
            <div style={{ width: 80, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.15)" }} />
          </div>
        </div>
      </motion.div>

      {/* ── Chip: top-left ── */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute flex items-center gap-2 pointer-events-none"
        style={{
          top: 60,
          left: 0,
          background: "rgba(8,7,5,0.92)",
          border: "1px solid rgba(212,175,55,0.26)",
          borderRadius: 12,
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          padding: "9px 13px",
          maxWidth: 160,
        }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(212,175,55,0.12)" }}
        >
          <Zap size={12} color="#D4AF37" strokeWidth={2} />
        </div>
        <div>
          <p className="text-white text-[10px] font-semibold font-manrope leading-tight whitespace-nowrap">
            Ziora render complete
          </p>
          <p className="text-white/40 text-[9px] font-manrope leading-tight mt-0.5 whitespace-nowrap">
            Living room · Luxury
          </p>
        </div>
      </motion.div>

      {/* ── Chip: middle-right ── */}
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute flex items-center gap-2 pointer-events-none"
        style={{
          top: "42%",
          right: 0,
          background: "rgba(8,7,5,0.92)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          padding: "9px 13px",
          maxWidth: 152,
        }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <Truck size={12} color="rgba(255,255,255,0.55)" strokeWidth={2} />
        </div>
        <div>
          <p className="text-white text-[10px] font-semibold font-manrope leading-tight whitespace-nowrap">
            Delivery confirmed
          </p>
          <p className="text-white/40 text-[9px] font-manrope leading-tight mt-0.5 whitespace-nowrap">
            Marble tiles · #TBM-3812
          </p>
        </div>
      </motion.div>

      {/* ── Chip: bottom-left ── */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
        className="absolute flex items-center gap-2 pointer-events-none"
        style={{
          bottom: 70,
          left: 8,
          background: "rgba(8,7,5,0.92)",
          border: "1px solid rgba(212,175,55,0.18)",
          borderRadius: 12,
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          padding: "9px 13px",
          maxWidth: 158,
        }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(212,175,55,0.1)" }}
        >
          <BarChart3 size={12} color="#D4AF37" strokeWidth={2} />
        </div>
        <div>
          <p className="text-white text-[10px] font-semibold font-manrope leading-tight whitespace-nowrap">
            On schedule
          </p>
          <p className="text-white/40 text-[9px] font-manrope leading-tight mt-0.5 whitespace-nowrap">
            4 of 7 milestones done
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AppDownloadBanner() {
  return (
    <section className="relative overflow-hidden" style={{ background: "#060504" }}>
      {/* Top border */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.32) 35%, rgba(212,175,55,0.32) 65%, transparent 100%)",
        }}
      />
      {/* Bottom border */}
      <div
        className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" }}
      />

      {/* Spotlight */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: "100%",
          background:
            "radial-gradient(ellipse 60% 70% at 65% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(212,175,55,0.08) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage:
            "radial-gradient(ellipse 65% 80% at 65% 50%, rgba(0,0,0,0.5) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: copy ── */}
          <div className="flex flex-col">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="flex items-center gap-3 mb-6"
            >
              <span
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-manrope font-bold uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  background: "rgba(212,175,55,0.09)",
                  border: "1px solid rgba(212,175,55,0.22)",
                  color: "#D4AF37",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                Now Available
              </span>
              <span className="text-white/25 text-[10px] font-manrope uppercase tracking-[0.15em]">
                iOS & Android
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.68, delay: 0.07 }}
              className="font-poppins font-bold tracking-tight text-white leading-[1.08] mb-5"
              style={{ fontSize: "clamp(36px, 4.5vw, 58px)" }}
            >
              Your Entire Project,{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  backgroundImage: "linear-gradient(110deg, #e8c84a 0%, #D4AF37 50%, #b8962e 100%)",
                }}
              >
                In Your Pocket.
              </span>
            </motion.h2>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.13 }}
              className="text-white/45 font-manrope leading-[1.75] mb-10 max-w-md"
              style={{ fontSize: 15 }}
            >
              Browse materials, visualise spaces with Ziora AI, manage projects,
              and track every delivery — all from one beautifully crafted app.
            </motion.p>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.19 }}
              className="flex flex-col gap-5 mb-10 pb-10"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Feature icon={Zap}      label="Ziora AI Visualizer"   desc="Generate photorealistic room renders from a single photo." />
              <Feature icon={Package}  label="Shop Premium Materials" desc="Full Bogat catalogue with live pricing and stock." />
              <Feature icon={BarChart3} label="Project Dashboard"     desc="Timelines, docs, and site gallery in one place." />
              <Feature icon={Truck}    label="Real-time Delivery"     desc="Track every order from warehouse to site." />
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="flex flex-wrap gap-3 mb-7"
            >
              <StoreBadge platform="apple" />
              <StoreBadge platform="google" />
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill="#D4AF37"
                    stroke="#D4AF37"
                    strokeWidth={1}
                    style={{ opacity: i === 4 ? 0.5 : 1 }}
                  />
                ))}
                <span className="text-white/55 text-xs font-manrope ml-1">4.8</span>
              </div>

              <span className="w-px h-3.5" style={{ background: "rgba(255,255,255,0.1)" }} />

              <span className="text-white/35 text-xs font-manrope">
                <span className="text-white/60 font-semibold">10K+</span> downloads
              </span>

              <span className="w-px h-3.5" style={{ background: "rgba(255,255,255,0.1)" }} />

              <span className="text-white/35 text-xs font-manrope">Free forever</span>
            </motion.div>
          </div>

          {/* ── Right: phone ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center overflow-hidden"
          >
            <div
              className="scale-75 sm:scale-90 lg:scale-100 origin-center shrink-0"
              style={{ width: 380, height: 500 }}
            >
              <PhoneStage />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
