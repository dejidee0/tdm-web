// app/dashboard/designs/page.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";

import Link from "next/link";
import DashboardLayout from "@/components/shared/dashboard/layout";
import DesignsFilters from "@/components/shared/dashboard/designs/filters";
import DesignsGrid from "@/components/shared/dashboard/designs/grid";
import { useDesigns } from "@/hooks/use-designs";

export default function DesignsPage() {
  const [filters, setFilters] = useState({
    search: "",
    roomType: "all",
    sortBy: "newest",
    view: "grid", // grid or list
  });

  const { data: designs, isLoading, isError } = useDesigns(filters);

  return (
    <DashboardLayout>
      <div className="space-y-6 pt-12 md:pt-0 md:w-[60vw] w-full ">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col py-2 sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-300"
        >
          <div>
            <h1 className="text-[28px] md:text-[32px] font-extrabold text-text-black leading-tight">
              My AI Designs
            </h1>
            <p className="text-[15px] text-[#666666] font-medium mt-1 max-w-2xl">
              Browse, edit, and organize your AI-generated interior
              visualizations. All your creative ideas in one place.
            </p>
          </div>

          {/* Create New Design Button */}
          <Link
            href="/visualizer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-lg text-[14px] font-medium hover:bg-[#2a2a2a] transition-colors self-start sm:self-auto whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Create New Design
          </Link>
        </motion.div>

        {/* Filters */}
        <DesignsFilters filters={filters} setFilters={setFilters} />

        {/* Designs Grid/List */}
        <DesignsGrid
          designs={designs}
          isLoading={isLoading}
          isError={isError}
          view={filters.view}
        />
      </div>
    </DashboardLayout>
  );
}
