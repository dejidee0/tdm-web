"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, CalendarDays } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";

const CTAAndTestimonials = () => {
  const { data: user } = useCurrentUser();

  const designHref = user ? "/dashboard/ai-designs" : "/sign-in?from=/dashboard/ai-designs";

  const testimonials = [
    {
      rating: 5,
      text: "I couldn't decide on cabinet colors for months. The AI visualizer showed me exactly how navy blue would look. Saved me from a huge mistake!",
      name: "Sarah M.",
      project: "Kitchen Remodel",
    },
    {
      rating: 5,
      text: "Being able to upload my own photo was a game changer. The 'Industrial' filter gave me ideas I never would have thought of on my own.",
      name: "James T.",
      project: "Living Room Update",
    },
    {
      rating: 5,
      text: "Used the tool, loved the look, and booked a designer right after. The transition from AI to real expert help was seamless.",
      name: "Emily R.",
      project: "Full Home Reno",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="max-w-315 mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* CTA Banner */}
      <motion.div
        className="rounded-3xl px-8 md:px-12 py-10 md:py-12 mb-16 border"
        style={{
          background: "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(184,150,46,0.06) 100%)",
          borderColor: "rgba(212,175,55,0.25)",
        }}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Ready to make it real?
            </h2>
            <p className="text-lg text-white/60 max-w-xl">
              Generate your first design free — then bring it to life with a TBM
              designer who knows Nigerian materials and budgets.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 shrink-0">
            <Link href={designHref}>
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-black hover:opacity-90 transition-opacity cursor-pointer"
                style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
              >
                <Sparkles className="w-4 h-4" />
                {user ? "Open Ziora Studio" : "Start Designing Free"}
              </motion.span>
            </Link>

            <Link href="/contact">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border border-white/15 text-white/70 hover:bg-white/05 transition-colors cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <CalendarDays className="w-4 h-4" />
                Book a Consultation
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <div>
        <motion.h2
          className="text-4xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Renovations Realized
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="rounded-2xl p-8 flex flex-col border border-white/08"
              style={{ background: "#0d0b08" }}
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.svg
                    key={i}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
                  >
                    <path
                      d="M10 1.66667L12.575 6.88333L18.3333 7.725L14.1667 11.7833L15.15 17.5167L10 14.8083L4.85 17.5167L5.83333 11.7833L1.66667 7.725L7.425 6.88333L10 1.66667Z"
                      fill="#FCD34D"
                      stroke="#FCD34D"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-white/70 leading-relaxed mb-6 grow">
                {testimonial.text}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 shrink-0" />
                <div>
                  <p className="font-semibold text-white text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-white/40">{testimonial.project}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </section>
  );
};

export default CTAAndTestimonials;
