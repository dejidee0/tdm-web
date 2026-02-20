"use client";

import { motion } from "framer-motion";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { roleBadgeColors } from "@/lib/mock/users";
import { useToggleUserStatus } from "@/hooks/use-users";
import Image from "next/image";

export default function UserManagementTable({
  data,
  pagination,
  onPageChange,
}) {
  const { mutate: toggleStatus } = useToggleUserStatus();

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
        <p className="text-[#64748B] font-manrope text-[14px]">
          No users found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  const handleToggleStatus = (userId) => {
    toggleStatus(userId);
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
            {data.map((user, index) => {
              const roleColor =
                roleBadgeColors[user.role] || roleBadgeColors.Customer;

              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  {/* User ID */}
                  <td className="px-6 py-4">
                    <span className="font-manrope text-[14px] text-[#64748B]">
                      #{user.id}
                    </span>
                  </td>

                  {/* User (Avatar + Name) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-manrope font-bold text-[14px]"
                          style={{
                            backgroundColor: user.colorScheme.bg,
                            color: user.colorScheme.text,
                          }}
                        >
                          {user.initials}
                        </div>
                      )}
                      <span className="font-manrope text-[14px] font-medium text-primary">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <span className="font-manrope text-[14px] text-[#64748B]">
                      {user.email}
                    </span>
                  </td>

                  {/* Role Badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full font-manrope text-[13px] font-medium ${roleColor.bg} ${roleColor.text}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6]"
                      style={{
                        backgroundColor: user.isActive ? "#22C55E" : "#475569",
                      }}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Actions Menu */}
                  <td className="px-6 py-4">
                    <button className="text-[#64748B] hover:text-primary transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-[#E5E7EB]">
        {data.map((user, index) => {
          const roleColor =
            roleBadgeColors[user.role] || roleBadgeColors.Customer;

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 mb-3">
                {user.avatar ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-manrope font-bold text-[14px]"
                    style={{
                      backgroundColor: user.colorScheme.bg,
                      color: user.colorScheme.text,
                    }}
                  >
                    {user.initials}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-manrope text-[14px] font-medium text-primary">
                    {user.name}
                  </p>
                  <p className="font-manrope text-[12px] text-[#64748B]">
                    #{user.id}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleStatus(user.id)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{
                    backgroundColor: user.isActive ? "#22C55E" : "#475569",
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      user.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Email and Role */}
              <div className="mb-3">
                <p className="font-manrope text-[13px] text-[#64748B] mb-2">
                  {user.email}
                </p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full font-manrope text-[13px] font-medium ${roleColor.bg} ${roleColor.text}`}
                >
                  {user.role}
                </span>
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
              {(currentPage - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span> results
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
    </div>
  );
}
