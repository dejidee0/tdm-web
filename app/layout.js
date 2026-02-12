import { Inter } from "next/font/google";
import "./globals.css";

import Providers from "@/components/common/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "700", "900"],
  display: "swap",
});

export const metadata = {
  title: "TDM ",
  description: "Building and Construction Company",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body
        className={`${inter.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
