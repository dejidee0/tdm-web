"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useIsAuthenticated, useLogout } from "@/hooks/use-auth";
import { useAdminUser, useAdminLogout } from "@/hooks/use-admin-auth";
import { useVendorUser, useVendorLogout } from "@/hooks/use-vendor-auth";
import { useCartCount } from "@/hooks/use-cart";
import { useSavedItems } from "@/hooks/use-saved";
import {
  Heart,
  ChevronDown,
  X,
  Menu,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { isAuthenticated: isUserAuthed, user: regularUser, isLoading: userLoading } = useIsAuthenticated();
  const { data: adminUser, isLoading: adminLoading } = useAdminUser();
  const { data: vendorUser, isLoading: vendorLoading } = useVendorUser();

  const userLogout = useLogout();
  const adminLogout = useAdminLogout();
  const vendorLogout = useVendorLogout();

  // Determine active session: admin > vendor > regular user
  const isAuthenticated = !!(adminUser || vendorUser || isUserAuthed);
  const isLoading = adminLoading || vendorLoading || userLoading;

  // Normalize user object for display
  const activeUser = adminUser
    ? { ...adminUser, fullName: adminUser.name || `${adminUser.firstName || ""} ${adminUser.lastName || ""}`.trim() }
    : vendorUser
    ? { ...vendorUser, fullName: vendorUser.name || `${vendorUser.firstName || ""} ${vendorUser.lastName || ""}`.trim() }
    : regularUser;

  // Dashboard destination based on active session
  const dashboardHref = adminUser
    ? "/admin/dashboard"
    : vendorUser
    ? "/vendor/dashboard"
    : "/dashboard";
  const dashboardLabel = adminUser
    ? "Admin Dashboard"
    : vendorUser
    ? "Vendor Dashboard"
    : "Pro Dashboard";

  // Profile destination based on active session
  const profileHref = adminUser
    ? "/admin/dashboard/settings"
    : vendorUser
    ? "/vendor/dashboard/account-settings"
    : "/dashboard/profile";

  const cartCount = useCartCount();
  const pathname = usePathname();

  // Saved items count — only fetched when authenticated
  const { data: savedItems = [] } = useSavedItems();
  const savedCount = isAuthenticated ? savedItems.length : 0;

  const displayName =
    activeUser?.fullName ||
    `${activeUser?.firstName || ""} ${activeUser?.lastName || ""}`.trim() ||
    "User";
  const avatarInitial =
    activeUser?.firstName?.charAt(0)?.toUpperCase() ||
    activeUser?.fullName?.charAt(0)?.toUpperCase() ||
    "U";

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/project" },
    { name: "Shop", href: "/materials" },
    { name: "Ziora AI", href: "/ai-visualizer" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = () => {
    if (adminUser) adminLogout.mutate();
    else if (vendorUser) vendorLogout.mutate();
    else userLogout.mutate();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };
  const isLogoutPending = adminLogout.isPending || vendorLogout.isPending || userLogout.isPending;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-60 border-b border-[#E8E2D9] backdrop-blur-sm bg-[#FAF8F5]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={60}
                className="h-10 sm:h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 py-2 text-[15px] font-manrope font-medium tracking-wide transition-colors duration-200 group ${
                      active
                        ? "text-[#0A0A0A]"
                        : "text-[#5C5550] hover:text-[#0A0A0A]"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gold rounded-full transition-transform duration-300 origin-left ${
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                  <div className="w-20 h-4 rounded bg-gray-100 animate-pulse" />
                </div>
              ) : isAuthenticated ? (
                <>
                  {/* Heart / Saved */}
                  <Link href="/dashboard/saved">
                    <button
                      className={`relative p-2 transition-colors duration-200 ${
                        isActive("/dashboard/saved")
                          ? "text-primary"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <Heart
                        className={`w-6 h-6 ${isActive("/dashboard/saved") ? "fill-primary" : ""}`}
                      />
                      <SavedBadge count={savedCount} />
                    </button>
                  </Link>

                  {/* Cart */}
                  <Link href="/cart">
                    <button
                      className={`relative p-2 transition-colors duration-200 ${
                        isActive("/cart")
                          ? "text-primary"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <CartIcon className="w-6 h-6" />
                      <CartBadge count={cartCount} />
                    </button>
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      <Avatar
                        initial={avatarInitial}
                        avatar={activeUser?.avatar}
                        name={displayName}
                        size={10}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {displayName}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsProfileOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-64 bg-[#FAF8F5] border border-stone rounded-2xl shadow-xl overflow-hidden z-50"
                          >
                            <Link
                              href={profileHref}
                              onClick={() => setIsProfileOpen(false)}
                              className={`flex items-center gap-4 px-5 py-4.5 transition-colors ${
                                isActive(profileHref)
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-black/5 text-gray-900"
                              }`}
                            >
                              <User
                                className="w-7 h-7 shrink-0"
                                strokeWidth={1.5}
                              />
                              <span className="text-[17px] font-medium">
                                Profile
                              </span>
                            </Link>

                            <Link
                              href={dashboardHref}
                              onClick={() => setIsProfileOpen(false)}
                              className={`flex items-center gap-4 px-5 py-4.5 transition-colors ${
                                isActive(dashboardHref) &&
                                !isActive(profileHref)
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-black/5 text-gray-900"
                              }`}
                            >
                              <LayoutDashboard
                                className="w-7 h-7 shrink-0"
                                strokeWidth={1.5}
                              />
                              <span className="text-[17px] font-medium">
                                {dashboardLabel}
                              </span>
                            </Link>

                            <hr className="border-gray-300/70" />

                            <button
                              onClick={handleLogout}
                              disabled={isLogoutPending}
                              className="flex items-center gap-4 w-full px-5 py-[18px] hover:bg-black/5 text-gray-900 transition-colors disabled:opacity-50"
                            >
                              <LogOut
                                className="w-7 h-7 shrink-0"
                                strokeWidth={1.8}
                              />
                              <span className="text-[17px] font-semibold">
                                {isLogoutPending ? "Logging out..." : "Logout"}
                              </span>
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/cart">
                    <button
                      className={`relative p-2 transition-colors duration-200 ${
                        isActive("/cart")
                          ? "text-primary"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <CartIcon className="w-6 h-6" />
                      <CartBadge count={cartCount} />
                    </button>
                  </Link>
                  <Link
                    href="/contact?type=estimate"
                    className="px-4 py-2 text-[14px] font-medium text-[#3D3833] border border-stone rounded-lg hover:bg-warm transition-all duration-200"
                  >
                    Get Estimate
                  </Link>
                  <Link
                    href="/sign-in"
                    className="px-4 py-2 text-[14px] font-medium text-[#3D3833] border border-stone rounded-lg hover:bg-warm transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/contact?type=consultation"
                    className="px-4 py-2 text-[14px] font-medium text-white bg-[#0A0A0A] rounded-lg hover:bg-[#1C1C1C] transition-all duration-200 shadow-sm hover:shadow-md tracking-wide"
                  >
                    Book Consultation
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Right Icons */}
            <div className="lg:hidden flex items-center gap-0.5">
              {!isLoading && isAuthenticated && (
                <Link href="/dashboard/saved">
                  <button
                    className={`relative p-2 ${
                      isActive("/dashboard/saved")
                        ? "text-primary"
                        : "text-gray-700"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isActive("/dashboard/saved") ? "fill-primary" : ""}`}
                    />
                    <SavedBadge count={savedCount} />
                  </button>
                </Link>
              )}
              <Link href="/cart">
                <button
                  className={`relative p-2 cursor-pointer ${isActive("/cart") ? "text-primary" : "text-gray-700"}`}
                >
                  <CartIcon className="w-5 h-5" />
                  <CartBadge count={cartCount} />
                </button>
              </Link>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-55 bg-black/40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 z-60 w-[78vw] max-w-[320px] bg-[#FAF8F5] shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-stone shrink-0">
                <span className="text-sm font-semibold text-[#0A0A0A] tracking-widest uppercase">
                  Menu
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg text-[#5C5550] hover:bg-warm transition-colors -mr-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {!isLoading && isAuthenticated && activeUser && (
                  <div className="px-5 py-4 border-b border-stone bg-warm/50">
                    <div className="flex items-center gap-3">
                      <Avatar
                        initial={avatarInitial}
                        avatar={activeUser?.avatar}
                        name={displayName}
                        size={11}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {activeUser.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="py-3 px-3">
                  <p className="px-2 pb-1 text-[11px] font-semibold text-[#7A736C] uppercase tracking-widest">
                    Navigate
                  </p>
                  {navLinks.map((link, i) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.08 }}
                      >
                        <Link
                          href={link.href}
                          className={`flex items-center justify-between px-3 py-3 text-[15px] font-medium rounded-lg transition-colors ${
                            active
                              ? "bg-warm text-[#0A0A0A]"
                              : "text-[#5C5550] hover:bg-warm hover:text-[#0A0A0A]"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.name}
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {!isLoading && isAuthenticated && (
                  <div className="py-3 px-3 border-t border-stone">
                    <p className="px-2 pb-1 text-[11px] font-semibold text-[#7A736C] uppercase tracking-widest">
                      Account
                    </p>
                    <MobileLink
                      href="/dashboard/saved"
                      icon={
                        <span className="relative">
                          <Heart className="w-4 h-4" />
                          {savedCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                              {savedCount > 99 ? "99+" : savedCount}
                            </span>
                          )}
                        </span>
                      }
                      label="Saved Items"
                      active={isActive("/dashboard/saved")}
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <MobileLink
                      href={profileHref}
                      icon={<User className="w-4 h-4" />}
                      label="Profile"
                      active={isActive(profileHref)}
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <MobileLink
                      href={dashboardHref}
                      icon={<LayoutDashboard className="w-4 h-4" />}
                      label={dashboardLabel}
                      active={
                        isActive(dashboardHref) &&
                        !isActive(profileHref)
                      }
                      onClick={() => setIsMenuOpen(false)}
                    />
                  </div>
                )}
              </div>

              <div className="px-5 py-5 border-t border-stone space-y-2.5 shrink-0">
                {isLoading ? (
                  <div className="w-full h-12 rounded-xl bg-warm animate-pulse" />
                ) : isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    disabled={isLogoutPending}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-[15px] font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" />
                    {isLogoutPending ? "Logging out..." : "Logout"}
                  </button>
                ) : (
                  <>
                    <Link
                      href="/contact?type=estimate"
                      className="flex items-center justify-center w-full px-4 py-3 text-[15px] font-medium text-[#3D3833] border border-stone rounded-xl hover:bg-warm transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Estimate
                    </Link>
                    <Link
                      href="/sign-in"
                      className="flex items-center justify-center w-full px-4 py-3 text-[15px] font-medium text-[#3D3833] border border-stone rounded-xl hover:bg-warm transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/contact?type=consultation"
                      className="flex items-center justify-center w-full px-4 py-3 text-[15px] font-medium text-white bg-[#0A0A0A] rounded-xl hover:bg-[#1C1C1C] transition-colors tracking-wide"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Book Consultation
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function SavedBadge({ count }) {
  if (!count || count === 0) return null;
  return (
    <AnimatePresence>
      <motion.span
        key={count}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none"
      >
        {count > 99 ? "99+" : count}
      </motion.span>
    </AnimatePresence>
  );
}

function CartBadge({ count }) {
  if (!count || count === 0) return null;
  return (
    <AnimatePresence>
      <motion.span
        key={count}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none"
      >
        {count > 99 ? "99+" : count}
      </motion.span>
    </AnimatePresence>
  );
}

function Avatar({ initial, avatar, name, size = 10 }) {
  const sizeClass = `w-${size} h-${size}`;
  return (
    <div
      className={`${sizeClass} rounded-full bg-primary/10 overflow-hidden flex items-center justify-center shrink-0`}
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={44}
          height={44}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm font-bold text-primary">{initial}</span>
      )}
    </div>
  );
}

function CartIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function MobileLink({ href, icon, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-3 text-[15px] font-medium rounded-lg transition-colors ${
        active ? "bg-warm text-[#0A0A0A]" : "text-[#5C5550] hover:bg-warm"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? "text-[#0A0A0A]" : "text-[#7A736C]"}>
          {icon}
        </span>
        {label}
      </div>
      {active && (
        <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
      )}
    </Link>
  );
}
