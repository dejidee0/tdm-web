"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CTACards() {
  return (
    <section className="bg-background py-20 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New to TBM Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative bg-gray-900 rounded-3xl px-10 py-4 h-[40vh] overflow-hidden shadow-lg transition-transform"
          >
            {/* Background Icon */}
            <div className="absolute right-0 top-10 opacity-20">
              <Image
                src="/icons/about-vector1.svg"
                alt=""
                width={250}
                height={250}
                className="w-28 h-28"
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white">New to TBM?</h3>
              <p className="text-gray-200 mb-2 leading-relaxed max-w-md">
                Take a guided tour of our ecosystem and discover how easy
                renovation can be.
              </p>
              <button className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                Take a Tour
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Unsure of Your Style Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative bg-gray-200 rounded-3xl  px-10 py-4  overflow-hidden shadow-lg transition-transform"
          >
            {/* Background Icon */}
            <div className="absolute right-0 top-10 opacity-30">
              <Image
                src="/icons/about-vector2.png"
                alt=""
                width={200}
                height={200}
                className="w-28 h-28"
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 ">
                Unsure of your style?
              </h3>
              <p className="text-gray-700 mb-2 leading-relaxed max-w-md">
                Take our 2-minute style quiz and let our AI suggest the perfect
                palette for you.
              </p>
              <button className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
                Find Your Style
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
