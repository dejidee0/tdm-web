import CTASection from "@/components/shared/home/cta";
import CustomizeSection from "@/components/shared/home/customize";
import HeroSection from "@/components/shared/home/hero";
import ServicesSection from "@/components/shared/home/services";
import TrendingSection from "@/components/shared/home/trending";

export const metadata = {
  title:
    "TBM - Transform Your Dream Home with Premium Materials & AI Visualization",
  description:
    "Discover premium materials, visualize your space with AI technology, and connect with expert designers. Shop high-quality furniture, get expert consultations, and transform your home renovation journey with TBM.",
  keywords: [
    "premium materials",
    "AI home visualization",
    "furniture shopping",
    "interior design",
    "home renovation",
    "expert consultation",
    "custom furniture",
    "home transformation",
    "TBM",
  ],
  authors: [{ name: "TBM" }],
  creator: "TBM",
  publisher: "TBM",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://yourdomain.com",
    siteName: "TBM - Transform Your Home",
    title: "TBM - Transform Your Dream Home with Premium Materials & AI",
    description:
      "Discover premium materials, visualize your space with AI, and connect with expert designers to bring your vision to life.",
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
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ServicesSection />
      <CustomizeSection />
      <TrendingSection />
      <CTASection />
    </div>
  );
}
