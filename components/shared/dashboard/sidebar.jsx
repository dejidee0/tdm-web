// components/dashboard/Sidebar.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  LayoutGrid,
  Package,
  Layers,
  Heart,
  User,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDashboardUser } from "@/hooks/use-user-dashboard";

const navItems = [
  { icon: LayoutGrid, label: "Overview", href: "/dashboard" },
  { icon: Package, label: "Orders", href: "/dashboard/orders" },
  { icon: Layers, label: "AI Designs", href: "/dashboard/ai-designs" },
  { icon: Heart, label: "Saved Items", href: "/dashboard/saved-items" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  // ✅ Reads from React Query cache — zero extra fetch, already fetched by Navbar
  const { user } = useDashboardUser();

  const displayName =
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Welcome";
  const avatarInitial =
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.fullName?.charAt(0)?.toUpperCase() ||
    "U";

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white font-manrope">
      {/* Header */}
      <div className="p-6 border-b border-[#e5e5e5]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={displayName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-primary">
                  {avatarInitial}
                </span>
              )}
            </div>
            <div className="min-w-0">
              {user ? (
                <>
                  <p className="text-base text-[#0F172A] font-semibold font-manrope truncate">
                    Welcome back, {user?.firstName || displayName}
                  </p>
                  <p className="text-sm text-[#999999] mt-0.5">
                    Premium Member
                  </p>
                </>
              ) : (
                // Skeleton while user loads
                <>
                  <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mt-1.5" />
                </>
              )}
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-md transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-[#666666]" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose()}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                text-[14px] font-medium transition-all
                ${
                  isActive
                    ? "bg-primary/20 text-primary font-semibold"
                    : "text-[#666666] hover:bg-primary/10 hover:text-primary"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Go Pro Card */}
      <div className="p-2.5">
        <div
          className="rounded-2xl p-6 text-white"
          style={{
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          }}
        >
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-[16px] font-semibold mb-2">Go Pro?</h3>
          <p className="text-[13px] text-white/70 mb-4 leading-relaxed">
            Get unlimited AI renders and priority support.
          </p>
          <button className="w-full bg-white text-[#1a1a1a] text-[14px] font-medium py-2.5 px-4 rounded-lg hover:bg-white/90 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-96 h-screen sticky top-0 border-r border-[#e5e5e5]">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="lg:hidden fixed left-0 top-0 w-70 h-screen border-r border-[#e5e5e5] z-50"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
