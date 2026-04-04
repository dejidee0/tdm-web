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
    <section className="bg-primary py-3.5 overflow-hidden">
      {/*
        The marquee is two identical tracks side by side animated together.
        CSS animation scrolls the whole strip one full "track width" to the left,
        then snaps back — creating a seamless infinite loop.
      */}
      <div
        className="flex w-max animate-marquee whitespace-nowrap"
        style={{ "--marquee-speed": "30s" }}
      >
        {TRACK.map((item, i) => {
          const Icon = item.icon;
          return (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-white px-8"
            >
              <Icon className="w-3.5 h-3.5 text-white/60 shrink-0" strokeWidth={2} />
              <span className="text-xs sm:text-sm font-manrope font-medium tracking-wide">
                {item.label}
              </span>
              {/* Separator dot */}
              <span className="ml-8 w-1 h-1 rounded-full bg-white/25 shrink-0" />
            </span>
          );
        })}
      </div>
    </section>
  );
}
