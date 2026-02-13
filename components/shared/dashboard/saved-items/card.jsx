// components/dashboard/saved/SavedItemCard.jsx
"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingCart, LayoutGrid } from "lucide-react";
import Image from "next/image";
import {
  useRemoveFromSaved,
  useAddToCart,
  useAddToMoodboard,
} from "@/hooks/use-saved-items";

export default function SavedItemCard({
  item,
  index,
  isSelected,
  onToggleSelect,
}) {
  const removeFromSaved = useRemoveFromSaved();
  const addToCart = useAddToCart();
  const addToMoodboard = useAddToMoodboard();

  const handleRemove = (e) => {
    e.stopPropagation();
    removeFromSaved.mutate(item.id);
  };

  const handleAddToCart = () => {
    if (!item.price) return;

    addToCart.mutate(
      { itemId: item.id, quantity: 1 },
      {
        onSuccess: () => {
          alert(`${item.name} added to cart!`);
        },
      },
    );
  };

  const handleAddToMoodboard = () => {
    addToMoodboard.mutate(
      { itemId: item.id },
      {
        onSuccess: () => {
          alert(`${item.name} added to moodboard!`);
        },
      },
    );
  };

  // Determine tag style
  const getTagStyle = (tag) => {
    switch (tag) {
      case "SALE":
        return "bg-[#3b82f6] text-white";
      case "INSPIRATION":
        return "bg-[#9333EAE5] text-white";
      case "FURNITURE":
        return "bg-primary text-white";
      case "FIXTURE":
        return "bg-primary text-white";
      default:
        return "bg-primary text-white";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden hover:shadow-lg transition-all group"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[#f5f5f5] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {/* Category Tag */}
        {item.tags && item.tags.length > 0 && (
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 ${getTagStyle(item.tags[0])} text-[11px] font-semibold rounded-md uppercase tracking-wide`}
          >
            {item.tags[0]}
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart className="w-5 h-5 fill-[#ef4444] text-[#ef4444]" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="mb-2">
          <h3 className="text-[15px] font-semibold text-primary line-clamp-1 mb-1">
            {item.name}
          </h3>
          {item.price ? (
            <div className="flex items-baseline gap-2">
              <span className="text-[18px] font-bold text-primary">
                ${item.price.toFixed(2)}
              </span>
              {item.originalPrice && (
                <span className="text-[14px] text-[#999999] line-through">
                  ${item.originalPrice.toFixed(2)}
                </span>
              )}
              {item.unit && (
                <span className="text-[13px] text-[#666666]">/{item.unit}</span>
              )}
            </div>
          ) : null}
        </div>

        {/* Subcategory and Stock */}
        <div className="mb-4">
          <p className="text-[13px] text-[#666666] line-clamp-1">
            {item.subcategory}
            {item.stockStatus && ` • ${item.stockStatus}`}
          </p>
        </div>

        {/* Action Button */}
        {item.isInspirationBoard ? (
          <button
            onClick={handleAddToMoodboard}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-primary hover:text-white  text-primary rounded-lg text-[14px] font-medium hover:opacity-90 transition-opacity"
          >
            <LayoutGrid className="w-4 h-4" />
            Add to Moodboard
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!item.price}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary/5 text-primary hover:text-white rounded-lg text-[14px] font-medium hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>
    </motion.div>
  );
}
