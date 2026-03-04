// components/cart/CartItem.jsx
"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useUpdateQuantity, useRemoveItem } from "@/hooks/use-cart";
import { useState } from "react";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop";

export default function CartItem({ item, index }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const updateQuantity = useUpdateQuantity();
  const removeItem = useRemoveItem();

  const handleQuantityChange = (newQty) => {
    const clamped = Math.max(
      1,
      item.stockQuantity ? Math.min(item.stockQuantity, newQty) : newQty,
    );
    setQuantity(clamped);
    updateQuantity.mutate({ itemId: item.id, quantity: clamped });
  };

  const handleRemove = () => {
    removeItem.mutate(item.id);
  };

  // Compute total price display
  const totalPrice =
    item.price != null ? (item.price * quantity).toLocaleString() : null;

  const isInStock = item.inStock !== false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_140px_40px] gap-4">
        {/* Product Details */}
        <div className="flex gap-4">
          <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-[#f5f5f5] rounded-lg overflow-hidden">
            <Image
              src={item.image || PLACEHOLDER}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80px, 96px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-primary mb-1 line-clamp-2">
              {item.name}
            </h3>
            {item.sku && (
              <p className="text-[13px] text-[#666666] mb-1">SKU: {item.sku}</p>
            )}
            {(item.brandName || item.categoryName) && (
              <p className="text-[12px] text-[#999999] mb-2">
                {[item.brandName, item.categoryName]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            <span
              className={`inline-block px-2.5 py-1 text-[11px] font-medium rounded-md ${
                isInStock
                  ? "bg-[#dcfce7] text-[#166534]"
                  : "bg-[#fee2e2] text-[#991b1b]"
              }`}
            >
              {isInStock ? "In Stock" : "Out of Stock"}
            </span>
            {item.price != null && (
              <p className="text-[12px] text-[#999999] mt-2">
                ₦{item.price.toLocaleString()}/unit
              </p>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex md:justify-center items-start">
          <div className="inline-flex items-center border border-[#e5e5e5] rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || updateQuantity.isPending}
              className="p-2 hover:bg-[#f5f5f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4 text-[#666666]" />
            </button>
            <input
              type="number"
              value={quantity}
              min={1}
              max={item.stockQuantity || undefined}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
              className="w-16 text-center text-[14px] font-medium text-primary border-x border-[#e5e5e5] py-2 focus:outline-none"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={
                updateQuantity.isPending ||
                (item.stockQuantity != null && quantity >= item.stockQuantity)
              }
              className="p-2 hover:bg-[#f5f5f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 text-[#666666]" />
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="flex md:justify-end items-start">
          <div className="text-right">
            {totalPrice != null ? (
              <p className="text-[18px] font-bold text-primary">
                ₦{totalPrice}
              </p>
            ) : (
              <p className="text-[14px] font-semibold text-primary">
                Request Price
              </p>
            )}
            <p className="text-[12px] text-[#666666] mt-0.5">
              {quantity} unit{quantity !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Delete */}
        <div className="flex md:justify-end items-start">
          <button
            onClick={handleRemove}
            disabled={removeItem.isPending}
            className="p-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
