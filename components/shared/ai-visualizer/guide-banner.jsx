"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const STEP_TRAIL = [
  "Sign Up",
  "Pick Plan",
  "Log In",
  "Create Design",
  "Choose Style",
  "Upload Photo",
  "Generate",
  "Download",
  "Share",
];

export default function ZioraGuideBanner() {
  return (
    <section
      className="relative overflow-hidden border-y"
      style={{ background: "#060503", borderColor: "rgba(212,175,55,0.12)" }}
    >
      {/* Gold top hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-20 justify-between"
        >
          {/* Left */}
          <div className="flex items-start gap-5 sm:gap-8 flex-1 min-w-0">
            {/* Ghost "9" */}
            <div
              aria-hidden
              className="hidden sm:block shrink-0 select-none leading-none"
              style={{ opacity: 0.04 }}
            >
              <span
                className="font-poppins font-extrabold text-white"
                style={{ fontSize: "clamp(90px, 12vw, 160px)" }}
              >
                9
              </span>
            </div>

            <div>
              <span
                className="block text-[10px] font-bold tracking-[0.42em] uppercase font-manrope mb-4"
                style={{ color: "rgba(212,175,55,0.65)" }}
              >
                Step-by-Step User Guide
              </span>
              <h3
                className="font-poppins font-extrabold text-white leading-[1.08] mb-4"
                style={{ fontSize: "clamp(24px, 3.2vw, 44px)" }}
              >
                New to Ziora AI?<br />
                <span className="text-[#D4AF37]">9 steps to your first design.</span>
              </h3>
              <p className="text-white/40 text-sm sm:text-[15px] leading-relaxed max-w-xl mb-6">
                From creating your account and picking a plan, to uploading a room photo,
                generating your design, and downloading the result — every step shown with real screenshots.
              </p>

              {/* Step trail */}
              <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
                {STEP_TRAIL.map((s, i) => (
                  <span key={s} className="flex items-center gap-1">
                    <span
                      className="text-[9px] font-bold font-manrope"
                      style={{ color: "rgba(212,175,55,0.45)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[12px] text-white/35 font-manrope">{s}</span>
                    {i < STEP_TRAIL.length - 1 && (
                      <ArrowRight size={9} className="text-white/15 mx-0.5" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="shrink-0 flex flex-col items-start lg:items-end gap-3">
            <Link href="/ziora/guide" className="btn-gold px-10 py-4">
              Read the Full Guide <ArrowRight size={14} />
            </Link>
            <p
              className="text-[11px] font-manrope"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              9 steps · Free · Real screenshots
            </p>
          </div>

        </motion.div>
      </div>

      {/* Gold bottom hairline */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)" }}
      />
    </section>
  );
}
