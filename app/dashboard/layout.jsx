import Navbar from "@/components/common/navbar";
import "../globals.css";
import Providers from "@/components/common/providers";
import Footer from "@/components/common/footer";

export const metadata = {
  title: "TDM User Dashboard",
  description: "Building and Construction Company",
};

export default function UserDashboardLayout({ children }) {
  return (
    <Providers>
      <Navbar />
      <div className="mt-24 ">{children}</div>
      <Footer />
    </Providers>
  );
}
