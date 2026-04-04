"use client";

import React from "react";
import { MapPin, Package, Cpu, HardHat, Zap, HeadphonesIcon } from "lucide-react";

const ITEMS = [
  { icon: MapPin,           label: "Abuja & Lagos Projects" },
  { icon: Package,          label: "Premium Materials" },
  { icon: Cpu,              label: "AI Visualization" },
  { icon: HardHat,          label: "Expert Execution" },
  { icon: Zap,              label: "Fast Project Delivery" },
  { icon: HeadphonesIcon,   label: "After-Sales Support" },
];

// Duplicate so the seam is invisible during the loop
const TRACK = [...ITEMS, ...ITEMS];

export default function TrustStrip() {
  return (
    <section className="bg-[#0A0A0A] py-4 overflow-hidden border-b border-white/5">
      <div
        className="flex w-max animate-marquee whitespace-nowrap"
        style={{ "--marquee-speed": "32s" }}
      >
        {TRACK.map((item, i) => {
          const Icon = item.icon;
          return (
            <span
              key={i}
              className="inline-flex items-center gap-2.5 text-white/70 px-10"
            >
              <Icon className="w-3.5 h-3.5 text-gold shrink-0" strokeWidth={1.8} />
              <span className="text-xs font-manrope font-medium tracking-[0.15em] uppercase">
                {item.label}
              </span>
              <span className="ml-10 w-px h-3 bg-white/15 shrink-0" />
            </span>
          );
        })}
      </div>
    </section>
  );
}
