"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddToCart } from "@/hooks/use-cart";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { useIsSaved, useToggleSave } from "@/hooks/use-saved";
import { showToast } from "@/components/shared/toast";
import Breadcrumb from "@/components/shared/materials/details/bread-crumb";
import ImageGallery from "@/components/shared/materials/details/image-gallery";
import AIVisualizer from "@/components/shared/materials/details/visualizer";
import ProjectCard from "@/components/shared/materials/details/card";
import RatingsReviews from "@/components/shared/materials/details/reviews";
import SimilarStyles from "@/components/shared/materials/details/similar";
import ProductTabs from "@/components/shared/materials/details/tabs";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop";

export default function MaterialDetailClient({
  product = {},
  similarProducts = [],
}) {
  const [quantity, setQuantity] = useState(1);
  const [buyingNow, setBuyingNow] = useState(false);

  const router = useRouter();
  const addToCart = useAddToCart();
  const { isAuthenticated } = useIsAuthenticated();
  const { isSaved, savedId, isLoading: savedLoading } = useIsSaved(product.id);
  const toggleSave = useToggleSave();

  const images = product.images?.length
    ? product.images
    : product.primaryImageUrl
      ? [product.primaryImageUrl]
      : [PLACEHOLDER];

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > (product.price ?? 0);
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;

  const totalPrice = product.price != null ? product.price * quantity : null;

  const handleAddToCart = () => {
    addToCart.mutate(
      { product, quantity },
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
    try {
      await addToCart.mutateAsync({ product, quantity });
      router.push("/checkout");
    } catch (error) {
      showToast.error({ title: "Couldn't Process", message: error.message || "Something went wrong." });
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
      window.location.href =
        "/sign-in?redirect=" + encodeURIComponent(window.location.pathname);
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

  return (
    <div className="min-h-screen bg-black font-manrope pt-20">
      {/* Breadcrumb bar */}
      <div className="border-b border-white/08" style={{ background: "#0d0b08" }}>
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Materials", href: "/materials" },
              {
                label: product?.categoryName || "Product",
                href: `/materials?category=${product?.categoryId}`,
              },
              { label: product?.name || "Product", href: "#" },
            ]}
          />
        </div>
      </div>

      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ImageGallery
            images={images}
            productName={product?.name || "Product"}
          />

          <div className="w-full max-w-full overflow-hidden">
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.isFeatured && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-linear-to-br from-[#D4AF37] to-[#b8942e] text-black">
                    Featured
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                    -{discountPct}% OFF
                  </span>
                )}
                {product.productTypeName === "Service" && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/08 text-white/60 border border-white/10">
                    Service
                  </span>
                )}
              </div>

              {/* Title & Save */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-poppins font-bold text-3xl text-white leading-tight flex-1 min-w-0">
                  {product?.name || "Product Name"}
                </h1>
                <motion.button
                  whileHover={{ scale: savedLoading ? 1 : 1.1 }}
                  whileTap={{ scale: savedLoading ? 1 : 0.95 }}
                  onClick={handleToggleSave}
                  disabled={savedLoading || toggleSave.isPending}
                  className="shrink-0 w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-60"
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

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/40">
                {product.brandName && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {product.brandName}
                  </span>
                )}
                {product.categoryName && (
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    {product.categoryName}
                  </span>
                )}
                {product.sku && product.sku !== "null" && (
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1">
                {product.showPrice ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-white">
                      {product.priceDisplay}
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

              {/* Stock */}
              <div className="inline-flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <CheckCircle className="text-emerald-400 w-5 h-5" />
                    <span className="text-sm font-medium text-emerald-400">
                      {product.trackInventory && product.stockQuantity != null
                        ? `${product.stockQuantity} units in stock`
                        : "In Stock & Ready to Ship"}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500 w-5 h-5" />
                    <span className="text-sm font-medium text-red-400">
                      Out of Stock
                    </span>
                  </>
                )}
              </div>

              {/* Quantity */}
              {product.showPrice && product.inStock && (
                <div className="rounded-xl border border-white/08 p-4 space-y-3" style={{ background: "#0d0b08" }}>
                  <p className="text-sm font-medium text-white/50">Quantity</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
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
                      <div className="text-sm text-white/40">
                        Total:{" "}
                        <span className="font-semibold text-white">
                          ₦{totalPrice.toLocaleString()}.00
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Purchase actions */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleBuyNow}
                  disabled={buyingNow || addToCart.isPending || !product.inStock}
                  className="w-full py-4 rounded-xl bg-linear-to-br from-[#D4AF37] to-[#b8942e] text-black font-manrope font-semibold text-[11px] tracking-[0.2em] uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Zap className="w-5 h-5" />
                  {buyingNow ? "Processing…" : product.inStock ? "Buy Now" : "Out of Stock"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending || buyingNow || !product.inStock}
                  className="w-full py-4 rounded-xl border border-white/15 text-white font-manrope font-semibold text-[11px] tracking-[0.2em] uppercase hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addToCart.isPending && !buyingNow ? "Adding…" : "Add to Cart"}
                </motion.button>
              </div>

              {/* Share */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleShare}
                className="w-full py-3 rounded-xl border border-white/10 text-white/60 font-medium hover:border-white/20 hover:text-white hover:bg-white/05 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Product
              </motion.button>

              <div className="w-full">
                <AIVisualizer />
              </div>
              <div className="w-full">
                <ProjectCard
                  title="Master Bath Renovation"
                  description="This item matches the moodboard for your active project"
                  icon={<FolderPlus className="w-5 h-5 text-[#D4AF37]/40" />}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <ProductTabs material={product} />
        </div>
        <div className="mb-12">
          <RatingsReviews
            averageRating={product?.rating || 4.5}
            totalReviews={product?.reviewCount || 0}
            ratingDistribution={
              product?.ratingDistribution || { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 }
            }
          />
        </div>
        <SimilarStyles materials={normalisedSimilar} />
      </div>
    </div>
  );
}
