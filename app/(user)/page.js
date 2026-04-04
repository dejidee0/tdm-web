import CTASection from "@/components/shared/home/cta";
import FAQ from "@/components/shared/home/faq";
import FeaturedProjects from "@/components/shared/home/featured-projects";
import HeroSection from "@/components/shared/home/hero";
import ProcessSection from "@/components/shared/home/process";
import ServicesSection from "@/components/shared/home/services";
import ShopCategories from "@/components/shared/home/shop-categories";
import Testimonials from "@/components/shared/home/testimonials";
import TrustStrip from "@/components/shared/home/trust-strip";
import TrendingSection from "@/components/shared/home/trending";
import WhyTBM from "@/components/shared/home/why-tbm";
import ZioraTeaser from "@/components/shared/home/ziora-teaser";

export const metadata = {
  title: "TBM Building Services – Design. Price. Build. All in one place.",
  description:
    "Premium renovation, construction materials, and AI-powered space visualization for homes, apartments, and commercial spaces across Abuja and Lagos.",
  keywords: [
    "TBM Building Services",
    "Ziora AI design",
    "Bogat materials",
    "renovation Nigeria",
    "bathroom renovation Abuja",
    "kitchen remodeling Abuja",
    "construction materials Nigeria",
    "building project estimate",
    "home renovation Lagos",
    "AI visualization",
    "interior fit-out Abuja",
    "premium bathroom fixtures Nigeria",
  ],
  authors: [{ name: "TBM Building Services" }],
  creator: "TBM Building Services",
  publisher: "TBM Building Services",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://tbmbuilding.com",
    siteName: "TBM Building Services",
    title: "TBM Building Services – Design. Price. Build. All in one place.",
    description:
      "Premium renovation, AI-powered design with Ziora, and certified materials from Bogat — all in one platform.",
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
      {/* 1. Hero */}
      <HeroSection />
      {/* 2. Trust strip */}
      <TrustStrip />
      {/* 3. How TBM Works — 4 steps */}
      <ProcessSection />
      {/* 4. TBM / Bogat / Ziora pillars */}
      <ServicesSection />
      {/* 5. Featured transformations */}
      <FeaturedProjects />
      {/* 6. Shop categories */}
      <ShopCategories />
      {/* 7. Featured products */}
      <TrendingSection />
      {/* 8. Ziora AI teaser */}
      <ZioraTeaser />
      {/* 9. Why Choose TBM */}
      <WhyTBM />
      {/* 10. Testimonials */}
      <Testimonials />
      {/* 11. FAQ */}
      <FAQ />
      {/* 12. Final CTA */}
      <CTASection />
    </div>
  );
}
