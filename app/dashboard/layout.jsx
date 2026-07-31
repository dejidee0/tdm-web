import Navbar from "@/components/common/navbar";
import "../globals.css";

// No <Providers> here — the root layout (app/layout.js) already supplies them.

export const metadata = {
  title: "My Dashboard | TBM Building Services",
  description: "Manage your projects, orders, saved designs, and account settings.",
};

export default function UserDashboardLayout({ children }) {
  return (
    <>
      {/* The footer lives in the DashboardLayout *component*, not here, so a
          focused full-page task (e.g. /dashboard/ai-designs/new) can opt out of
          the whole dashboard shell — sidebar and footer together — while every
          page that renders DashboardLayout still gets both. */}
      <Navbar />
      <div className="mt-16">{children}</div>
    </>
  );
}
