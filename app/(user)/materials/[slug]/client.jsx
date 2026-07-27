"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  ShoppingCart,
  CheckCircle,
  XCircle,
  FolderPlus,
  Package,
  Tag,
  Building2,
  Shield,
  Star,
  Layers,
  Droplets,
  Gem,
  Clock,
  Ruler,
  Sparkles,
  Truck,
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

// Variants carry a raw price number, not a formatted string. Match the shape of
// the backend's product-level `priceDisplay` ("₦850,000.00").
function formatNaira(amount) {
  if (amount == null) return null;
  return Number(amount).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
}

// ─── Feature icon map ─────────────────────────────────────────────────────────
const FEATURE_ICONS = {
  diamond: Gem,
  waterproof: Droplets,
  star: Star,
  storage: Layers,
  shield: Shield,
};

// ─── Made-to-order reassurance, from the catalogue's ordering notes ────────────
const ORDERING_NOTES = [
  {
    Icon: Clock,
    label: "Made to order",
    description: "Handcrafted in 8–12 weeks after your drawings are approved.",
  },
  {
    Icon: Sparkles,
    label: "One-of-a-kind stone",
    description: "Veining and colour vary — every slab is natural and unique.",
  },
  {
    Icon: Ruler,
    label: "Site survey included",
    description: "We measure and assess the wall before production begins.",
  },
  {
    Icon: Truck,
    label: "Bespoke widths",
    description: "Custom dimensions quoted individually on request.",
  },
];

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
  // Variants carry a raw `price` number and no `priceDisplay`, so format it
  // here to match the backend's product-level string ("₦850,000.00"). Fall
  // back to the product's own display when no variant is selected.
  const activePriceDisplay =
    selectedVariant != null
      ? formatNaira(selectedVariant.price)
      : (product.priceDisplay ?? null);

  // Real product images are ProductImageDto objects ({ imageUrl }); normalise to
  // URL strings. `hasRealImages` drives an honest branded placeholder instead of
  // a stock photo when the catalogue has no photography yet (currently 0/120).
  const galleryUrls = (product.images ?? [])
    .map((img) => (typeof img === "string" ? img : img?.imageUrl))
    .filter(Boolean);
  const primaryUrl = product.primaryImageUrl || galleryUrls[0] || null;
  const hasRealImages = galleryUrls.length > 0 || Boolean(product.primaryImageUrl);
  const images = galleryUrls.length ? galleryUrls : primaryUrl ? [primaryUrl] : [];

  // Bogat (brandType 2) is a made-to-order bespoke collection: 8–12 week lead
  // time, natural-stone variation, site survey before production. The page must
  // say so rather than borrow fast-moving-stock language ("ready to ship").
  const isMadeToOrder = product.brandType === 2;

  // The catalogue seeds compareAtPrice as the largest size's price, so every
  // product would otherwise flash a bogus "-56% OFF". Never show a discount on a
  // made-to-order piece — the price is a starting point, not a markdown.
  const hasDiscount =
    !isMadeToOrder &&
    product.compareAtPrice &&
    product.compareAtPrice > (activePrice ?? 0);
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compareAtPrice - activePrice) / product.compareAtPrice) * 100,
      )
    : 0;

  const totalPrice = activePrice != null ? activePrice * quantity : null;

  // Extended fields (graceful if absent)
  const hasVariants = (product.variants?.length ?? 0) > 0;

  // Lowest size price, for the "From ₦X" headline. These are starting prices;
  // the final quote moves with stone, finish and bespoke dimensions.
  const fromPrice = hasVariants
    ? Math.min(...product.variants.map((v) => v.price))
    : (product.price ?? null);
  const fromPriceDisplay = fromPrice != null ? formatNaira(fromPrice) : null;

  // The backend returns `keyFeatures` as a string[]; the mock used `features`
  // as objects. Normalise to the { label } shape the strip renders, preferring
  // real data. Icon/description are absent on real data — the strip degrades to
  // a default icon and no subtext.
  const featureList =
    (product.keyFeatures?.length
      ? product.keyFeatures.map((label) => ({ label }))
      : product.features) ?? [];
  const hasFeatures = featureList.length > 0;
  const hasMaterialDetails = (product.materialDetails?.length ?? 0) > 0;
  const hasComponents = (product.components?.length ?? 0) > 0;
  const hasTrustBadges = (product.trustBadges?.length ?? 0) > 0;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    const cartProduct = selectedVariant
      ? {
          ...product,
          price: selectedVariant.price,
          priceDisplay: selectedVariant.priceDisplay,
          name: `${product.name} — ${selectedVariant.label}`,
        }
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
      ? {
          ...product,
          price: selectedVariant.price,
          priceDisplay: selectedVariant.priceDisplay,
          name: `${product.name} — ${selectedVariant.label}`,
        }
      : product;
    try {
      await addToCart.mutateAsync({ product: cartProduct, quantity });
      router.push("/checkout");
    } catch (error) {
      showToast.error({
        title: "Couldn't Process",
        message: error.message || "Something went wrong.",
      });
      setBuyingNow(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || "Product",
          text: product?.shortDescription || "",
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== "AbortError")
          showToast.error({
            title: "Share Failed",
            message: "Unable to share.",
          });
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast.success({
          title: "Link Copied",
          message: "Product link copied to your clipboard.",
        });
      } catch {
        showToast.error({
          title: "Copy Failed",
          message: "Unable to copy the link.",
        });
      }
    }
  };

  const handleToggleSave = () => {
    if (!isAuthenticated) {
      window.location.assign(
        "/sign-in?redirect=" + encodeURIComponent(window.location.pathname),
      );
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
      <div
        className="border-b border-white/[0.07]"
        style={{ background: "#0d0b08" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Bogat", href: "/bogat" },
              { label: "Materials", href: "/bogat/materials" },
              {
                label: product?.categoryName || "Product",
                href: `/bogat/materials?category=${product?.categoryId}`,
              },
              { label: product?.name || "Product", href: "#" },
            ]}
          />
        </div>
      </div>

      {/* ── Collection header strip ────────────────────────────────────────── */}
      <div
        className="border-b border-[#D4AF37]/20"
        style={{
          background: "linear-gradient(90deg, #0d0b08 0%, #111008 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <div className="flex items-center gap-3">
            <span className="text-[#D4AF37] font-poppins font-bold text-sm tracking-wider">
              BOGAT BY TBM.
            </span>
            {product.categoryName && (
              <>
                <span className="w-px h-4 bg-white/20" />
                <span className="text-white/50 text-xs tracking-widest uppercase">
                  {product.categoryName}
                  {product.shortDescription && (
                    <> &mdash; {product.shortDescription}</>
                  )}
                </span>
              </>
            )}
          </div>
          {isMadeToOrder && (
            <span className="text-white/35 text-xs tracking-wider italic">
              Made to order &middot; Bespoke natural stone
            </span>
          )}
        </div>
      </div>

      {/* ── HERO: image + purchase panel ──────────────────────────────────── */}
      <section
        style={{ background: "#0a0a08" }}
        className="border-b border-white/6"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5 lg:gap-10">
            {/* Left — hero image + thumbnail strip. Sticky on desktop so the
                image tracks the scroll instead of leaving dead space beside the
                taller purchase panel. */}
            <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
              {/* Main image */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: "4/3",
                  border: "1px solid rgba(212,175,55,0.2)",
                  background: "#0d0b09",
                }}
              >
                {hasRealImages ? (
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
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  // Honest placeholder: the catalogue has no photography yet.
                  // A stock photo here would misrepresent a bespoke stone piece.
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6"
                    style={{ background: "radial-gradient(circle at 50% 35%, #14110b 0%, #0a0a08 70%)" }}
                  >
                    <span className="font-poppins font-bold text-[#D4AF37] tracking-[0.3em] text-sm uppercase">
                      BOGAT
                    </span>
                    <span className="text-white/80 font-poppins text-lg tracking-wide">
                      {product?.name}
                    </span>
                    <span className="text-white/30 text-[11px] tracking-[0.25em] uppercase">
                      {product?.categoryName}
                    </span>
                    <span className="mt-2 text-white/25 text-[11px] tracking-wider">
                      Studio photography in production
                    </span>
                  </div>
                )}

                {/* Badges overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {isMadeToOrder && (
                    <span className="text-[11px] font-bold px-2.5 py-1 tracking-widest uppercase bg-[#D4AF37] text-black">
                      Made to Order
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="text-[11px] font-bold px-2.5 py-1 tracking-widest uppercase bg-white/10 text-white border border-white/20">
                      Featured
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="text-[11px] font-bold px-2.5 py-1 tracking-widest uppercase bg-emerald-500 text-white">
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
                        border:
                          i === activeGalleryIndex
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
                  <h1 className="font-poppins font-bold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight tracking-tight uppercase">
                    {product?.name || "Product Name"}
                  </h1>
                  {product.shortDescription && (
                    <p className="mt-1 text-sm text-[#D4AF37]/70 tracking-widest">
                      {product.shortDescription}
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
                      savedLoading
                        ? "text-white/20"
                        : isSaved
                          ? "fill-[#D4AF37] text-[#D4AF37]"
                          : "text-white/40 hover:text-[#D4AF37]"
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

              {/* Availability — made-to-order pieces lead with the lead time,
                  not stock counts, so a bespoke item never reads as off-the-shelf. */}
              <div className="inline-flex items-center gap-2">
                {isMadeToOrder ? (
                  <>
                    <Clock className="text-[#D4AF37] w-4 h-4 shrink-0" />
                    <span className="text-sm text-[#D4AF37] font-medium">
                      Made to order &middot; Ships in 8–12 weeks
                    </span>
                  </>
                ) : product.inStock ? (
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
                    <span className="text-sm text-red-400 font-medium">
                      Out of Stock
                    </span>
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
                  {/* From-price headline: the starting point of the range, so a
                      buyer sees the entry price before scanning every size. */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-white/40 tracking-widest uppercase">
                        Starting from
                      </p>
                      <p className="text-2xl font-bold text-white leading-tight">
                        {fromPriceDisplay}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-[#D4AF37] tracking-widest uppercase pb-1">
                      Select size
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
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {variant.size}
                            </p>
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
                          {formatNaira(variant.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                  {isMadeToOrder && (
                    <p className="text-[11px] text-white/35 leading-relaxed pt-1">
                      Recommended starting prices. Final quote varies with stone
                      selection, finish and bespoke dimensions. Excludes VAT,
                      delivery and installation.
                    </p>
                  )}
                </div>
              )}

              {/* ── Price (no variants OR fallback) ──────────────────────── */}
              {!hasVariants && (
                <div>
                  {product.showPrice ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-white">
                        {activePriceDisplay}
                      </span>
                      {hasDiscount && (
                        <span className="text-base text-white/30 line-through">
                          ₦{product.compareAtPrice?.toLocaleString()}.00
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xl font-semibold text-[#D4AF37]">
                      Request Price
                    </span>
                  )}
                </div>
              )}

              {/* ── Quantity (show only if there's a price and in stock) ── */}
              {product.showPrice && product.inStock && (
                <div
                  className="rounded-none p-4 space-y-2"
                  style={{
                    background: "#0d0b08",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p className="text-xs font-semibold text-white/40 tracking-widest uppercase">
                    Quantity
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-white/10 overflow-hidden">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/05 transition-colors text-lg font-medium"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-white font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity((q) =>
                            product.stockQuantity
                              ? Math.min(product.stockQuantity, q + 1)
                              : q + 1,
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
                  disabled={
                    buyingNow || addToCart.isPending || !product.inStock
                  }
                  className="w-full py-4 text-white font-manrope font-bold text-[11px] tracking-[0.25em] uppercase flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  style={{
                    background: "linear-gradient(180deg, #E8C230 0%, #B8940A 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.18), 0 0 0 1px rgba(184,148,10,0.6), 0 0 22px rgba(212,175,55,0.32)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.45)",
                  }}
                >
                  {buyingNow
                    ? "Processing…"
                    : !product.inStock
                      ? "Out of Stock"
                      : isMadeToOrder
                        ? "Reserve This Piece"
                        : "Buy Now"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAddToCart}
                  disabled={
                    addToCart.isPending || buyingNow || !product.inStock
                  }
                  className="w-full py-4 border border-white/15 text-white font-manrope font-bold text-[11px] tracking-[0.25em] uppercase hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {addToCart.isPending && !buyingNow
                    ? "Adding…"
                    : "Add to Cart"}
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

                {isMadeToOrder && (
                  <p className="text-[11px] text-white/35 leading-relaxed text-center">
                    Reserve your size and finish now — our design team confirms
                    the final quote, stone selection and 8–12 week timeline
                    before any payment is taken.
                  </p>
                )}
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
            <div className="grid gap-px grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {featureList.map((feat, i) => {
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
                      <Icon
                        className="w-5 h-5 text-[#D4AF37]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white tracking-wider uppercase leading-tight">
                        {feat.label}
                      </p>
                      {feat.description && (
                        <p className="text-xs text-white/35 mt-1">
                          {feat.description}
                        </p>
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
                  <p className="text-[16px] font-bold text-[#D4AF37] tracking-[0.25em] uppercase mb-5">
                    Material Details
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                  <p className="text-[16px] font-bold text-[#D4AF37] tracking-[0.25em] uppercase mb-5">
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
                            <p className="text-[11px] text-white/40 mt-0.5">
                              {comp.description}
                            </p>
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

      {/* ── Made-to-order reassurance ─────────────────────────────────────────
          The trust content that a high-ticket bespoke buyer needs, from the
          catalogue's ordering notes. Static brand/policy copy — not per-product
          data — shown for the made-to-order collection. */}
      {isMadeToOrder && (
        <section
          className="border-b border-white/[0.07]"
          style={{ background: "#0d0b08" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid gap-px grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {ORDERING_NOTES.map(({ Icon, label, description }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 px-4 py-4"
                >
                  <div className="shrink-0 w-9 h-9 flex items-center justify-center text-[#D4AF37]"
                    style={{
                      background: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.2)",
                    }}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-white tracking-wide">
                      {label}
                    </p>
                    <p className="text-[12px] text-white/40 mt-0.5 leading-snug">
                      {description}
                    </p>
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
        {/* Real values only — no invented rating. A 4.5 with 0 reviews is a
            fabricated trust signal; the component shows an honest empty state. */}
        <RatingsReviews
          averageRating={product?.rating ?? 0}
          totalReviews={product?.reviewCount ?? 0}
          ratingDistribution={product?.ratingDistribution ?? null}
        />
      </div>

      {/* ── Similar products ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <SimilarStyles materials={normalisedSimilar} />
      </div>
    </div>
  );
}
