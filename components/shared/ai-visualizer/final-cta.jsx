"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const APP_SCREENSHOT = "/kitchen.png";

const STATS = [
  { Icon: Award, value: "700+", label: "Projects Designed" },
  { Icon: TrendingUp, value: "10,000+", label: "Designs Generated" },
  { Icon: CheckCircle, value: "98%", label: "Estimate Accuracy" },
  { Icon: Clock, value: "~3 min", label: "Avg. Design Time" },
];

// Fixed device dimensions — lets us build real CSS 3D geometry
const DEVICE_W = 440;
const DEVICE_H = 358; // 14 top pad + 309 screen (4:3 of 412px) + 16 home area + 18 bottom pad
const DEVICE_DEPTH = 11; // tablet thickness

function TabletMockup() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 22 });

  // Positive rotateY → left edge comes toward viewer → device FACES RIGHT ✓
  // Mouse adds ±4deg of live parallax around the base 22deg tilt
  const rotateY = useTransform(springX, [-0.5, 0.5], [18, 26]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [-1, -7]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative select-none cursor-default"
      // perspectiveOrigin to the RIGHT: we're "looking" at the device from
      // the right side of the layout, which makes the 22deg right-facing tilt
      // read naturally
      style={{ perspective: "1400px", perspectiveOrigin: "65% 50%" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -inset-20 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 45% 50%, rgba(212,175,55,0.13) 0%, rgba(212,175,55,0.04) 45%, transparent 68%)",
        }}
      />

      {/* ── 3D device assembly ──────────────────────────────────────────────
          Using fixed DEVICE_W × DEVICE_H so sibling faces can use pixel
          coords to line up with the front face perfectly.
          preserve-3d is set here so all direct children share one 3D space.
      ── */}
      <motion.div
        style={{
          rotateY,
          rotateX,
          transformStyle: "preserve-3d",
          width: DEVICE_W,
          height: DEVICE_H,
          position: "relative",
        }}
      >
        {/* ── FRONT FACE ─────────────────────────────────────────────────── */}
        {/* Chassis gradient is lighter on the left (left edge faces viewer) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "1.75rem",
            padding: "14px 14px 18px",
            background:
              "linear-gradient(to right, #424242 0%, #2a2a2a 55%, #1c1c1c 100%)",
            // Shadow direction: cast to the RIGHT because the left side is
            // the leading face toward the viewer / light source
            boxShadow: [
              "16px 48px 130px rgba(0,0,0,0.95)",
              "6px 12px 36px rgba(0,0,0,0.7)",
              "0 0 0 1px rgba(212,175,55,0.10)",
              "inset 0 1px 0 rgba(255,255,255,0.10)",
              "inset 0 -1px 0 rgba(0,0,0,0.65)",
            ].join(", "),
          }}
        >
          {/* Camera */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full"
            style={{ width: "6px", height: "6px", background: "#222" }}
          />

          {/* Screen */}
          <div
            className="rounded-[1.1rem] overflow-hidden"
            style={{
              aspectRatio: "4 / 3",
              background: "#000",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.9)",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={APP_SCREENSHOT}
                alt="Ziora AI app interface"
                fill
                className="object-cover"
                sizes="440px"
              />
              {/* Glare — top-left light source */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%)",
                }}
              />
              {/* Vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.32) 100%)",
                }}
              />
            </div>
          </div>

          {/* Home bar */}
          <div
            className="mx-auto mt-3 rounded-full"
            style={{ width: "44px", height: "4px", background: "#363636" }}
          />

          {/* Volume buttons — left short edge */}
          {[0, 32].map((offset) => (
            <div
              key={offset}
              className="absolute rounded-r-sm"
              style={{
                left: "-3px",
                top: `calc(28% + ${offset}px)`,
                width: "3px",
                height: "24px",
                background: "#2a2a2a",
              }}
            />
          ))}

          {/* Power button — right edge */}
          <div
            className="absolute rounded-l-sm"
            style={{
              right: "-3px",
              top: "35%",
              width: "3px",
              height: "32px",
              background: "#2a2a2a",
            }}
          />
        </div>

        {/* ── LEFT SIDE FACE ─────────────────────────────────────────────────
            Visible when rotateY > 0 (left edge toward viewer).

            The div sits at left:0 (device's left edge), width = DEVICE_DEPTH.
            transform-origin "left center" places the rotation pivot at the
            device's left edge (x = 0 of the 3D container).
            rotateY(90deg) swings the face from the XY plane to the ZY plane
            at x=0, extending from z=0 (front face) to z=−DEPTH (into screen).
            This is geometrically correct for a tablet left bezel edge.
        ── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "1.75rem",
            width: DEVICE_DEPTH,
            height: DEVICE_H - 56, // inset ~28px each end for the border-radius
            // Gradient: bright at front edge (z=0 = left of original div),
            // dark toward the back (z=−DEPTH = right of original div)
            background: "linear-gradient(to right, #3a3a3a 0%, #181818 100%)",
            transform: "rotateY(90deg)",
            transformOrigin: "left center",
          }}
        />

        {/* ── TOP FACE ───────────────────────────────────────────────────────
            Visible when rotateX < 0 (top edge tilts away / into screen).

            Same logic: pivot at the device top edge, rotateX(90deg) swings
            the face into the correct plane.
        ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "1.75rem",
            width: DEVICE_W - 56,
            height: DEVICE_DEPTH,
            background: "linear-gradient(to bottom, #3e3e3e 0%, #1c1c1c 100%)",
            transform: "rotateX(90deg)",
            transformOrigin: "top center",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function FinalCTA() {
  return (
    <section className="bg-black font-manrope overflow-hidden">
      {/* ── Main CTA block ── */}
      <div
        className="relative border-y border-white/[0.06]"
        style={{ background: "#080705" }}
      >
        {/* Gold hairline top */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-40"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20 py-16 md:py-24">
            {/* ── Text — first on mobile, second on desktop ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="space-y-6 order-first lg:order-last"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <div
                  className="h-px w-8 shrink-0"
                  style={{
                    background:
                      "linear-gradient(to right, #D4AF37, transparent)",
                  }}
                />
                <p className="text-gold text-[11px] font-bold tracking-[0.28em] uppercase font-manrope">
                  Get Started Today
                </p>
              </div>

              <h2 className="font-primary text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white tracking-tight leading-[1.12]">
                Start Designing with{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #D4AF37 0%, #f0d060 50%, #b8962e 100%)",
                  }}
                >
                  Ziora AI
                </span>{" "}
                Today.
              </h2>

              <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                Go from idea to photorealistic 3D design and accurate project
                estimate in under three minutes — no guesswork, no delays.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/dashboard/ai-designs"
                  className="btn-gold px-7 py-3.5"
                >
                  Start Designing Now <ArrowRight size={13} />
                </Link>

                <Link href="/contact" className="btn-outline px-7 py-3.5">
                  <MessageSquare size={13} />
                  Book a Consultation
                </Link>
              </div>

              <p className="text-white/20 text-xs font-manrope pt-1">
                No commitment required &mdash; your first design is free.
              </p>

              <Link
                href="/ziora/guide"
                className="inline-flex items-center gap-2 text-white/30 hover:text-[#D4AF37]/70 text-xs font-manrope transition-colors duration-200 group pt-1"
              >
                <BookOpen size={11} className="shrink-0" />
                New here? Read our 9-step guide with screenshots
                <ArrowRight
                  size={10}
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                />
              </Link>
            </motion.div>

            {/* ── Tablet — second on mobile, first on desktop ── */}
            <div className="flex items-center justify-center lg:justify-start overflow-visible order-last lg:order-first lg:-ml-4">
              {/* Mobile: static simplified version, no full 3D machinery */}
              <div className="lg:hidden">
                <div
                  style={{
                    width: "clamp(260px, 80vw, 340px)",
                    padding: "10px 10px 14px",
                    borderRadius: "1.4rem",
                    background:
                      "linear-gradient(to right, #3a3a3a 0%, #242424 55%, #191919 100%)",
                    boxShadow:
                      "10px 30px 90px rgba(0,0,0,0.9), 0 0 0 1px rgba(212,175,55,0.10)",
                    transform:
                      "perspective(900px) rotateY(15deg) rotateX(-3deg)",
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "4 / 3",
                      borderRadius: "0.9rem",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="relative w-full h-full"
                      style={{ minHeight: "195px" }}
                    >
                      <Image
                        src={APP_SCREENSHOT}
                        alt="Ziora AI"
                        fill
                        className="object-cover"
                        sizes="340px"
                      />
                    </div>
                  </div>
                  <div
                    className="mx-auto mt-2 rounded-full"
                    style={{
                      width: "32px",
                      height: "3px",
                      background: "#383838",
                    }}
                  />
                </div>
              </div>

              {/* Desktop: full 3D interactive version */}
              <div className="hidden lg:block">
                <TabletMockup />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <motion.div
        className="border-t border-white/6"
        style={{ background: "#060503" }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/6">
            {STATS.map(({ Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col items-center justify-center px-6 py-10 text-center gap-2 group"
              >
                <Icon
                  className="w-5 h-5 text-gold/50 group-hover:text-gold/75 transition-colors duration-200"
                  strokeWidth={1.5}
                />
                <span className="text-white text-2xl sm:text-3xl font-extrabold font-primary leading-none">
                  {value}
                </span>
                <span className="text-white/30 text-xs font-manrope tracking-wide">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
