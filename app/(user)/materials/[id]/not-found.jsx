// app/materials/[id]/not-found.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";

export default function MaterialNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Material Not Found
          </h1>
          <p className="text-gray-600 leading-relaxed">
            We couldn&#39;t find the material you&lsquo;re looking for. It may
            have been removed or the link might be incorrect.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            href="/materials"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
          >
            Browse All Materials
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
