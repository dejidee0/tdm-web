"use client";

import Image from "next/image";
import Link from "next/link";
import { Layers, Sparkles, Cpu, Diamond, ArrowRight } from "lucide-react";

const TRUST_CHIPS = [
  { Icon: Layers, label: "Design Excellence" },
  { Icon: Sparkles, label: "Luxury Renovation" },
  { Icon: Cpu, label: "Smart Construction" },
  { Icon: Diamond, label: "Premium Finishes" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black flex items-center overflow-hidden">
      {/* ── Right column — luxury image (desktop) ─────────────────── */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-[50%]">
        <div className="relative h-full w-full">
          {/* <Image
            src="/hero/re-imagine.png"
            alt="Luxury interior by TBM Building Services"
            fill
            priority
            className="object-cover object-center"
          /> */}
          <video className="object-cover object-center w-full h-full" src={"/hero/videos/2.mp4"} controls autoPlay muted loop playsInline>
            {/* <source src="/hero/videos/2.mp4" type="video/mp4" /> */}
          </video>
          {/* Left bleed — fades image into the black text column */}
          <div className="absolute inset-y-0 left-0 w-48 bg-linear-to-r from-black to-transparent" />
          {/* Subtle dark overlay for richness */}
          <div className="absolute inset-0 bg-black/25" />
          {/* Bottom fade into stats bar */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-black to-transparent" />
        </div>
      </div>

      {/* ── Mobile background image ───────────────────────────────── */}
      <div className="lg:hidden absolute inset-0">
        {/* <Image
          src="/hero/re-imagine.png"
          alt="Luxury interior"
          fill
          priority
          className="object-cover object-center opacity-20"
        /> */}
         <video className="object-cover object-center w-full h-full" src={"/hero/videos/2.mp4"} controls autoPlay muted loop playsInline></video>
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-black" />
      </div>

      {/* ── Content column (left) ─────────────────────────────────── */}
      <div className="relative z-10 w-full lg:w-[55%] xl:w-[52%]">
        <div className="w-full mx-auto lg:mx-0 px-6 sm:px-10 lg:pl-16 xl:pl-20 2xl:pl-28 pt-32 pb-24 sm:pt-36 sm:pb-28 ">
          {/* Eyebrow */}
          <p className="text-[#D4AF37] text-18 font-manrope font-bold tracking-[0.38em] uppercase mb-5 hero-badge">
            Contractor Abuja &amp; Lagos
          </p>

          {/* Headline */}
          <h1 className="font-poppins font-bold leading-[1.2] tracking-tight mb-6 hero-heading">
            <span className="block text-white text-[34px] sm:text-[52px] lg:text-[52px] xl:text-[58px]">
              Luxury Renovation &amp;
            </span>
            <span className="block text-[34px] sm:text-[52px] lg:text-[54px] xl:text-[62px]">
              <span className="text-[#D4AF37]">Smart</span>
              <span className="text-white"> Construction</span>
            </span>
            <span className="block text-white text-[34px] sm:text-[52px] lg:text-[54px] xl:text-[62px]">
              Experts
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/50 text-[14px] sm:text-[18px] font-manrope leading-normal mb-8 max-w-[85%] hero-sub">
            We design, visualize, and build premium homes using Ziora — our 3D
            design and project estimation system.
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-x-4 gap-y-3 mb-10 hero-sub ">
            {TRUST_CHIPS.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full shrink-0">
                  <Icon className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.6} />
                </span>
                <span className="text-white/55 text-[16px] font-manrope font-medium max-w-28">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 hero-ctas">
            <Link
              href="/ai-visualizer"
              className="flex items-center justify-center gap-2  bg-[#D4AF37] px-7 py-3.5 text-black font-poppings font-bold text-[14px] tracking-[0.12em] uppercase hover:bg-primary transition-colors duration-200"
            >
              Start with Ziora <ArrowRight size={14} />
            </Link>
            <Link
              href="/project"
              className="flex items-center justify-center border border-white/18 px-7 py-3.5 text-white/80 font-manrope font-semibold text-[14px] tracking-[0.22em] uppercase text-center hover:border-primary hover:text-white hover:bg-white/4 transition-all duration-200"
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
