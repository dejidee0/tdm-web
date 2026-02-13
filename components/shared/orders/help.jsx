// components/orders/HelpSection.jsx
"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import Link from "next/link";

export default function HelpSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-[#e5e7eb] rounded-2xl p-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
          <HelpCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-[16px] font-semibold text-primary mb-2">
            Have a question?
          </h3>
          <p className="text-[14px] text-[#666666] mb-4 leading-relaxed">
            Our renovation experts are here to help with installation guides.
          </p>
          <Link
            href="/help"
            className="text-[14px] font-semibold text-primary hover:text-[#666666] transition-colors"
          >
            Visit Help Center →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
