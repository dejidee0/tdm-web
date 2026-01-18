"use client";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="bg-background py-20 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl shadow-xl"
          style={{
            background: `
      linear-gradient(
        to right,
        rgba(27, 63, 205, 0.14),
        rgba(27, 63, 205, 0.01)
      ),
      #0a1628
    `,
          }}
        >
          <div className="relative z-10 py-16 px-8 text-center">
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Ready to Create Your Dream Space?
            </motion.h2>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto"
            >
              Don't just imagine it. See it, build it, and live in it with TBM.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="inline-flex items-center justify-center bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors w-full sm:w-auto">
                Start Your Project
              </button>
              <button className="inline-flex items-center justify-center bg-transparent text-white font-semibold px-8 py-3.5 rounded-xl border-2 border-white/30 hover:bg-white/10 transition-colors w-full sm:w-auto">
                Book a Free Consultation
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
