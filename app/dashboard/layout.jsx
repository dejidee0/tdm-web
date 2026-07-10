import Navbar from "@/components/common/navbar";
import "../globals.css";
import Footer from "@/components/common/footer";

// No <Providers> here — the root layout (app/layout.js) already supplies them.

export const metadata = {
  title: "My Dashboard | TBM Building Services",
  description: "Manage your projects, orders, saved designs, and account settings.",
};

export default function UserDashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="mt-16">{children}</div>
      <Footer />
    </>
  );
}
