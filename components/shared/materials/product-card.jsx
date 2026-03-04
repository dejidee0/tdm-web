"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop";

export default function ProductCard({ product, viewMode = "grid" }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const imageUrl =
    product.primaryImageUrl || product.images?.[0] || PLACEHOLDER;
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;

  // Always use product.id as the canonical route identifier
  const detailHref = `/materials/${product.id}`;

  if (viewMode === "list") {
    return (
      <Link href={detailHref}>
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-0"
        >
          <div className="relative w-48 shrink-0 bg-gray-100">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.isFeatured && (
              <span className="absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded bg-primary text-white">
                Featured
              </span>
            )}
          </div>
          <div className="p-4 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs text-primary font-semibold uppercase tracking-wide">
                  {product.categoryName} · {product.brandName}
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsFavorite(!isFavorite);
                  }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform shrink-0"
                >
                  <svg
                    className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "fill-none text-gray-400"}`}
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
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {product.shortDescription || product.description}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                {product.showPrice ? (
                  <>
                    <span className="text-xl font-bold text-gray-900">
                      {product.priceDisplay}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-400 line-through">
                        ₦{product.compareAtPrice?.toLocaleString()}.00
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-base font-semibold text-primary">
                    Request Price
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {product.inStock
                    ? `${product.stockQuantity ?? "✓"} in stock`
                    : "Out of stock"}
                </span>
                <button
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-semibold text-primary hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
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
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={detailHref}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative h-48 sm:h-56 lg:h-64 bg-gray-100 shrink-0">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-primary text-white">
                Featured
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-500 text-white">
                -{discountPct}%
              </span>
            )}
            {product.productTypeName === "Service" && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-purple-600 text-white">
                Service
              </span>
            )}
          </div>

          {/* Favorite */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <svg
              className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "fill-none text-gray-400"}`}
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

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1">
            <p className="text-xs text-primary font-semibold uppercase tracking-wide">
              {product.categoryName} · {product.brandName}
            </p>
          </div>

          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 flex-1">
            {product.name}
          </h3>

          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {product.shortDescription || product.description}
          </p>

          {/* Stock */}
          <div className="flex items-center gap-1.5 mb-3">
            {product.inStock ? (
              <>
                <svg
                  className="w-4 h-4 text-green-600 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-green-700">
                  {product.trackInventory
                    ? `${product.stockQuantity} units in stock`
                    : "In Stock"}
                </p>
              </>
            ) : (
              <p className="text-sm text-red-600 font-medium">Out of Stock</p>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto">
            <div>
              {product.showPrice ? (
                <>
                  <span className="text-xl font-bold text-gray-900">
                    {product.priceDisplay}
                  </span>
                  {hasDiscount && (
                    <div className="text-xs text-gray-400 line-through mt-0.5">
                      ₦{product.compareAtPrice?.toLocaleString()}.00
                    </div>
                  )}
                </>
              ) : (
                <span className="text-base font-semibold text-primary">
                  Request Price
                </span>
              )}
            </div>
            <button
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-semibold text-primary hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
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
