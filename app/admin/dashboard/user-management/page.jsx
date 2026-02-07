"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useUsers } from "@/hooks/use-users";
import UserManagementTable from "@/components/shared/admin/dashboard/user-management-table";
import UserManagementFilters from "@/components/shared/admin/dashboard/user-management-filters";
import AddUserModal from "@/components/shared/admin/dashboard/add-user-modal";

export default function UserManagementPage() {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("any");

  // Fetch users with filters
  const { data, isLoading, isError } = useUsers({
    page,
    limit: 5,
    search,
    role,
    status,
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const handleRoleChange = (value) => {
    setRole(value);
    setPage(1); // Reset to first page on filter change
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1); // Reset to first page on filter change
  };

  const handleCreateUser = (userData) => {
    console.log("Creating user:", userData);
    // TODO: Implement user creation logic
  };

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#E5E7EB] border-t-[#1E293B] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#64748B] font-manrope text-[14px]">
              Loading users...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-[#EF4444] font-manrope text-[16px] font-medium mb-2">
              Error loading users
            </p>
            <p className="text-[#64748B] font-manrope text-[14px]">
              Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="font-manrope text-[32px] font-bold text-[#1E293B] mb-2">
              User & Role Management
            </h1>
            <p className="font-manrope text-[14px] text-[#64748B]">
              Manage access, roles, and account statuses across the platform.
            </p>
          </div>

          {/* Add New User Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1E293B] text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors"
          >
            <UserPlus size={16} />
            Add New User
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <UserManagementFilters
        search={search}
        role={role}
        status={status}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
      />

      {/* Users Table */}
      <UserManagementTable
        data={data?.users || []}
        pagination={data?.pagination}
        onPageChange={handlePageChange}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateUser={handleCreateUser}
      />
    </div>
  );
}
