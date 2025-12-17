"use client";

import React from "react";
import Image from "next/image";

const CustomizeSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-16 bg-gray-50">
      <div className="">
        <div className="bg-slate-400 overflow-hidden relative min-h-[200px] sm:min-h-[450px] md:min-h-[300px]">
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-slate-500/40" />

          {/* Content Container */}
          <div className="relative z-10 h-full flex items-center">
            <div className="w-full md:w-1/2 px-8 sm:px-12 md:px-16 lg:px-20 py-12 sm:py-16">
              {/* Heading */}
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-primary font-bold text-white mb-4 sm:mb-6 leading-tight">
                Customize your furniture and build your space with TBM
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl font-inter text-white/90 mb-8 sm:mb-10 max-w-xl">
                Allows you to view our showrooms containing our latest furniture
                collections
              </p>

              {/* CTA Button */}
              <button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 sm:px-10 py-3 sm:py-4 rounded-lg transition-colors duration-200 text-base sm:text-lg shadow-lg">
                Browse Materials
              </button>
            </div>

            {/* Chair Image - Hidden on mobile, visible on larger screens */}
            <div className="hidden md:block absolute right-12 lg:right-20 -bottom-10 w-[400px] lg:w-[500px] h-[400px] lg:h-[500px]">
              <Image
                src="/chair.png" // Replace with your chair image path
                alt="Modern green chair"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizeSection;
