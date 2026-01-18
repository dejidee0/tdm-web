"use client";
import { motion } from "framer-motion";

export default function WhyChooseTBM() {
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

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-3 font-primary">
            Why Choose TBM?
          </h2>
          <p className="text-gray-600">
            See how we stack up against traditional renovation services.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white py-4 border border-gray-50 rounded-3xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-3 border-b border-gray-50">
            <div className="p-6">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                FEATURE
              </span>
            </div>
            <div className="p-6 bg-primary/10 rounded-md">
              <span className="text-base font-bold text-gray-900">
                TBM Platform
              </span>
            </div>
            <div className="p-6">
              <span className="text-base font-semibold text-gray-600">
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
              className={`grid grid-cols-3 ${
                index !== features.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              {/* Feature Column */}
              <div className="p-6 flex items-center">
                <span className="text-gray-900 font-medium">
                  {item.feature}
                </span>
              </div>

              {/* TBM Platform Column */}
              <div className="p-6 bg-primary/10 flex items-center gap-3">
                <div className="w-5 h-5 flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-primary"
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
                </div>
                <span className="text-primary font-semibold">{item.tbm}</span>
              </div>

              {/* Traditional Services Column */}
              <div className="p-6 flex items-center">
                <span className="text-gray-600">{item.traditional}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
