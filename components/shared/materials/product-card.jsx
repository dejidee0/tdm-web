"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { useIsSaved, useToggleSave } from "@/hooks/use-saved";

function HeartIcon({ filled, loading, className = "w-4 h-4" }) {
  return (
    <svg
      className={`${className} transition-colors duration-200 ${
        loading
          ? "fill-none text-white/20"
          : filled
            ? "fill-[#D4AF37] text-[#D4AF37]"
            : "fill-none text-white/60"
      }`}
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function SaveButton({ productId, className = "", iconClass = "w-4 h-4" }) {
  const { isAuthenticated } = useIsAuthenticated();
  const { isSaved, savedId, isLoading } = useIsSaved(productId);
  const toggleSave = useToggleSave();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.assign(
        "/sign-in?redirect=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }
    toggleSave.mutate({ productId, savedId, isSaved });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || toggleSave.isPending}
      className={`flex items-center justify-center transition-transform hover:scale-110 disabled:opacity-60 ${className}`}
      aria-label={isSaved ? "Remove from saved" : "Save item"}
    >
      <HeartIcon filled={isSaved} loading={isLoading} className={iconClass} />
    </button>
  );
}

// An honest branded panel when a piece has no photography yet — a stock photo
// would misrepresent a bespoke stone product.
function ImagePlaceholder({ name, categoryName }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4"
      style={{
        background: "radial-gradient(circle at 50% 35%, #14110b 0%, #0a0a08 72%)",
      }}
    >
      <span className="font-poppins font-bold text-[#D4AF37] tracking-[0.3em] text-[11px] uppercase">
        BOGAT
      </span>
      <span className="text-white/70 font-poppins text-sm leading-snug line-clamp-2">
        {name}
      </span>
      {categoryName && (
        <span className="text-white/25 text-[10px] tracking-[0.22em] uppercase">
          {categoryName}
        </span>
      )}
    </div>
  );
}

export default function ProductCard({ product, viewMode = "grid" }) {
  const imageUrl = product.primaryImageUrl || product.images?.[0] || null;
  const hasImage = Boolean(imageUrl);
  const detailHref = `/materials/${product.slug || product.id}`;

  // Bogat (brandType 2) is made to order — never show fast-stock language, and
  // frame the price as a starting point ("From"), never a fixed sticker.
  const isMadeToOrder = product.brandType === 2;
  const priceLabel = product.showPrice
    ? product.priceDisplay
    : "Request price";

  // ── List view ──────────────────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <Link href={detailHref} className="group block">
        <div
          className="flex overflow-hidden bg-[#0d0b08] transition-colors"
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}
        >
          <div className="relative w-40 sm:w-56 shrink-0 overflow-hidden">
            <div className="relative aspect-[4/5] sm:aspect-auto sm:h-full">
              {hasImage ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="224px"
                />
              ) : (
                <ImagePlaceholder
                  name={product.name}
                  categoryName={product.categoryName}
                />
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]/70 font-manrope">
                  {product.categoryName}
                </p>
                <SaveButton productId={product.id} iconClass="w-4 h-4" />
              </div>
              <h3 className="font-poppins text-lg font-semibold text-white leading-snug">
                {product.name}
              </h3>
              {product.shortDescription && (
                <p className="mt-1.5 text-sm text-white/45 line-clamp-2 font-manrope">
                  {product.shortDescription}
                </p>
              )}
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                {product.showPrice && isMadeToOrder && (
                  <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                    From
                  </span>
                )}
                <span className="font-poppins text-lg font-semibold text-white">
                  {priceLabel}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 transition-colors group-hover:text-[#D4AF37]">
                View
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ── Grid view ────────────────────────────────────────────────────────────────
  return (
    <Link href={detailHref} className="group block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="flex h-full flex-col overflow-hidden bg-[#0d0b08]"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <ImagePlaceholder
              name={product.name}
              categoryName={product.categoryName}
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {isMadeToOrder && (
              <span className="bg-[#D4AF37] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-black font-manrope">
                Made to Order
              </span>
            )}
            {product.isFeatured && (
              <span className="border border-white/25 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm font-manrope">
                Featured
              </span>
            )}
          </div>

          <SaveButton
            productId={product.id}
            className="absolute right-3 top-3 h-9 w-9 border border-white/10 bg-black/40 backdrop-blur-sm"
            iconClass="w-4 h-4"
          />

          {/* Hover affordance — the card funnels to the detail page. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
              View piece
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]/70 font-manrope">
            {product.categoryName}
          </p>
          <h3 className="font-poppins text-[15px] font-semibold leading-snug text-white line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-auto pt-4">
            <div className="flex items-baseline gap-2">
              {product.showPrice && isMadeToOrder && (
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                  From
                </span>
              )}
              <span className="font-poppins text-lg font-semibold text-white">
                {priceLabel}
              </span>
            </div>
            {isMadeToOrder && (
              <p className="mt-1 text-[11px] text-white/35 font-manrope">
                Made to order · 8–12 weeks
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
