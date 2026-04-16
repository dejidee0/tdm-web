"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Hammer,
  HardHat,
  Sofa,
  LayoutGrid,
  ClipboardList,
  Building2,
} from "lucide-react";
import Reveal from "@/components/common/reveal";

const SERVICES = [
  { Icon: Hammer, label: "Construction" },
  { Icon: HardHat, label: "Renovation" },
  { Icon: Sofa, label: "Interior Design" },
  { Icon: LayoutGrid, label: "Interior Design" },
  { Icon: ClipboardList, label: "Project Management" },
  { Icon: Building2, label: "Commercial Build" },
];

export default function ServicesSection() {
  return (
    <section className="bg-black py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Section title */}
        <Reveal direction="up">
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-white mb-12 sm:mb-16">
            Our Services
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">
          {/* Left — 3×2 service cards grid */}
          <div className="grid grid-cols-3 gap-4">
            {SERVICES.map(({ Icon, label }, i) => (
              <Reveal key={`${label}-${i}`} direction="up" delay={i * 60}>
                <Link
                  href="/services"
                  className="group flex flex-col items-center gap-4 bg-card rounded-2xl p-6 sm:p-8 hover:border hover:border-[#D4AF37]/30 border border-transparent transition-all duration-300"
                >
                  {/* Icon container */}
                  <span className="flex items-center justify-center w-14 h-14 rounded-xl bg-black/50 group-hover:bg-[#D4AF37]/10 transition-colors duration-300">
                    <Icon
                      className="w-6 h-6 text-[#D4AF37]"
                      strokeWidth={1.5}
                    />
                  </span>
                  {/* Label */}
                  <span className="text-white text-sm font-manrope font-medium text-center leading-snug">
                    {label}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Right — tall photo */}
          <Reveal direction="right" delay={150}>
            <div className="relative rounded-2xl overflow-hidden h-80 lg:h-full min-h-80 bg-card">
              <Image
                src="/hero/services.jpg"
                alt="TBM Services"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
