"use client";

import { Building2, MapPin, ShieldCheck, Clock } from "lucide-react";
import Reveal from "@/components/common/reveal";

const STATS = [
  { Icon: Building2, value: "700+", label: "Projects Completed" },
  { Icon: MapPin, value: "Abuja & Lagos", label: "We Serve" },
  { Icon: ShieldCheck, value: "Premium Quality", label: "Guaranteed" },
  { Icon: Clock, value: "On-Time Delivery", label: "Always" },
];

export default function TrustStrip() {
  return (
    <section className="bg-[#090909] border-y border-white/5.5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} direction="up" delay={i * 70}>
              <div
                className="flex items-center gap-4 px-5 py-8 sm:py-10"
                style={{
                  borderRight:
                    i < 3 ? "1px solid rgba(255,255,255,0.055)" : "none",
                  borderBottom:
                    i < 2 ? "1px solid rgba(255,255,255,0.055)" : "none",
                }}
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#D4AF37]/[0.07] border border-[#D4AF37]/15 shrink-0">
                  <stat.Icon
                    className="w-4.5 h-4.5 text-[#D4AF37]"
                    strokeWidth={1.5}
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-white font-poppins font-bold text-[17px] sm:text-[19px] leading-tight truncate">
                    {stat.value}
                  </p>
                  <p className="text-white/70 font-manrope text-[10px] sm:text-[11px] uppercase tracking-[0.2em] mt-0.5 leading-tight">
                    {stat.label}
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
