"use client";

import Image from "next/image";
import { FileStack, Settings2, MapPin, ArrowRight } from "lucide-react";
import Reveal from "@/components/common/reveal";

const FEATURES = [
  {
    Icon: FileStack,
    label: "Full Structural Blueprints",
  },
  {
    Icon: Settings2,
    label: "Precision MEP Engineering",
  },
  {
    Icon: MapPin,
    label: "Curation of Fine Materials",
  },
];

export default function ReimagineSection() {
  return (
    <section className="bg-black py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text content */}
          <div>
            <Reveal direction="up">
              <h2 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-[52px] leading-[1.08] tracking-tight text-white mb-6">
                Everything you need
                <br />
                to <span className="text-[#D4AF37]">reimagine</span> your space.
              </h2>
            </Reveal>

            <Reveal direction="up" delay={100}>
              <p className="text-white/45 text-base font-manrope leading-relaxed mb-10 max-w-md">
                We bridge the gap between creative vision and structural
                integrity. Our hybrid approach ensures that what you see in the
                design is exactly what we build on the site.
              </p>
            </Reveal>

            {/* Feature bullets */}
            <ul className="flex flex-col gap-5">
              {FEATURES.map(({ Icon, label }, i) => (
                <Reveal key={label} direction="left" delay={i * 100 + 150}>
                  <li className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-9 h-9 rounded-full border border-[#D4AF37]/40 shrink-0">
                      <Icon
                        className="w-4 h-4 text-[#D4AF37]"
                        strokeWidth={1.6}
                      />
                    </span>
                    <span className="text-white/70 text-[15px] font-manrope font-medium">
                      {label}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Right — image card */}
          <Reveal direction="right" delay={100}>
            <div className="relative rounded-br-[48px] overflow-hidden aspect-4/5 lg:aspect-auto lg:h-135 bg-card">
              <Image
                src="/hero/re-imagine.png"
                alt="The Luxury Transition"
                fill
                className="object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Bottom card label */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                <div>
                  <span className="block text-[#D4AF37] text-[10px] font-manrope font-semibold tracking-[0.25em] uppercase mb-1">
                    Perspective
                  </span>
                  <span className="block text-white text-base font-manrope font-semibold">
                    The Luxury Transition
                  </span>
                </div>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#D4AF37] text-black hover:bg-[#c49e30] transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
