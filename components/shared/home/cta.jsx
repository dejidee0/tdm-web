"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-16 bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 sm:mb-10 md:mb-12 leading-tight">
            Let&apos;s make your space amazing together.
          </h2>

          {/* CTA Button */}
          <button className="group inline-flex items-center gap-3 bg-transparent hover:bg-gray-900/5 text-gray-700 font-semibold px-0 py-2 transition-all duration-200 border-b-2 border-gray-900">
            <span className="text-base sm:text-lg md:text-xl tracking-wide uppercase">
              LET&lsquo;S GET STARTED
            </span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
