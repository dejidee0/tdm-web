"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/shared/admin/dashboard/sidebar";
import { useAdminUser } from "@/hooks/use-admin-auth";

export default function AdminLayout({ children }) {
  // Prime the auth cache immediately when the layout mounts.
  // All child hooks use `useIsAdminAuthed()` which reads this same query key.
  // By firing the /me request here — before children mount — we eliminate the
  // serial waterfall where data queries wait for auth to resolve first.
  useAdminUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Tapping a nav item navigates but leaves this layout mounted, so the drawer
  // has to be dismissed explicitly — otherwise it stays open on top of the page
  // the user just navigated to.
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSidebarOpen]);

  // Don't let the page scroll behind the open drawer.
  useEffect(() => {
    if (!isSidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isSidebarOpen]);

  // Don't render the dashboard shell on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile top bar. In normal flow, so it reserves its own height — the
          hamburger used to be `fixed` with nothing below it, and sat on top of
          each page's heading and action buttons. */}
      <header className="lg:hidden sticky top-0 z-50 h-14 flex items-center justify-between gap-3 px-4 bg-surface border-b border-white/08">
        <span className="font-manrope font-bold text-[15px] text-white truncate">
          TBM &amp; Bogat
        </span>
        {/* Toggle, not just "open". The drawer is 240px wide, so this button at
            the right edge is never covered by it and stays tappable to close. */}
        <button
          onClick={() => setIsSidebarOpen((v) => !v)}
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={isSidebarOpen}
          aria-controls="admin-mobile-nav"
          className="shrink-0 p-2 -mr-2 text-white/70 hover:text-white rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - always visible */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full w-60 bg-surface border-r border-white/08 z-40">
        <AdminSidebar />
      </aside>

      {/* Mobile Sidebar - animated */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            id="admin-mobile-nav"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 h-full w-60 bg-surface border-r border-white/08 z-50"
          >
            <AdminSidebar />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-60 min-h-[calc(100vh-3.5rem)] lg:min-h-screen">
        <div className="p-4 lg:p-6 xl:p-8">{children}</div>
      </main>
    </div>
  );
}
