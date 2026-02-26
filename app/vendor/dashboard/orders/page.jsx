"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Package,
  Download,
  Upload,
  Plus,
  X,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useOrders, useCreateOrder } from "@/hooks/use-orders";
import OrdersTable from "@/components/shared/vendor/dashboard/table";
import Pagination from "@/components/shared/vendor/dashboard/pagination";
import CreateOrderModal from "@/components/shared/vendor/dashboard/create-order";

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    status: "all",
    type: "all",
    dateRange: "last30days",
    search: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);

  const { data, isLoading } = useOrders(filters);
  const createOrder = useCreateOrder();

  // Auto-open modal based on URL query parameter
  useEffect(() => {
    const openParam = searchParams.get("open");
    if (openParam === "create-order") {
      setIsCreateOrderModalOpen(true);
    }
  }, [searchParams]);

  const handleSearch = (value) => {
    setSearchInput(value);
    if (value.trim()) {
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    } else {
      setFilters((prev) => ({ ...prev, search: "", page: 1 }));
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value, page: 1 }));

    // Update active filters display
    if (value !== "all" && filterType !== "page" && filterType !== "limit") {
      const filterLabel =
        filterType === "type"
          ? `Type: ${value}`
          : filterType === "status"
            ? `Status: ${value}`
            : filterType === "dateRange"
              ? `Date: ${value}`
              : value;

      setActiveFilters((prev) => {
        const filtered = prev.filter((f) => !f.startsWith(filterType));
        return [...filtered, `${filterType}:${filterLabel}`];
      });
    }
  };

  const removeFilter = (filterKey) => {
    const [type] = filterKey.split(":");
    setFilters((prev) => ({ ...prev, [type]: "all" }));
    setActiveFilters((prev) => prev.filter((f) => !f.startsWith(type)));
  };

  const clearAllFilters = () => {
    setFilters((prev) => ({
      ...prev,
      status: "all",
      type: "all",
      dateRange: "last30days",
    }));
    setActiveFilters([]);
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleCloseModal = () => {
    setIsCreateOrderModalOpen(false);
    // Remove query parameter from URL when closing modal
    const currentPath = window.location.pathname;
    router.replace(currentPath);
  };

  const handleCreateOrder = async (orderData) => {
    try {
      await createOrder.mutateAsync(orderData);
      handleCloseModal();
    } catch (error) {
      console.error("Error creating order:", error);
      // Error will be handled by the mutation's error state
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="font-manrope text-[32px] font-bold text-primary mb-2">
              Order Management
            </h1>
            <p className="font-manrope text-[14px] text-[#64748B]">
              Track e-commerce shipments and renovation service requests in
              real-time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-primary hover:bg-[#F8FAFC] transition-colors"
            >
              <Upload size={16} />
              Import
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsCreateOrderModalOpen(true);
                router.push("/vendor/dashboard/orders?open=create-order");
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors"
            >
              <Plus size={16} />
              Create Order
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
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
              placeholder="Search by Order ID, Customer..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-primary placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <SlidersHorizontal
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              size={16}
            />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="pending approval">Pending Approval</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              size={16}
            />
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="last30days">Last 30 Days</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="thisyear">This Year</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Package
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              size={16}
            />
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="all">Type: All</option>
              <option value="renovation">Renovation</option>
              <option value="e-commerce">E-commerce</option>
            </select>
          </div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-primary hover:bg-[#F8FAFC] transition-colors whitespace-nowrap"
          >
            <Download size={16} />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="font-manrope text-[12px] text-[#64748B] uppercase tracking-wider">
            ACTIVE FILTERS:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {activeFilters.map((filter) => {
              const [, label] = filter.split(":");
              return (
                <motion.button
                  key={filter}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={() => removeFilter(filter)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#EEF2FF] text-[#4F46E5] rounded-lg font-manrope text-[12px] font-medium hover:bg-[#E0E7FF] transition-colors group"
                >
                  {label}
                  <X
                    size={14}
                    className="group-hover:scale-110 transition-transform"
                  />
                </motion.button>
              );
            })}
            <button
              onClick={clearAllFilters}
              className="font-manrope text-[12px] text-[#64748B] hover:text-primary underline"
            >
              Clear all
            </button>
          </div>
        </motion.div>
      )}

      {/* Orders Table */}
      <OrdersTable orders={data?.orders} isLoading={isLoading} />

      {/* Pagination */}
      {data?.pagination && (
        <Pagination
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateOrderModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrder}
        isLoading={createOrder.isPending}
        error={createOrder.error}
      />
    </div>
  );
}
