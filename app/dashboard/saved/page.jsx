// app/dashboard/saved/page.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FolderPlus, ShoppingBag } from "lucide-react";

import { useSavedItems, useBuyAll, useCreateBoard } from "@/hooks/use-saved";
import DashboardLayout from "@/components/shared/dashboard/layout";
import SavedItemsFilters from "@/components/shared/dashboard/saved-items/filters";
import SavedItemsGrid from "@/components/shared/dashboard/saved-items/grid";

export default function SavedItemsPage() {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    sortBy: "date-added",
  });
  const [selectedItems, setSelectedItems] = useState([]);

  const { data: items = [], isLoading, isError } = useSavedItems(filters);
  const createBoard = useCreateBoard();
  const buyAll = useBuyAll();

  const handleCreateBoard = () => {
    const itemIds =
      selectedItems.length > 0 ? selectedItems : items.map((item) => item.id);
    if (itemIds.length === 0) return;

    const boardName = prompt("Enter board name:");
    if (boardName) {
      createBoard.mutate(
        { itemIds, boardName },
        {
          onSuccess: () => setSelectedItems([]),
        },
      );
    }
  };

  const handleBuyAll = () => {
    // Use selected items if any, otherwise all items
    const targetItems =
      selectedItems.length > 0
        ? items.filter((item) => selectedItems.includes(item.id))
        : items;

    const itemIds = targetItems.map((item) => item.id);
    if (itemIds.length === 0) return;

    buyAll.mutate(itemIds);
  };

  const totalItems = items.length;

  return (
    <DashboardLayout>
      <div className="space-y-6 pt-12 md:pt-0 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-white/08"
        >
          <div>
            <h1 className="text-[28px] md:text-[32px] font-semibold text-white leading-tight">
              My Saved Items
            </h1>
            <p className="text-[14px] text-white/50 mt-1">
              Organize your materials, products, and inspiration for upcoming
              projects.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCreateBoard}
              disabled={totalItems === 0 || createBoard.isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-[14px] font-medium text-white/60 hover:bg-white/05 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FolderPlus className="w-4 h-4" />
              Create Board
            </button>
            <button
              onClick={handleBuyAll}
              disabled={totalItems === 0 || buyAll.isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold text-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
            >
              <ShoppingBag className="w-4 h-4" />
              {buyAll.isPending
                ? "Adding..."
                : selectedItems.length > 0
                  ? `Buy Selected (${selectedItems.length})`
                  : "Buy All"}
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <SavedItemsFilters
          filters={filters}
          setFilters={setFilters}
          totalItems={totalItems}
        />

        {/* Items Grid */}
        <SavedItemsGrid
          items={items}
          isLoading={isLoading}
          isError={isError}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
    </DashboardLayout>
  );
}
