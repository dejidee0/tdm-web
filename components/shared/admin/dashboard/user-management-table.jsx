"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { roleBadgeColors } from "@/lib/mock/users";
import { useUpdateUserStatus, useDeleteUser } from "@/hooks/use-admin-users";
import ConfirmDeleteModal from "./confirm-delete-modal";
import Image from "next/image";

export default function UserManagementTable({
  data,
  pagination,
  onPageChange,
  onEditUser,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const menuRef = useRef(null);
  const updateStatus = useUpdateUserStatus();
  const deleteUser = useDeleteUser();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openMenuId]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
        <p className="text-[#64748B] font-manrope text-[14px]">
          No users found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  const handleToggleStatus = (userId, currentStatus) => {
    updateStatus.mutate({ id: userId, isActive: !currentStatus });
  };

  const handleDeleteUser = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName });
    setDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser.mutate(userToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        },
        onError: () => {
          // Keep modal open on error so user can retry
        },
      });
    }
  };

  const handleEditUser = (userId) => {
    const user = data?.find((u) => u?.id === userId);
    if (user && onEditUser) {
      onEditUser(user);
    }
    setOpenMenuId(null);
  };

  const toggleMenu = (userId) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.page || 1;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB]">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-[#27305433] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-6 py-4 text-left">
                <span className="font-manrope text-[11px] font-bold text-[#273054] uppercase tracking-wider">
                  USER ID
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="font-manrope text-[11px] font-bold text-[#273054] uppercase tracking-wider">
                  USER
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="font-manrope text-[11px] font-bold text-[#273054] uppercase tracking-wider">
                  EMAIL
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="font-manrope text-[11px] font-bold text-[#273054] uppercase tracking-wider">
                  ROLE
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="font-manrope text-[11px] font-bold text-[#273054] uppercase tracking-wider">
                  STATUS
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="font-manrope text-[11px] font-bold text-[#273054] uppercase tracking-wider">
                  ACTIONS
                </span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#E5E7EB]">
            {data?.map((user, index) => {
              // Handle backend data structure: roles is an array, get first role
              const userRole = Array.isArray(user?.roles) ? user.roles[0] : user?.role;
              const roleColor =
                roleBadgeColors[userRole] || roleBadgeColors.Customer;

              return (
                <motion.tr
                  key={user?.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  {/* User ID */}
                  <td className="px-6 py-4">
                    <span className="font-manrope text-[14px] text-[#64748B]">
                      #{user?.id || 'N/A'}
                    </span>
                  </td>

                  {/* User (Avatar + Name) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user?.avatar ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={user.avatar}
                            alt={user?.name || 'User'}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-manrope font-bold text-[14px]"
                          style={{
                            backgroundColor: user?.colorScheme?.bg || '#ccc',
                            color: user?.colorScheme?.text || '#000',
                          }}
                        >
                          {user?.initials || '?'}
                        </div>
                      )}
                      <span className="font-manrope text-[14px] font-medium text-primary">
                        {user?.fullName || user?.name || 'N/A'}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <span className="font-manrope text-[14px] text-[#64748B]">
                      {user?.email || 'N/A'}
                    </span>
                  </td>

                  {/* Role Badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full font-manrope text-[13px] font-medium ${roleColor?.bg || 'bg-gray-100'} ${roleColor?.text || 'text-gray-600'}`}
                    >
                      {userRole || 'N/A'}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        // Handle backend data: status is "Active"/"Suspended"
                        const isActive = user?.status
                          ? user.status.toLowerCase() === "active"
                          : user?.isActive;
                        handleToggleStatus(user?.id, isActive);
                      }}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6]"
                      style={{
                        backgroundColor: (user?.status
                          ? user.status.toLowerCase() === "active"
                          : user?.isActive) ? "#22C55E" : "#475569",
                      }}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          (user?.status
                            ? user.status.toLowerCase() === "active"
                            : user?.isActive) ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Actions Menu */}
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={() => toggleMenu(user?.id)}
                      className="text-[#64748B] hover:text-primary transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {openMenuId === user?.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.1 }}
                          className="absolute right-0 top-12 z-50 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] overflow-hidden"
                        >
                          <button
                            onClick={() => handleEditUser(user?.id)}
                            className="w-full px-4 py-3 text-left font-manrope text-[14px] text-[#273054] hover:bg-[#F8FAFC] transition-colors flex items-center gap-3"
                          >
                            <Edit2 size={16} />
                            Edit User
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user?.id, user?.name)}
                            className="w-full px-4 py-3 text-left font-manrope text-[14px] text-[#EF4444] hover:bg-[#FEE2E2] transition-colors flex items-center gap-3"
                          >
                            <Trash2 size={16} />
                            Delete User
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-[#E5E7EB]">
        {data?.map((user, index) => {
          // Handle backend data structure: roles is an array, get first role
          const userRole = Array.isArray(user?.roles) ? user.roles[0] : user?.role;
          const roleColor =
            roleBadgeColors[userRole] || roleBadgeColors.Customer;

          return (
            <motion.div
              key={user?.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 mb-3">
                {user?.avatar ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={user.avatar}
                      alt={user?.name || 'User'}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-manrope font-bold text-[14px]"
                    style={{
                      backgroundColor: user?.colorScheme?.bg || '#ccc',
                      color: user?.colorScheme?.text || '#000',
                    }}
                  >
                    {user?.initials || '?'}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-manrope text-[14px] font-medium text-primary">
                    {user?.fullName || user?.name || 'N/A'}
                  </p>
                  <p className="font-manrope text-[12px] text-[#64748B]">
                    #{user?.id || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Handle backend data: status is "Active"/"Suspended"
                    const isActive = user?.status
                      ? user.status.toLowerCase() === "active"
                      : user?.isActive;
                    handleToggleStatus(user?.id, isActive);
                  }}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{
                    backgroundColor: (user?.status
                      ? user.status.toLowerCase() === "active"
                      : user?.isActive) ? "#22C55E" : "#475569",
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      (user?.status
                        ? user.status.toLowerCase() === "active"
                        : user?.isActive) ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Email and Role */}
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-manrope text-[13px] text-[#64748B] mb-2">
                    {user?.email || 'N/A'}
                  </p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full font-manrope text-[13px] font-medium ${roleColor?.bg || 'bg-gray-100'} ${roleColor?.text || 'text-gray-600'}`}
                  >
                    {userRole || 'N/A'}
                  </span>
                </div>

                {/* Actions Menu for Mobile */}
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(user?.id)}
                    className="text-[#64748B] hover:text-primary transition-colors p-2"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {openMenuId === user?.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-12 z-50 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] overflow-hidden"
                      >
                        <button
                          onClick={() => handleEditUser(user?.id)}
                          className="w-full px-4 py-3 text-left font-manrope text-[14px] text-[#273054] hover:bg-[#F8FAFC] transition-colors flex items-center gap-3"
                        >
                          <Edit2 size={16} />
                          Edit User
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user?.id, user?.name)}
                          className="w-full px-4 py-3 text-left font-manrope text-[14px] text-[#EF4444] hover:bg-[#FEE2E2] transition-colors flex items-center gap-3"
                        >
                          <Trash2 size={16} />
                          Delete User
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-manrope text-[13px] text-[#273054]">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * (pagination?.limit || 0) + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * (pagination?.limit || 0), pagination?.total || 0)}
            </span>{" "}
            of <span className="font-medium">{pagination?.total || 0}</span> results
          </p>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </motion.button>

            {/* Page Numbers */}
            {getPageNumbers().map((pageNum, index) => {
              if (pageNum === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 font-manrope text-[13px] text-[#64748B]"
                  >
                    ...
                  </span>
                );
              }

              return (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg font-manrope text-[13px] font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-[#E2E8F0] text-[#64748B]"
                      : "bg-primary text-white hover:bg-[#334155]"
                  }`}
                >
                  {pageNum}
                </motion.button>
              );
            })}

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        userName={userToDelete?.name}
        isDeleting={deleteUser.isPending}
      />
    </div>
  );
}
