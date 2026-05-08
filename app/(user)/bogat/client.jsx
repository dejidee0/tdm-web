"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Layers,
  Droplets,
  DoorOpen,
  Sparkles,
  Diamond,
  Gem,
  Shield,
  Truck,
  Headphones,
  CheckCircle,
  RotateCcw,
  Phone,
} from "lucide-react";
import Reveal from "@/components/common/reveal";

// ── Data ──────────────────────────────────────────────────────────────────────

const TRUST_CHIPS = [
  { Icon: Diamond, label: "Premium Quality" },
  { Icon: Shield, label: "100% Authentic" },
  { Icon: Truck, label: "On-Time Delivery" },
  { Icon: Headphones, label: "Expert Advice" },
];

const CATEGORIES = [
  {
    Icon: Layers,
    label: "Tiles & Stone",
    href: "/bogat/materials?category=tiles",
    image: "/matte.png",
    description: "Large format tiles, porcelain, ceramic & more.",
  },
  {
    Icon: Droplets,
    label: "Bathroom Fittings",
    href: "/bogat/materials?category=bathroom",
    image: "/brass.png",
    description: "Premium taps, showers, mixers & accessories.",
  },
  {
    Icon: Sparkles,
    label: "Sanitary Ware",
    href: "/bogat/materials?category=sanitary",
    image: "/pendant.png",
    description: "Elegant, durable and hygienic solutions.",
  },
  {
    Icon: DoorOpen,
    label: "Doors & Hardware",
    href: "/bogat/materials?category=doors",
    image: "/oak.png",
    description: "Security, style and durability in every detail.",
  },
  {
    Icon: Gem,
    label: "Accessories",
    href: "/bogat/materials?category=accessories",
    image: "/chair.png",
    description: "Complements that define your space.",
  },
  {
    Icon: Diamond,
    label: "Marble & Quartz",
    href: "/bogat/materials?category=marble",
    image: "/geo.png",
    description: "Natural stone, engineered for perfection.",
  },
];

const WHY_BOGAT = [
  {
    Icon: Diamond,
    title: "Premium Quality",
    desc: "Carefully selected materials of the highest standard.",
  },
  {
    Icon: CheckCircle,
    title: "Authentic Brands",
    desc: "We partner with world-class brands you can trust.",
  },
  {
    Icon: Layers,
    title: "Wide Selection",
    desc: "A vast range of designs, finishes, and styles to suit every taste.",
  },
  {
    Icon: Truck,
    title: "Reliable Delivery",
    desc: "Timely delivery with care and professional handling.",
  },
  {
    Icon: Headphones,
    title: "Expert Support",
    desc: "Our team helps you choose the perfect fit for your project.",
  },
  {
    Icon: RotateCcw,
    title: "After-Sales Care",
    desc: "We stand by our products long after installation.",
  },
];

const BRANDS = [
  "Atlas Concorde",
  "Marazzi",
  "Grohe",
  "Kohler",
  "Jaquar",
  "Duravit",
  "RAK Ceramics",
  "Porcelanosa",
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function BogatClient() {
  return (
    <div className="min-h-screen bg-black font-manrope">

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Desktop — right image column */}
        <div className="hidden lg:block absolute inset-y-0 right-0 w-[48%]">
          <div className="relative h-full w-full">
            <Image
              src="/hero/re-imagine.png"
              alt="Bogat premium materials showroom"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-y-0 left-0 w-48 bg-linear-to-r from-black to-transparent" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-black to-transparent" />
          </div>
        </div>

        {/* Mobile — background image */}
        <div className="lg:hidden absolute inset-0">
          <Image
            src="/hero/re-imagine.png"
            alt="Bogat premium materials"
            fill
            priority
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-black" />
        </div>

        {/* Content column */}
        <div className="relative z-10 w-full lg:w-[56%]">
          <div className="px-6 sm:px-10 lg:pl-16 xl:pl-20 2xl:pl-28 pt-32 pb-24 sm:pt-36 sm:pb-28">

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[#D4AF37] text-xs font-bold tracking-[0.38em] uppercase mb-5"
            >
              Bogat by TBM
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="font-poppins font-bold leading-[1.12] tracking-tight mb-6"
            >
              <span className="block text-white text-[32px] sm:text-[50px] lg:text-[52px] xl:text-[58px]">
                Luxury Finishes.
              </span>
              <span className="block text-white text-[32px] sm:text-[50px] lg:text-[52px] xl:text-[58px]">
                Timeless Beauty.
              </span>
              <span className="block text-[#D4AF37] text-[32px] sm:text-[50px] lg:text-[52px] xl:text-[58px]">
                Built to Perfection.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-white/50 text-[14px] sm:text-[17px] leading-relaxed mb-8 max-w-[85%]"
            >
              We supply premium tiles, fittings, sanitary ware, marble, doors,
              and accessories for luxury homes and commercial spaces across
              Nigeria.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-wrap gap-x-6 gap-y-3 mb-10"
            >
              {TRUST_CHIPS.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
                  <span className="text-white/55 text-[13px] font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <Link
                href="/bogat/materials"
                className="flex items-center justify-center gap-2 bg-[#D4AF37] px-7 py-3.5 text-black font-poppins font-bold text-[13px] tracking-[0.12em] uppercase hover:bg-[#c49e30] transition-colors duration-200"
              >
                Explore Materials <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center border border-white/18 px-7 py-3.5 text-white/80 font-semibold text-[13px] tracking-[0.22em] uppercase hover:border-[#D4AF37]/60 hover:text-white transition-all duration-200"
              >
                Book Showroom Visit
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CATEGORY NAVIGATION STRIP
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ background: "#0d0b08" }} className="border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-white/[0.08]">
            {CATEGORIES.map(({ Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-center gap-3 py-7 px-3 text-center hover:bg-white/[0.025] transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-full border border-white/10 group-hover:border-[#D4AF37]/40 flex items-center justify-center transition-colors duration-200 shrink-0">
                  <Icon
                    className="w-4 h-4 text-white/40 group-hover:text-[#D4AF37] transition-colors duration-200"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-white/50 group-hover:text-white/85 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 leading-snug">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PREMIUM COLLECTIONS GRID
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-black py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
            <div>
              <Reveal direction="up">
                <p className="text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.28em] mb-3">
                  Our Premium Collections
                </p>
              </Reveal>
              <Reveal direction="up" delay={60}>
                <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-white leading-tight">
                  Curated for Luxury Spaces
                </h2>
              </Reveal>
            </div>
            <Reveal direction="up" delay={80}>
              <Link
                href="/bogat/materials"
                className="flex items-center gap-2 text-white/40 hover:text-[#D4AF37] text-sm font-medium transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                View All Products <ArrowRight size={13} />
              </Link>
            </Reveal>
          </div>

          {/* Editorial grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map(({ label, href, image, description }, i) => (
              <Reveal key={label} direction="scale" delay={i * 55}>
                <Link
                  href={href}
                  className="group relative block overflow-hidden aspect-[4/5] border border-white/[0.06] hover:border-white/[0.18] transition-all duration-300"
                >
                  <Image
                    src={image}
                    alt={label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <p className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-[0.22em] mb-1.5">
                      {label}
                    </p>
                    <p className="text-white/80 font-poppins font-semibold text-[13px] sm:text-sm leading-snug mb-3">
                      {description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-white/40 group-hover:text-white/80 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200">
                      Explore <ArrowRight size={9} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          WHY BOGAT — TRUST GRID
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ background: "#080808" }} className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

          <div className="text-center mb-14">
            <Reveal direction="up">
              <p className="text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.28em] mb-3">
                Why Bogat
              </p>
            </Reveal>
            <Reveal direction="up" delay={60}>
              <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-white">
                The Standard Behind Every Finish
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
            {WHY_BOGAT.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} direction="up" delay={i * 55}>
                <div className="bg-[#080808] p-7 sm:p-8 group hover:bg-[#0f0d0a] transition-colors duration-200 h-full">
                  <div className="w-10 h-10 rounded-full border border-[#D4AF37]/25 flex items-center justify-center mb-5 group-hover:border-[#D4AF37]/50 transition-colors duration-200">
                    <Icon className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-poppins font-semibold text-white text-[14px] mb-2">
                    {title}
                  </h3>
                  <p className="text-white/38 text-[13px] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TRUSTED BRANDS — MARQUEE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-black py-16 border-y border-white/[0.06] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 mb-10">
          <Reveal direction="up">
            <p className="text-white/30 text-[10px] font-semibold uppercase tracking-[0.3em] text-center">
              Our Trusted Brands
            </p>
          </Reveal>
        </div>

        <div className="relative flex overflow-x-hidden">
          <motion.div
            className="flex gap-16 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span
                key={i}
                className="text-white/22 font-poppins font-bold text-base sm:text-lg tracking-tight cursor-default select-none"
              >
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SHOWROOM CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ background: "#0d0b08" }} className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image */}
            <Reveal direction="left">
              <div className="relative overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[520px] bg-[#111]">
                <Image
                  src="/hero/re-imagine.png"
                  alt="Bogat showroom — experience premium materials in person"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-black/60 to-transparent" />
              </div>
            </Reveal>

            {/* Content */}
            <div>
              <Reveal direction="up">
                <p className="text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.28em] mb-4">
                  Visit Our Showroom
                </p>
              </Reveal>
              <Reveal direction="up" delay={60}>
                <h2 className="font-poppins font-bold text-3xl sm:text-[40px] lg:text-[44px] leading-[1.1] text-white mb-5">
                  Experience Materials.{" "}
                  <span className="text-[#D4AF37]">Feel the Difference.</span>
                </h2>
              </Reveal>
              <Reveal direction="up" delay={100}>
                <p className="text-white/45 text-base leading-relaxed mb-10 max-w-md">
                  Visit any of our showrooms in Abuja or Lagos and let our
                  experts guide you through the full Bogat collection. Touch,
                  compare, and choose with confidence.
                </p>
              </Reveal>
              <Reveal direction="up" delay={140}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-[#D4AF37] px-7 py-3.5 text-black font-poppins font-bold text-[13px] tracking-[0.12em] uppercase hover:bg-[#c49e30] transition-colors duration-200"
                  >
                    Book a Showroom Visit <ArrowRight size={14} />
                  </Link>
                  <a
                    href="tel:+2348107324443"
                    className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors duration-200"
                  >
                    <Phone size={13} className="text-[#D4AF37]" />
                    +234 810 732 4443
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
