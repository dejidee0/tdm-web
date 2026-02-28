"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsAuthenticated, useLogout } from "@/hooks/use-auth";
import {
  Heart,
  ChevronDown,
  X,
  Menu,
  LogOut,
  User,
  Package,
  Settings,
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, isLoading } = useIsAuthenticated();
  const logout = useLogout();

  const displayName =
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "User";
  const avatarInitial =
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.fullName?.charAt(0)?.toUpperCase() ||
    "U";

  const navLinks = [
    { name: "Materials", href: "/materials" },
    { name: "AI Visualizer", href: "/ai-visualizer" },
    { name: "Project", href: "/project" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    logout.mutate();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-60 border-b border-gray-100 backdrop-blur-sm bg-white/95">
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
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-[15px] font-manrope font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Show skeleton while auth state is loading */}
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                  <div className="w-20 h-4 rounded bg-gray-100 animate-pulse" />
                </div>
              ) : isAuthenticated ? (
                <>
                  <Link href="/dashboard/saved-items">
                    <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200">
                      <Heart className="w-6 h-6" />
                    </button>
                  </Link>

                  <Link href="/cart">
                    <button className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200">
                      <CartIcon className="w-6 h-6" />
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
                        avatar={user?.avatar}
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
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {displayName}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {user?.email}
                            </p>
                          </div>
                          <DropdownLink
                            href="/dashboard"
                            icon={<User className="w-4 h-4" />}
                            label="My Profile"
                            onClick={() => setIsProfileOpen(false)}
                          />
                          <DropdownLink
                            href="/dashboard/orders"
                            icon={<Package className="w-4 h-4" />}
                            label="Orders"
                            onClick={() => setIsProfileOpen(false)}
                          />
                          <DropdownLink
                            href="/dashboard/saved-items"
                            icon={<Heart className="w-4 h-4" />}
                            label="Saved Items"
                            onClick={() => setIsProfileOpen(false)}
                          />
                          <DropdownLink
                            href="/dashboard/settings"
                            icon={<Settings className="w-4 h-4" />}
                            label="Settings"
                            onClick={() => setIsProfileOpen(false)}
                          />
                          <hr className="my-2 border-gray-100" />
                          <button
                            onClick={handleLogout}
                            disabled={logout.isPending}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <LogOut className="w-4 h-4" />
                            {logout.isPending ? "Logging out..." : "Logout"}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/cart">
                    <button className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200">
                      <CartIcon className="w-6 h-6" />
                    </button>
                  </Link>
                  <Link
                    href="/sign-in"
                    className="px-5 py-2 text-[15px] font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/consultation"
                    className="px-5 py-2 text-[15px] font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Book Consultation
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Right Icons */}
            <div className="lg:hidden flex items-center gap-0.5">
              {!isLoading && isAuthenticated && (
                <Link href="/dashboard/saved-items">
                  <button className="p-2 text-gray-700">
                    <Heart className="w-5 h-5" />
                  </button>
                </Link>
              )}
              <Link href="/cart">
                <button className="relative p-2 cursor-pointer text-gray-700">
                  <CartIcon className="w-5 h-5" />
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

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-55 bg-black/40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 z-60 w-[78vw] max-w-[320px] bg-white shadow-2xl lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
                <span className="text-sm font-semibold text-gray-900">
                  Menu
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors -mr-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto">
                {/* User Profile Block */}
                {!isLoading && isAuthenticated && user && (
                  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/70">
                    <div className="flex items-center gap-3">
                      <Avatar
                        initial={avatarInitial}
                        avatar={user?.avatar}
                        name={displayName}
                        size={11}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Nav Links */}
                <div className="py-3 px-3">
                  <p className="px-2 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                    Navigate
                  </p>
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.08 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center px-3 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Account Links - only when authenticated */}
                {!isLoading && isAuthenticated && (
                  <div className="py-3 px-3 border-t border-gray-100">
                    <p className="px-2 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                      Account
                    </p>
                    <MobileLink
                      href="/dashboard"
                      icon={<User className="w-4 h-4" />}
                      label="My Profile"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <MobileLink
                      href="/dashboard/orders"
                      icon={<Package className="w-4 h-4" />}
                      label="Orders"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <MobileLink
                      href="/dashboard/saved-items"
                      icon={<Heart className="w-4 h-4" />}
                      label="Saved Items"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <MobileLink
                      href="/dashboard/settings"
                      icon={<Settings className="w-4 h-4" />}
                      label="Settings"
                      onClick={() => setIsMenuOpen(false)}
                    />
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="px-5 py-5 border-t border-gray-100 space-y-2.5 shrink-0">
                {isLoading ? (
                  // Skeleton while loading
                  <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse" />
                ) : isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-[15px] font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" />
                    {logout.isPending ? "Logging out..." : "Logout"}
                  </button>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className="flex items-center justify-center w-full px-4 py-3 text-[15px] font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/consultation"
                      className="flex items-center justify-center w-full px-4 py-3 text-[15px] font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
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

/* ── Sub-components ── */

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

function DropdownLink({ href, icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </Link>
  );
}

function MobileLink({ href, icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </Link>
  );
}
