import { Titillium_Web, Inter, Manrope } from "next/font/google";
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
  weight: ["200", "300", "400"],
});
const manRope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400"],
});

export const metadata = {
  title: "TDM ",
  description: "Building and Construction Company",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body
        className={`${titilum.variable} ${inter.variable} ${manRope.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
