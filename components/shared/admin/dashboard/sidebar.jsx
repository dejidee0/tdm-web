"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import overviewIcon from "@/public/assets/svgs/sidebars/overview.svg";
import userManagementIcon from "@/public/assets/svgs/sidebars/userManagement.svg";
import financialReportIcon from "@/public/assets/svgs/sidebars/financialReport.svg";
import systemLogIcon from "@/public/assets/svgs/sidebars/systemLog.svg";
import settingsIcon from "@/public/assets/svgs/sidebars/settings.svg";

const navItems = [
  {
    label: "Overview",
    icon: overviewIcon,
    href: "/admin/dashboard",
  },
  {
    label: "User Management",
    icon: userManagementIcon,
    href: "/admin/dashboard/user-management",
  },
  {
    label: "Financial Report",
    icon: financialReportIcon,
    href: "/admin/dashboard/financial-report",
  },
  {
    label: "System Log",
    icon: systemLogIcon,
    href: "/admin/dashboard/system-log",
  },
  {
    label: "Settings",
    icon: settingsIcon,
    href: "/admin/dashboard/settings",
  },
];

const isActivePath = (pathname, href) => {
  // Exact match for the dashboard root (Overview)
  if (href === "/admin/dashboard") {
    return pathname === href;
  }
  // For other routes, check if pathname starts with the href
  return pathname === href || pathname.startsWith(href + "/");
};

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="TBM Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="font-manrope font-bold text-[15px] text-primary">
              TBM & Bogat
            </h1>
            <p className="font-manrope text-[11px] text-[#64748B] uppercase tracking-wider">
              ADMIN PORTAL
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative flex items-center gap-3 px-4 py-3 rounded-lg
                      font-manrope text-[14px] transition-colors
                      ${
                        isActive
                          ? "bg-[#2730541A] text-[#273054] font-semibold"
                          : "text-[#64748B] hover:bg-[#2730541A]"
                      }
                    `}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={20}
                      height={20}
                    />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin Profile */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center text-white font-manrope font-bold text-[14px]">
            AU
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-manrope font-medium text-[14px] text-primary truncate">
              Admin User
            </p>
            <p className="font-manrope text-[12px] text-[#64748B] truncate">
              SUPER ADMIN
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#273054] hover:bg-[#2730541A] font-manrope text-[13px] transition-colors"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </motion.button>
      </div>
    </div>
  );
}
