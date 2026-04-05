"use client";

import { motion } from "framer-motion";
import { Search, Heart, ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";

const MOCK_PROJECTS = [
  {
    id: 1,
    type: "featured-quote",
    image: "/product-main.svg",
    tag: "Renovation",
    categoryTag: "Industrial",
    title: "Brooklyn Loft",
    duration: "3 Months",
    budget: "₦90k",
    quote:
      '"Transformed our cozy space into a warm, industrial masterpiece. Highly recommended!"',
    hasGetLook: true,
    category: "living-room",
    style: "industrial",
    budgetValue: 8000000,
  },
  {
    id: 2,
    type: "before-after",
    image: "/product-main.svg",
    title: "Industrial Living",
    hasBeforeAfter: true,
    budget: "₦8.5M",
    duration: "6 Weeks",
    hasBookSimilar: true,
    category: "living-room",
    style: "industrial",
    budgetValue: 8500000,
  },
  {
    id: 3,
    type: "simple-banner",
    image: "/product-main.svg",
    title: "FULL HOME RENO",
    variant: "dark",
    category: "full-home",
    style: "modern",
    budgetValue: 25000000,
  },
  {
    id: 4,
    type: "minimal-card",
    image: "/product-main.svg",
    tag: "Bedroom",
    title: "Scandinavian Kitchen",
    category: "kitchen",
    categoryLabel: "Minimalist",
    budget: "Budget: ₦3M",
    rating: 5,
    hasGetLook: true,
    style: "scandinavian",
    budgetValue: 3000000,
  },
  {
    id: 5,
    type: "featured-card",
    image: "/product-main.svg",
    tag: "Farmhouse",
    title: "Cozy Farmhouse",
    description:
      "A complete overhaul of the master bedroom using reclaimed wood.",
    rating: 5,
    hasBookSimilar: true,
    category: "bedroom",
    style: "farmhouse",
    budgetValue: 4000000,
  },
  {
    id: 6,
    type: "new-badge",
    image: "/product-main.svg",
    title: "Minimalist Bedroom",
    category: "bedroom",
    categoryLabel: "Full House Refresh",
    hasViewMaterials: true,
    isNew: true,
    style: "minimalist",
    budgetValue: 2000000,
  },
  {
    id: 7,
    type: "overlay-text",
    image: "/product-main.svg",
    tag: "Bathroom",
    title: "Modern Bathroom Oasis",
    variant: "dark",
    category: "bathroom",
    style: "modern",
    budgetValue: 4500000,
  },
  {
    id: 8,
    type: "detailed-banner",
    image: "/product-main.svg",
    tag: "Traditional",
    title: "Traditional Kitchen Update",
    description:
      "Restoring classic charm with modern amenities. See the brilliant backsplash revealed.",
    hasViewDetails: true,
    category: "kitchen",
    style: "traditional",
    budgetValue: 6000000,
  },
  {
    id: 9,
    type: "featured-project",
    image: "/product-main.svg",
    title: "Outdoor Patio",
    subtitle: "Lush, modern living",
    isFeatured: true,
    category: "commercial",
    style: "modern",
    budgetValue: 12000000,
  },
];

const FILTERS = [
  { id: "all", label: "All Projects" },
  { id: "bathroom", label: "Bathrooms" },
  { id: "kitchen", label: "Kitchens" },
  { id: "living-room", label: "Living Rooms" },
  { id: "full-home", label: "Full Home Renovation" },
  { id: "commercial", label: "Commercial" },
  { id: "construction", label: "Construction" },
];

const BUDGET_RANGES = [
  { id: "all", label: "All Budgets", min: 0, max: Infinity },
  { id: "under-1m", label: "Under ₦1M", min: 0, max: 1000000 },
  { id: "1m-5m", label: "₦1M - ₦5M", min: 1000000, max: 5000000 },
  { id: "5m-10m", label: "₦5M - ₦10M", min: 5000000, max: 10000000 },
  { id: "over-10m", label: "Over ₦10M", min: 10000000, max: Infinity },
];

export default function MasterpiecesGallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowBudgetDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((project) => {
      const categoryMatch =
        activeFilter === "all" || project.category === activeFilter;
      const searchMatch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.style?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.categoryTag?.toLowerCase().includes(searchQuery.toLowerCase());
      const selectedBudget = BUDGET_RANGES.find((b) => b.id === budgetFilter);
      const budgetMatch =
        budgetFilter === "all" ||
        (project.budgetValue >= selectedBudget.min &&
          project.budgetValue <= selectedBudget.max);
      return categoryMatch && searchMatch && budgetMatch;
    });
  }, [activeFilter, searchQuery, budgetFilter]);

  const renderCard = (project, index) => {
    const baseDelay = index * 0.1;

    switch (project.type) {
      case "featured-quote":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="relative group overflow-hidden flex flex-col w-full"
          >
            <div className="relative w-full" style={{ paddingBottom: "125%" }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <span className="px-3 py-1 bg-[#0A0A0A] text-white text-xs font-medium font-manrope">
                  {project.tag}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium font-manrope">
                  {project.categoryTag}
                </span>
              </div>

              <button
                onClick={() => toggleFavorite(project.id)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-10"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.has(project.id)
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }`}
                />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h3 className="text-white text-xl font-medium font-primary mb-1">
                  {project.title}
                </h3>
                <div className="flex items-center gap-3 text-white/80 text-sm font-manrope">
                  <span className="flex items-center gap-1.5">
                    <span className="w-px h-3 bg-gold" />
                    {project.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-px h-3 bg-gold" />
                    {project.budget}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-stone flex-1 flex flex-col">
              <p className="text-sm text-[#7A736C] italic mb-4 flex-1 font-manrope">
                {project.quote}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="w-8 h-8 border border-stone flex items-center justify-center hover:border-[#0A0A0A] transition-colors">
                    <span className="text-xs">👁️</span>
                  </button>
                  <button className="w-8 h-8 border border-stone flex items-center justify-center hover:border-[#0A0A0A] transition-colors">
                    <span className="text-xs">📤</span>
                  </button>
                </div>
                <button className="flex items-center gap-2 text-sm font-semibold text-[#0A0A0A] hover:text-gold transition-colors font-manrope tracking-wide">
                  GET THIS LOOK
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        );

      case "before-after":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="relative group overflow-hidden bg-white border border-stone flex flex-col w-full"
          >
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

              <div className="absolute bottom-4 left-4 z-10">
                <h3 className="text-white text-xl font-medium font-primary mb-2">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium w-fit font-manrope">
                  <span>📸 BEFORE & AFTER AVAILABLE</span>
                </div>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm">
                  <div className="text-[#7A736C] mb-1 font-manrope text-xs uppercase tracking-[0.15em]">BUDGET</div>
                  <div className="font-semibold text-[#0A0A0A] font-primary">
                    {project.budget}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-[#7A736C] mb-1 font-manrope text-xs uppercase tracking-[0.15em]">DURATION</div>
                  <div className="font-semibold text-[#0A0A0A] font-primary">
                    {project.duration}
                  </div>
                </div>
              </div>
              <Link href="/contact?type=consultation" className="mt-auto block">
                <button className="w-full py-3 bg-[#0A0A0A] text-white text-sm font-medium font-manrope hover:bg-[#1C1C1C] transition-colors tracking-wide">
                  Start Similar Project
                </button>
              </Link>
            </div>
          </motion.div>
        );

      case "simple-banner":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="relative group overflow-hidden w-full"
            style={{ paddingBottom: "75%" }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-3xl font-medium border-4 border-white px-8 py-4 font-primary tracking-wide">
                {project.title}
              </h3>
            </div>
          </motion.div>
        );

      case "minimal-card":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="bg-white overflow-hidden border border-stone flex flex-col w-full"
          >
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover absolute inset-0"
              />
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#0A0A0A] text-white text-xs font-medium font-manrope z-10">
                {project.tag}
              </span>
              <button
                onClick={() => toggleFavorite(project.id)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-10"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.has(project.id)
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }`}
                />
              </button>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-medium text-[#0A0A0A] font-primary">
                  {project.title}
                </h3>
                <div className="flex gap-0.5">
                  {[...Array(project.rating)].map((_, i) => (
                    <span key={i} className="text-gold text-sm">★</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#7A736C] mb-4 font-manrope">
                <span className="px-2 py-0.5 bg-warm text-xs">
                  {project.categoryLabel}
                </span>
                <span>{project.budget}</span>
              </div>
              <button className="w-full py-2.5 border border-stone text-[#0A0A0A] text-sm font-medium font-manrope hover:bg-warm transition-colors mt-auto tracking-wide">
                Get This Look
              </button>
            </div>
          </motion.div>
        );

      case "featured-card":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="bg-white overflow-hidden border border-stone flex flex-col w-full"
          >
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover absolute inset-0"
              />
              <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-white text-xs font-medium font-manrope z-10">
                {project.tag}
              </span>
              <button
                onClick={() => toggleFavorite(project.id)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-10"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.has(project.id)
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }`}
                />
              </button>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-[#0A0A0A] font-primary">
                  {project.title}
                </h3>
                <div className="flex gap-0.5">
                  {[...Array(project.rating)].map((_, i) => (
                    <span key={i} className="text-gold text-sm">★</span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-[#7A736C] mb-4 flex-1 font-manrope">
                {project.description}
              </p>
              <Link href="/contact?type=consultation" className="mt-auto block">
                <button className="w-full py-3 bg-[#0A0A0A] text-white text-sm font-medium font-manrope hover:bg-[#1C1C1C] transition-colors tracking-wide">
                  Start Similar Project
                </button>
              </Link>
            </div>
          </motion.div>
        );

      case "new-badge":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="bg-white overflow-hidden border border-stone flex flex-col w-full"
          >
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover absolute inset-0"
              />
              {project.isNew && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-white text-[#0A0A0A] text-xs font-bold font-manrope z-10">
                  NEW
                </span>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-medium text-[#0A0A0A] mb-1 font-primary">
                {project.title}
              </h3>
              <div className="w-px h-8 bg-gold mb-2" />
              <p className="text-sm text-[#7A736C] mb-4 flex-1 font-manrope">
                {project.categoryLabel}
              </p>
              <button className="flex items-center gap-2 text-sm font-semibold text-[#0A0A0A] hover:text-gold transition-colors mt-auto font-manrope tracking-wide">
                View Materials List
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        );

      case "overlay-text":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="relative group overflow-hidden w-full"
            style={{ paddingBottom: "125%" }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

            <span className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium font-manrope z-10">
              {project.tag}
            </span>

            <button
              onClick={() => toggleFavorite(project.id)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-10"
            >
              <Heart
                className={`w-4 h-4 ${
                  favorites.has(project.id)
                    ? "fill-red-500 text-red-500"
                    : "text-white"
                }`}
              />
            </button>

            <div className="absolute bottom-4 left-4 right-4 z-10">
              <h3 className="text-white text-2xl font-medium font-primary tracking-tight">
                {project.title}
              </h3>
            </div>
          </motion.div>
        );

      case "detailed-banner":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="relative group overflow-hidden flex flex-col w-full"
          >
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

              <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-white text-xs font-medium font-manrope z-10">
                {project.tag}
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="text-white text-2xl font-medium font-primary mb-2 tracking-tight">
                  {project.title}
                </h3>
                <p className="text-white/80 text-sm mb-4 max-w-md font-manrope">
                  {project.description}
                </p>
                <button className="w-full py-3 bg-[#0A0A0A] text-white text-sm font-medium font-manrope hover:bg-[#1C1C1C] transition-colors tracking-wide">
                  View Project Details
                </button>
              </div>
            </div>
          </motion.div>
        );

      case "featured-project":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="relative group overflow-hidden w-full"
            style={{ paddingBottom: "62.5%" }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

            <div className="absolute bottom-4 left-4 z-10">
              <h3 className="text-white text-2xl font-medium font-primary mb-1 tracking-tight">
                {project.title}
              </h3>
              <p className="text-white/70 text-sm font-manrope">{project.subtitle}</p>
            </div>

            {project.isFeatured && (
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium font-manrope z-10">
                FEATURED PROJECT
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="w-full bg-[#FAF8F5] pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-8">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A736C]" />
            <input
              type="text"
              placeholder="Search by room, style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-stone bg-white text-[#0A0A0A] text-sm focus:outline-none focus:border-[#0A0A0A] transition-colors font-manrope placeholder:text-[#7A736C]"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {FILTERS.map((filter) => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors font-manrope tracking-wide ${
                  activeFilter === filter.id
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-white text-[#5C5550] border border-stone hover:bg-warm"
                }`}
              >
                {filter.label}
              </motion.button>
            ))}

            {/* Budget Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 font-manrope tracking-wide ${
                  budgetFilter !== "all"
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-white text-[#5C5550] border border-stone hover:bg-warm"
                }`}
              >
                {BUDGET_RANGES.find((b) => b.id === budgetFilter)?.label ||
                  "Budget"}
                <ChevronDown className="w-4 h-4" />
              </motion.button>

              {showBudgetDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-1 right-0 bg-white border border-stone py-1 min-w-45 z-20"
                >
                  {BUDGET_RANGES.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => {
                        setBudgetFilter(range.id);
                        setShowBudgetDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-manrope hover:bg-warm transition-colors ${
                        budgetFilter === range.id
                          ? "bg-warm font-medium text-[#0A0A0A]"
                          : "text-[#5C5550]"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {(searchQuery || activeFilter !== "all" || budgetFilter !== "all") && (
          <div className="mb-4 text-sm text-[#7A736C] font-manrope">
            Showing {filteredProjects.length} project
            {filteredProjects.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#7A736C] text-lg mb-2 font-manrope">No projects found</p>
            <p className="text-[#7A736C]/60 text-sm font-manrope">
              Try adjusting your filters or search query
            </p>
          </div>
        )}

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-px">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="break-inside-avoid mb-px"
            >
              {renderCard(project, index)}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
