"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/common/reveal";

const PROJECTS = [
  {
    label: "Bathroom Renovation",
    before: "/hero/before.jpg",
    after: "/product-3.jpg",
  },
  {
    label: "Kitchen Remodeling",
    before: "/hero/before.jpg",
    after: "/product-1.jpg",
  },
  {
    label: "Living Room Renovation",
    before: "/hero/before.jpg",
    after: "/hero/after.png",
  },
  {
    label: "Full Build Construction",
    before: "/hero/before.jpg",
    after: "/product-4.png",
  },
];

function BeforeAfterCard({ label, before, after, delay }) {
  return (
    <Reveal direction="up" delay={delay}>
      <div
        className="group relative overflow-hidden rounded-2xl bg-card"
        style={{ aspectRatio: "7/5" }}
      >
        {/* After — full background */}
        <Image
          src={after}
          alt={`${label} — after`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Before — clipped to left half via inline clip-path */}
        <div
          className="absolute inset-0 transition-all duration-700 group-hover:[clip-path:inset(0_55%_0_0)]"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        >
          <Image
            src={before}
            alt={`${label} — before`}
            fill
            className="object-cover"
          />
          {/* Slight desaturate overlay on before side */}
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Centre divider line */}
        <div
          className="absolute inset-y-0 pointer-events-none transition-all duration-700 group-hover:left-[45%]"
          style={{
            left: "50%",
            width: "1.5px",
            background: "rgba(255,255,255,0.55)",
            transform: "translateX(-50%)",
          }}
        />
        {/* Divider handle */}
        <div
          className="absolute top-1/2 pointer-events-none flex items-center justify-center transition-all duration-700 group-hover:left-[45%]"
          style={{
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#000",
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            ⇔
          </span>
        </div>

        {/* Labels: BEFORE / AFTER */}
        <span className="absolute top-3.5 left-3.5 text-white/80 text-[9px] font-manrope font-bold tracking-[0.28em] uppercase bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
          Before
        </span>
        <span className="absolute top-3.5 right-3.5 text-white/80 text-[9px] font-manrope font-bold tracking-[0.28em] uppercase bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
          After
        </span>

        {/* Bottom label */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
          <p className="text-white text-[12px] font-manrope font-semibold tracking-wide uppercase text-center">
            {label}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export default function TransformationSection() {
  return (
    <section className="bg-black py-20 sm:py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-14">
          <div>
            <Reveal direction="up">
              <p className="text-[#D4AF37] text-[10px] font-manrope font-extrabold tracking-[0.32em] uppercase mb-3">
                Real Transformations
              </p>
            </Reveal>
            <Reveal direction="up" delay={60}>
              <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
                Before &amp; After Projects
              </h2>
            </Reveal>
          </div>
          <Reveal direction="up" delay={80}>
            <Link
              href="/project"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[12px] font-manrope font-semibold tracking-[0.18em] uppercase shrink-0"
            >
              View All Projects
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Reveal>
        </div>

        {/* 4-column before/after grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {PROJECTS.map((p, i) => (
            <BeforeAfterCard key={p.label} {...p} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  );
}
