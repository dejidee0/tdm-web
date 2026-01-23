import "./globals.css";
import Navbar from "@/components/common/navbar";

import Providers from "@/components/common/providers";

export const metadata = {
  title: "Join TDM",
  description: "Building and Construction Company",
};

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
