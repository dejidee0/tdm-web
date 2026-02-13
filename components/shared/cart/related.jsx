// components/cart/RelatedProducts.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRelatedProducts, useAddToCart } from "@/hooks/use-cart";
import { ShoppingCart, Star } from "lucide-react";

export default function RelatedProducts() {
  const { data: products, isLoading } = useRelatedProducts();
  const addToCart = useAddToCart();

  if (isLoading || !products || products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-16"
    >
      <h2 className="text-[28px] font-bold text-primary mb-8">
        You might also need
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-[#f5f5f5] overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-[15px] font-semibold text-primary mb-2 line-clamp-2 min-h-[40px]">
                {product.name}
              </h3>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                  <span className="text-[13px] font-medium text-primary">
                    {product.rating}
                  </span>
                </div>
              )}

              {/* Price and Add Button */}
              <div className="flex items-center justify-between">
                <span className="text-[18px] font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  onClick={() => {
                    addToCart.mutate(product.id, {
                      onSuccess: () => {
                        alert(`${product.name} added to cart!`);
                      },
                    });
                  }}
                  disabled={addToCart.isPending}
                  className="p-2 bg-primary text-white rounded-lg hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
