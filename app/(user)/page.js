import HeroSection from "@/components/shared/home/hero";
import StatsStrip from "@/components/shared/home/trust-strip";
import ReimagineSection from "@/components/shared/home/why-tbm";
import ServicesSection from "@/components/shared/home/services";
import PortfolioSection from "@/components/shared/home/featured-projects";
import TransformationSection from "@/components/shared/home/transformation";
import ProcessSection from "@/components/shared/home/process";
import MaterialsBogatSection from "@/components/shared/home/materials-bogat";
import ArchServicesSection from "@/components/shared/home/arch-services";
import ZioraSection from "@/components/shared/home/ziora-teaser";
import TestimonialsSection from "@/components/shared/home/testimonials";

export const metadata = {
  title: "TBM Building Services – Design Digitally, Build Reality.",
  description:
    "The apex construction and architecture agency. Premium renovation, construction materials, and AI-powered space visualization for homes and commercial spaces across Abuja and Lagos.",
  keywords: [
    "TBM Building Services",
    "Ziora AI design",
    "Bogat materials",
    "renovation Nigeria",
    "construction Abuja",
    "interior design Lagos",
    "AI visualization architecture",
    "bespoke construction Nigeria",
    "luxury renovation Abuja",
    "building project estimate",
  ],
  authors: [{ name: "TBM Building Services" }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://tbmbuilding.com",
    siteName: "TBM Building Services",
    title: "TBM Building Services – Design Digitally, Build Reality.",
    description:
      "Premium renovation, AI-powered design with Ziora, and certified materials from Bogat — all in one platform.",
  },
};

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      {/* 1. Hero */}
      <HeroSection />
      {/* 2. Stats — 150+ | Hubs | N550M+ */}
      <StatsStrip />
      {/* 3. Reimagine your space */}
      <ReimagineSection />
      {/* 4. Our Services grid */}
      <ServicesSection />
      {/* 5. Explore Our Work portfolio */}
      <PortfolioSection />
      {/* 6. The TBM Transformation before/after */}
      <TransformationSection />
      {/* 7. Methodical Excellence process */}
      <ProcessSection />
      {/* 8. Material (Bogat) gallery */}
      <MaterialsBogatSection />
      {/* 9. Bespoke Architectural Services */}
      <ArchServicesSection />
      {/* 10. Ziora AI teaser */}
      <ZioraSection />
      {/* 11. Testimonials */}
      <TestimonialsSection />
    </main>
  );
}
