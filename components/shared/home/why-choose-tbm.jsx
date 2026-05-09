"use client";

import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { Star } from "lucide-react";
import Reveal from "@/components/common/reveal";

const REASONS = [
  "Luxury is our standard",
  "Transparent process, no surprises",
  "Top-quality materials & finishes",
  "On-time project delivery",
  "Limited projects for maximum attention",
];

const TESTIMONIALS = [
  {
    quote:
      "TBM turned our outdated home into a masterpiece. Their attention to detail and professionalism is unmatched.",
    name: "Mrs. Aisha Ibrahim",
    title: "Asokoro, Abuja",
  },
  {
    quote:
      "The transition from the digital render to the final site was indistinguishable. Material quality is unparalleled.",
    name: "Chiamaka O.",
    title: "Principal, O. Living",
  },
  {
    quote:
      "Their methodical approach removed all the anxiety usually associated with high-end construction.",
    name: "Dr. Marcus T.",
    title: "Property Developer, Lagos",
  },
];

export default function WhyChooseTBM() {
  return (
    <section className="bg-black py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        {/* ── Top row: 3-column grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 mb-20 sm:mb-24">

          {/* Left — Why Choose TBM */}
          <Reveal direction="up">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[#D4AF37] text-[10px] font-manrope font-bold tracking-[0.32em] uppercase mb-3">
                  Our Promise
                </p>
                <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-white leading-snug">
                  Why Choose TBM
                </h2>
              </div>
              <ul className="flex flex-col gap-3.5">
                {REASONS.map((r) => (
                  <li key={r} className="flex items-center gap-3">
                    <CheckCircle2
                      className="w-4.5 h-4.5 text-[#D4AF37] shrink-0"
                      strokeWidth={1.8}
                    />
                    <span className="text-white/65 text-[14px] font-manrope">
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Centre — Featured testimonial quote */}
          <Reveal direction="up" delay={80}>
            <div
              className="rounded-2xl p-7 sm:p-8 flex flex-col gap-5 h-full"
              style={{
                background: "#111110",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]"
                    strokeWidth={0}
                  />
                ))}
              </div>

              {/* Opening mark */}
              <span
                className="font-poppins text-[#D4AF37]/30 leading-none select-none"
                style={{ fontSize: 72, lineHeight: 0.8 }}
                aria-hidden
              >
                "
              </span>

              <p className="text-white/75 text-[15px] font-manrope leading-[1.75] flex-1 -mt-2">
                {TESTIMONIALS[0].quote}
              </p>

              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-white text-[14px] font-manrope font-semibold leading-tight">
                  {TESTIMONIALS[0].name}
                </p>
                <p className="text-[#D4AF37] text-[11px] font-manrope tracking-[0.14em] uppercase mt-1">
                  {TESTIMONIALS[0].title}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right — Final CTA block */}
          <Reveal direction="up" delay={140}>
            <div
              className="rounded-2xl p-7 sm:p-8 flex flex-col justify-between gap-8 h-full"
              style={{
                background: "linear-gradient(145deg, #111110 0%, #0d0b08 100%)",
                border: "1px solid rgba(212,175,55,0.14)",
              }}
            >
              <div>
                <p className="font-poppins font-bold text-[22px] sm:text-[24px] text-white leading-[1.25] mb-3">
                  Build Smarter.<br />
                  Build Luxury.<br />
                  <span className="text-[#D4AF37]">Build with TBM.</span>
                </p>
                <p className="text-white/40 text-[13px] font-manrope leading-relaxed">
                  Start with Ziora or speak with our team to begin your project.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/ziora"
                  className="btn-gold gap-2"
                >
                  Start with Ziora
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="https://wa.me/2348107524643"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-xl border border-white/14 px-6 py-3.5 text-white/70 font-manrope font-semibold text-[11px] tracking-[0.2em] uppercase hover:border-white/28 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                >
                  {/* WhatsApp icon */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Bottom row: remaining testimonials ───────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.slice(1).map((t, i) => (
            <Reveal key={t.name} direction="up" delay={i * 100}>
              <div
                className="rounded-2xl p-6 sm:p-7 flex flex-col gap-4"
                style={{
                  background: "#0e0e0e",
                  border: "1px solid rgba(255,255,255,0.055)",
                }}
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="text-white/65 text-[14px] font-manrope leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-white text-[13px] font-manrope font-semibold">{t.name}</p>
                  <p className="text-[#D4AF37] text-[10px] font-manrope tracking-[0.14em] uppercase mt-0.5">
                    {t.title}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
