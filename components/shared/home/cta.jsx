"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-16 bg-[#F5F5F5]  h-[40vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute -bottom-5 z-50 bg-[#FAFAFA] h-[40vh] flex flex-col items-center justify-center ">
        <div className="w-[80vw] md:w-[70vw] pl-5 md:pl-32">
          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-primary mb-8 sm:mb-10 md:mb-12 leading-tight font-manrope">
            Let&apos;s make your space <br /> amazing together.
          </h2>

          {/* CTA Button */}
          <button className="group inline-flex items-center gap-3 bg-transparent hover:bg-gray-900/5 text-gray-500 font-semibold px-0 py-2 transition-all duration-200  border-gray-900">
            <span className="text-base sm:text-lg md:text-lg tracking-wide uppercase font-inter">
              LET&lsquo;S GET STARTED
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
