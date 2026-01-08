"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCurrentUser } from "@/hooks/use-auth";
import AuthModal from "@/components/common/auth-modal";

const CTAAndTestimonials = () => {
  const [showAuthModal, setShowAuthModal] = useState("");
  const { data: user } = useCurrentUser();

  const handleSaveProject = () => {
    if (!user) {
      setShowAuthModal((prev) => !prev);
    }
  };
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
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="max-w-[1260px] mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* CTA Banner */}
      <motion.div
        className="bg-primary rounded-3xl px-8 md:px-12 py-10 md:py-12 mb-16"
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
            <p className="text-lg text-gray-300 max-w-xl">
              Don&apos;t lose your progress. Save your favorite designs or share
              them with your partner.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {!user && (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#3d4f66" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveProject}
                className="flex items-center gap-2 px-6 py-3 bg-[#3d4f63] text-white rounded-xl font-medium text-sm transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.8333 17.5H4.16667C3.70833 17.5 3.33333 17.125 3.33333 16.6667V5.83333C3.33333 5.375 3.70833 5 4.16667 5H10L11.6667 6.66667H15.8333C16.2917 6.66667 16.6667 7.04167 16.6667 7.5V16.6667C16.6667 17.125 16.2917 17.5 15.8333 17.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Save Project
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#3d4f66" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-[#3d4f63] text-white rounded-xl font-medium text-sm transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3333 10.8333L16.6667 7.5L13.3333 4.16667M16.6667 7.5H9.16667C6.40833 7.5 4.16667 9.74167 4.16667 12.5V15.8333"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Share Link
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#2d3e54] rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3333 5.83333C14.2538 5.83333 15 5.08714 15 4.16667C15 3.24619 14.2538 2.5 13.3333 2.5C12.4129 2.5 11.6667 3.24619 11.6667 4.16667C11.6667 5.08714 12.4129 5.83333 13.3333 5.83333Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M6.66667 11.6667C7.58714 11.6667 8.33333 10.9205 8.33333 10C8.33333 9.07953 7.58714 8.33333 6.66667 8.33333C5.74619 8.33333 5 9.07953 5 10C5 10.9205 5.74619 11.6667 6.66667 11.6667Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M13.3333 17.5C14.2538 17.5 15 16.7538 15 15.8333C15 14.9129 14.2538 14.1667 13.3333 14.1667C12.4129 14.1667 11.6667 14.9129 11.6667 15.8333C11.6667 16.7538 12.4129 17.5 13.3333 17.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8.15833 11.0083L11.85 14.825M11.8417 5.175L8.16667 8.99167"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Send to Designer
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <div>
        {/* Section Title */}
        <motion.h2
          className="text-4xl font-bold text-[#1e3a5f] text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Renovations Realized
        </motion.h2>

        {/* Testimonials Grid */}
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
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col"
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
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1 + i * 0.05,
                    }}
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
              <p className="text-gray-700 leading-relaxed mb-6 grow">
                {testimonial.text}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.project}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            setShowAuthModal={setShowAuthModal}
            showAuthModal={showAuthModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CTAAndTestimonials;
