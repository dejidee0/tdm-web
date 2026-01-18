"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function MissionVision() {
  return (
    <section className="bg-[#F3F4F6] py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Image with Impact Badge */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none rounded-3xl overflow-visible shadow-2xl bg-gray-300 p-4 sm:p-6 rotate-3 sm:rotate-6">
              <div className="aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden relative -rotate-3 sm:-rotate-6">
                {/* Image */}
                <Image
                  src="/about2.png"
                  alt="Modern kitchen interior"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Impact Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6"
                >
                  <div className="bg-white/90 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 shadow-lg">
                    {/* Icon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                      <Image
                        src="/icons/check.svg"
                        alt="Impact icon"
                        width={26}
                        height={26}
                      />
                    </div>

                    {/* Text */}
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide">
                        Impact
                      </div>
                      <div className="text-sm sm:text-base font-medium text-black leading-snug">
                        Over 10,000 homes transformed
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Our Mission & Vision
              </h2>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 max-w-xl">
                We are dedicated to{" "}
                <span className="font-semibold text-gray-900 bg-primary/20 py-1.5 px-2 rounded-lg">
                  empowering homeowners
                </span>{" "}
                with the tools and expertise to create spaces they love.
              </p>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                Our vision is to become the leading digital platform for home
                renovation, setting new standards for quality, innovation, and
                customer satisfaction.
              </p>
            </div>

            {/* Value Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 pt-2 sm:pt-4">
              {/* Empowerment */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5">
                  Empowerment
                </h3>
                <p className="text-sm text-gray-600">
                  Tools that put you in control.
                </p>
              </motion.div>

              {/* Innovation */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5">
                  Innovation
                </h3>
                <p className="text-sm text-gray-600">
                  AI-driven design solutions.
                </p>
              </motion.div>

              {/* Satisfaction */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5">
                  Satisfaction
                </h3>
                <p className="text-sm text-gray-600">
                  Guaranteed quality results.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
