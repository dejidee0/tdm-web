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
  { icon: Heart, label: "Saved Items", href: "/dashboard/saved" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
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
    <div className="h-full flex flex-col font-manrope" style={{ background: "#0d0b08" }}>
      {/* Header */}
      <div className="p-6 border-b border-white/08">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
              style={{ background: "rgba(212,175,55,0.12)" }}
            >
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={displayName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-[#D4AF37]">
                  {avatarInitial}
                </span>
              )}
            </div>
            <div className="min-w-0">
              {user ? (
                <>
                  <p className="text-base text-white font-semibold font-manrope truncate">
                    Welcome back, {user?.firstName || displayName}
                  </p>
                  <p className="text-sm text-white/40 mt-0.5">Premium Member</p>
                </>
              ) : (
                <>
                  <div className="h-4 w-32 bg-white/08 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-white/08 rounded animate-pulse mt-1.5" />
                </>
              )}
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-white/05 rounded-md transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                    ? "text-[#D4AF37]"
                    : "text-white/50 hover:bg-white/05 hover:text-white"
                }
              `}
              style={
                isActive
                  ? { background: "rgba(212,175,55,0.10)" }
                  : undefined
              }
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
            background: "rgba(212,175,55,0.06)",
            boxShadow: "0 0 0 1px rgba(212,175,55,0.15)",
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
            style={{ background: "rgba(212,175,55,0.12)" }}
          >
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <h3 className="text-[16px] font-semibold mb-2 text-white">Go Pro?</h3>
          <p className="text-[13px] text-white/50 mb-4 leading-relaxed">
            Get unlimited AI renders and priority support.
          </p>
          <Link
            href="/ai-visualizer#pricing"
            className="block w-full text-center text-[14px] font-medium py-2.5 px-4 rounded-lg transition-colors text-black"
            style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
          >
            Upgrade Plan
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 h-screen sticky top-0 border-r border-white/08">
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
            className="lg:hidden fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 border-r border-white/08 z-50 overflow-y-auto"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
