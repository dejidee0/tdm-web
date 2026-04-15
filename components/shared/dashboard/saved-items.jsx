// components/dashboard/SavedItems.jsx
"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useSavedItems } from "@/hooks/use-user-dashboard";
import { useState, useEffect, useRef } from "react";

export default function SavedItems() {
  const { data: savedData, isLoading, isError } = useSavedItems();
  const items = Array.isArray(savedData)
    ? savedData
    : Array.isArray(savedData?.items)
    ? savedData.items
    : Array.isArray(savedData?.data)
    ? savedData.data
    : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    let isScrolling;
    const handleScroll = () => {
      clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        const itemWidth = container.offsetWidth * 0.85;
        setCurrentIndex(Math.round(container.scrollLeft / itemWidth));
      }, 50);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const cardClass = "rounded-2xl border border-white/08";
  const cardStyle = { background: "#0d0b08" };

  if (isLoading) {
    return (
      <div className={`${cardClass} p-6`} style={cardStyle}>
        <h2 className="text-[18px] font-semibold text-white mb-6">Saved Items</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-white/06 rounded-xl mb-3" />
              <div className="h-4 bg-white/06 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/06 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !items || items.length === 0) {
    return (
      <div className={`${cardClass} p-6`} style={cardStyle}>
        <h2 className="text-[18px] font-semibold text-white mb-6">Saved Items</h2>
        <p className="text-[14px] text-white/30 text-center py-12">
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
      scrollContainerRef.current.scrollBy({ left: -scrollContainerRef.current.offsetWidth * 0.85, behavior: "smooth" });
    } else {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (isMobile && scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollContainerRef.current.offsetWidth * 0.85, behavior: "smooth" });
    } else {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className={`${cardClass} p-4 md:p-6`}
      style={cardStyle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2 md:px-0">
        <h2 className="text-[18px] font-semibold text-white">Saved Items</h2>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[#D4AF37] font-medium hover:text-[#D4AF37]/80 transition-colors cursor-pointer">
            View all ({totalItems})
          </span>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center transition-all ${
                currentIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-white/05 hover:border-white/20"
              }`}
            >
              <ChevronLeft className="w-4 h-4 text-white/60" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={`w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center transition-all ${
                currentIndex >= maxIndex
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-white/05 hover:border-white/20"
              }`}
            >
              <ChevronRight className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: Carousel */}
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

      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-2 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div key={item.id} className="snap-center shrink-0 w-[85vw] max-w-85">
              <SavedItemCard item={item} />
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const itemWidth = scrollContainerRef.current.offsetWidth * 0.85;
                  scrollContainerRef.current.scrollTo({ left: itemWidth * index, behavior: "smooth" });
                }
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-[#D4AF37]"
                  : "w-1.5 bg-white/20"
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
      className="w-full md:w-[calc(20%-12.8px)] shrink-0 group cursor-pointer"
    >
      <div className="relative w-full aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden mb-3">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 85vw, 20vw"
        />
      </div>

      <div>
        <h3 className="text-[14px] font-medium text-white mb-1 truncate">
          {item.name}
        </h3>
        <p className="text-[14px] font-semibold text-[#D4AF37]">
          ₦{item.price.toLocaleString()}
          {item.unit && (
            <span className="text-white/30 font-normal">/{item.unit}</span>
          )}
        </p>
      </div>
    </motion.div>
  );
}
