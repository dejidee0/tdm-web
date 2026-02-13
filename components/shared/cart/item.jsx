// components/cart/CartItem.jsx
"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useUpdateQuantity, useRemoveItem } from "@/hooks/use-cart";
import { useState } from "react";

export default function CartItem({ item, index }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const updateQuantity = useUpdateQuantity();
  const removeItem = useRemoveItem();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    updateQuantity.mutate({ itemId: item.id, quantity: newQuantity });
  };

  const handleRemove = () => {
    if (confirm(`Remove ${item.name} from cart?`)) {
      removeItem.mutate(item.id);
    }
  };

  const totalPrice = item.price * quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_140px_40px] gap-4 md:gap-4">
        {/* Product Details */}
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-[#f5f5f5] rounded-lg overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80px, 96px"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-primary mb-1 line-clamp-2">
              {item.name}
            </h3>
            <p className="text-[13px] text-[#666666] mb-2">SKU: {item.sku}</p>
            <span
              className={`inline-block px-2.5 py-1 text-[11px] font-medium rounded-md ${
                item.stockStatus === "In Stock"
                  ? "bg-[#dcfce7] text-[#166534]"
                  : "bg-[#e0e7ff] text-[#3730a3]"
              }`}
            >
              {item.stockStatus}
            </span>
            {item.unit && (
              <p className="text-[12px] text-[#999999] mt-2">
                ${item.price.toFixed(2)}/{item.unit}
              </p>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex md:justify-center items-start">
          <div className="inline-flex items-center border border-[#e5e5e5] rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={item.isPriceFixed || quantity <= 1}
              className="p-2 hover:bg-[#f5f5f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4 text-[#666666]" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
              disabled={item.isPriceFixed}
              className="w-16 text-center text-[14px] font-medium text-primary border-x border-[#e5e5e5] py-2 focus:outline-none disabled:bg-gray-50"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={item.isPriceFixed}
              className="p-2 hover:bg-[#f5f5f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 text-[#666666]" />
            </button>
          </div>
          {item.isPriceFixed && (
            <span className="ml-2 text-[11px] text-[#999999] mt-2">Fixed</span>
          )}
        </div>

        {/* Price */}
        <div className="flex md:justify-end items-start">
          <div className="text-right">
            <p className="text-[18px] font-bold text-primary">
              ${totalPrice.toFixed(2)}
            </p>
            {!item.isPriceFixed && item.unit && (
              <p className="text-[12px] text-[#666666] mt-0.5">
                {quantity} {item.unit}
              </p>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <div className="flex md:justify-end items-start">
          <button
            onClick={handleRemove}
            className="p-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
