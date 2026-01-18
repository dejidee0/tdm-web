"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Share2,
  Star,
  Package,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";
import Breadcrumb from "@/components/shared/materials/details/bread-crumb";
import ImageGallery from "@/components/shared/materials/details/image-gallery";
import QuantityCalculator from "@/components/shared/materials/details/quantity-calculator";
import AIVisualizer from "@/components/shared/materials/details/visualizer";
import ProjectCard from "@/components/shared/materials/details/card";

import RatingsReviews from "@/components/shared/materials/details/reviews";
import SimilarStyles from "@/components/shared/materials/details/similar";
import ProductTabs from "@/components/shared/materials/details/tabs";

export default function MaterialDetailClient({
  material = {},
  similarMaterials = [],
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(200);

  const handleAddToCart = () => {
    // Add to cart logic
    console.log("Adding to cart:", { materialId: material?.id, quantity });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: material?.name || "Product",
          text: material?.description || "",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Add API call to save favorite
  };

  // Calculate values with safe fallbacks
  const boxSize = material?.boxSize || 10; // sq ft per box
  const boxes = Math.ceil(quantity / boxSize);
  const totalPrice = quantity * (material?.pricePerSqFt || 0);

  return (
    <div className="min-h-screen bg-gray-50 font-manrope pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Renovation", href: "/renovation" },
              { label: "Tiles", href: "/renovation/tiles" },
              { label: material?.category || "Carrara Marble", href: "#" },
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Image Gallery */}
          <ImageGallery
            images={material?.images || []}
            productName={material?.name || "Product"}
          />

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Title & Favorite */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-semibold text-primary leading-tight">
                {material?.name || "Product Name"}
              </h1>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFavorite}
                className="shrink-0 w-10 h-10 flex items-center justify-center hover:border-primary transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? "fill-primary text-primary" : "text-primary"
                  }`}
                />
              </motion.button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(material?.rating || 4.8)
                        ? "fill-primary text-primary"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {material?.reviewCount || 42} reviews
              </span>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${material?.pricePerSqFt?.toFixed(2) || "8.50"}
                </span>
                <span className="text-base text-gray-500">/ sq. ft</span>
              </div>
              <p className="text-sm text-gray-800">
                Sold in boxes of {boxes} sq ft (
                {material?.boxSizeImperial || "900 BF / box"})
              </p>
            </div>

            {/* Stock Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full">
              <CheckCircle className="text-primary w-5 h-5" />
              <span className="text-sm font-medium text-primary">
                In Stock & Ready to Ship
              </span>
            </div>

            {/* Quantity Calculator */}
            <QuantityCalculator
              quantity={quantity}
              setQuantity={setQuantity}
              boxes={boxes}
              totalPrice={totalPrice}
            />

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAddToCart}
              className="w-[90%] mx-auto py-4 bg-primary text-white font-semibold rounded-lg hover:bg-[#0f172a] transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleShare}
              className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Project
            </motion.button>

            {/* AI Visualizer */}
            <div className="">
              <AIVisualizer />
            </div>

            {/* Project Card */}
            <div className="">
              <ProjectCard
                title="Master Bath Renovation"
                description="This item matches the moodboard for your active project"
                icon={<Package className="w-5 h-5 text-blue-600" />}
              />
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mb-12">
          <ProductTabs material={material} />
        </div>

        {/* Ratings & Reviews */}
        <div className="mb-12">
          <RatingsReviews
            averageRating={material?.rating || 4.8}
            totalReviews={material?.reviewCount || 42}
            ratingDistribution={
              material?.ratingDistribution || {
                5: 78,
                4: 15,
                3: 5,
                2: 2,
                1: 0,
              }
            }
          />
        </div>

        {/* Similar Styles */}
        <SimilarStyles materials={similarMaterials} />
      </div>
    </div>
  );
}
