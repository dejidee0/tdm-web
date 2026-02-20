// components/shared/materials/product-card.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const renderBadge = (badge) => {
    const badgeStyles = {
      "Best Seller": "bg-primary text-white",
      "New Arrival": "bg-[#3d2817] text-white",
      "Designer Pick": "bg-purple-600 text-white",
      "Eco-Friendly": "bg-emerald-500 text-white",
    };

    return (
      <span
        className={`text-xs font-medium px-2 py-1 rounded ${
          badgeStyles[badge] || "bg-gray-600 text-white"
        }`}
      >
        {badge}
      </span>
    );
  };

  return (
    <Link href={`/materials/${product.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative h-64 bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.badges?.map((badge, index) => (
              <div key={index}>{renderBadge(badge)}</div>
            ))}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <svg
              className={`w-5 h-5 ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "fill-none text-gray-400"
              }`}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex justify-between">
            <p className="text-xs text-primary font-semibold font-manrope uppercase tracking-wide mb-1">
              {product.materialType}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  {product.rating}
                </span>
              </div>
              <span className="text-xs text-gray-400">({product.reviews})</span>
            </div>
          </div>

          <h3 className="font-semibold font-manrope text-text-black mb-2 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-start gap-2 mb-4">
            <svg
              className="w-4 h-4 text-green-600 mt-0.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-green-700">{product.stock.quantity}</p>
              {product.stock.bundleOffer && (
                <p className="text-xs text-blue-600 mt-1">
                  {product.stock.bundleOffer}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                /{product.unit}
              </span>
            </div>
            <button
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-sm font-semibold text-primary hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Visualize
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
