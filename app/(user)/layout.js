import "../globals.css";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import Providers from "@/components/common/providers";

export const metadata = {
  title: "TDM ",
  description: "Building and Construction Company",
};

export default function UserLayout({ children }) {
  return (
    <Providers>
      <Navbar />
      {children}
      <Footer />
    </Providers>
  );
}
