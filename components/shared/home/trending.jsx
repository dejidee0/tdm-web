"use client";

import React, { useState } from "react";
import Image from "next/image";
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
        : [...prev, productId]
    );
  };

  return (
    <section className="py-16 sm:py-20 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-primary font-bold text-gray-900 mb-4 sm:mb-6">
            Top Trending
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-inter text-gray-600 max-w-3xl mx-auto">
            Find a bright ideal to suit your taste with our great selection of
            suspension, wall, floor and table lights.
          </p>
          {/* Decorative underline */}
          <div className="flex justify-center mt-4">
            <div className="w-20 h-1 bg-blue-900 rounded-full"></div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Product Image Container */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 ${
                      wishlist.includes(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5 sm:p-6">
                <h3 className="text-base sm:text-lg text-gray-500 mb-1 sm:mb-2">
                  {product.name}
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
