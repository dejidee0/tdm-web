"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const TrendingSection = () => {
  const [wishlist, setWishlist] = useState([]);

  const products = [
    {
      id: 1,
      name: "Sverom chair",
      price: "N65,000",
      image: "/product-1.jpg", // Replace with your image paths
    },
    {
      id: 2,
      name: "Sverom chair",
      price: "N65,000",
      image: "/product-2.jpg",
    },
    {
      id: 3,
      name: "Sverom chair",
      price: "N65,000",
      image: "/product-3.jpg",
    },
    {
      id: 4,
      name: "Sverom chair",
      price: "N65,000",
      image: "/product-4.png",
    },
  ];

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  return (
    <section className="py-16 sm:py-20 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-primary font-bold text-gray-900 mb-4 sm:mb-6"
          >
            Top Trending
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl font-inter text-gray-600 max-w-3xl mx-auto"
          >
            Find a bright ideal to suit your taste with our great selection of
            suspension, wall, floor and table lights.
          </motion.p>
          {/* Decorative underline */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center mt-4"
          >
            <div className="w-20 h-1 bg-blue-900 rounded-full"></div>
          </motion.div>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 0.4 + index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Product Image Container */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ scale: 1.2, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5 + index * 0.1,
                    ease: "easeOut",
                  }}
                  className="w-full h-full"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>

                {/* Wishlist Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.4,
                    delay: 0.7 + index * 0.1,
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 200,
                  }}
                  onClick={() => toggleWishlist(product.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                  aria-label="Add to wishlist"
                >
                  <motion.div
                    animate={
                      wishlist.includes(product.id)
                        ? { scale: [1, 1.3, 1] }
                        : {}
                    }
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 ${
                        wishlist.includes(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </motion.div>
                </motion.button>
              </div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + index * 0.1,
                  ease: "easeOut",
                }}
                className="p-5 sm:p-6"
              >
                <h3 className="text-base sm:text-lg text-gray-500 mb-1 sm:mb-2">
                  {product.name}
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {product.price}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
