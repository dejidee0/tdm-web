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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="
          lg:hidden
          fixed top-4 left-4 z-50
          p-2 bg-white rounded-lg shadow-md
        "
      >
        <Menu className="w-6 h-6 text-[#1a1a1a]" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Layout Wrapper */}
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 w-full">
          <main
            className="
              font-manrope
              px-4 sm:px-6 lg:px-8
               lg:pt-6
              pb-6
              max-w-[1400px]
              mx-auto
            "
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
