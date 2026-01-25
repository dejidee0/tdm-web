// components/dashboard/SavedItems.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useSavedItems } from "@/hooks/use-user-dashboard";
import { useState, useEffect, useRef } from "react";

export default function SavedItems() {
  const { data: items, isLoading, isError } = useSavedItems();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile: scroll snap behavior
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let isScrolling;

    const handleScroll = () => {
      clearTimeout(isScrolling);

      isScrolling = setTimeout(() => {
        const scrollLeft = container.scrollLeft;
        const itemWidth = container.offsetWidth * 0.85; // 85vw per item
        const newIndex = Math.round(scrollLeft / itemWidth);
        setCurrentIndex(newIndex);
      }, 50);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e5e5e5]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-semibold text-[#1a1a1a]">
            Saved Items
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !items || items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e5e5e5]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-semibold text-[#1a1a1a]">
            Saved Items
          </h2>
        </div>
        <p className="text-[14px] text-[#999999] text-center py-12">
          No saved items yet
        </p>
      </div>
    );
  }

  const totalItems = items.length;
  const itemsPerView = isMobile ? 1 : 5;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const handlePrev = () => {
    if (isMobile && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollBy({
        left: -container.offsetWidth * 0.85,
        behavior: "smooth",
      });
    } else {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (isMobile && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollBy({
        left: container.offsetWidth * 0.85,
        behavior: "smooth",
      });
    } else {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-2xl p-4 md:p-6 border border-[#e5e5e5]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2 md:px-0">
        <h2 className="text-[18px] font-semibold text-[#1a1a1a]">
          Saved Items
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[#3b82f6] font-medium hover:text-[#2563eb] transition-colors cursor-pointer">
            View all ({totalItems})
          </span>

          {/* Navigation Arrows - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`w-8 h-8 rounded-lg border border-[#e5e5e5] flex items-center justify-center transition-all ${
                currentIndex === 0
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[#f5f5f5] hover:border-[#d4d4d4]"
              }`}
            >
              <ChevronLeft className="w-4 h-4 text-[#1a1a1a]" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={`w-8 h-8 rounded-lg border border-[#e5e5e5] flex items-center justify-center transition-all ${
                currentIndex >= maxIndex
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[#f5f5f5] hover:border-[#d4d4d4]"
              }`}
            >
              <ChevronRight className="w-4 h-4 text-[#1a1a1a]" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: Carousel with transform */}
      <div className="hidden md:block overflow-hidden">
        <motion.div
          className="flex gap-4"
          animate={{ x: -currentIndex * (100 / itemsPerView + 3.2) + "%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          {items.map((item) => (
            <SavedItemCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>

      {/* Mobile: Horizontal scroll with snap */}
      <div className="md:hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-2 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="snap-center shrink-0 w-[85vw] max-w-[340px]"
            >
              <SavedItemCard item={item} />
            </div>
          ))}
        </div>

        {/* Mobile Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const container = scrollContainerRef.current;
                  const itemWidth = container.offsetWidth * 0.85;
                  container.scrollTo({
                    left: itemWidth * index,
                    behavior: "smooth",
                  });
                }
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-[#3b82f6]"
                  : "w-1.5 bg-[#d4d4d4]"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SavedItemCard({ item }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="w-full md:w-[calc(20%-12.8px)] flex-shrink-0 group cursor-pointer"
    >
      {/* Item Image */}
      <div className="relative w-full aspect-square bg-[#f5f5f5] rounded-xl overflow-hidden mb-3">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 85vw, 20vw"
        />
      </div>

      {/* Item Info */}
      <div>
        <h3 className="text-[14px] font-medium text-[#1a1a1a] mb-1 truncate">
          {item.name}
        </h3>
        <p className="text-[14px] font-semibold text-[#1a1a1a]">
          ${item.price.toFixed(2)}
          {item.unit && (
            <span className="text-[#999999] font-normal">/{item.unit}</span>
          )}
        </p>
      </div>
    </motion.div>
  );
}
