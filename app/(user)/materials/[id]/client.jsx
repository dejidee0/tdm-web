"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Share2,
  ShoppingCart,
  CheckCircle,
  XCircle,
  FolderPlus,
  Package,
  Tag,
  Building2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAddToCart } from "@/hooks/use-cart";
import { showToast } from "@/components/shared/toast";
import Breadcrumb from "@/components/shared/materials/details/bread-crumb";
import ImageGallery from "@/components/shared/materials/details/image-gallery";
import AIVisualizer from "@/components/shared/materials/details/visualizer";
import ProjectCard from "@/components/shared/materials/details/card";
import RatingsReviews from "@/components/shared/materials/details/reviews";
import SimilarStyles from "@/components/shared/materials/details/similar";
import ProductTabs from "@/components/shared/materials/details/tabs";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop";

export default function MaterialDetailClient({
  product = {},
  similarProducts = [],
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const addToCart = useAddToCart();

  // ── Normalise product shape from real API ─────────────────────────────────
  const images = product.images?.length
    ? product.images
    : product.primaryImageUrl
      ? [product.primaryImageUrl]
      : [PLACEHOLDER];

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > (product.price ?? 0);
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;

  const totalPrice = product.price != null ? product.price * quantity : null;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    addToCart.mutate(
      { product, quantity },
      {
        onSuccess: (data) => {
          showToast.success({
            title: "Added to Cart",
            message: data.message || `${quantity}x added successfully.`,
          });
        },
        onError: (error) => {
          showToast.error({
            title: "Couldn't Add to Cart",
            message: error.message || "Something went wrong. Please try again.",
          });
        },
      },
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || "Product",
          text: product?.shortDescription || product?.description || "",
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          showToast.error({
            title: "Share Failed",
            message: "Unable to share. Please try again.",
          });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast.success({
          title: "Link Copied",
          message: "Product link copied to your clipboard.",
        });
      } catch {
        showToast.error({
          title: "Copy Failed",
          message: "Unable to copy the link.",
        });
      }
    }
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => {
      const next = !prev;
      if (next)
        showToast.success({
          title: "Saved",
          message: "Added to your saved items.",
        });
      else
        showToast.info({
          title: "Removed",
          message: "Removed from your saved items.",
        });
      return next;
    });
  };

  // ── Normalise similar products for SimilarStyles component ───────────────
  const normalisedSimilar = similarProducts.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.categoryName,
    price: p.price,
    priceDisplay: p.priceDisplay,
    image: p.primaryImageUrl || p.images?.[0] || PLACEHOLDER,
    inStock: p.inStock,
    slug: p.slug,
  }));

  return (
    <div className="min-h-screen bg-gray-50 font-manrope pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Materials", href: "/materials" },
              {
                label: product?.categoryName || "Product",
                href: `/materials?category=${product?.categoryId}`,
              },
              { label: product?.name || "Product", href: "#" },
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left — Image Gallery */}
          <ImageGallery
            images={images}
            productName={product?.name || "Product"}
          />

          {/* Right — Product Details */}
          <div className="w-full max-w-full overflow-hidden">
            <div className="space-y-6">
              {/* Badges row */}
              <div className="flex flex-wrap gap-2">
                {product.isFeatured && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary text-white">
                    Featured
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500 text-white">
                    -{discountPct}% OFF
                  </span>
                )}
                {product.productTypeName === "Service" && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-600 text-white">
                    Service
                  </span>
                )}
              </div>

              {/* Title & Favourite */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-semibold text-primary leading-tight flex-1 min-w-0">
                  {product?.name || "Product Name"}
                </h1>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFavorite}
                  className="shrink-0 w-10 h-10 flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorite ? "fill-primary text-primary" : "text-primary"}`}
                  />
                </motion.button>
              </div>

              {/* Meta row — brand, category, SKU */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                {product.brandName && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {product.brandName}
                  </span>
                )}
                {product.categoryName && (
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    {product.categoryName}
                  </span>
                )}
                {product.sku && product.sku !== "null" && (
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1">
                {product.showPrice ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {product.priceDisplay}
                    </span>
                    {hasDiscount && (
                      <span className="text-base text-gray-400 line-through">
                        ₦{product.compareAtPrice?.toLocaleString()}.00
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xl font-semibold text-primary">
                    Request Price
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full">
                {product.inStock ? (
                  <>
                    <CheckCircle className="text-primary w-5 h-5" />
                    <span className="text-sm font-medium text-primary">
                      {product.trackInventory && product.stockQuantity != null
                        ? `${product.stockQuantity} units in stock`
                        : "In Stock & Ready to Ship"}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500 w-5 h-5" />
                    <span className="text-sm font-medium text-red-600">
                      Out of Stock
                    </span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              {product.showPrice && product.inStock && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Quantity</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-gray-900 font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity((q) =>
                            product.stockQuantity
                              ? Math.min(product.stockQuantity, q + 1)
                              : q + 1,
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
                      >
                        +
                      </button>
                    </div>
                    {totalPrice != null && (
                      <div className="text-sm text-gray-600">
                        Total:{" "}
                        <span className="font-semibold text-gray-900">
                          ₦{totalPrice.toLocaleString()}.00
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAddToCart}
                disabled={addToCart.isPending || !product.inStock}
                className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {addToCart.isPending
                  ? "Adding..."
                  : product.inStock
                    ? "Add to Cart"
                    : "Out of Stock"}
              </motion.button>

              {/* Share */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleShare}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Product
              </motion.button>

              {/* AI Visualizer */}
              <div className="w-full">
                <AIVisualizer />
              </div>

              {/* Project Card */}
              <div className="w-full">
                <ProjectCard
                  title="Master Bath Renovation"
                  description="This item matches the moodboard for your active project"
                  icon={<FolderPlus className="w-5 h-5 text-primary/40" />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs — description, specs, etc. */}
        <div className="mb-12">
          <ProductTabs material={product} />
        </div>

        {/* Ratings & Reviews */}
        <div className="mb-12">
          <RatingsReviews
            averageRating={product?.rating || 4.5}
            totalReviews={product?.reviewCount || 0}
            ratingDistribution={
              product?.ratingDistribution || { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 }
            }
          />
        </div>

        {/* Similar Products */}
        <SimilarStyles materials={normalisedSimilar} />
      </div>
    </div>
  );
}
