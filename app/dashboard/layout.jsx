import Navbar from "@/components/common/navbar";
import "../globals.css";
import Providers from "@/components/common/providers";
import Footer from "@/components/common/footer";

export const metadata = {
  title: "My Dashboard | TBM Building Services",
  description: "Manage your projects, orders, saved designs, and account settings.",
};

export default function UserDashboardLayout({ children }) {
  return (
    <Providers>
      <Navbar />
      <div className="mt-16">{children}</div>
      <Footer />
    </Providers>
  );
}
