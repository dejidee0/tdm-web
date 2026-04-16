"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogOut, ExternalLink, Zap, CreditCard } from "lucide-react";
import { useAdminUser, useAdminLogout } from "@/hooks/use-admin-auth";
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
    label: "AI Usage",
    lucideIcon: Zap,
    href: "/admin/dashboard/ai-usage",
  },
  {
    label: "Subscriptions",
    lucideIcon: CreditCard,
    href: "/admin/dashboard/subscriptions",
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
  const { data: adminUser } = useAdminUser();
  const { mutate: logout, isPending: isLoggingOut } = useAdminLogout();

  const displayName = adminUser?.name || adminUser?.email?.split("@")[0] || "Admin";
  const displayRole = adminUser?.role || "SUPER ADMIN";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "A";

  return (
    <div className="h-full flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-white/08">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/tbm-logo-v2.png"
              alt="TBM Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="font-manrope font-bold text-[15px] text-white">
              TBM & Bogat
            </h1>
            <p className="font-manrope text-[11px] text-white/40 uppercase tracking-wider">
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
                          ? "bg-[#D4AF37]/10 text-[#D4AF37] font-semibold"
                          : "text-white/50 hover:bg-white/05 hover:text-white"
                      }
                    `}
                  >
                    {item.lucideIcon ? (
                      <item.lucideIcon size={20} />
                    ) : (
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={20}
                        height={20}
                      />
                    )}
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin Profile */}
      <div className="p-4 border-t border-white/08">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-manrope font-bold text-[14px]">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-manrope font-medium text-[14px] text-white truncate">
              {displayName}
            </p>
            <p className="font-manrope text-[12px] text-white/40 truncate uppercase">
              {displayRole}
            </p>
          </div>
        </div>
        <Link href="/" target="_blank" rel="noopener noreferrer">
          <motion.div
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:bg-white/05 hover:text-white font-manrope text-[13px] transition-colors mb-1"
          >
            <ExternalLink size={16} />
            <span>Back to Main Site</span>
          </motion.div>
        </Link>
        <motion.button
          onClick={() => logout()}
          disabled={isLoggingOut}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:bg-white/05 hover:text-white font-manrope text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut size={16} />
          <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
        </motion.button>
      </div>
    </div>
  );
}
