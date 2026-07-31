"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Settings,
  ExternalLink,
  LayoutGrid,
  ClipboardList,
  Boxes,
  Truck,
  MessageSquare,
  Bell,
} from "lucide-react";

// lucide icons paint with `currentColor`, so they follow the row's active and
// inactive text color. The SVGs these replaced had their fill baked in, and had
// even encoded the active state in the asset itself: dashboard.svg was #273054
// while the rest were #475569. On the dark sidebar all six measured under 3:1.
const navItems = [
  {
    label: "Dashboard",
    icon: LayoutGrid,
    href: "/vendor/dashboard",
  },
  {
    label: "Orders",
    icon: ClipboardList,
    href: "/vendor/dashboard/orders",
  },
  {
    label: "Inventory",
    icon: Boxes,
    href: "/vendor/dashboard/inventory",
  },
  {
    label: "Delivery",
    icon: Truck,
    href: "/vendor/dashboard/delivery",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    href: "/vendor/dashboard/messages",
    badge: 3,
  },
];

const isActivePath = (pathname, href) => {
  // Exact match for the dashboard root, so it does not light up on every child.
  if (href === "/vendor/dashboard") return pathname === href;
  // Prefix match on a path segment: `/orders` must also match `/orders/<id>`.
  // This used to append "/dashboard", so opening an order detail page silently
  // un-highlighted Orders in the nav.
  return pathname === href || pathname.startsWith(href + "/");
};

export default function VendorSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Logo/Header */}
      <div className="p-6 border-b border-white/08">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src="/tbm-logo-v2.png" // change to your actual file name
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
              <p className="font-manrope text-[11px] text-muted uppercase tracking-wider">
                VENDOR PORTAL
              </p>
            </div>
          </div>

          {/* Notification Icon */}
          <button
            aria-label="Notifications"
            className="relative p-2 text-white/50 hover:text-white hover:bg-white/05 rounded-lg transition-colors"
          >
            <Bell size={16} />
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-solid rounded-full" />
          </button>
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
                          ? "bg-white/08 text-white font-medium"
                          : "text-white/50 hover:bg-white/05 hover:text-white"
                      }
                    `}
                  >
                    <item.icon size={20} className="shrink-0" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-5 h-5 bg-danger-solid text-white text-[11px] font-bold rounded-full flex items-center justify-center"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings + Back to Site */}
      <div className="p-4 border-t border-white/08 space-y-1">
        <Link href="/vendor/dashboard/account-settings">
          <motion.div
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-white/05 font-manrope text-[14px] transition-colors"
          >
            <Settings size={20} />
            <span>Settings</span>
          </motion.div>
        </Link>
        <Link href="/" target="_blank" rel="noopener noreferrer">
          <motion.div
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-white/05 font-manrope text-[14px] transition-colors"
          >
            <ExternalLink size={20} />
            <span>Back to Main Site</span>
          </motion.div>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/08">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-black font-manrope font-bold text-[14px]">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-manrope font-medium text-[14px] text-white truncate">
              Alex Morgan
            </p>
            <p className="font-manrope text-[12px] text-muted truncate">
              Vendor ID: #8939
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
