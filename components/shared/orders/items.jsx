// components/orders/OrderItems.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function OrderItems({ items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl border border-[#e5e5e5] p-6"
    >
      <h2 className="text-[18px] font-semibold text-primary mb-6">
        Items in this shipment ({items?.length || 0})
      </h2>

      <div className="space-y-6">
        {items?.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            className="flex gap-4 pb-6 border-b border-[#e5e5e5] last:border-0 last:pb-0"
          >
            {/* Product Image */}
            <div className="relative w-20 h-20 shrink-0 bg-[#f5f5f5] rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-primary mb-1">
                {item.name}
              </h3>
              <p className="text-[13px] text-[#666666] mb-2">
                {item.description}
              </p>
            </div>

            {/* Quantity and Price */}
            <div className="text-right shrink-0">
              <p className="text-[13px] text-[#666666] mb-1">
                Qty: {item.quantity}
                {item.quantityUnit ? ` ${item.quantityUnit}` : ""}
              </p>
              <p className="text-[16px] font-bold text-primary">
                ${item.price.toFixed(2)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
