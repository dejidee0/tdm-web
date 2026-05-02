import "../globals.css";
import Navbar from "@/components/common/navbar";

import Providers from "@/components/common/providers";

export const metadata = {
  title: "Sign In | TBM Building Services",
  description: "Log in or create your TBM account to manage projects, save designs, and shop materials.",
};

export default function AuthLayout({ children }) {
  return (
    <Providers>
      <Navbar />
      {children}
    </Providers>
  );
}
