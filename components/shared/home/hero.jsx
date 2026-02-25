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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      image: "/hero/slide1.png",
      title: "Your Dream Home, Reimagined",
      description:
        "Discover premium materials, visualize your space with AI, and connect with expert designers to bring your vision to life.",
    },
    {
      image: "/product-1.jpg",
      title: "Transform Your Space with AI",
      description:
        "See your renovation before you commit. Our AI visualizer shows you exactly how materials will look in your home.",
    },
    {
      image: "/product-2.jpg",
      title: "Premium Materials, Delivered",
      description:
        "Browse thousands of high-quality materials from trusted suppliers. Free shipping on orders over N300,000.",
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

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="min-h-screen bg-background md:min-h-[90vh] overflow-visible relative">
      {/* Container with max-width for content constraint */}
      <div className="max-w-325 mx-auto h-full flex items-center justify-center px-4 sm:px-2 lg:px-3 relative min-h-[90vh]">
        {/* Blue background section with image slider */}
        <div className="absolute bottom-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 h-[85%] sm:h-[85%] rounded-xl md:rounded-2xl overflow-hidden">
          {/* Image Slider with crossfade */}
          <div className="absolute inset-0">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Navy blue tint overlay */}
                <div className="absolute inset-0 bg-blue-950/60" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controls */}
          <div className="absolute inset-0 z-10  items-center justify-between px-4 sm:px-6 md:px-2 hidden">
            {/* Previous Button */}
            <motion.button
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSlide}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-white" />
            </motion.button>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSlide}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-colors group"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-white" />
            </motion.button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Content - Now stays persistent with only text changing */}
          <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 py-12">
            {/* Heading */}
            <div className="mb-4 sm:mb-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl sm:text-5xl font-primary md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                >
                  {slides[currentSlide].title.split(",")[0]},
                  <br />
                  {slides[currentSlide].title.split(",")[1]}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Subheading */}
            <div className="mb-8 sm:mb-10 md:mb-12 max-w-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-base sm:text-lg md:text-xl font-manrope text-white/90"
                >
                  {slides[currentSlide].description}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* CTA Buttons - Stay persistent */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link href="/materials">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 text-base sm:text-lg font-manrope cursor-pointer shadow-lg hover:shadow-xl"
                >
                  Shop Materials
                </motion.button>
              </Link>
              <Link href="/ai-visualizer">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white hover:bg-gray-100 text-primary font-semibold px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 text-base sm:text-lg font-manrope cursor-pointer shadow-lg hover:shadow-xl"
                >
                  Try AI Before/After
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar - centered at bottom of blue section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute -bottom-12 sm:-bottom-16 md:-bottom-16 left-1/2 -translate-x-1/2 w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] h-24 sm:h-32 md:h-32 bg-white z-30 rounded-lg md:rounded-xl shadow-2xl"
        >
          <div className="h-full flex items-center justify-around px-4 sm:px-6 md:px-8 lg:px-12">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex flex-col items-center justify-center gap-2 sm:gap-2 transition-all duration-200 group ${
                    category.active ? "" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`w-10 h-10 sm:w-14 sm:h-14 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                      category.active
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}
                  >
                    <Icon
                      className="w-5 h-5 sm:w-7 sm:h-7 md:w-7 md:h-7"
                      strokeWidth={1.5}
                    />
                  </motion.div>

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
      <div className="bg-background py-12 sm:py-16 md:py-20 mt-16 sm:mt-20 md:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="flex items-start gap-4 sm:gap-5"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="shrink-0"
                  >
                    <Icon
                      className="w-10 h-10 sm:w-10 sm:h-10 text-gray-700"
                      strokeWidth={1.5}
                    />
                  </motion.div>

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
