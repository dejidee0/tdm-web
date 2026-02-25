"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import {
  useAdminUsers,
  useCreateUser,
  useUpdateUserRole,
  useUpdateUserStatus,
} from "@/hooks/use-admin-users";
import UserManagementTable from "@/components/shared/admin/dashboard/user-management-table";
import UserManagementFilters from "@/components/shared/admin/dashboard/user-management-filters";
import AddUserModal from "@/components/shared/admin/dashboard/add-user-modal";
import addNewUser from "@/public/assets/svgs/userAndRoleMgt/addNewUser.svg";
import Image from "next/image";

export default function UserManagementPage() {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Filter states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("any");

  // Track initial load
  const isInitialMount = useRef(true);

  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  // Fetch users with filters using real API
  const { data, isLoading, isError } = useAdminUsers({
    page,
    pageSize: 5,
    search,
    role: role === "all" ? "" : role,
    status: status === "any" ? "" : status,
  });

  // Mutations
  const createUser = useCreateUser();
  const updateUserRole = useUpdateUserRole();
  const updateUserStatus = useUpdateUserStatus();

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
    createUser.mutate(userData, {
      onSuccess: () => {
        setIsModalOpen(false);
        // Data will auto-refresh due to query invalidation
      },
      onError: (error) => {
        console.error("Failed to create user:", error);
        // You can add toast notification here
      },
    });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleUpdateUser = (userData) => {
    const { id, role, isActive } = userData;
    const currentUser = editingUser;

    // Handle backend data structure: roles is array, status is string
    const currentRole = Array.isArray(currentUser.roles)
      ? currentUser.roles[0]
      : currentUser.role;
    const currentIsActive = currentUser.status
      ? currentUser.status.toLowerCase() === "active"
      : currentUser.isActive;

    // Check what changed and update accordingly
    const updates = [];

    if (currentRole !== role) {
      updates.push(
        updateUserRole.mutateAsync({ id, newRole: role })
      );
    }

    if (currentIsActive !== isActive) {
      updates.push(
        updateUserStatus.mutateAsync({ id, isActive })
      );
    }

    // Execute all updates
    Promise.all(updates)
      .then(() => {
        setIsModalOpen(false);
        setEditingUser(null);
      })
      .catch((error) => {
        console.error("Failed to update user:", error);
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Only show full-page loading on initial mount
  if (isLoading && isInitialMount.current) {
    return (
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#E5E7EB] border-t-primary rounded-full animate-spin mx-auto mb-4" />
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
            <h1 className="font-manrope text-[32px] font-bold text-primary mb-2">
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
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors"
          >
            <Image src={addNewUser} alt="Add New User" />
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
      <div className="relative">
        {isLoading && !isInitialMount.current && (
          <div className="absolute top-4 right-4 z-10">
            <div className="w-6 h-6 border-2 border-[#E5E7EB] border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <UserManagementTable
          data={data?.users || []}
          pagination={data?.pagination}
          onPageChange={handlePageChange}
          isLoading={isLoading && !isInitialMount.current}
          onEditUser={handleEditUser}
        />
      </div>

      {/* Add/Edit User Modal */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateUser={handleCreateUser}
        editUser={editingUser}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
}
