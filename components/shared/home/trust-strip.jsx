"use client";

import Reveal from "@/components/common/reveal";

const PILLARS = [
  {
    label: "Abuja & Lagos Projects",
    description: "On-the-ground execution teams in both cities.",
  },
  {
    label: "Premium Materials",
    description: "Curated Bogat collection for every finish and budget.",
  },
  {
    label: "AI Visualization",
    description: "See your space redesigned before a single tile is laid.",
  },
  {
    label: "Expert Execution",
    description: "Master craftsmen with proven project track records.",
  },
  {
    label: "Fast Project Delivery",
    description: "Structured timelines with milestone accountability.",
  },
  {
    label: "After-Sales Support",
    description: "Workmanship warranties and dedicated post-project care.",
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-black py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.label} direction="up" delay={i * 70}>
              <div className="bg-[#111111] border border-white/8 rounded-2xl px-7 py-6 flex flex-col gap-2 min-w-0 overflow-hidden">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                <span className="font-manrope font-bold text-[15px] text-white leading-snug">
                  {pillar.label}
                </span>
                <p className="text-white/35 text-sm font-manrope leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
