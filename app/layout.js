import { Inter, Manrope, Titillium_Web } from "next/font/google";
import "./globals.css";

import Providers from "@/components/common/providers";

const titilum = Titillium_Web({
  variable: "--font-titilum",
  subsets: ["latin"],
  weight: ["200", "300", "400"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});
const manRope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "TDM ",
  description: "Building and Construction Company",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${titilum.variable} ${inter.variable} ${manRope.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
