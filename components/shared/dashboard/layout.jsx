// components/dashboard/DashboardLayout.jsx
"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile-only sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-19 left-4 z-30 p-2 bg-[#0d0b08] border border-white/10 rounded-lg hover:bg-white/05 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5 text-white/60" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed top-16 inset-x-0 bottom-0 bg-black/70 z-40"
          />
        )}
      </AnimatePresence>

      {/* Layout Wrapper — pt-28 on mobile accounts for navbar (4rem) + hamburger bar (3rem) */}
      <div className="flex max-w-7xl mx-auto pt-0 lg:pt-0">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className="font-manrope px-4 sm:px-6 lg:px-8 pt-4 lg:pt-6 pb-6 max-w-350 mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
