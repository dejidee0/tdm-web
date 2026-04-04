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
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-block text-primary text-xs font-inter font-semibold uppercase tracking-widest mb-2">
              Featured transformations
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-primary font-bold text-primary leading-tight">
              Real Spaces. Real Results.
            </h2>
          </div>
          <Link
            href="/project"
            className="group inline-flex items-center gap-2 text-primary font-inter font-semibold text-sm hover:gap-3 transition-all duration-200"
          >
            View all projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image panel */}
          <div className="relative">
            {/* Before / After toggle */}
            <div className="absolute top-4 left-4 z-20 flex rounded-lg overflow-hidden shadow-lg">
              {["before", "after"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 text-xs font-inter font-semibold uppercase tracking-wide transition-colors ${
                    view === v
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Tag */}
            <div className="absolute top-4 right-4 z-20">
              <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-inter font-medium px-3 py-1.5 rounded-full">
                {project.tag}
              </span>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-gray-100">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav arrows */}
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-800" />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-800" />
              </button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {PROJECTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-primary" : "w-1.5 bg-white/60"
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
                <h3 className="text-2xl sm:text-3xl font-primary font-bold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-inter">{project.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-inter uppercase tracking-wide mb-1">Scope</p>
                  <p className="text-sm font-inter font-semibold text-gray-800">{project.scope}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <p className="text-xs text-gray-400 font-inter uppercase tracking-wide">Duration</p>
                  </div>
                  <p className="text-sm font-inter font-semibold text-gray-800">{project.duration}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Banknote className="w-3.5 h-3.5 text-primary" />
                    <p className="text-xs text-gray-400 font-inter uppercase tracking-wide">Budget Band</p>
                  </div>
                  <p className="text-sm font-inter font-semibold text-gray-800">{project.budget}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-inter uppercase tracking-wide mb-1">Key Finishes</p>
                  <p className="text-sm font-inter font-medium text-gray-700 leading-snug">{project.finishes}</p>
                </div>
              </div>

              <Link href={`/project`}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-inter font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group"
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
