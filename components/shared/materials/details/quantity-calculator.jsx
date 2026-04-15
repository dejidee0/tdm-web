"use client";

import { Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function QuantityCalculator({
  quantity,
  setQuantity,
  boxes,
  totalPrice,
}) {
  const increment = () => setQuantity((prev) => prev + 10);
  const decrement = () => setQuantity((prev) => Math.max(10, prev - 10));

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(Math.max(0, value));
  };

  return (
    <div className="p-2 space-y-4">
      {/* Quantity Input */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={decrement}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 hover:bg-white/05 transition-colors"
          >
            <Minus className="w-4 h-4 text-white/60" />
          </motion.button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              className="w-20 text-center text-lg font-semibold text-white border-b-2 border-white/10 focus:border-[#D4AF37] outline-none transition-colors bg-transparent"
              min="0"
              step="10"
            />
            <span className="text-sm text-white/50">sq ft</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={increment}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 hover:bg-white/05 transition-colors"
          >
            <Plus className="w-4 h-4 text-white/60" />
          </motion.button>
        </div>

        <div className="text-right">
          <div className="text-sm text-white/50">{boxes} Boxes</div>
        </div>
      </div>

      {/* Total Price */}
      <div className="flex items-center justify-between pt-4 border-t border-white/08">
        <span className="text-sm font-medium text-white/60">Total</span>
        <span className="text-2xl font-bold text-white">
          ₦{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
