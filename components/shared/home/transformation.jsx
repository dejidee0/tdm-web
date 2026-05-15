"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/common/reveal";

const PROJECTS = [
  {
    label: "Bathroom Renovation",
    before: "/hero/before.jpg",
    after: "/product-3.jpg",
  },
  {
    label: "Kitchen Remodeling",
    before: "/hero/before.jpg",
    after: "/product-1.jpg",
  },
  {
    label: "Living Room Renovation",
    before: "/hero/before.jpg",
    after: "/hero/after.png",
  },
  {
    label: "Full Build Construction",
    before: "/hero/before.jpg",
    after: "/product-4.png",
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   Handle SVG — bidirectional arrow icon inside the white circle
───────────────────────────────────────────────────────────────────────── */
function HandleIcon() {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left chevron */}
      <path
        d="M5 2L2 6L5 10"
        stroke="#111"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right chevron */}
      <path
        d="M11 2L14 6L11 10"
        stroke="#111"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   BeforeAfterCard — fully interactive drag slider
───────────────────────────────────────────────────────────────────────── */
function BeforeAfterCard({ label, before, after, delay }) {
  const [pos, setPos] = useState(50); // 0–100 (% from left)
  const [dragging, setDragging] = useState(false);
  const cardRef = useRef(null);

  /* Clamp + set position from a clientX coordinate */
  const updatePos = useCallback((clientX) => {
    if (!cardRef.current) return;
    const { left, width } = cardRef.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - left) / width) * 100));
    setPos(pct);
  }, []);

  /* Mouse */
  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(true);
      updatePos(e.clientX);

      const onMove = (ev) => updatePos(ev.clientX);
      const onUp = () => {
        setDragging(false);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [updatePos],
  );

  /* Touch */
  const handleTouchStart = useCallback(
    (e) => {
      setDragging(true);
      updatePos(e.touches[0].clientX);

      const onMove = (ev) => {
        ev.preventDefault();
        updatePos(ev.touches[0].clientX);
      };
      const onEnd = () => {
        setDragging(false);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
      };
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onEnd);
    },
    [updatePos],
  );

  /* Also allow clicking anywhere on the card to jump the slider */
  const handleCardClick = useCallback(
    (e) => {
      if (e.target.closest("[data-handle]")) return; // handled by handle itself
      updatePos(e.clientX);
    },
    [updatePos],
  );

  return (
    <Reveal direction="up" delay={delay}>
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl bg-card select-none"
        style={{ aspectRatio: "7/5", cursor: "ew-resize" }}
        onClick={handleCardClick}
      >
        {/* ── After image — full background ─────────────────── */}
        <Image
          src={after}
          alt={`${label} — after`}
          fill
          className="object-cover"
          draggable={false}
        />

        {/* ── Before image — clipped to left `pos`% ─────────── */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image
            src={before}
            alt={`${label} — before`}
            fill
            className="object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* ── Divider line ───────────────────────────────────── */}
        <div
          className="absolute inset-y-0 pointer-events-none z-10"
          style={{
            left: `${pos}%`,
            width: 2,
            transform: "translateX(-50%)",
            background: dragging
              ? "rgba(255,255,255,1)"
              : "rgba(255,255,255,0.75)",
            transition: dragging ? "none" : "background 0.2s",
          }}
        />

        {/* ── Drag handle ────────────────────────────────────── */}
        <div
          data-handle="true"
          className="absolute top-1/2 z-20 flex items-center justify-center"
          style={{
            left: `${pos}%`,
            transform: "translate(-50%, -50%)",
            width: dragging ? 36 : 32,
            height: dragging ? 36 : 32,
            borderRadius: "50%",
            background: "#ffffff",
            boxShadow: dragging
              ? "0 4px 24px rgba(0,0,0,0.7), 0 0 0 2px rgba(212,175,55,0.6)"
              : "0 2px 14px rgba(0,0,0,0.55)",
            transition: dragging
              ? "none"
              : "width 0.15s, height 0.15s, box-shadow 0.15s",
            cursor: "ew-resize",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <HandleIcon />
        </div>

        {/* ── BEFORE / AFTER pill labels ─────────────────────── */}
        <span className="absolute top-3 left-3 z-10 text-white/85 text-[9px] font-manrope font-bold tracking-[0.28em] uppercase bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full pointer-events-none">
          Before
        </span>
        <span className="absolute top-3 right-3 z-10 text-white/85 text-[9px] font-manrope font-bold tracking-[0.28em] uppercase bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full pointer-events-none">
          After
        </span>

        {/* ── Project label ──────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-linear-to-t from-black/80 to-transparent pointer-events-none">
          <p className="text-white text-[11px] font-manrope font-semibold tracking-[0.12em] uppercase text-center">
            {label}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Section wrapper
───────────────────────────────────────────────────────────────────────── */
export default function TransformationSection() {
  return (
    <section className="bg-black py-20 sm:py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-14">
          <div>
            <Reveal direction="up">
              <p className="text-[#D4AF37] text-[16px] font-manrope font-extrabold tracking-[0.32em] uppercase mb-3">
                Real Transformations
              </p>
            </Reveal>
            <Reveal direction="up" delay={60}>
              <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
                Before &amp; After Projects
              </h2>
            </Reveal>
          </div>
          <Reveal direction="up" delay={80}>
            <Link
              href="/project"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[12px] font-manrope font-semibold tracking-[0.18em] uppercase shrink-0"
            >
              View All Projects
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Reveal>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {PROJECTS.map((p, i) => (
            <BeforeAfterCard key={p.label} {...p} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  );
}
