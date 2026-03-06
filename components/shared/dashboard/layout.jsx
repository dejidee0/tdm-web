// components/dashboard/DashboardLayout.jsx
"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Mobile hamburger bar — fixed directly below the navbar (top-16) */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 flex items-center justify-end h-12 px-4 bg-white border-b border-gray-200">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-[#1a1a1a]" />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed top-16 inset-x-0 bottom-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Layout Wrapper — pt-28 on mobile accounts for navbar (4rem) + hamburger bar (3rem) */}
      <div className="flex max-w-7xl mx-auto pt-0 lg:pt-0">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className="font-manrope px-4 sm:px-6 lg:px-8 pt-4 lg:pt-6 pb-6 max-w-[1400px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
