"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SimilarStyles({ materials = [] }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const products =
    materials.length > 0
      ? materials
      : [
          { id: 1, name: "Calacatta Gold 12x24", subtitle: "Italian Marble", price: 12.5, image: "/mock/1.svg" },
          { id: 2, name: "Statuary White 12x24", subtitle: "Premium Porcelain", price: 6.99, image: "/mock/2.svg" },
          { id: 3, name: "Emperador Dark 12x24", subtitle: "Spanish Marble", price: 9.25, image: "/mock/3.svg" },
          { id: 4, name: "Travertine Beige 12x24", subtitle: "Natural Stone", price: 5.5, image: "/mock/4.svg" },
        ];

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const newPosition =
        direction === "left"
          ? scrollPosition - scrollAmount
          : scrollPosition + scrollAmount;
      scrollContainerRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="p-4"
      style={{ background: "#050505" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Similar Styles</h2>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors ${
              canScrollLeft
                ? "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                : "border-white/10 text-white/20 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors ${
              canScrollRight
                ? "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                : "border-white/10 text-white/20 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Products Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto -mx-6 px-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/materials/${product.id}`} className="group block w-70 shrink-0">
              <div
                className="rounded-lg overflow-hidden border border-white/08 hover:border-white/20 transition-all"
                style={{ background: "#0d0b08" }}
              >
                {/* Product Image */}
                <div className="relative aspect-3/2 bg-[#1a1a1a]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="280px"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-white/40 mb-3">{product.subtitle}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-white">
                        ₦{product.price?.toFixed(2)}
                      </span>
                      <span className="text-sm text-white/40">/ sq ft</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-black transition-colors"
                      style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
