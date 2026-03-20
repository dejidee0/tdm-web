import CTASection from "@/components/shared/home/cta";
import CustomizeSection from "@/components/shared/home/customize";
import HeroSection from "@/components/shared/home/hero";
import ProcessSection from "@/components/shared/home/process";
import ServicesSection from "@/components/shared/home/services";
import TrendingSection from "@/components/shared/home/trending";

export const metadata = {
  title:
    "TBM Building Services – Design with Ziora, Build with TBM, Source from Bogat",
  description:
    "TBM Building Services powers your renovation and construction journey. Design with Ziora AI intelligence, source certified materials through Bogat, and execute your project with TBM's expert team.",
  keywords: [
    "TBM Building Services",
    "Ziora AI design",
    "Bogat materials",
    "renovation Nigeria",
    "construction materials",
    "building project estimate",
    "tiles plumbing electrical",
    "home renovation Lagos",
    "AI visualization",
    "project execution",
  ],
  authors: [{ name: "TBM Building Services" }],
  creator: "TBM Building Services",
  publisher: "TBM Building Services",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://yourdomain.com",
    siteName: "TBM Building Services",
    title: "TBM Building Services – Design. Materials. Execution.",
    description:
      "Design with Ziora Intelligence, source certified materials through Bogat, and let TBM manage your renovation or construction project end-to-end.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative">
      <HeroSection />
      <ServicesSection />
      <CustomizeSection />
      <TrendingSection />
      <ProcessSection />
      <CTASection />
    </div>
  );
}
