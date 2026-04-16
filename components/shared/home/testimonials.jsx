"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Reveal from "@/components/common/reveal";

const TESTIMONIALS = [
  {
    quote:
      '"TBM Digital didn\'t just build our headquarters; they interpreted our brand values into a structural language. The AI visualizer was a game changer for our board."',
    name: "Adesola K.",
    title: "CEO, ZENITH FRONTIERS",
    avatar: "/avatars/avatar1.png",
  },
  {
    quote:
      '"The transition from the digital render to the final site in Lagos was indistinguishable. Their commitment to material quality is unparalleled."',
    name: "Chiamaka O.",
    title: "PRINCIPAL, O. LIVING",
    avatar: "/avatars/avatar2.png",
  },
  {
    quote:
      '"Their methodical approach removed all the anxiety usually associated with high-end construction. Truly the architects of the digital age."',
    name: "Dr. Marcus T.",
    title: "PROPERTY DEVELOPER",
    avatar: "/avatars/avatar3.png",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-black py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        {/* Heading */}
        <Reveal direction="up">
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-white text-center mb-4">
            Trusted by Visionaries
          </h2>
        </Reveal>

        {/* Stars */}
        <Reveal direction="up" delay={80}>
          <div className="flex justify-center gap-1.5 mb-14 sm:mb-16">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]"
                strokeWidth={0}
              />
            ))}
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} direction="up" delay={i * 100}>
              <div className="bg-card rounded-2xl p-7 sm:p-8 flex flex-col gap-6 h-full">
                {/* Quote */}
                <p className="text-white/70 text-[15px] font-manrope leading-relaxed flex-1 italic">
                  {t.quote}
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#333] shrink-0">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                    {/* Fallback initial */}
                    <span className="absolute inset-0 flex items-center justify-center text-white/60 text-sm font-bold font-manrope">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-[14px] font-manrope font-semibold leading-tight">
                      {t.name}
                    </p>
                    <p className="text-[#D4AF37] text-[11px] font-manrope font-medium tracking-[0.12em] uppercase mt-0.5">
                      {t.title}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
