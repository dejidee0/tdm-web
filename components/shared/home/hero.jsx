"use client";

import React from "react";
import Image from "next/image";
import {
  Star,
  Armchair,
  Monitor,
  Sofa,
  BedDouble,
  Truck,
  Headphones,
  CheckCircle,
  Trophy,
} from "lucide-react";

const HeroSection = () => {
  const categories = [
    { icon: Star, label: "Popular", active: true },
    { icon: Armchair, label: "Chair", active: false },
    { icon: Monitor, label: "Workstation", active: false },
    { icon: Sofa, label: "Living room", active: false },
    { icon: BedDouble, label: "Bedroom", active: false },
  ];
  const features = [
    {
      icon: Trophy,
      title: "High Quality",
      description: "crafted from top materials",
    },
    {
      icon: CheckCircle,
      title: "Warranty Protection",
      description: "Over 8 Months",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Order over N300,000",
    },
    {
      icon: Headphones,
      title: "24 / 7 Support",
      description: "Dedicated support",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] md:min-h-[90vh] overflow-visible relative">
      {/* Container with max-width for content constraint */}
      <div className="max-w-[1300px] mx-auto h-full flex items-center justify-center px-4 sm:px-2 lg:px-3  relative min-h-[90vh]">
        {/* Blue background section with image */}
        <div className="absolute bottom-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 h-[85%] sm:h-[85%] rounded-xl md:rounded-2xl overflow-hidden">
          {/* Background Image */}
          <Image
            src="/hero/slide1.png" // Replace with your image path
            alt="Dream Home Background"
            fill
            className="object-cover"
            priority
          />

          {/* Navy blue tint overlay */}
          <div className="absolute inset-0 bg-blue-950/60" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 py-12">
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl font-primary md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Your Dream Home,
              <br />
              Reimagined
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl font-manrope text-white/90 mb-8 sm:mb-10 md:mb-12 max-w-2xl">
              Discover premium materials, visualize your space with AI, and
              connect with expert designers to bring your vision to life.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <button className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 sm:py-4 rounded-xl transition-colors duration-200 text-base sm:text-lg font-manrope cursor-pointer">
                Shop Materials
              </button>
              <button className="bg-white hover:bg-gray-100 text-primary font-semibold px-8 py-3 sm:py-4 rounded-xl transition-colors duration-200 text-base sm:text-lg font-manrope cursor-pointer">
                Try AI Before/After
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar - centered at bottom of blue section */}
        <div className="absolute -bottom-12 sm:-bottom-16 md:-bottom-16 left-1/2 -translate-x-1/2 w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] h-24 sm:h-32 md:h-32 bg-white z-50 rounded-lg md:rounded-xl shadow-2xl">
          <div className="h-full flex items-center justify-around px-4 sm:px-6 md:px-8 lg:px-12">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={index}
                  className={`flex flex-col items-center justify-center gap-2 sm:gap-2 transition-all duration-200 hover:scale-105 group ${
                    category.active ? "" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 sm:w-14 sm:h-14 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                      category.active
                        ? "bg-blue-900 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}
                  >
                    <Icon
                      className="w-5 h-5 sm:w-7 sm:h-7 md:w-7 md:h-7"
                      strokeWidth={1.5}
                    />
                  </div>

                  <span
                    className={`text-xs sm:text-sm md:text-base font-medium ${
                      category.active ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className=" bg-[#F5F5F5] py-12 sm:py-16 md:py-20 mt-16 sm:mt-20 md:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-4 sm:gap-5">
                  {/* Icon */}
                  <div className="shrink-0">
                    <Icon
                      className="w-10 h-10 sm:w-10 sm:h-10 text-gray-700"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex flex-col">
                    <h3 className="text-base sm:text-base font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
