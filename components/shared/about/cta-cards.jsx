"use client";
import { motion } from "framer-motion";

export default function CTACards() {
  return (
    <section className="bg-black py-20 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
          {/* New to TBM */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative bg-[#0d0b08] px-10 py-14 min-h-64 overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 80% at 100% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-4 block">New here</span>
              <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-white mb-3 tracking-tight">New to TBM?</h3>
              <p className="text-white/45 mb-6 leading-relaxed max-w-sm text-sm">
                Take a guided tour of our ecosystem and discover how easy renovation can be.
              </p>
              <button className="inline-flex items-center gap-3 bg-white text-black font-manrope font-semibold px-6 py-3 hover:bg-white/90 transition-colors text-sm">
                Take a Tour
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Style Discovery */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative px-10 py-14 min-h-64 overflow-hidden"
            style={{ background: "rgba(212,175,55,0.06)" }}
          >
            {/* Glow */}
            <div className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 80% at 0% 50%, rgba(212,175,55,0.12) 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-4 block">Style discovery</span>
              <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-white mb-3 tracking-tight">
                Unsure of your style?
              </h3>
              <p className="text-white/45 mb-6 leading-relaxed max-w-sm text-sm">
                Take our 2-minute style quiz and let Ziora suggest the perfect palette for you.
              </p>
              <button
                className="inline-flex items-center gap-3 font-manrope font-semibold px-6 py-3 text-black text-sm hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
              >
                Find Your Style
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
