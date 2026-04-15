// components/dashboard/designs/DesignsGrid.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import DesignCard from "./card";
import CreateNewCard from "./create-new-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DesignsGrid({ designs, isLoading, isError, view, onOpenModal }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (isLoading) return <LoadingSkeleton view={view} />;

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-12 border border-white/08 text-center"
        style={{ background: "#0d0b08" }}
      >
        <p className="text-[14px] text-white/30">Failed to load designs. Please try again.</p>
      </motion.div>
    );
  }

  if (!designs || designs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-12 border border-white/08 text-center"
        style={{ background: "#0d0b08" }}
      >
        <p className="text-[16px] font-medium text-white mb-2">No designs yet</p>
        <p className="text-[14px] text-white/40 mb-6">
          Start creating AI-generated visualizations for your projects
        </p>
        <div className="max-w-sm mx-auto">
          <CreateNewCard onOpenModal={onOpenModal} />
        </div>
      </motion.div>
    );
  }

  const totalItems = designs.length + 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayItems = [...designs, { id: "create-new", isCreateNew: true }];
  const currentItems = displayItems.slice(startIndex, endIndex);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {currentItems.map((item, index) =>
                item.isCreateNew ? (
                  <CreateNewCard key="create-new" index={index} onOpenModal={onOpenModal} />
                ) : (
                  <DesignCard key={item.id} design={item} index={index} />
                ),
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {currentItems.map((item, index) =>
                item.isCreateNew ? (
                  <CreateNewCard key="create-new" index={index} isList onOpenModal={onOpenModal} />
                ) : (
                  <DesignCard key={item.id} design={item} index={index} isList />
                ),
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border border-white/10 transition-all ${
              currentPage === 1 ? "text-white/20 cursor-not-allowed" : "text-white/50 hover:bg-white/05"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className="w-10 h-10 rounded-lg text-[14px] font-medium transition-all text-black"
                style={
                  currentPage === i + 1
                    ? { background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }
                    : { background: "transparent", color: "rgba(255,255,255,0.40)" }
                }
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border border-white/10 transition-all ${
              currentPage === totalPages ? "text-white/20 cursor-not-allowed" : "text-white/50 hover:bg-white/05"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}

function LoadingSkeleton({ view }) {
  const skeletonCount = view === "grid" ? 8 : 6;

  return (
    <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
      {[...Array(skeletonCount)].map((_, i) => (
        <div key={i} className="animate-pulse">
          {view === "grid" ? (
            <>
              <div className="aspect-4/3 bg-white/06 rounded-xl mb-3" />
              <div className="h-4 bg-white/06 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/06 rounded w-1/2" />
            </>
          ) : (
            <div className="flex items-center gap-4 rounded-xl border border-white/08 p-4" style={{ background: "#0d0b08" }}>
              <div className="w-28 h-24 bg-white/06 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/06 rounded w-1/2" />
                <div className="h-3 bg-white/06 rounded w-1/3" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
