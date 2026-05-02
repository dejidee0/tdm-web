"use client";

import Reveal from "@/components/common/reveal";

const STEPS = [
  {
    number: "01",
    title: "Upload, Book, or Describe",
    description:
      "Upload a room photo, book an inspection, or simply describe your space and goals — we meet you where you are.",
  },
  {
    number: "02",
    title: "Get Concept & Estimate",
    description:
      "Receive an AI-generated design concept, material recommendations, and a transparent project estimate.",
  },
  {
    number: "03",
    title: "Approve Materials & Scope",
    description:
      "Review and confirm your materials, finishes, and full project scope before anything begins.",
  },
  {
    number: "04",
    title: "TBM Executes & Delivers",
    description:
      "Our on-ground team takes over — building, finishing, and handing over your completed space on time.",
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-black py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        {/* Label + heading */}
        <Reveal direction="up">
          <p className="text-[#D4AF37] text-[10px] font-manrope font-semibold tracking-[0.3em] uppercase mb-4">
            How It Works
          </p>
        </Reveal>

        <Reveal direction="up" delay={80}>
          <h2 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-16 sm:mb-20">
            How TBM Works
          </h2>
        </Reveal>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} direction="up" delay={i * 100}>
              <div className="bg-card rounded-2xl p-7 sm:p-8 flex flex-col gap-5 h-full">
                {/* Number */}
                <span className="font-poppins font-bold text-5xl sm:text-6xl leading-none text-white/15 tracking-tight select-none">
                  {step.number}
                </span>

                {/* Title */}
                <h3 className="font-manrope font-bold text-[17px] text-white leading-snug">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-white/40 text-sm font-manrope leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
