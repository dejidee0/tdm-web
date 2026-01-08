"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const FindYourAesthetic = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Styles");

  const filters = ["All Styles", "Modern", "Rustic", "Filters"];

  const aesthetics = [
    {
      title: "Scandi Minimal",
      image:
        "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&h=400&fit=crop",
      colors: ["#E8D5C4", "#8B9AA3"],
    },
    {
      title: "Dark Modern",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop",
      colors: ["#1C1C1E", "#2C2C2E"],
    },
    {
      title: "Bohemian",
      image:
        "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=400&h=400&fit=crop",
      colors: ["#C9A574", "#E8DCC8"],
    },
    {
      title: "Industrial",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=400&fit=crop",
      colors: ["#6B5D54", "#C97D4A"],
    },
    {
      title: "Coastal",
      image:
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&h=400&fit=crop",
      colors: ["#A8D5E2"],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const filterVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className="min-h-[60vh] bg-white mt-10">
      <section className="max-w-[1260px] mx-auto  flex flex-col px-4 sm:px-6 lg:px-8 py-20 relative  ">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-2">
              Find Your Perfect Aesthetic
            </h1>
            <p className="text-lg text-gray-600">
              Filter by mood, color, or material to start your transformation.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            className="flex flex-wrap gap-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {filters.map((filter, index) => (
              <motion.button
                key={filter}
                variants={filterVariants}
                onClick={() => setSelectedFilter(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  selectedFilter === filter
                    ? "bg-[#2d3e54] text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                } ${filter === "Filters" ? "flex items-center gap-2" : ""}`}
              >
                {filter === "Filters" && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 4H14M4 8H12M6 12H10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {filter}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Aesthetics Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {aesthetics.map((aesthetic, index) => (
            <motion.div
              key={aesthetic.title}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden aspect-3/2 lg:aspect-4/4 mb-4 shadow-md">
                <motion.img
                  src={aesthetic.image}
                  alt={aesthetic.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Title and Colors */}
              <div className="flex flex-col items-center gap-3">
                <h3 className="text-base font-semibold text-[#1e3a5f]">
                  {aesthetic.title}
                </h3>
                <div className="flex gap-2">
                  {aesthetic.colors.map((color, i) => (
                    <motion.div
                      key={i}
                      className="w-5 h-5 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                      whileHover={{ scale: 1.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add More Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center aspect-3/2 lg:aspect-4/4 rounded-2xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            <motion.div
              className="flex flex-col items-center gap-3 text-gray-500"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Explore More</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default FindYourAesthetic;
