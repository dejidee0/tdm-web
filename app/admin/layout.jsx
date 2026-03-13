"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/shared/admin/dashboard/sidebar";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Don't render the dashboard shell on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white text-primary rounded-lg shadow-md"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - always visible */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full w-60 bg-white border-r border-[#E5E7EB] z-40">
        <AdminSidebar />
      </aside>

      {/* Mobile Sidebar - animated */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 h-full w-60 bg-white border-r border-[#E5E7EB] z-40"
          >
            <AdminSidebar />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-60 min-h-screen">
        <div className="p-4 lg:p-6 xl:p-8 mt-2 md:mt-0">{children}</div>
      </main>
    </div>
  );
}
