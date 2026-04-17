// app/dashboard/ai-designs/page.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles } from "lucide-react";

import DashboardLayout from "@/components/shared/dashboard/layout";
import DesignsFilters from "@/components/shared/dashboard/designs/filters";
import DesignsGrid from "@/components/shared/dashboard/designs/grid";
import { useDesigns } from "@/hooks/use-designs";
import CreateNewDesignModal from "@/components/shared/dashboard/designs/create-new-design";
import SubscriptionPanel from "@/components/shared/dashboard/designs/subscription-panel";

export default function DesignsPage() {
  const [filters, setFilters] = useState({
    search: "",
    roomType: "all",
    sortBy: "newest",
    view: "grid",
  });
  const [modalOpen, setModalOpen] = useState(false);

  const { data: designs, isLoading, isError } = useDesigns(filters);

  return (
    <DashboardLayout>
      <div className="space-y-6 pt-12 md:pt-0 md:w-[60vw] w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col py-2 sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-white/08"
        >
          <div>
            <h1 className="text-[28px] md:text-[32px] font-extrabold text-white leading-tight">
              My Ziora Designs
            </h1>
            <p className="text-[15px] text-white/50 font-medium mt-1 max-w-2xl">
              Browse, edit, and organize your Ziora-generated interior
              visualizations. All your creative ideas in one place.
            </p>
          </div>

          {/* Create New Design — always visible; modal handles quota/upgrade wall */}
          <button
            onClick={() => setModalOpen(true)}
            className="relative inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold text-black hover:opacity-90 active:scale-[0.98] transition-all self-start sm:self-auto whitespace-nowrap"
            style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
          >
            <Sparkles className="w-4 h-4" />
            Create New Design
          </button>
        </motion.div>

        {/* Subscription status panel */}
        <SubscriptionPanel />

        {/* Filters */}
        <DesignsFilters filters={filters} setFilters={setFilters} />

        {/* Designs Grid */}
        <DesignsGrid
          designs={designs}
          isLoading={isLoading}
          isError={isError}
          view={filters.view}
          onOpenModal={() => setModalOpen(true)}
        />
      </div>

      {/* Generation modal */}
      <CreateNewDesignModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </DashboardLayout>
  );
}
