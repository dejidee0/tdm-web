"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/common/reveal";

const MATERIALS = [
  { src: "/brass.png",   alt: "Brass fixtures" },
  { src: "/matte.png",   alt: "Matte tiles" },
  { src: "/oak.png",     alt: "Oak wood panels" },
  { src: "/pendant.png", alt: "Pendant lighting" },
  { src: "/chair.png",   alt: "Designer chair" },
  { src: "/geo.png",     alt: "Geometric materials" },
];

export default function MaterialsBogatSection() {
  return (
    <section className="bg-black py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        {/* Section label */}
        <Reveal direction="up">
          <p className="text-center text-[#D4AF37] font-manrope text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            Bogat Collection
          </p>
        </Reveal>

        {/* Title */}
        <Reveal direction="up" delay={60}>
          <h2 className="font-poppins font-bold text-4xl sm:text-5xl text-white text-center mb-4">
            Premium{" "}
            <span className="text-[#D4AF37]">Materials</span>
          </h2>
        </Reveal>

        {/* Subtitle */}
        <Reveal direction="up" delay={100}>
          <p className="text-white/45 text-base font-manrope text-center leading-relaxed max-w-md mx-auto mb-12 sm:mb-16">
            Curated finishes and fixtures sourced for quality, longevity, and
            aesthetic precision.
          </p>
        </Reveal>

        {/* 3×2 image grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {MATERIALS.map((mat, i) => (
            <Reveal key={mat.src} direction="scale" delay={i * 60}>
              <div className="relative overflow-hidden rounded-xl aspect-square bg-card group">
                <Image
                  src={mat.src}
                  alt={mat.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-300" />
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal direction="up" delay={80}>
          <div className="flex justify-center">
            <Link href="/materials">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-br from-[#D4AF37] to-[#b8942e] px-10 py-4 text-black font-manrope font-semibold text-[11px] tracking-[0.2em] uppercase hover:opacity-90 transition-opacity duration-200"
              >
                View All Materials
              </motion.button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
