"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { useIsSaved, useToggleSave } from "@/hooks/use-saved";
import { useAddToCart } from "@/hooks/use-cart";
import { showToast } from "@/components/shared/toast";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop";

function HeartIcon({ filled, loading, className = "w-4 h-4" }) {
  return (
    <svg
      className={`${className} transition-colors duration-200 ${
        loading ? "fill-none text-white/20" : filled ? "fill-red-500 text-red-500" : "fill-none text-white/40"
      }`}
      stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function SaveButton({ productId, className = "", iconClass = "w-4 h-4" }) {
  const { isAuthenticated } = useIsAuthenticated();
  const { isSaved, savedId, isLoading } = useIsSaved(productId);
  const toggleSave = useToggleSave();

  const handleClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = "/sign-in?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }
    toggleSave.mutate({ productId, savedId, isSaved });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || toggleSave.isPending}
      className={`flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-60 ${className}`}
      aria-label={isSaved ? "Remove from saved" : "Save item"}
    >
      <HeartIcon filled={isSaved} loading={isLoading} className={iconClass} />
    </button>
  );
}

export default function ProductCard({ product, viewMode = "grid" }) {
  const imageUrl = product.primaryImageUrl || product.images?.[0] || PLACEHOLDER;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const detailHref = `/materials/${product.slug || product.id}`;
  const addToCart = useAddToCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart.mutate(
      { product, quantity: 1 },
      {
        onSuccess: () => showToast.success({ title: "Added to Cart", message: `${product.name} added.` }),
        onError: (err) => showToast.error({ title: "Couldn't Add", message: err.message || "Try again." }),
      }
    );
  };

  if (viewMode === "list") {
    return (
      <Link href={detailHref}>
        <motion.div
          whileHover={{ y: -2 }}
          className="overflow-hidden cursor-pointer flex gap-0 transition-colors"
          style={{ background: "#0d0b08", boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}
        >
          <div className="relative w-48 shrink-0" style={{ background: "#1a1a1a" }}>
            <Image src={imageUrl} alt={product.name} fill className="object-cover" />
            {product.isFeatured && (
              <span className="absolute top-2 left-2 text-xs font-medium px-2 py-1 bg-[#D4AF37] text-black font-manrope">
                Featured
              </span>
            )}
          </div>
          <div className="p-4 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wide font-manrope">
                  {product.categoryName} · {product.brandName}
                </p>
                <SaveButton productId={product.id} className="w-8 h-8 bg-white/05 shrink-0" iconClass="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-white mb-1 line-clamp-1 font-poppins">{product.name}</h3>
              <p className="text-sm text-white/45 line-clamp-2 mb-3 font-manrope">{product.shortDescription || product.description}</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                {product.showPrice ? (
                  <>
                    <span className="text-xl font-bold text-white">{product.priceDisplay}</span>
                    {hasDiscount && <span className="text-sm text-white/35 line-through">₦{product.compareAtPrice?.toLocaleString()}.00</span>}
                  </>
                ) : (
                  <span className="text-base font-bold text-white font-manrope">Request Price</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 font-manrope ${
                  product.inStock ? "bg-green-900/30 text-green-400" : "bg-red-900/20 text-red-400"
                }`}>
                  {product.inStock ? `${product.stockQuantity ?? "✓"} in stock` : "Out of stock"}
                </span>
                <button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending || !product.inStock}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-white/12 text-sm font-semibold text-white/70 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors font-manrope disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {addToCart.isPending ? "Adding…" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={detailHref}>
      <motion.div
        whileHover={{ y: -4 }}
        className="overflow-hidden cursor-pointer h-full flex flex-col transition-all"
        style={{ background: "#0d0b08", boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}
      >
        <div className="relative h-48 sm:h-56 lg:h-64 shrink-0" style={{ background: "#1a1a1a" }}>
          <Image src={imageUrl} alt={product.name} fill className="object-cover" />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <span className="text-xs font-medium px-2 py-1 bg-[#D4AF37] text-black font-manrope">Featured</span>
            )}
            {hasDiscount && (
              <span className="text-xs font-medium px-2 py-1 bg-[#D4AF37] text-black font-manrope">-{discountPct}%</span>
            )}
            {product.productTypeName === "Service" && (
              <span className="text-xs font-medium px-2 py-1 bg-black/60 text-white font-manrope">Service</span>
            )}
          </div>

          <SaveButton
            productId={product.id}
            className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm border border-white/10"
            iconClass="w-4 h-4"
          />
        </div>

        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs text-white/35 font-semibold uppercase tracking-wide mb-1 font-manrope">
            {product.categoryName} · {product.brandName}
          </p>
          <h3 className="font-semibold text-white mb-1 line-clamp-2 flex-1 font-poppins">{product.name}</h3>
          <p className="text-sm text-white/45 mb-3 line-clamp-2 font-manrope">{product.shortDescription || product.description}</p>

          <div className="flex items-center gap-1.5 mb-3">
            {product.inStock ? (
              <>
                <svg className="w-4 h-4 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-400 font-manrope">
                  {product.trackInventory ? `${product.stockQuantity} units in stock` : "In Stock"}
                </p>
              </>
            ) : (
              <p className="text-sm text-red-400 font-medium font-manrope">Out of Stock</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto">
            <div>
              {product.showPrice ? (
                <>
                  <span className="text-xl font-bold text-white">{product.priceDisplay}</span>
                  {hasDiscount && (
                    <div className="text-xs text-white/35 line-through mt-0.5">₦{product.compareAtPrice?.toLocaleString()}.00</div>
                  )}
                </>
              ) : (
                <span className="text-base font-bold text-white font-manrope">Request Price</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={addToCart.isPending || !product.inStock}
              className="flex items-center gap-2 px-4 py-2 border border-white/12 text-sm font-semibold text-white/60 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors w-full sm:w-auto justify-center font-manrope disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {addToCart.isPending ? "Adding…" : "Add to Cart"}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
