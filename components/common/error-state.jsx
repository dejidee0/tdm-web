"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RotateCcw, Home, Phone } from "lucide-react";

/**
 * Shared UI for every error boundary. See app/error.jsx for how it is wired.
 *
 * Deliberately does NOT render `error.message`. A caught error can carry a
 * backend stack trace, a SQL fragment, or a token that leaked into an exception
 * string — the same class of leak lib/log.js exists to prevent, except this one
 * renders in the user's browser. `error.digest` is a hash Next.js generates for
 * server errors; it is safe to show and is what you grep the server logs for.
 */
export default function ErrorState({
  error,
  reset,
  title = "Something went wrong",
  description = "We hit an unexpected problem. It has been logged, and the team is on it.",
  showHomeLink = true,
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-black px-4 py-20 font-manrope">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full text-center"
      >
        <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
          {title}
        </h1>
        <p className="text-[15px] leading-relaxed text-white/50 mb-8">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {reset && (
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#D4AF37] text-black text-[14px] font-semibold tracking-wide transition-colors hover:bg-gold-dim"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2} />
              Try again
            </button>
          )}
          {showHomeLink && (
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-white/15 text-white/80 text-[14px] font-medium transition-colors hover:border-white/40 hover:text-white"
            >
              <Home className="w-4 h-4" strokeWidth={1.75} />
              Back to home
            </Link>
          )}
        </div>

        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 text-[13px] text-white/35 transition-colors hover:text-white/60"
        >
          <Phone className="w-3.5 h-3.5" strokeWidth={1.75} />
          Still stuck? Talk to our team
        </Link>

        {/* Safe to surface: a hash, not the exception. Quote it in a bug report. */}
        {error?.digest && (
          <p className="mt-10 text-[11px] tracking-[0.15em] uppercase text-white/20">
            Reference {error.digest}
          </p>
        )}
      </motion.div>
    </div>
  );
}
