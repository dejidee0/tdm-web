"use client";

import Image from "next/image";
import Link from "next/link";
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

        {/* Title */}
        <Reveal direction="up">
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-white text-center mb-12 sm:mb-16">
            Material{" "}
            <span className="text-white/40">(Bogat)</span>
          </h2>
        </Reveal>

        {/* 3×2 image grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-12 sm:mb-16">
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
            <Link
              href="/materials"
              className="inline-flex items-center border border-white/30 text-white font-manrope font-medium text-[13px] tracking-[0.18em] uppercase px-10 py-4 hover:border-white/60 hover:bg-white/5 transition-all duration-200"
            >
              View More
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
