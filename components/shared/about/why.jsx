"use client";
import { motion } from "framer-motion";

const features = [
  {
    feature: "Design Visualization",
    tbm: "Instant AI Rendering",
    traditional: "Slow, manual sketches",
  },
  {
    feature: "Material Sourcing",
    tbm: "Direct Digital Catalog",
    traditional: "Showroom hopping",
  },
  {
    feature: "Cost Transparency",
    tbm: "Real-time Quotes",
    traditional: "Estimates & hidden fees",
  },
  {
    feature: "Project Management",
    tbm: "Centralized Dashboard",
    traditional: "Emails & Phone Tag",
  },
];

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-primary shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function WhyChooseTBM() {
  return (
    <section className="bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 font-primary">
            Why Choose TBM?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            See how we stack up against traditional renovation services.
          </p>
        </motion.div>

        {/* ── DESKTOP TABLE (md+) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="hidden md:block border border-gray-100 rounded-3xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-3">
            <div className="p-5 lg:p-6 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                Feature
              </span>
            </div>
            <div className="p-5 lg:p-6 bg-primary/10 border-b border-primary/10">
              <span className="text-sm lg:text-base font-bold text-gray-900">
                TBM Platform
              </span>
            </div>
            <div className="p-5 lg:p-6 border-b border-gray-100">
              <span className="text-sm lg:text-base font-semibold text-gray-500">
                Traditional Services
              </span>
            </div>
          </div>

          {/* Table Rows */}
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className={`grid grid-cols-3 ${index !== features.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              {/* Feature */}
              <div className="p-5 lg:p-6 flex items-center">
                <span className="text-gray-900 font-medium text-sm lg:text-base">
                  {item.feature}
                </span>
              </div>

              {/* TBM */}
              <div className="p-5 lg:p-6 bg-primary/10 flex items-center gap-2.5">
                <CheckIcon />
                <span className="text-primary font-semibold text-sm lg:text-base">
                  {item.tbm}
                </span>
              </div>

              {/* Traditional */}
              <div className="p-5 lg:p-6 flex items-center">
                <span className="text-gray-500 text-sm lg:text-base">
                  {item.traditional}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── MOBILE CARDS (< md) ── */}
        <div className="md:hidden space-y-4">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
              viewport={{ once: true }}
              className="border border-gray-100 rounded-2xl overflow-hidden"
            >
              {/* Feature label */}
              <div className="px-4 py-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Feature
                </span>
                <p className="text-gray-900 font-semibold text-sm mt-0.5">
                  {item.feature}
                </p>
              </div>

              {/* Two column — TBM vs Traditional */}
              <div className="grid grid-cols-2">
                {/* TBM */}
                <div className="bg-primary/10 px-4 py-4 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-primary/60 uppercase tracking-wider">
                    TBM
                  </span>
                  <div className="flex items-start gap-1.5">
                    <CheckIcon />
                    <span className="text-primary font-semibold text-sm leading-snug">
                      {item.tbm}
                    </span>
                  </div>
                </div>

                {/* Traditional */}
                <div className="px-4 py-4 flex flex-col gap-1.5 border-l border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Traditional
                  </span>
                  <span className="text-gray-500 text-sm leading-snug">
                    {item.traditional}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
