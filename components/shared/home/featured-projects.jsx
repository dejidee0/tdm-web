"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, Clock, Banknote, ArrowRight } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    title: "Luxury Master Bathroom",
    location: "Maitama, Abuja",
    scope: "Full bathroom remodel",
    duration: "3 weeks",
    budget: "₦4.5M – ₦6M",
    finishes: "Italian tiles, concealed WC, rain shower, heated towel rail",
    before: "/product-main.svg",
    after: "/product-main.svg",
    tag: "Bathroom",
  },
  {
    id: 2,
    title: "Open-Plan Kitchen Transformation",
    location: "Lekki, Lagos",
    scope: "Kitchen redesign & fit-out",
    duration: "5 weeks",
    budget: "₦7M – ₦10M",
    finishes: "Quartz countertops, handleless cabinets, built-in appliances",
    before: "/product-main.svg",
    after: "/product-main.svg",
    tag: "Kitchen",
  },
  {
    id: 3,
    title: "Modern Living Room Upgrade",
    location: "Wuse 2, Abuja",
    scope: "Interior fit-out & furnishing",
    duration: "2 weeks",
    budget: "₦2M – ₦3.5M",
    finishes: "Engineered wood flooring, feature wall, recessed lighting",
    before: "/product-main.svg",
    after: "/product-main.svg",
    tag: "Living Room",
  },
  {
    id: 4,
    title: "Full Home Renovation",
    location: "Victoria Island, Lagos",
    scope: "Whole-property renovation",
    duration: "12 weeks",
    budget: "₦25M – ₦40M",
    finishes: "Marble floors, bespoke joinery, smart home integration",
    before: "/product-main.svg",
    after: "/product-main.svg",
    tag: "Full Home",
  },
];

export default function FeaturedProjects() {
  const [current, setCurrent] = useState(0);
  const [view, setView] = useState("after"); // "before" | "after"

  const project = PROJECTS[current];

  const prev = () => setCurrent((c) => (c - 1 + PROJECTS.length) % PROJECTS.length);
  const next = () => setCurrent((c) => (c + 1) % PROJECTS.length);

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14"
        >
          <div>
            <span className="inline-block text-gold text-xs font-manrope font-semibold uppercase tracking-[0.2em] mb-4">
              Featured transformations
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-primary font-bold text-[#0A0A0A] leading-tight tracking-tight">
              Real Spaces.<br className="hidden sm:block" /> Real Results.
            </h2>
          </div>
          <Link
            href="/project"
            className="group inline-flex items-center gap-2 text-[#0A0A0A] font-manrope font-semibold text-sm hover:gap-3 transition-all duration-200 shrink-0"
          >
            View all projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image panel */}
          <div className="relative">
            {/* Before / After toggle */}
            <div className="absolute top-4 left-4 z-20 flex overflow-hidden">
              {["before", "after"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-5 py-2 text-xs font-manrope font-semibold uppercase tracking-widest transition-colors ${
                    view === v
                      ? "bg-[#0A0A0A] text-white"
                      : "bg-white/90 text-[#5C5550] hover:bg-white"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Tag */}
            <div className="absolute top-4 right-4 z-20">
              <span className="bg-black/70 text-white text-xs font-manrope font-medium px-3 py-1.5 tracking-widest uppercase">
                {project.tag}
              </span>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-4/3 overflow-hidden bg-stone">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${project.id}-${view}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={view === "before" ? project.before : project.after}
                    alt={`${project.title} — ${view}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav arrows */}
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
              <button
                onClick={prev}
                className="w-9 h-9 bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#0A0A0A]" />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#0A0A0A]" />
              </button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {PROJECTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1 transition-all duration-300 ${
                    i === current ? "w-8 bg-gold" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Project details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h3 className="text-2xl sm:text-3xl font-primary font-bold text-[#0A0A0A] mb-2 tracking-tight">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[#7A736C]">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <span className="text-sm font-manrope">{project.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-stone">
                <div className="bg-white p-4">
                  <p className="text-[10px] text-[#7A736C] font-manrope uppercase tracking-[0.15em] mb-2">Scope</p>
                  <p className="text-sm font-manrope font-semibold text-[#0A0A0A]">{project.scope}</p>
                </div>
                <div className="bg-white p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock className="w-3 h-3 text-gold" />
                    <p className="text-[10px] text-[#7A736C] font-manrope uppercase tracking-[0.15em]">Duration</p>
                  </div>
                  <p className="text-sm font-manrope font-semibold text-[#0A0A0A]">{project.duration}</p>
                </div>
                <div className="bg-white p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Banknote className="w-3 h-3 text-gold" />
                    <p className="text-[10px] text-[#7A736C] font-manrope uppercase tracking-[0.15em]">Budget Band</p>
                  </div>
                  <p className="text-sm font-manrope font-semibold text-[#0A0A0A]">{project.budget}</p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-[10px] text-[#7A736C] font-manrope uppercase tracking-[0.15em] mb-2">Key Finishes</p>
                  <p className="text-sm font-manrope font-medium text-[#3D3833] leading-snug">{project.finishes}</p>
                </div>
              </div>

              <Link href={`/project`}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-white font-manrope font-semibold px-8 py-4 rounded-none transition-all duration-200 group tracking-wide"
                >
                  View Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
