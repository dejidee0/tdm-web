"use client";

import Image from "next/image";
import Reveal from "@/components/common/reveal";

export default function TransformationSection() {
  return (
    <section className="bg-black py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        {/* Heading */}
        <Reveal direction="up">
          <div className="text-center mb-4">
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
              The TBM{" "}
              <span className="text-[#D4AF37]">Transformation</span>
            </h2>
          </div>
        </Reveal>

        <Reveal direction="up" delay={80}>
          <p className="text-center text-white/40 text-sm sm:text-base font-manrope max-w-xl mx-auto mb-14 sm:mb-18">
            Witness the precision of our construction and interior team as we restore raw structures
            into architectural masterpieces.
          </p>
        </Reveal>

        {/* Before / After images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Before */}
          <Reveal direction="left" delay={100}>
            <div className="relative overflow-hidden rounded-2xl aspect-video bg-card">
              <Image
                src="/site-progress1.svg"
                alt="Before transformation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              {/* Label */}
              <span className="absolute top-4 left-4 text-white/80 text-[10px] font-manrope font-bold tracking-[0.25em] uppercase bg-black/50 px-3 py-1.5 rounded-full">
                Before
              </span>
            </div>
          </Reveal>

          {/* After */}
          <Reveal direction="right" delay={100}>
            <div className="relative overflow-hidden rounded-2xl aspect-video bg-card">
              <Image
                src="/site-progress2.svg"
                alt="After transformation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              {/* Label */}
              <span className="absolute top-4 left-4 text-white/80 text-[10px] font-manrope font-bold tracking-[0.25em] uppercase bg-black/50 px-3 py-1.5 rounded-full">
                After
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
