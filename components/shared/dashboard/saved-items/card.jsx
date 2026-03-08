// components/shared/dashboard/saved-items/card.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, CheckSquare, Square } from "lucide-react";
import { useRemoveSaved, useAddSavedToCart } from "@/hooks/use-saved";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop";

export default function SavedItemCard({
  item,
  index,
  isSelected,
  onToggleSelect,
}) {
  const removeSaved = useRemoveSaved();
  const addToCart = useAddSavedToCart();

  // Normalise field names — backend may use different casing
  const name = item.productName || item.name || "Unnamed Item";
  const category = item.categoryName || item.category || "";
  const image =
    item.productImageUrl || item.imageUrl || item.image || PLACEHOLDER;
  const price = item.price;
  const priceDisplay =
    item.priceDisplay || (price ? `₦${price.toLocaleString()}.00` : null);
  const inStock = item.inStock ?? item.isAvailable ?? true;
  const slug = item.productSlug || item.slug;
  const detailHref = slug ? `/materials/${slug}` : "#";

  const handleRemove = (e) => {
    e.preventDefault();
    removeSaved.mutate({ savedId: item.id });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart.mutate({ savedId: item.id });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-200 ${
        isSelected
          ? "border-primary shadow-md"
          : "border-[#e5e5e5] hover:shadow-md"
      }`}
    >
      {/* Selection checkbox */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleSelect(item.id);
        }}
        className="absolute top-3 left-3 z-10 transition-opacity"
        aria-label="Select item"
      >
        {isSelected ? (
          <CheckSquare className="w-5 h-5 text-primary drop-shadow-sm" />
        ) : (
          <Square className="w-5 h-5 text-white drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>

      {/* Remove button */}
      <button
        onClick={handleRemove}
        disabled={removeSaved.isPending}
        className="absolute top-3 right-3 z-10 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 disabled:opacity-50"
        aria-label="Remove from saved"
      >
        <Trash2 className="w-3.5 h-3.5 text-red-500" />
      </button>

      {/* Image */}
      <Link href={detailHref}>
        <div className="relative aspect-square bg-[#f5f5f5] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Out of stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xs font-semibold px-3 py-1 bg-black/60 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        {category && (
          <p className="text-[11px] font-semibold text-primary uppercase tracking-wide mb-1 truncate">
            {category}
          </p>
        )}
        <Link href={detailHref}>
          <h3 className="text-[14px] font-semibold text-[#1a1a1a] line-clamp-2 leading-snug mb-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-3">
          {priceDisplay ? (
            <span className="text-[15px] font-bold text-[#1a1a1a]">
              {priceDisplay}
            </span>
          ) : (
            <span className="text-[13px] font-semibold text-primary">
              Request Price
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={addToCart.isPending || !inStock}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {addToCart.isPending ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}
