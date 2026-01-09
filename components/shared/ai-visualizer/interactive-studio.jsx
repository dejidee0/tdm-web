"use client";
import React, { useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";

const InteractiveStudio = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const beforeImage =
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=800&fit=crop";
  const afterImage =
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&h=800&fit=crop";

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updatePosition = (clientX) => {
    if (containerRef.current) {
      const bounds = containerRef.current.getBoundingClientRect();
      const newPosition = ((clientX - bounds.left) / bounds.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, newPosition)));
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <section className="max-w-[1260px] mx-auto min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-12 relative font-manrope">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
          Interactive Studio
        </h1>
        <p className="text-lg text-gray-700">
          Drag the slider to reveal your future home.
        </p>
      </motion.div>

      {/* Before/After Comparison */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative w-full max-w-5xl mx-auto mb-8"
      >
        <div
          ref={containerRef}
          className="relative w-full aspect-16/10 rounded-3xl overflow-hidden shadow-2xl cursor-ew-resize select-none"
          onMouseDown={handleMouseDown}
        >
          {/* Before Image */}
          <div className="absolute inset-0">
            <Image
              src={beforeImage}
              alt="Before"
              fill
              className="object-cover"
              draggable="false"
              priority
            />
            {/* BEFORE Badge */}
            <div className="absolute top-6 left-6">
              <span className="bg-[#3d4f63] text-white text-xs font-semibold px-4 py-2 rounded-full">
                BEFORE
              </span>
            </div>
          </div>

          {/* After Image with Clip */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            <Image
              src={afterImage}
              alt="After"
              fill
              className="object-cover"
              draggable="false"
              priority
            />
            {/* AFTER Badge */}
            <div className="absolute top-6 right-6">
              <span className="bg-black text-white text-xs font-semibold px-4 py-2 rounded-full">
                AFTER
              </span>
            </div>
          </div>

          {/* Slider Line and Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Slider Handle */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto"
              onMouseDown={handleMouseDown}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#374151"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#374151"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        className="flex flex-col lg:flex-row gap-6 items-center justify-between max-w-5xl mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* AI Style Match */}
        <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-5 shadow-md border border-gray-100 flex-1">
          <div className="relative">
            <svg
              className="w-16 h-16 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background dashed circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
                strokeDasharray="12 12" // fewer dashes, more space
              />

              {/* Animated progress dashed circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="#10B981"
                strokeWidth="5"
                fill="none"
                strokeDasharray="12 12" // match background dash pattern
                strokeLinecap="round"
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                whileInView={{
                  strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.94),
                }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">94%</span>
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              AI Style Match
            </h3>
            <p className="text-sm text-gray-600">
              This matches your &ldquo;Modern Farmhouse&ldquo; preference.
            </p>
          </div>
        </div>

        {/* Rate This Transformation */}
        <div className="flex flex-col gap-3 bg-white rounded-2xl px-6 py-5 flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Rate This Transformation
          </p>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center flex-1 gap-2 px-6 py-3 bg-[#D1FAE5] text-[#059669] rounded-xl font-medium text-sm hover:bg-[#A7F3D0] transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 1.5L11.3175 6.195L16.5 6.9525L12.75 10.605L13.635 15.765L9 13.3275L4.365 15.765L5.25 10.605L1.5 6.9525L6.6825 6.195L9 1.5Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Love it
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 flex-1 px-6 py-3 bg-[#FEE2E2] text-[#DC2626] rounded-xl font-medium text-sm hover:bg-[#FECACA] transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5 6L6 13.5M6 6L13.5 13.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Regenerate
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default InteractiveStudio;
