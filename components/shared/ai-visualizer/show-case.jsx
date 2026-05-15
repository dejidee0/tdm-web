"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderOpen,
  Box,
  FileText,
  Package,
  Lightbulb,
  Settings,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const STYLES = [
  "Modern Luxury",
  "Minimalist",
  "Classic",
  "Contemporary",
  "Industrial",
];

const NAV_ITEMS = [
  { Icon: LayoutDashboard, label: "Dashboard" },
  { Icon: FolderOpen, label: "My Projects" },
  { Icon: Box, label: "3D Designs", active: true },
  { Icon: FileText, label: "Estimates" },
  { Icon: Package, label: "Materials" },
  { Icon: Lightbulb, label: "Inspiration" },
  { Icon: Settings, label: "Settings" },
];

const ESTIMATE_LINES = [
  { label: "Construction", value: "₦ 16,850,000" },
  { label: "Finishing", value: "₦ 6,450,000" },
  { label: "Materials", value: "₦ 4,400,000" },
  { label: "Others", value: "₦ 750,000" },
];

const BULLETS = [
  "Multiple design styles",
  "Custom materials & finishes",
  "Real-time 3D walkthrough",
  "Accurate & transparent pricing",
];

const TOOLBAR = ["Layout", "Style", "Materials", "Lighting", "Decor"];

// ─── Mobile card — self-contained, purpose-built for small screens ────────────
function MobileAppCard({
  selectedStyle,
  setSelectedStyle,
  viewMode,
  setViewMode,
}) {
  return (
    <div
      className="border border-white/08 overflow-hidden"
      style={{ background: "#0d0b08" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-3 py-2.5 border-b border-white/06"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 flex items-center justify-center text-black text-[16px] font-black shrink-0"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)",
            }}
          >
            Z
          </div>
          <span className="text-white text-xs font-bold font-primary tracking-widest">
            ZIORA
          </span>
          <span className="text-[7px] font-bold px-1 py-0.5 border border-gold/40 text-gold leading-none">
            AI
          </span>
        </div>
        {/* 2D / 3D toggle */}
        <div className="flex items-center border border-white/10 overflow-hidden">
          {["2D", "3D"].map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className="px-3 py-1 text-[16px] font-bold transition-colors font-manrope"
              style={
                viewMode === m
                  ? {
                      background:
                        "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)",
                      color: "#000",
                    }
                  : {
                      background: "transparent",
                      color: "rgba(255,255,255,0.30)",
                    }
              }
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Room image with overlaid estimate badge */}
      <div className="relative h-52 sm:h-64">
        <Image
          src="/kitchen.png"
          alt="3D Design Preview"
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay gradient at bottom for legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Floating mini estimate badge */}
        <div
          className="absolute bottom-3 right-3 px-3 py-2 border border-white/10"
          style={{
            background: "rgba(8,7,4,0.92)",
            backdropFilter: "blur(12px)",
          }}
        >
          <p className="text-white/35 text-[8px] uppercase tracking-wider font-manrope mb-0.5">
            Estimate
          </p>
          <p className="text-white text-sm font-extrabold font-primary leading-none">
            ₦ 28.4M
          </p>
        </div>

        {/* Active style badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 border border-gold/30"
          style={{ background: "rgba(8,7,4,0.85)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
          <span className="text-gold text-[16px] font-medium font-manrope">
            {selectedStyle}
          </span>
        </div>
      </div>

      {/* Style chips — horizontal scroll */}
      <div className="border-t border-white/06 px-3 py-2.5">
        <p className="text-white/25 text-[8px] font-bold tracking-[0.18em] uppercase font-manrope mb-2">
          Choose Style
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {STYLES.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`shrink-0 px-3 py-1.5 text-[16px] font-medium font-manrope transition-colors border whitespace-nowrap ${
                selectedStyle === style
                  ? "border-gold/40 text-gold"
                  : "border-white/08 text-white/35"
              }`}
              style={
                selectedStyle === style
                  ? { background: "rgba(212,175,55,0.07)" }
                  : {}
              }
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-around px-3 py-2.5 border-t border-white/06">
        {TOOLBAR.map((t) => (
          <button
            key={t}
            className={`flex flex-col items-center gap-1 text-[9px] font-semibold uppercase tracking-wide transition-colors font-manrope ${
              t === "Style" ? "text-gold" : "text-white/25"
            }`}
          >
            <div
              className={`w-4 h-3 ${t === "Style" ? "bg-gold/20" : "bg-white/05"}`}
            />
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Desktop card — full multi-panel layout ───────────────────────────────────
function DesktopAppCard({
  selectedStyle,
  setSelectedStyle,
  viewMode,
  setViewMode,
}) {
  return (
    <div
      className="border border-white/08 overflow-hidden"
      style={{ background: "#0d0b08" }}
    >
      <div className="flex h-150">
        {/* Panel 1: Left copy */}
        <div
          className="flex flex-col justify-center p-8 xl:p-10 w-64 xl:w-72 shrink-0 border-r border-white/06"
          style={{ background: "rgba(255,255,255,0.015)" }}
        >
          <span className="text-gold text-[9px] font-bold tracking-[0.2em] uppercase block font-manrope mb-4">
            Powered by AI. Designed for You.
          </span>
          <h2 className="font-primary text-2xl xl:text-3xl font-bold text-white tracking-tight leading-tight mb-4">
            Design Your Space,
            <br />
            Your Way
          </h2>
          <p className="text-white/40 text-xs xl:text-sm leading-relaxed mb-6">
            Explore different layouts, styles and finishes. See it in 3D and
            know the cost — all in one place.
          </p>
          <ul className="space-y-2.5 mb-7">
            {BULLETS.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <Check
                  className="w-3.5 h-3.5 text-gold shrink-0"
                  strokeWidth={2.5}
                />
                <span className="text-white/55 text-xs">{b}</span>
              </li>
            ))}
          </ul>
          <Link href="/dashboard/ai-designs" className="btn-gold px-5 py-3">
            Try Ziora Now <ArrowRight size={12} />
          </Link>
        </div>

        {/* Panel 2: App sidebar */}
        <div
          className="flex flex-col w-36 xl:w-40 border-r border-white/06 shrink-0"
          style={{ background: "rgba(255,255,255,0.01)" }}
        >
          <div className="flex items-center gap-1.5 px-4 py-3.5 border-b border-white/06 shrink-0">
            <div
              className="w-5 h-5 flex items-center justify-center text-black text-[16px] font-black"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)",
              }}
            >
              Z
            </div>
            <span className="text-white text-xs font-bold font-primary tracking-widest">
              ZIORA
            </span>
            <span className="text-[7px] font-bold px-1 py-0.5 border border-gold/40 text-gold leading-none">
              AI
            </span>
          </div>
          <nav className="flex flex-col gap-0.5 p-2 flex-1 overflow-hidden">
            {NAV_ITEMS.map(({ Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2 px-2 py-2 cursor-pointer transition-colors ${
                  active ? "text-gold" : "text-white/30 hover:text-white/55"
                }`}
                style={active ? { background: "rgba(212,175,55,0.07)" } : {}}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                <span className="text-[11px] font-medium">{label}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Panel 3: Main canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/06 shrink-0">
            <span className="text-white/25 text-[16px] tracking-widest uppercase font-manrope">
              3D Preview
            </span>
            <div className="flex items-center border border-white/10 overflow-hidden">
              {["2D", "3D"].map((m) => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className="px-3 py-1 text-[16px] font-bold transition-colors font-manrope"
                  style={
                    viewMode === m
                      ? {
                          background:
                            "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)",
                          color: "#000",
                        }
                      : {
                          background: "transparent",
                          color: "rgba(255,255,255,0.28)",
                        }
                  }
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="relative flex-1 min-h-0">
            <Image
              src="/kitchen.png"
              alt="3D Design Preview"
              fill
              className="object-cover"
              sizes="40vw"
            />
          </div>
          <div
            className="flex gap-1.5 p-2 border-t border-white/06 shrink-0"
            style={{ background: "rgba(0,0,0,0.35)" }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`relative w-14 h-10 shrink-0 overflow-hidden border transition-colors ${
                  i === 0 ? "border-gold/60" : "border-white/08"
                }`}
              >
                <Image
                  src="/kitchen.png"
                  alt={`View ${i + 1}`}
                  fill
                  className="object-cover opacity-70"
                  sizes="56px"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-around px-3 py-2.5 border-t border-white/06 shrink-0">
            {TOOLBAR.map((t) => (
              <button
                key={t}
                className={`flex flex-col items-center gap-1 text-[9px] font-semibold uppercase tracking-wide transition-colors font-manrope ${
                  t === "Style"
                    ? "text-gold"
                    : "text-white/22 hover:text-white/45"
                }`}
              >
                <div
                  className={`w-4 h-3.5 ${t === "Style" ? "bg-gold/22" : "bg-white/05"}`}
                />
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Panel 4: Style + Estimate */}
        <div className="hidden xl:flex flex-col w-48 border-l border-white/06 shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-white/06">
            <p className="text-white/22 text-[9px] font-bold tracking-[0.2em] uppercase mb-3 font-manrope">
              Choose Style
            </p>
            {STYLES.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 mb-1 text-[11px] font-medium transition-colors text-left border ${
                  selectedStyle === style
                    ? "border-gold/30 text-gold"
                    : "border-transparent text-white/30 hover:text-white/55"
                }`}
                style={
                  selectedStyle === style
                    ? { background: "rgba(212,175,55,0.06)" }
                    : {}
                }
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${selectedStyle === style ? "bg-gold" : "bg-white/15"}`}
                />
                <span className="font-manrope">{style}</span>
              </button>
            ))}
          </div>
          <div className="p-3">
            <p className="text-white/22 text-[9px] font-bold tracking-[0.2em] uppercase mb-0.5 font-manrope">
              Project Estimate
            </p>
            <p className="text-white/20 text-[8px] font-manrope mb-2">
              Total Estimate
            </p>
            <p className="text-white text-base font-extrabold font-primary mb-3 leading-tight">
              ₦ 28,450,000
            </p>
            <div className="space-y-1.5 mb-3">
              {ESTIMATE_LINES.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-white/30 text-[16px] font-manrope">
                    {label}
                  </span>
                  <span className="text-white/50 text-[16px] font-medium font-manrope">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <button
              className="w-full py-1.5 text-[9px] font-bold tracking-[0.14em] uppercase text-black hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)",
              }}
            >
              View Full Estimate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function AppShowcase() {
  const [selectedStyle, setSelectedStyle] = useState("Modern Luxury");
  const [viewMode, setViewMode] = useState("3D");

  const sharedProps = {
    selectedStyle,
    setSelectedStyle,
    viewMode,
    setViewMode,
  };

  return (
    <section
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 font-manrope"
      style={{ background: "#060503" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Mobile layout (< lg) ── */}
        <div className="lg:hidden space-y-6">
          {/* Copy block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span className="text-gold text-[9px] font-bold tracking-[0.2em] uppercase block font-manrope">
              Powered by AI. Designed for You.
            </span>
            <h2 className="font-primary text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Design Your Space, Your Way
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Explore different layouts, styles and finishes. See it in 3D and
              know the cost — all in one place.
            </p>
            <ul className="space-y-2.5">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <Check
                    className="w-3.5 h-3.5 text-gold shrink-0"
                    strokeWidth={2.5}
                  />
                  <span className="text-white/55 text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* App card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <MobileAppCard {...sharedProps} />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/dashboard/ai-designs" className="btn-gold px-6 py-3.5">
              <Sparkles size={14} />
              Try Ziora Now
            </Link>
          </motion.div>
        </div>

        {/* ── Desktop layout (lg+) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="hidden lg:block"
        >
          <DesktopAppCard {...sharedProps} />
        </motion.div>
      </div>
    </section>
  );
}
