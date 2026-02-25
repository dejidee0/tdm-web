"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import locationIcon from "@/public/assets/svgs/vendor/inventory/location.svg";
import filterIcon from "@/public/assets/svgs/vendor/inventory/filter.svg";
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
            <h1 className="font-inter text-[21.8px] font-bold text-[#273054] leading-[30.45px] tracking-[-0.63px] mb-2">
              Product Inventory
            </h1>
            <p className="font-inter text-[13.53px] font-normal text-[#273054] leading-[20.3px]">
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
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-[0.87px] border-[#234848] rounded-[6.96px] font-inter text-[12.19px] font-medium text-[#273054] hover:bg-[#F8FAFC] transition-colors"
            >
              <Download size={16} />
              Export Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddProductModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#273054] text-white rounded-[6.96px] font-inter text-[12.19px] font-medium hover:bg-[#273054]/90 transition-colors"
            >
              <Plus size={16} />
              Add New Product
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <InventoryStatsCards stats={stats} />

      {/* Table Container */}
      <div className="rounded-[10.45px] border-[0.59px] border-[#273054]/50 overflow-hidden" style={{ boxShadow: '0 0.87px 1.74px 0 rgba(0,0,0,0.05)' }}>
      {/* Search and Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-white border-b-[0.87px] border-[#273054]"
      >
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#273054]/40"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by Product Name, SKU..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#273054]/10 border-[0.59px] border-[#273054]/10 rounded-[6.96px] font-inter text-[12.19px] text-[#273054] placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#273054]/20 focus:border-transparent"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#273054]/10 rounded-[6.96px] p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  px-3 py-1.5 rounded-[5.22px] font-inter text-[12.19px] font-medium
                  transition-colors flex items-center gap-1.5 leading-[17.41px]
                  ${
                    activeTab === tab.id
                      ? "bg-[#273054] text-white"
                      : "text-[#273054]"
                  }
                `}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`
                      px-1.5 py-0.5 rounded-full text-[10.45px] font-bold
                      ${
                        activeTab === tab.id
                          ? "bg-white text-[#273054]"
                          : "text-[#273054]"
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Location Filter */}
          <div className="relative">
            <Image
              src={locationIcon}
              alt=""
              width={16}
              height={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
              style={{ fieldSizing: "content" }}
              className="pl-9 pr-8 py-2.5 bg-[#273054] text-white border-[0.87px] border-[#234848] rounded-[6.96px] font-inter text-[12.19px] font-medium focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">Location</option>
              <option value="warehouse-a">Warehouse A</option>
              <option value="warehouse-b">Warehouse B</option>
              <option value="warehouse-c">Warehouse C</option>
              <option value="warehouse-d">Warehouse D</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none"
              size={14}
            />
          </div>

          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#273054] text-white border-[0.87px] border-[#234848] rounded-[6.96px] font-inter text-[12.19px] font-medium transition-colors hover:bg-[#273054]/90"
          >
            <Image src={filterIcon} alt="" width={16} height={20} />
            Filter
          </motion.button>
        </div>
      </motion.div>

      {/* Products Table */}
      <InventoryProductsTable products={data?.products} isLoading={isLoading} />
      </div>

      {/* Pagination */}
      {data?.pagination && data.products?.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="font-inter text-[12.19px] font-normal text-[#273054] leading-[17.41px]">
            Showing{" "}
            <span className="font-medium text-[#273054]">
              {(data.pagination.page - 1) * data.pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-[#273054]">
              {Math.min(
                data.pagination.page * data.pagination.limit,
                data.pagination.total,
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#273054]">
              {data.pagination.total}
            </span>{" "}
            results
          </p>

          {/* Joined pagination */}
          <div className="flex items-center overflow-hidden rounded-[6.96px] border-[0.87px] border-[#234848]/20">
            {/* Previous arrow */}
            <button
              onClick={() => handlePageChange(data.pagination.page - 1)}
              disabled={data.pagination.page === 1}
              className="w-[33px] h-[31.34px] flex items-center justify-center bg-white border-r-[0.87px] border-[#234848]/20 text-[#234848] hover:bg-[#F6F8F7] transition-colors disabled:text-[#234848]/30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Page numbers */}
            {[...Array(Math.min(data.pagination.totalPages, 3))].map(
              (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`
                      w-[33px] h-[31.34px] flex items-center justify-center
                      font-inter text-[12.19px] font-medium
                      border-r-[0.87px] border-[#234848]/20 transition-colors
                      ${
                        data.pagination.page === pageNum
                          ? "bg-[#273054] text-white"
                          : "bg-white text-[#234848] hover:bg-[#F6F8F7]"
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                );
              },
            )}

            {data.pagination.totalPages > 3 && (
              <>
                <span className="w-[35.46px] h-[31.34px] flex items-center justify-center bg-white border-r-[0.87px] border-[#234848]/20 font-inter text-[12.19px] text-[#234848]">
                  ...
                </span>
                <button
                  onClick={() => handlePageChange(data.pagination.totalPages)}
                  className={`
                    w-[33px] h-[31.34px] flex items-center justify-center
                    font-inter text-[12.19px] font-medium
                    border-r-[0.87px] border-[#234848]/20 transition-colors
                    ${
                      data.pagination.page === data.pagination.totalPages
                        ? "bg-[#273054] text-white"
                        : "bg-white text-[#234848] hover:bg-[#F6F8F7]"
                    }
                  `}
                >
                  {data.pagination.totalPages}
                </button>
              </>
            )}

            {/* Next arrow */}
            <button
              onClick={() => handlePageChange(data.pagination.page + 1)}
              disabled={data.pagination.page === data.pagination.totalPages}
              className="w-[33px] h-[31.34px] flex items-center justify-center bg-white text-[#234848] hover:bg-[#F6F8F7] transition-colors disabled:text-[#234848]/30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
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
