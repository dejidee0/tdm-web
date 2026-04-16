"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageGallery({ images = [], productName = "Product" }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const galleryImages =
    images.length > 0
      ? images
      : [
          "/materials/carrara-white-main.jpg",
          "/materials/carrara-white-2.jpg",
          "/materials/carrara-white-3.jpg",
          "/materials/carrara-white-close.jpg",
        ];

  const selectedImage = galleryImages[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div
        className="relative w-full h-125 bg-[#1a1a1a] rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* AI READY Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs font-semibold text-white">AI READY</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={selectedImage}
              alt={`${productName} - View ${selectedIndex + 1}`}
              fill
              className="object-cover"
              priority={selectedIndex === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {galleryImages.map((image, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedIndex(index)}
            className={`relative h-32 rounded-lg overflow-hidden border-2 transition-all ${
              selectedIndex === index
                ? "border-[#D4AF37]"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <Image
              src={image}
              alt={`${productName} - Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="100px"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
