"use client";

import { useRef, useState } from "react";
import Link from "next/link";

const VIDEOS = ["/hero/videos/3.mp4", "/hero/videos/2.mp4"];
const CROSSFADE_S = 1.5;

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  const switchingRef = useRef(false);
  const videoRefs = useRef([]);

  const switchTo = (next) => {
    if (switchingRef.current) return;
    switchingRef.current = true;
    activeRef.current = next;
    setActiveIndex(next);
    const nextVid = videoRefs.current[next];
    if (nextVid) {
      nextVid.currentTime = 0;
      nextVid.play().catch(() => {});
    }
    setTimeout(() => { switchingRef.current = false; }, CROSSFADE_S * 1000);
  };

  const handleTimeUpdate = (i) => {
    if (activeRef.current !== i || switchingRef.current) return;
    const vid = videoRefs.current[i];
    if (!vid || !vid.duration) return;
    if (vid.duration - vid.currentTime < CROSSFADE_S) {
      switchTo((i + 1) % VIDEOS.length);
    }
  };

  return (
    <section className="relative min-h-screen bg-black flex items-center overflow-hidden">
      {/* ── Background videos (crossfade) ─────────────────────────── */}
      <div className="absolute inset-0">
        {VIDEOS.map((src, i) => (
          <video
            key={src}
            ref={(el) => { videoRefs.current[i] = el; }}
            autoPlay={i === 0}
            muted
            playsInline
            preload="auto"
            onTimeUpdate={() => handleTimeUpdate(i)}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1500 ease-in-out ${
              activeIndex === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}

        {/* Primary dark veil */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Left-to-right vignette — keeps text readable */}
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-transparent" />

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-black to-transparent" />
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-24 sm:pt-36 sm:pb-32">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Heading */}
          <h1 className="font-poppins font-bold leading-[1.12] tracking-tight mb-5 hero-heading">
            <span className="block text-white text-[34px] sm:text-[60px] lg:text-[76px] xl:text-[88px]">
              Design Digitally,
            </span>
            <span className="block text-[#D4AF37] text-[34px] sm:text-[60px] lg:text-[76px] xl:text-[88px]">
              Build Reality.
            </span>
          </h1>

          {/* Subtitle — small, muted, two lines */}
          <p className="text-white/50 text-[13px] sm:text-sm font-manrope leading-relaxed mb-9 max-w-xs sm:max-w-sm hero-sub">
            TBM Digital orchestrates high-end architectural journeys from
            AI-driven concepts to precision-built physical luxury.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 hero-ctas">
            {/* Primary — solid gold gradient fill, slightly rounded */}
            <Link
              href="/contact?type=consultation"
              className="flex items-center justify-center rounded-xl bg-linear-to-br from-[#D4AF37] to-gold-dim px-8 py-4 text-black font-manrope font-semibold text-[11px] tracking-[0.2em] uppercase whitespace-nowrap hover:opacity-90 transition-opacity duration-200"
            >
              Start Your Project
            </Link>

            {/* Secondary — dark fill, gold gradient border, slightly rounded */}
            <Link
              href="/project"
              className="relative inline-flex rounded-xl p-px bg-linear-to-br from-[#D4AF37] to-gold-dim hover:opacity-90 transition-opacity duration-200"
            >
              <span className="flex items-center justify-center rounded-[11px] bg-[#0d0d0d] px-8 py-4 text-[#D4AF37] font-manrope font-semibold text-[11px] tracking-[0.2em] uppercase whitespace-nowrap w-full">
                View Portfolio
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
