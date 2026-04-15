"use client";

import Reveal from "@/components/common/reveal";

const STATS = [
  {
    value: "150+",
    label: "PROJECTS DELIVERED",
    description: "Customising spaces, commercial and residential landscapes.",
    valueColor: "text-white",
  },
  {
    value: "Hubs",
    label: "ABUJA & LAGOS",
    description: "Strategically positioned to serve Nigeria's elite clientele.",
    valueColor: "text-[#D4AF37]",
    italic: true,
  },
  {
    value: "N550M+",
    label: "ASSET VALUE MANAGED",
    description: "Significant portfolio performance for discerning investors.",
    valueColor: "text-white",
  },
];

export default function StatsStrip() {
  return (
    <section className="bg-black py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} direction="up" delay={i * 100}>
              <div className="bg-[#111111] border border-white/8 rounded-2xl px-8 py-8 sm:py-10 flex flex-col gap-3">
                {/* Value */}
                <span
                  className={`font-poppins font-bold text-4xl sm:text-5xl leading-none tracking-tight ${stat.valueColor} ${stat.italic ? "italic" : ""}`}
                >
                  {stat.value}
                </span>

                {/* Label */}
                <span className="text-[10px] font-manrope font-semibold tracking-[0.22em] text-white/40 uppercase">
                  {stat.label}
                </span>

                {/* Description */}
                <p className="text-white/30 text-sm font-manrope leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
