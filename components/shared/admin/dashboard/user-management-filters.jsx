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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-[#0d0b08] p-4 rounded-[13.04px] border border-white/08">
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
          className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg font-manrope text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-transparent transition-all"
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
            className="appearance-none bg-[#1a1a1a] text-white border border-white/10 rounded-lg pl-10 pr-10 py-2.5 font-manrope text-[13px] font-medium cursor-pointer hover:bg-white/08 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
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
            className="appearance-none bg-[#1a1a1a] text-white border border-white/10 rounded-lg pl-10 pr-10 py-2.5 font-manrope text-[13px] font-medium cursor-pointer hover:bg-white/08 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
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
          className="p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white/50 hover:text-white hover:bg-white/08 transition-colors disabled:opacity-50"
          title="Export users"
        >
          <Image src={downloadIcon} alt="Export" />
        </motion.button>
      </div>
    </div>
  );
}
