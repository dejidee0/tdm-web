"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Adaeze Okonkwo",
    projectType: "Full bathroom renovation",
    city: "Abuja",
    rating: 5,
    quote:
      "TBM completely transformed our master bathroom. The Ziora design tool gave us a clear picture before work started, and the execution team delivered exactly what was promised. The Italian tiles look stunning.",
  },
  {
    name: "Emeka Chukwu",
    projectType: "Kitchen fit-out",
    city: "Lagos",
    rating: 5,
    quote:
      "I was skeptical about using an online platform for something this big, but TBM exceeded every expectation. The Bogat materials were top quality — I've had contractors try to tell me I must have paid double what I actually paid.",
  },
  {
    name: "Fatimah Suleiman",
    projectType: "Living room & dining redesign",
    city: "Abuja",
    rating: 5,
    quote:
      "The consultation process was refreshingly honest. They gave us a realistic budget, a clear scope, and stuck to the timeline. Ziora AI helped us visualize three different style directions before we committed.",
  },
  {
    name: "Tunde Adeyemi",
    projectType: "Full home renovation",
    city: "Lagos",
    rating: 5,
    quote:
      "Seven rooms, twelve weeks, zero surprises. The project management was tight, the materials arrived on time, and the finishing is exceptional. TBM is the real deal — I've already referred three friends.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);

  const t = TESTIMONIALS[current];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-primary text-xs font-inter font-semibold uppercase tracking-widest mb-2">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-primary font-bold text-primary leading-tight">
            Clients Who Trusted TBM
          </h2>
        </motion.div>

        <div className="relative bg-white rounded-3xl shadow-xl p-8 sm:p-12">
          {/* Stars */}
          <div className="flex gap-1 mb-6 justify-center">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Quote */}
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="text-lg sm:text-xl font-inter text-gray-700 text-center leading-relaxed mb-8"
            >
              &ldquo;{t.quote}&rdquo;
            </motion.blockquote>
          </AnimatePresence>

          {/* Attribution */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`attr-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <p className="font-inter font-bold text-gray-900">{t.name}</p>
              <p className="text-sm font-inter text-gray-500 mt-1">
                {t.projectType} &middot; {t.city}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-primary" : "w-1.5 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
