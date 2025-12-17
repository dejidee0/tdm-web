import { Titillium_Web, Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";

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
    <html lang="en">
      <body
        className={`${titilum.variable} ${inter.variable} ${manRope.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
