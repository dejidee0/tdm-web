"use client";

import { motion } from "framer-motion";
import { Search, Heart, ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
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
    budgetValue: 90000,
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
    category: "all",
    style: "modern",
    budgetValue: 5000000,
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
    category: "all",
    style: "modern",
    budgetValue: 1500000,
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
    category: "all",
    style: "modern",
    budgetValue: 3500000,
  },
];

const FILTERS = [
  { id: "all", label: "All Projects" },
  { id: "living-room", label: "Living Room" },
  { id: "kitchen", label: "Kitchen" },
  { id: "bedroom", label: "Bedroom" },
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

  // Close dropdown when clicking outside
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

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((project) => {
      // Category filter
      const categoryMatch =
        activeFilter === "all" || project.category === activeFilter;

      // Search filter
      const searchMatch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.style?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.categoryTag?.toLowerCase().includes(searchQuery.toLowerCase());

      // Budget filter
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
            className="relative group overflow-hidden rounded-lg flex flex-col"
          >
            <div className="relative w-full" style={{ paddingBottom: "125%" }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Tags */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <span className="px-3 py-1 bg-[#1E3A5F] text-white text-xs font-medium rounded">
                  {project.tag}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded">
                  {project.categoryTag}
                </span>
              </div>

              {/* Favorite */}
              <button
                onClick={() => toggleFavorite(project.id)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-10"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.has(project.id)
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }`}
                />
              </button>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h3 className="text-white text-xl font-medium mb-1">
                  {project.title}
                </h3>
                <div className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-white/80 rounded-full" />
                    {project.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-white/80 rounded-full" />
                    {project.budget}
                  </span>
                </div>
              </div>
            </div>

            {/* Quote Section */}
            <div className="p-4 bg-white border border-gray-200 rounded-b-lg flex-1 flex flex-col">
              <p className="text-sm text-gray-700 italic mb-4 flex-1">
                {project.quote}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                    <span className="text-xs">👁️</span>
                  </button>
                  <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                    <span className="text-xs">📤</span>
                  </button>
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors">
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
            className="relative group overflow-hidden rounded-lg bg-white flex flex-col"
          >
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Title */}
              <div className="absolute bottom-4 left-4 z-10">
                <h3 className="text-white text-xl font-medium mb-2">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded text-white text-xs font-medium w-fit">
                  <span>📸 BEFORE & AFTER AVAILABLE</span>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">BUDGET</div>
                  <div className="font-semibold text-gray-900">
                    {project.budget}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">DURATION</div>
                  <div className="font-semibold text-gray-900">
                    {project.duration}
                  </div>
                </div>
              </div>
              <button className="w-full py-3 bg-[#1E3A5F] text-white text-sm font-medium rounded hover:bg-[#2d5080] transition-colors mt-auto">
                Book Similar Project
              </button>
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
            className="relative group overflow-hidden rounded-lg w-full"
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
              <h3 className="text-white text-3xl font-medium border-4 border-white px-8 py-4">
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
            className="bg-white rounded-lg overflow-hidden border border-gray-200 flex flex-col"
          >
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover absolute inset-0"
              />
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#1E3A5F] text-white text-xs font-medium rounded z-10">
                {project.tag}
              </span>
              <button
                onClick={() => toggleFavorite(project.id)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-10"
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
                <h3 className="text-lg font-medium text-gray-900">
                  {project.title}
                </h3>
                <div className="flex gap-0.5">
                  {[...Array(project.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                  {project.categoryLabel}
                </span>
                <span>{project.budget}</span>
              </div>
              <button className="w-full py-2.5 border border-gray-300 text-gray-900 text-sm font-medium rounded hover:bg-gray-50 transition-colors mt-auto">
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
            className="bg-white rounded-lg overflow-hidden flex flex-col"
          >
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover absolute inset-0"
              />
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#8B6F47] text-white text-xs font-medium rounded z-10">
                {project.tag}
              </span>
              <button
                onClick={() => toggleFavorite(project.id)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-10"
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
                <h3 className="text-lg font-medium text-gray-900">
                  {project.title}
                </h3>
                <div className="flex gap-0.5">
                  {[...Array(project.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 flex-1">
                {project.description}
              </p>
              <button className="w-full py-3 bg-[#1E3A5F] text-white text-sm font-medium rounded hover:bg-[#2d5080] transition-colors mt-auto">
                Book Similar Project
              </button>
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
            className="bg-white rounded-lg overflow-hidden flex flex-col"
          >
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover absolute inset-0"
              />
              {project.isNew && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-white text-gray-900 text-xs font-bold rounded z-10">
                  NEW
                </span>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {project.title}
              </h3>
              <div className="h-1 w-12 bg-[#1E3A5F] mb-2" />
              <p className="text-sm text-gray-600 mb-4 flex-1">
                {project.categoryLabel}
              </p>
              <button className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors mt-auto">
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
            className="relative group overflow-hidden rounded-lg w-full"
            style={{ paddingBottom: "125%" }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <span className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded z-10">
              {project.tag}
            </span>

            <button
              onClick={() => toggleFavorite(project.id)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-10"
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
              <h3 className="text-white text-2xl font-medium">
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
            className="relative group overflow-hidden rounded-lg flex flex-col"
          >
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <span className="absolute top-4 left-4 px-3 py-1 bg-[#8B6F47] text-white text-xs font-medium rounded z-10">
                {project.tag}
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="text-white text-2xl font-medium mb-2">
                  {project.title}
                </h3>
                <p className="text-white/90 text-sm mb-4 max-w-md">
                  {project.description}
                </p>
                <button className="w-full py-3 bg-[#1E3A5F] text-white text-sm font-medium rounded hover:bg-[#2d5080] transition-colors">
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
            className="relative group overflow-hidden rounded-lg w-full"
            style={{ paddingBottom: "62.5%" }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            <div className="absolute bottom-4 left-4 z-10">
              <h3 className="text-white text-2xl font-medium mb-1">
                {project.title}
              </h3>
              <p className="text-white/80 text-sm">{project.subtitle}</p>
            </div>

            {project.isFeatured && (
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded z-10">
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
    <section className="w-full bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by room, style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
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
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  activeFilter === filter.id
                    ? "bg-[#1E3A5F] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
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
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors flex items-center gap-1 ${
                  budgetFilter !== "all"
                    ? "bg-[#1E3A5F] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {BUDGET_RANGES.find((b) => b.id === budgetFilter)?.label ||
                  "Budget"}
                <ChevronDown className="w-4 h-4" />
              </motion.button>

              {/* Dropdown Menu */}
              {showBudgetDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px] z-20"
                >
                  {BUDGET_RANGES.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => {
                        setBudgetFilter(range.id);
                        setShowBudgetDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                        budgetFilter === range.id
                          ? "bg-gray-50 font-medium text-[#1E3A5F]"
                          : "text-gray-700"
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
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredProjects.length} project
            {filteredProjects.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-2">No projects found</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your filters or search query
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div key={project.id} className="w-full">
              {renderCard(project, index)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
