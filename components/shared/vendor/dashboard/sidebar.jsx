"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  ShoppingCart,
  Package,
  Truck,
  MessageSquare,
  Settings,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutGrid,
    href: "/vendor/dashboard",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/vendor/dashboard/orders",
  },
  {
    label: "Inventory",
    icon: Package,
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
  return pathname === href || pathname.startsWith(href + "/dashboard");
};

export default function VendorSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png" // change to your actual file name
              alt="TBM Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="font-manrope font-bold text-[15px] text-[#1E293B]">
              TBM & Bogat
            </h1>
            <p className="font-manrope text-[11px] text-[#64748B] uppercase tracking-wider">
              VENDOR PORTAL
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);
            const Icon = item.icon;

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
                          ? "bg-primary/10 text-[#1E293B] font-medium"
                          : "text-[#64748B] hover:bg-[#F8FAFC]"
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-5 h-5 bg-[#EF4444] text-white text-[11px] font-bold rounded-full flex items-center justify-center"
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

      {/* Settings */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <Link href="/vendor/dashboard/account-settings">
          <motion.div
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] font-manrope text-[14px] transition-colors"
          >
            <Settings size={20} />
            <span>Settings</span>
          </motion.div>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-manrope font-bold text-[14px]">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-manrope font-medium text-[14px] text-[#1E293B] truncate">
              Alex Morgan
            </p>
            <p className="font-manrope text-[12px] text-[#64748B] truncate">
              Vendor ID: #8939
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
