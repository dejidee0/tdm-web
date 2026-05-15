"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";
import { BOGAT_PRODUCTS } from "@/lib/mock/bogat-products";

// Pick 8 products to display — featured ones first
const SHOWCASE_PRODUCTS = [
  ...BOGAT_PRODUCTS.filter((p) => p.isFeatured),
  ...BOGAT_PRODUCTS.filter((p) => !p.isFeatured),
].slice(0, 8);

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=600&fit=crop";

function ProductCard({ product, index }) {
  const imageUrl = product.primaryImageUrl || PLACEHOLDER;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link href={`/materials/${product.slug}`} className="block group">
        <div
          className="overflow-hidden"
          style={{
            background: "#0d0b08",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Image */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "4/3" }}
          >
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Featured badge */}
            {product.isFeatured && (
              <span className="absolute top-3 left-3 text-[16px] font-bold px-2 py-1 tracking-widest uppercase bg-[#D4AF37] text-black">
                Featured
              </span>
            )}

            {/* Category badge */}
            <span className="absolute top-3 right-3 text-[16px] font-semibold px-2 py-1 tracking-wide uppercase text-white/80 bg-black/50 backdrop-blur-sm border border-white/10">
              {product.categoryName}
            </span>

            {/* Hover CTA */}
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white tracking-widest uppercase">
                View Product
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-[16px] text-white/35 font-semibold uppercase tracking-widest mb-1.5">
              {product.brandName}
            </p>
            <h3 className="font-poppins font-semibold text-white text-sm leading-snug mb-2 line-clamp-1 group-hover:text-[#D4AF37] transition-colors duration-200">
              {product.name}
            </h3>

            <div className="flex items-center justify-between gap-2">
              <div>
                {product.showPrice ? (
                  <span className="text-sm font-bold text-white">
                    {product.variants?.length > 0
                      ? `From ${product.priceDisplay}`
                      : product.priceDisplay}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-[#D4AF37]">
                    Request Price
                  </span>
                )}
              </div>
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                  <span className="text-[11px] text-white/50">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function MaterialsBogatSection() {
  return (
    <section
      className="py-20 sm:py-28 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #080806 0%, #0a0a08 60%, #050503 100%)",
      }}
    >
      {/* Subtle gold glow top */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] font-manrope text-[16px] font-bold uppercase tracking-[0.3em] mb-3 flex items-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Bogat&apos;s Marketplace
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.07 }}
              className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight"
            >
              Materials by <span className="text-[#D4AF37]">Bogat</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="mt-3 text-white/45 text-sm font-manrope leading-relaxed max-w-md"
            >
              Premium bathroom fittings, kitchen fixtures, and luxury finishes —
              sourced, priced, and delivered across Nigeria.
            </motion.p>
          </div>

          {/* Desktop CTA */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="hidden sm:block shrink-0"
          >
            <Link
              href="/bogat/materials"
              className="btn-outline"
            >
              Browse All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* ── Product grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {SHOWCASE_PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* ── Bottom row: trust chips + mobile CTA ─────────────────── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Trust chips */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2">
            {[
              "100% Authentic",
              "Fast Delivery — Abuja & Lagos",
              "Expert Support",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-[11px] text-white/35 font-manrope"
              >
                <span className="w-1 h-1 rounded-full bg-[#D4AF37]/60 shrink-0" />
                {item}
              </span>
            ))}
          </div>

          {/* Mobile CTA */}
          <Link
            href="/bogat/materials"
            className="btn-gold sm:hidden w-full justify-center py-3.5"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse All Products
          </Link>

          {/* Desktop secondary CTA */}
          <Link
            href="/bogat/materials"
            className="btn-gold hidden sm:inline-flex px-8 py-3.5"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop All Materials
          </Link>
        </div>
      </div>
    </section>
  );
}
