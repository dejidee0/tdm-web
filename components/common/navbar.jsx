"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useIsAuthenticated, useLogout } from "@/hooks/use-auth";
import { Heart, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: cart } = useCart();
  const { isAuthenticated, user, isLoading } = useIsAuthenticated();
  const logout = useLogout();

  // Calculate total items in cart
  const itemCount = cart?.items?.length || 0;

  const navLinks = [
    { name: "Materials", href: "/flooring" },
    { name: "AI Visualizer", href: "/ai-visualizer" },
    { name: "Project", href: "/project" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    logout.mutate();
    setIsProfileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 backdrop-blur-sm bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
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
              className="h-12 w-auto"
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

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Favorites Icon */}
                <Link href="/dashboard/saved-items">
                  <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200">
                    <Heart className="w-6 h-6" />
                  </button>
                </Link>

                {/* Cart Icon with Badge */}
                <Link href="/cart">
                  <button className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                        {itemCount > 9 ? "9+" : itemCount}
                      </span>
                    )}
                  </button>
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      {user?.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name || "User"}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-600">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name || "User"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                      >
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          My Profile
                        </Link>
                        <Link
                          href="/dashboard/orders"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          Orders
                        </Link>
                        <Link
                          href="/dashboard/saved-items"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                          Saved Items
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Settings
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        <button
                          onClick={handleLogout}
                          disabled={logout.isPending}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          {logout.isPending ? "Logging out..." : "Logout"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                {/* Cart Icon (for logged out users) */}
                <Link href="/cart">
                  <button className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                        {itemCount > 9 ? "9+" : itemCount}
                      </span>
                    )}
                  </button>
                </Link>

                {/* Login Button */}
                <Link
                  href="/sign-in"
                  className="px-6 py-2 text-[15px] font-medium font-primary text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Login
                </Link>

                {/* Book Consultation Button */}
                <Link
                  href="/consultation"
                  className="px-6 py-2 text-[15px] font-medium font-primary text-white bg-primary rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Book Consultation
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Mobile Cart Icon */}
            <Link href="/cart">
              <button className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pt-2 pb-6 space-y-1 bg-white border-t border-gray-100">
          {/* User Info (Mobile) */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "User"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-600">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          )}

          {/* Nav Links */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* User Menu Items (Mobile) */}
          {isAuthenticated && (
            <>
              <hr className="my-2 border-gray-100" />
              <Link
                href="/dashboard"
                className="block px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href="/dashboard/orders"
                className="block px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                href="/dashboard/saved-items"
                className="block px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Saved Items
              </Link>
              <Link
                href="/dashboard/settings"
                className="block px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
            </>
          )}

          {/* Auth Buttons */}
          <div className="pt-4 space-y-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                disabled={logout.isPending}
                className="block w-full px-4 py-3 text-center text-[15px] font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
              >
                {logout.isPending ? "Logging out..." : "Logout"}
              </button>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="block w-full px-4 py-3 text-center text-[15px] font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/consultation"
                  className="block w-full px-4 py-3 text-center text-[15px] font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Consultation
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
