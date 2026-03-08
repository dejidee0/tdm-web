// components/cart/RelatedProducts.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAddToCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop";

// Fetch a small selection of featured products to show as related
async function fetchFeaturedProducts() {
  const res = await fetch(
    "/api/products?isFeatured=true&pageSize=4&ActiveOnly=true",
  );
  if (!res.ok) return [];
  const json = await res.json();
  return json.data?.items ?? [];
}

export default function RelatedProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "featured-for-cart"],
    queryFn: fetchFeaturedProducts,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

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
            {/* Image */}
            <Link href={`/materials/${product.slug}`}>
              <div className="relative aspect-square bg-[#f5f5f5] overflow-hidden">
                <Image
                  src={
                    product.primaryImageUrl ||
                    product.images?.[0] ||
                    PLACEHOLDER
                  }
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/materials/${product.slug}`}>
                <h3 className="text-[15px] font-semibold text-primary mb-1 line-clamp-2 min-h-[40px] hover:underline">
                  {product.name}
                </h3>
              </Link>
              <p className="text-[12px] text-[#999999] mb-3">
                {product.categoryName} · {product.brandName}
              </p>

              <div className="flex items-center justify-between gap-2">
                {product.showPrice ? (
                  <span className="text-[16px] font-bold text-primary">
                    {product.priceDisplay}
                  </span>
                ) : (
                  <span className="text-[13px] font-semibold text-primary">
                    Request Price
                  </span>
                )}

                {product.inStock && (
                  <button
                    onClick={() =>
                      addToCart.mutate(
                        { product, quantity: 1 },
                        {
                          onSuccess: () => {},
                        },
                      )
                    }
                    disabled={addToCart.isPending}
                    className="p-2 bg-primary text-white rounded-lg hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 shrink-0"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
