"use client";
import { motion } from "framer-motion";

export default function TBMJourney() {
  return (
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-4 font-primary">
            The TBM Journey
          </h2>
          <p className="text-xl text-gray-600">
            From a simple idea to a digital revolution in home design.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line - Positioned at left edge */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 ml-2" />

          {/* Timeline Items */}
          <div className="space-y-32">
            {/* 2018 - The Foundation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative pl-12"
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 top-0 w-4 h-4 bg-gray-900 rounded-full" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Content */}
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    2018
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    The Foundation
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    TBM was founded with a singular mission: to digitize the
                    material selection process.
                  </p>
                </div>

                {/* Right Quote Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    "I needed a better way to source materials for my own
                    renovation. That frustration sparked TBM."
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    - Founder
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Second Item - Chiamaka Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative pl-12"
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 top-0 w-4 h-4 bg-gray-900 rounded-full" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Quote Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm md:col-start-1">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    "Seeing my kitchen before buying a single tile saved me
                    thousands in mistakes. TBM is magic!"
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    - Chiamaka Okeke
                  </p>
                </div>

                {/* Right Content */}
                <div className="text-left md:col-start-2">
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    2025
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    AI Integration
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Launched our proprietary AI visualizer, allowing clients to
                    see their rooms transformed instantly.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Full Ecosystem */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative pl-12"
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 top-0 w-4 h-4 bg-gray-900 rounded-full" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Content */}
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Full Ecosystem
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Since its registration in 2018, TBM has grown into a
                    multi-discipline team delivering building construction,
                    renovation, maintenance and interior/ exterior design
                    services across residential and commercial projects.
                  </p>
                </div>

                {/* Right CTA Card */}
                <div className="bg-primary/10 border border-gray-300 drop-shadow-2xl rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    Join us on this journey
                  </h4>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    We are just getting started. Be part of the next chapter.
                  </p>
                  <a
                    href="#"
                    className="inline-block text-gray-900 font-semibold hover:underline"
                  >
                    See Open Roles
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
