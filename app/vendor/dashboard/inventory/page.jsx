"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  Plus,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useInventoryProducts, useInventoryStats } from "@/hooks/use-inventory";
import InventoryStatsCards from "@/components/shared/vendor/dashboard/inventory/stats";
import InventoryProductsTable from "@/components/shared/vendor/dashboard/inventory/table";
import AddProductModal from "@/components/shared/vendor/dashboard/add-product";

export default function InventoryPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    stockStatus: "all",
    location: "all",
    archived: false,
  });

  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const { data: stats } = useInventoryStats();
  const { data, isLoading } = useInventoryProducts(filters);

  const handleSearch = (value) => {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let stockStatus = "all";

    if (tab === "lowstock") stockStatus = "lowstock";
    if (tab === "outofstock") stockStatus = "outofstock";
    if (tab === "archived") {
      setFilters((prev) => ({
        ...prev,
        archived: true,
        stockStatus: "all",
        page: 1,
      }));
      return;
    }

    setFilters((prev) => ({ ...prev, stockStatus, archived: false, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const tabs = [
    { id: "all", label: "All Items", count: data?.stats?.all || 142 },
    { id: "lowstock", label: "Low Stock", count: data?.stats?.lowStock || 8 },
    {
      id: "outofstock",
      label: "Out of Stock",
      count: data?.stats?.outOfStock || 2,
    },
    { id: "archived", label: "Archived", count: data?.stats?.archived || 0 },
  ];
  const handleAddProduct = (productData) => {
    console.log("Adding product:", productData);
    // TODO: Call API to add product
    setIsAddProductModalOpen(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="font-manrope text-[32px] font-bold text-primary mb-2">
              Product Inventory
            </h1>
            <p className="font-manrope text-[14px] text-[#64748B]">
              Manage the Bogat product catalog, track real-time stock levels,
              and update inventory
              <br />
              details.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-primary hover:bg-[#F8FAFC] transition-colors"
            >
              <Download size={16} />
              Export Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddProductModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors"
            >
              <Plus size={16} />
              Add New Product
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <InventoryStatsCards stats={stats} />

      {/* Search and Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-white rounded-xl border border-[#E5E7EB]"
      >
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Product Name, SKU..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-primary placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 px-1 py-1 bg-primary rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  px-4 py-1.5 rounded-md font-manrope text-[13px] font-medium
                  transition-colors flex items-center gap-2
                  ${
                    activeTab === tab.id
                      ? "bg-white text-primary"
                      : "text-white hover:bg-[#334155]"
                  }
                `}
              >
                {tab.label}
                <span
                  className={`
                    px-2 py-0.5 rounded-full text-[11px] font-bold
                    ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "bg-[#334155] text-white"
                    }
                  `}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Location Filter */}
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              size={16}
            />
            <select
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  location: e.target.value,
                  page: 1,
                }))
              }
              className="pl-9 pr-8 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="all">Location</option>
              <option value="warehouse-a">Warehouse A</option>
              <option value="warehouse-b">Warehouse B</option>
              <option value="warehouse-c">Warehouse C</option>
              <option value="warehouse-d">Warehouse D</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              size={16}
            />
          </div>

          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-primary hover:bg-[#F8FAFC] transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filter
          </motion.button>
        </div>
      </motion.div>

      {/* Products Table */}
      <InventoryProductsTable products={data?.products} isLoading={isLoading} />

      {/* Pagination */}
      {data?.pagination && data.products?.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-[#E5E7EB]">
          <div className="flex items-center justify-between px-6 py-4">
            <p className="font-manrope text-[13px] text-[#64748B]">
              Showing{" "}
              <span className="font-bold text-primary">
                {(data.pagination.page - 1) * data.pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-primary">
                {Math.min(
                  data.pagination.page * data.pagination.limit,
                  data.pagination.total,
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold text-primary">
                {data.pagination.total}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              {/* Previous button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(data.pagination.page - 1)}
                disabled={data.pagination.page === 1}
                className={`
                  px-4 py-2 rounded-lg font-manrope text-[13px] font-medium
                  border border-[#E5E7EB]
                  ${
                    data.pagination.page === 1
                      ? "bg-[#F8FAFC] text-[#CBD5E1] cursor-not-allowed"
                      : "bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                  }
                  transition-colors
                `}
              >
                Previous
              </motion.button>

              {/* Page numbers */}
              {[...Array(Math.min(data.pagination.totalPages, 5))].map(
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(pageNum)}
                      className={`
                      w-9 h-9 rounded-lg flex items-center justify-center
                      font-manrope text-[13px] font-medium
                      transition-colors
                      ${
                        data.pagination.page === pageNum
                          ? "bg-primary text-white"
                          : "bg-white text-[#64748B] border border-[#E5E7EB] hover:bg-[#F8FAFC]"
                      }
                    `}
                    >
                      {pageNum}
                    </motion.button>
                  );
                },
              )}

              {data.pagination.totalPages > 5 && (
                <>
                  <span className="text-[#64748B]">...</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(data.pagination.totalPages)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-manrope text-[13px] font-medium bg-white text-[#64748B] border border-[#E5E7EB] hover:bg-[#F8FAFC]"
                  >
                    {data.pagination.totalPages}
                  </motion.button>
                </>
              )}

              {/* Next button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(data.pagination.page + 1)}
                disabled={data.pagination.page === data.pagination.totalPages}
                className={`
                  px-4 py-2 rounded-lg font-manrope text-[13px] font-medium
                  border border-[#E5E7EB]
                  ${
                    data.pagination.page === data.pagination.totalPages
                      ? "bg-[#F8FAFC] text-[#CBD5E1] cursor-not-allowed"
                      : "bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                  }
                  transition-colors
                `}
              >
                Next
              </motion.button>
            </div>
          </div>
        </div>
      )}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
}
