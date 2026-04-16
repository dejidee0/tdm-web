"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import Reveal from "@/components/common/reveal";

export default function ZioraSection() {
  return (
    <section className="bg-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* ── Outer rounded card with subtle 1px border ─────────────── */}
      <div
        className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden"
        style={{
          background: "#0d0b08",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* ── Glow: tight warm radial centred on the device side ─────
            Starts bright gold at the device, fades left naturally.
            Does NOT spread across the full card — left stays dark.   */}
        {/* Ambient warm glow — wide, soft, stays right of center */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 120% at 74% 50%, rgba(212,175,55,0.50) 0%, rgba(212,175,55,0.20) 30%, rgba(212,175,55,0.07) 55%, rgba(13,11,8,0) 70%)",
          }}
        />

        {/* ── Content grid ─────────────────────────────────────────── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[44%_56%] items-center">

          {/* ── LEFT: text ───────────────────────────────────────── */}
          <div className="px-12 py-14 sm:py-16 flex flex-col gap-5">

            <Reveal direction="left">
              <h2 className="font-poppins font-bold" style={{ lineHeight: 1.2 }}>
                <span className="block text-white   text-[26px] sm:text-[28px]">Ziora AI:</span>
                <span className="block text-[#D4AF37] text-[26px] sm:text-[28px]">See Before You</span>
                <span className="block text-[#D4AF37] text-[26px] sm:text-[28px]">Build.</span>
              </h2>
            </Reveal>

            <Reveal direction="left" delay={100}>
              <p
                className="text-white/45 text-[13px] font-manrope leading-relaxed"
                style={{ maxWidth: "255px" }}
              >
                Our exclusive Ziora Visualizer uses advanced
                generative AI to turn your abstract desires into
                photorealistic 4K environments in seconds. Skip the
                guesswork.
              </p>
            </Reveal>

            <Reveal direction="left" delay={180}>
              <Link href="/ai-visualizer" className="btn-gold gap-2.5 self-start">
                Launch Visualizer
                <Zap className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
              </Link>
            </Reveal>
          </div>

          {/* ── RIGHT: 3-D tablet ─────────────────────────────────── */}
          <div className="relative flex items-center justify-center px-8 py-10 lg:py-14">

            {/* Tight circular bloom directly behind the device */}
            <div
              className="pointer-events-none absolute"
              style={{
                width: "360px",
                height: "360px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0.15) 45%, rgba(13,11,8,0) 68%)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 0,
              }}
            />

            {/* Tablet frame */}
            <div
              className="relative z-10 w-full"
              style={{
                maxWidth: "370px",
                /* 3-D perspective tilt — right side slightly forward */
                transform: "perspective(1000px) rotateY(-18deg) rotateX(3deg)",
                transformOrigin: "center center",
                /* bezel */
                background: "#181818",
                borderRadius: "28px",
                padding: "20px 20px 24px",
                /* shadows */
                boxShadow:
                  "0 0 0 1.5px rgba(255,255,255,0.08)," +
                  "inset 0 0 0 1px rgba(255,255,255,0.03)," +
                  "0 40px 80px rgba(0,0,0,0.9)," +
                  "0 0 60px rgba(212,175,55,0.20)",
              }}
            >
              {/* Camera / front-facing sensor dot */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#2c2c2c",
                  }}
                />
              </div>

              {/* Screen */}
              <div
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  aspectRatio: "4 / 3",
                  position: "relative",
                  background: "#0a0a0a",
                }}
              >
                <Image
                  src="/hero/hero.png"
                  alt="Ziora AI — photorealistic interior visualization"
                  fill
                  className="object-cover"
                />
                {/* Top-left screen glare */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Home indicator bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "12px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: "38px",
                    height: "4px",
                    borderRadius: "4px",
                    background: "#272727",
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
