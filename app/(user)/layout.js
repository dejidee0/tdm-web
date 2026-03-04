// app/(user)/layout.jsx
import "../globals.css";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import Providers from "@/components/common/providers";
import TBMConcierge from "@/components/common/concierge/main";

export const metadata = {
  title: "TDM",
  description: "Building and Construction Company",
};

export default function UserLayout({ children }) {
  return (
    <Providers>
      <Navbar />
      {children}
      <Footer />
      {/* Floating AI Assistant — rendered outside page flow, fixed positioned */}
      <TBMConcierge />
    </Providers>
  );
}
