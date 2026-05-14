"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  ShoppingCart,
  Zap,
  CheckCircle,
  XCircle,
  FolderPlus,
  Package,
  Tag,
  Building2,
  Shield,
  Sparkles,
  Layers,
  Droplets,
  Gem,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddToCart } from "@/hooks/use-cart";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { useIsSaved, useToggleSave } from "@/hooks/use-saved";
import { showToast } from "@/components/shared/toast";
import Breadcrumb from "@/components/shared/materials/details/bread-crumb";
import AIVisualizer from "@/components/shared/materials/details/visualizer";
import ProjectCard from "@/components/shared/materials/details/card";
import RatingsReviews from "@/components/shared/materials/details/reviews";
import SimilarStyles from "@/components/shared/materials/details/similar";
import ProductTabs from "@/components/shared/materials/details/tabs";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop";

// ─── Feature icon map ─────────────────────────────────────────────────────────
const FEATURE_ICONS = {
  diamond: Gem,
  waterproof: Droplets,
  sparkles: Sparkles,
  storage: Layers,
  shield: Shield,
};

// ─── Trust badge icon ─────────────────────────────────────────────────────────
function TrustIcon({ index }) {
  const icons = [
    // 100% Authentic
    <svg key="auth" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>,
    // Quality
    <svg key="quality" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>,
    // Fast Delivery
    <svg key="delivery" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>,
    // Expert Support
    <svg key="support" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>,
    // Bogat Promise
    <svg key="promise" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>,
  ];
  return icons[index] ?? icons[0];
}

// ─── Fallback image with gold border ─────────────────────────────────────────
function ProductImage({ src, alt, fill = false, className = "", sizes }) {
  const [errored, setErrored] = useState(false);
  const imgSrc = errored || !src ? PLACEHOLDER : src;

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      onError={() => setErrored(true)}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MaterialDetailClient({
  product = {},
  similarProducts = [],
}) {
  const [quantity, setQuantity] = useState(1);
  const [buyingNow, setBuyingNow] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants?.[0]?.id ?? null,
  );
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const router = useRouter();
  const addToCart = useAddToCart();
  const { isAuthenticated } = useIsAuthenticated();
  const { isSaved, savedId, isLoading: savedLoading } = useIsSaved(product.id);
  const toggleSave = useToggleSave();

  // ── Derived values ────────────────────────────────────────────────────────
  const selectedVariant =
    product.variants?.find((v) => v.id === selectedVariantId) ??
    product.variants?.[0] ??
    null;

  const activePrice = selectedVariant?.price ?? product.price ?? null;
  const activePriceDisplay =
    selectedVariant?.priceDisplay ?? product.priceDisplay ?? null;

  const images = product.images?.length
    ? product.images
    : product.primaryImageUrl
      ? [product.primaryImageUrl]
      : [PLACEHOLDER];

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > (activePrice ?? 0);
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compareAtPrice - activePrice) / product.compareAtPrice) * 100,
      )
    : 0;

  const totalPrice = activePrice != null ? activePrice * quantity : null;

  // Extended fields (graceful if absent)
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const hasFeatures = (product.features?.length ?? 0) > 0;
  const hasMaterialDetails = (product.materialDetails?.length ?? 0) > 0;
  const hasComponents = (product.components?.length ?? 0) > 0;
  const hasTrustBadges = (product.trustBadges?.length ?? 0) > 0;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    const cartProduct = selectedVariant
      ? { ...product, price: selectedVariant.price, priceDisplay: selectedVariant.priceDisplay, name: `${product.name} — ${selectedVariant.label}` }
      : product;
    addToCart.mutate(
      { product: cartProduct, quantity },
      {
        onSuccess: (data) =>
          showToast.success({
            title: "Added to Cart",
            message: data.message || `${quantity}x added successfully.`,
          }),
        onError: (error) =>
          showToast.error({
            title: "Couldn't Add to Cart",
            message: error.message || "Something went wrong.",
          }),
      },
    );
  };

  const handleBuyNow = async () => {
    setBuyingNow(true);
    const cartProduct = selectedVariant
      ? { ...product, price: selectedVariant.price, priceDisplay: selectedVariant.priceDisplay, name: `${product.name} — ${selectedVariant.label}` }
      : product;
    try {
      await addToCart.mutateAsync({ product: cartProduct, quantity });
      router.push("/checkout");
    } catch (error) {
      showToast.error({ title: "Couldn't Process", message: error.message || "Something went wrong." });
      setBuyingNow(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product?.name || "Product", text: product?.shortDescription || "", url: window.location.href });
      } catch (error) {
        if (error.name !== "AbortError")
          showToast.error({ title: "Share Failed", message: "Unable to share." });
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast.success({ title: "Link Copied", message: "Product link copied to your clipboard." });
      } catch {
        showToast.error({ title: "Copy Failed", message: "Unable to copy the link." });
      }
    }
  };

  const handleToggleSave = () => {
    if (!isAuthenticated) {
      window.location.href = "/sign-in?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }
    toggleSave.mutate({ productId: product.id, savedId, isSaved });
  };

  const normalisedSimilar = similarProducts.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.categoryName,
    price: p.price,
    priceDisplay: p.priceDisplay,
    image: p.primaryImageUrl || p.images?.[0] || PLACEHOLDER,
    inStock: p.inStock,
    slug: p.slug,
  }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black font-manrope pt-20">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="border-b border-white/[0.07]" style={{ background: "#0d0b08" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Bogat", href: "/bogat" },
              { label: "Materials", href: "/bogat/materials" },
              { label: product?.categoryName || "Product", href: `/bogat/materials?category=${product?.categoryId}` },
              { label: product?.name || "Product", href: "#" },
            ]}
          />
        </div>
      </div>

      {/* ── Collection header strip ────────────────────────────────────────── */}
      <div
        className="border-b border-[#D4AF37]/20"
        style={{ background: "linear-gradient(90deg, #0d0b08 0%, #111008 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <div className="flex items-center gap-3">
            <span className="text-[#D4AF37] font-poppins font-bold text-sm tracking-wider">
              BOGAT BY TBM.
            </span>
            {product.collection && (
              <>
                <span className="w-px h-4 bg-white/20" />
                <span className="text-white/50 text-xs tracking-widest uppercase">
                  {product.collection}
                  {product.collectionSubtitle && (
                    <> &mdash; {product.collectionSubtitle}</>
                  )}
                </span>
              </>
            )}
          </div>
          {product.tagline && (
            <span className="text-white/35 text-xs tracking-wider italic">
              {product.tagline}
            </span>
          )}
        </div>
      </div>

      {/* ── HERO: image + purchase panel ──────────────────────────────────── */}
      <section style={{ background: "#0a0a08" }} className="border-b border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-10">

            {/* Left — hero image + thumbnail strip */}
            <div className="flex flex-col gap-3">
              {/* Main image */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: "4/3",
                  border: "1px solid rgba(212,175,55,0.2)",
                  background: "#111",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeGalleryIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <ProductImage
                      src={images[activeGalleryIndex]}
                      alt={product?.name || "Product"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Badges overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {product.isFeatured && (
                    <span className="text-[10px] font-bold px-2.5 py-1 tracking-widest uppercase bg-[#D4AF37] text-black">
                      Featured
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="text-[10px] font-bold px-2.5 py-1 tracking-widest uppercase bg-emerald-500 text-white">
                      -{discountPct}% OFF
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveGalleryIndex(i)}
                      className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden transition-all duration-200"
                      style={{
                        border: i === activeGalleryIndex
                          ? "2px solid #D4AF37"
                          : "2px solid rgba(255,255,255,0.08)",
                        background: "#111",
                      }}
                    >
                      <ProductImage
                        src={img}
                        alt={`${product?.name} view ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — product info + purchase */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col gap-5"
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-white leading-tight tracking-tight uppercase">
                    {product?.name || "Product Name"}
                  </h1>
                  {product.tagline && (
                    <p className="mt-1 text-sm text-[#D4AF37]/70 tracking-widest">
                      {product.tagline}
                    </p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: savedLoading ? 1 : 1.1 }}
                  whileTap={{ scale: savedLoading ? 1 : 0.9 }}
                  onClick={handleToggleSave}
                  disabled={savedLoading || toggleSave.isPending}
                  className="shrink-0 w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-50"
                  aria-label={isSaved ? "Remove from saved" : "Save product"}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors duration-200 ${
                      savedLoading ? "text-white/20" : isSaved ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/40 hover:text-[#D4AF37]"
                    }`}
                  />
                </motion.button>
              </div>

              {/* Meta tags */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/40">
                {product.brandName && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {product.brandName}
                  </span>
                )}
                {product.categoryName && (
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {product.categoryName}
                  </span>
                )}
                {product.sku && product.sku !== "null" && (
                  <span className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" />
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="inline-flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <CheckCircle className="text-emerald-400 w-4 h-4 shrink-0" />
                    <span className="text-sm text-emerald-400 font-medium">
                      {product.trackInventory && product.stockQuantity != null
                        ? `${product.stockQuantity} units in stock`
                        : "In Stock & Ready to Ship"}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500 w-4 h-4 shrink-0" />
                    <span className="text-sm text-red-400 font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* ── Variant / size selector ─────────────────────────────── */}
              {hasVariants && (
                <div
                  className="rounded-none p-4 space-y-3"
                  style={{
                    background: "#0d0b08",
                    border: "1px solid rgba(212,175,55,0.15)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#D4AF37] tracking-widest uppercase">
                      Available Sizes & Prices
                    </p>
                  </div>
                  <div className="space-y-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className="w-full flex items-center justify-between px-4 py-3 transition-all duration-200"
                        style={{
                          background:
                            selectedVariantId === variant.id
                              ? "rgba(212,175,55,0.08)"
                              : "rgba(255,255,255,0.02)",
                          border:
                            selectedVariantId === variant.id
                              ? "1px solid rgba(212,175,55,0.5)"
                              : "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        <div className="flex items-center gap-3 text-left">
                          {variant.image && (
                            <div className="relative w-10 h-10 shrink-0 overflow-hidden" style={{ background: "#1a1a1a" }}>
                              <ProductImage
                                src={variant.image}
                                alt={variant.label}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-white">{variant.label}</p>
                            {variant.dimensions && (
                              <p className="text-xs text-white/35 mt-0.5">{variant.dimensions}</p>
                            )}
                          </div>
                        </div>
                        <span
                          className="text-base font-bold shrink-0"
                          style={{
                            color:
                              selectedVariantId === variant.id
                                ? "#D4AF37"
                                : "rgba(255,255,255,0.7)",
                          }}
                        >
                          {variant.priceDisplay}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Price (no variants OR fallback) ──────────────────────── */}
              {!hasVariants && (
                <div>
                  {product.showPrice ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-white">{activePriceDisplay}</span>
                      {hasDiscount && (
                        <span className="text-base text-white/30 line-through">
                          ₦{product.compareAtPrice?.toLocaleString()}.00
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xl font-semibold text-[#D4AF37]">Request Price</span>
                  )}
                </div>
              )}

              {/* ── Quantity (show only if there's a price and in stock) ── */}
              {product.showPrice && product.inStock && (
                <div
                  className="rounded-none p-4 space-y-2"
                  style={{ background: "#0d0b08", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-xs font-semibold text-white/40 tracking-widest uppercase">Quantity</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-white/10 overflow-hidden">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/05 transition-colors text-lg font-medium"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-white font-semibold">{quantity}</span>
                      <button
                        onClick={() =>
                          setQuantity((q) =>
                            product.stockQuantity ? Math.min(product.stockQuantity, q + 1) : q + 1,
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/05 transition-colors text-lg font-medium"
                      >
                        +
                      </button>
                    </div>
                    {totalPrice != null && (
                      <p className="text-sm text-white/40">
                        Total:{" "}
                        <span className="font-semibold text-white">
                          ₦{totalPrice.toLocaleString()}.00
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ── CTA buttons ──────────────────────────────────────────── */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleBuyNow}
                  disabled={buyingNow || addToCart.isPending || !product.inStock}
                  className="w-full py-4 text-black font-manrope font-bold text-[11px] tracking-[0.25em] uppercase flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8942e 100%)" }}
                >
                  <Zap className="w-4 h-4" />
                  {buyingNow ? "Processing…" : product.inStock ? "Buy Now" : "Out of Stock"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending || buyingNow || !product.inStock}
                  className="w-full py-4 border border-white/15 text-white font-manrope font-bold text-[11px] tracking-[0.25em] uppercase hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {addToCart.isPending && !buyingNow ? "Adding…" : "Add to Cart"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleShare}
                  className="w-full py-3 border border-white/08 text-white/50 font-medium hover:border-white/15 hover:text-white/80 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share Product
                </motion.button>
              </div>

              {/* ── AI Visualizer & Project Card ──────────────────────── */}
              <div className="space-y-3">
                <AIVisualizer />
                <ProjectCard
                  title="Master Bath Renovation"
                  description="This item matches the moodboard for your active project"
                  icon={<FolderPlus className="w-5 h-5 text-[#D4AF37]/40" />}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Feature badges strip ──────────────────────────────────────────── */}
      {hasFeatures && (
        <section
          className="border-b border-white/[0.07]"
          style={{ background: "#0d0b08" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div
              className="grid gap-px"
              style={{
                gridTemplateColumns: `repeat(${Math.min(product.features.length, 5)}, 1fr)`,
              }}
            >
              {product.features.map((feat, i) => {
                const Icon = FEATURE_ICONS[feat.icon] ?? Shield;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex flex-col items-center gap-3 px-4 py-6 text-center"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    <div
                      className="w-11 h-11 flex items-center justify-center"
                      style={{
                        background: "rgba(212,175,55,0.1)",
                        border: "1px solid rgba(212,175,55,0.25)",
                      }}
                    >
                      <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white tracking-wider uppercase leading-tight">
                        {feat.label}
                      </p>
                      {feat.description && (
                        <p className="text-xs text-white/35 mt-1">{feat.description}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Material details + component highlights ───────────────────────── */}
      {(hasMaterialDetails || hasComponents) && (
        <section
          className="border-b border-white/[0.07]"
          style={{ background: "#090907" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

              {/* Material close-ups */}
              {hasMaterialDetails && (
                <div>
                  <p className="text-[10px] font-bold text-[#D4AF37] tracking-[0.25em] uppercase mb-5">
                    Material Details
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {product.materialDetails.map((mat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex flex-col gap-2"
                      >
                        <div
                          className="relative w-full overflow-hidden"
                          style={{
                            aspectRatio: "1/1",
                            background: "#111",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <ProductImage
                            src={mat.image}
                            alt={mat.label}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 33vw, 15vw"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#D4AF37] tracking-wider uppercase leading-tight">
                            {mat.label}
                          </p>
                          {mat.subtitle && (
                            <p className="text-[11px] text-white/40 mt-0.5 leading-snug">
                              {mat.subtitle}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Component highlights */}
              {hasComponents && (
                <div>
                  <p className="text-[10px] font-bold text-[#D4AF37] tracking-[0.25em] uppercase mb-5">
                    Component Highlights
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {product.components.map((comp, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex flex-col gap-2"
                      >
                        <div
                          className="relative w-full overflow-hidden"
                          style={{
                            aspectRatio: "4/3",
                            background: "#111",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <ProductImage
                            src={comp.image}
                            alt={comp.label}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 20vw"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white tracking-wider uppercase leading-tight">
                            {comp.label}
                          </p>
                          {comp.description && (
                            <p className="text-[11px] text-white/40 mt-0.5">{comp.description}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Trust badges bar ──────────────────────────────────────────────── */}
      {hasTrustBadges && (
        <section
          className="border-b border-white/[0.07]"
          style={{ background: "#0d0b08" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div
              className="grid gap-px"
              style={{ gridTemplateColumns: `repeat(${Math.min(product.trustBadges.length, 5)}, 1fr)` }}
            >
              {product.trustBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-2 px-4 py-4 text-center sm:text-left"
                >
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center text-[#D4AF37]">
                    <TrustIcon index={i} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-white tracking-wider uppercase">
                      {badge.label}
                    </p>
                    {badge.description && (
                      <p className="text-[10px] text-white/35 mt-0.5 leading-snug">
                        {badge.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Product tabs / specs ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProductTabs material={product} />
      </div>

      {/* ── Ratings & reviews ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <RatingsReviews
          averageRating={product?.rating || 4.5}
          totalReviews={product?.reviewCount || 0}
          ratingDistribution={
            product?.ratingDistribution || { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 }
          }
        />
      </div>

      {/* ── Similar products ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <SimilarStyles materials={normalisedSimilar} />
      </div>
    </div>
  );
}
