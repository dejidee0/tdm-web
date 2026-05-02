// app/(user)/layout.jsx
import "../globals.css";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import Providers from "@/components/common/providers";
import TBMConcierge from "@/components/common/concierge/main";

export const metadata = {
  title: "TBM Building Services — Design. Price. Build.",
  description:
    "Premium renovation, construction materials, and AI-powered space visualization across Abuja and Lagos.",
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
