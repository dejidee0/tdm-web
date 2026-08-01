"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/common/reveal";
import BeforeAfter from "@/components/common/before-after";

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

/* ─────────────────────────────────────────────────────────────────────────
   Section wrapper
───────────────────────────────────────────────────────────────────────── */
export default function TransformationSection() {
  return (
    <section className="bg-black py-20 sm:py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-14">
          <div>
            <Reveal direction="up">
              <p className="text-[#D4AF37] text-[16px] font-manrope font-extrabold tracking-[0.32em] uppercase mb-3">
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

        {/* 4-column grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {PROJECTS.map((p, i) => (
            <BeforeAfter key={p.label} {...p} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  );
}
