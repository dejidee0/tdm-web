"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/hero/slide1.png",
      title: "Your Dream Home,\nReimagined",
      description:
        "Discover premium materials, visualize your space with AI, and connect with expert designers to bring your vision to life.",
    },
    {
      image: "/product-1.jpg",
      title: "Transform Your\nLiving Space",
      description:
        "Explore our curated collection of premium flooring and materials designed to elevate every room in your home.",
    },
    {
      image: "/product-2.jpg",
      title: "Visualize Before\nYou Buy",
      description:
        "Use our AI-powered tools to see exactly how materials will look in your space before making a decision.",
    },
  ];

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

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] md:min-h-[90vh] overflow-visible relative">
      {/* Container with max-width for content constraint */}
      <div className="max-w-[1300px] mx-auto h-full flex items-center justify-center px-4 sm:px-2 lg:px-3 relative min-h-[90vh]">
        {/* Blue background section with image slider */}
        <div className="absolute bottom-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 h-[85%] sm:h-[85%] rounded-xl md:rounded-2xl overflow-hidden">
          {/* Image Slider */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slides[currentSlide].image}
                alt="Dream Home Background"
                fill
                className="object-cover"
                priority={currentSlide === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navy blue tint overlay */}
          <div className="absolute inset-0 bg-blue-950/60" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 py-12">
            {/* Heading with animation */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl sm:text-5xl font-primary md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight whitespace-pre-line"
              >
                {slides[currentSlide].title}
              </motion.h1>
            </AnimatePresence>

            {/* Subheading with animation */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-base sm:text-lg md:text-xl font-manrope text-white/90 mb-8 sm:mb-10 md:mb-12 max-w-2xl"
              >
                {slides[currentSlide].description}
              </motion.p>
            </AnimatePresence>

            {/* CTA Buttons with animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 sm:py-4 rounded-xl transition-colors duration-200 text-base sm:text-lg font-manrope cursor-pointer"
              >
                Shop Materials
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white hover:bg-gray-100 text-primary font-semibold px-8 py-3 sm:py-4 rounded-xl transition-colors duration-200 text-base sm:text-lg font-manrope cursor-pointer"
              >
                Try AI Before/After
              </motion.button>
            </motion.div>

            {/* Slide indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-2 mt-8 sm:mt-10"
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-white"
                      : "w-4 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Category Navigation Bar - centered at bottom of blue section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="absolute -bottom-12 sm:-bottom-16 md:-bottom-16 left-1/2 -translate-x-1/2 w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] h-24 sm:h-32 md:h-32 bg-white z-50 rounded-lg md:rounded-xl shadow-2xl"
        >
          <div className="h-full flex items-center justify-around px-4 sm:px-6 md:px-8 lg:px-12">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center gap-2 sm:gap-2 transition-all duration-200 group ${
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
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-[#F5F5F5] py-12 sm:py-16 md:py-20 mt-16 sm:mt-20 md:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 sm:gap-5"
                >
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
