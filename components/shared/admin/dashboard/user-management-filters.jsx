"use client";

import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { useExportUsers } from "@/hooks/use-admin-users";
import Image from "next/image";
import roleIcon from "@/public/assets/svgs/userAndRoleMgt/role.svg";
import statusIcon from "@/public/assets/svgs/userAndRoleMgt/status.svg";
import downloadIcon from "@/public/assets/svgs/userAndRoleMgt/download.svg";

export default function UserManagementFilters({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}) {
  const { mutate: exportUsers, isPending: isExporting } = useExportUsers();

  const handleExport = () => {
    // Pass current filters to export function
    exportUsers({
      role: role === "all" ? "" : role,
      status: status === "any" ? "" : status,
      search: search || "",
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-[#FFFFFF] p-4 rounded-[13.04px] border border-[#E5E7EB]">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
        />
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg font-manrope text-[14px] text-primary placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        {/* Role Filter */}
        <div className="relative">
          <Image
            src={roleIcon}
            alt="Role"
            width={16}
            height={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="appearance-none bg-primary text-white border border-[#334155] rounded-lg pl-10 pr-10 py-2.5 font-manrope text-[13px] font-medium cursor-pointer hover:bg-[#334155] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="all">Role: All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Vendor">Vendor</option>
            <option value="Customer">Customer</option>
            <option value="Auditor">Auditor</option>
            <option value="Manager">Manager</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Image
            src={statusIcon}
            alt="Status"
            width={16}
            height={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="appearance-none bg-primary text-white border border-[#334155] rounded-lg pl-10 pr-10 py-2.5 font-manrope text-[13px] font-medium cursor-pointer hover:bg-[#334155] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="any">Status: Any</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none"
          />
        </div>

        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          disabled={isExporting}
          className="p-2.5 bg-white rounded-lg text-[#64748B] hover:text-primary hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
          title="Export users"
        >
          <Image src={downloadIcon} alt="Export" />
        </motion.button>
      </div>
    </div>
  );
}
