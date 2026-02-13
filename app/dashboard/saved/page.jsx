// app/dashboard/saved/page.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FolderPlus, ShoppingBag } from "lucide-react";

import {
  useBuyAll,
  useCreateBoard,
  useSavedItems,
} from "@/hooks/use-saved-items";

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

  const { data: items, isLoading, isError } = useSavedItems(filters);
  const createBoard = useCreateBoard();
  const buyAll = useBuyAll();

  const handleCreateBoard = () => {
    const itemIds =
      selectedItems.length > 0
        ? selectedItems
        : items?.map((item) => item.id) || [];
    if (itemIds.length === 0) return;

    const boardName = prompt("Enter board name:");
    if (boardName) {
      createBoard.mutate(
        { itemIds, boardName },
        {
          onSuccess: (data) => {
            alert(
              `Board "${data.boardName}" created with ${data.itemCount} items!`,
            );
            setSelectedItems([]);
          },
        },
      );
    }
  };

  const handleBuyAll = () => {
    const purchasableItems =
      items?.filter((item) => item.price && !item.isInspirationBoard) || [];
    const itemIds = purchasableItems.map((item) => item.id);

    if (itemIds.length === 0) {
      alert("No purchasable items in your saved list");
      return;
    }

    buyAll.mutate(itemIds, {
      onSuccess: (data) => {
        alert(
          `${data.itemCount} items added to cart. Total: $${data.total.toFixed(2)}`,
        );
      },
    });
  };

  const totalItems = items?.length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 pt-12 md:pt-0 md:w-[62vw] w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-[#e5e5e5]"
        >
          <div>
            <h1 className="text-[28px] md:text-[32px] font-semibold text-primary leading-tight">
              My Saved Items
            </h1>
            <p className="text-[14px] text-[#666666] mt-1">
              Organize your materials, products, and inspiration for upcoming
              projects.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCreateBoard}
              disabled={totalItems === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-lg text-[14px] font-medium text-primary hover:bg-[#f8f8f8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FolderPlus className="w-4 h-4" />
              Create Board
            </button>
            <button
              onClick={handleBuyAll}
              disabled={totalItems === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-[14px] font-medium hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-4 h-4" />
              Buy All
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
