import UnderConstruction from "@/components/shared/under-construction";
import HeroSection from "@/components/shared/home/hero";
import StatsStrip from "@/components/shared/home/trust-strip";
import ZioraSection from "@/components/shared/home/ziora-teaser";
import TransformationSection from "@/components/shared/home/transformation";
import ProcessSection from "@/components/shared/home/process";
import ServicesSection from "@/components/shared/home/services";
import PortfolioSection from "@/components/shared/home/featured-projects";
import MaterialsBogatSection from "@/components/shared/home/materials-bogat";
import WhyChooseTBM from "@/components/shared/home/why-choose-tbm";
import AppDownloadBanner from "@/components/shared/home/app-download";

export const metadata = {
  title: "TBM Building Services – Luxury Renovation & Smart Construction",
  description:
    "Premium renovation and construction company in Abuja & Lagos. We design, visualize, and build luxury spaces using Ziora — our AI-powered 3D design and project estimation system.",
  keywords: [
    "TBM Building Services",
    "luxury renovation Abuja",
    "construction Lagos",
    "Ziora AI design",
    "Bogat materials Nigeria",
    "interior design Abuja",
    "3D home visualization",
    "building project estimate Nigeria",
    "smart construction Nigeria",
    "premium renovation contractor",
  ],
  authors: [{ name: "TBM Building Services" }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://tbmbuilding.com",
    siteName: "TBM Building Services",
    title: "TBM Building Services – Luxury Renovation & Smart Construction",
    description:
      "Premium renovation, AI-powered design with Ziora, and certified materials from Bogat — all in one platform.",
  },
};

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      {/* ── PUBLIC GATE: remove this component to reveal the site ── */}
      <UnderConstruction />
      {/* 1. Hero — split layout */}
      <HeroSection />

      {/* 2. Stats — 4-stat horizontal bar */}
      <StatsStrip />

      {/* 3. Ziora AI — 3-panel app mockup */}
      <ZioraSection />

      {/* 4. Before & After — 4-across transformation gallery */}
      <TransformationSection />
      <div className="bg-white/35 h-[0.35px] w-[80%] mx-auto"></div>
      {/* 5. The TBM × Ziora System — 4-step process */}
      <ProcessSection />
      <div className="bg-white/35 h-[0.35px] w-[80%] mx-auto"></div>
      {/* 6. Our Services — 6 image cards */}
      <ServicesSection />

      {/* 7. Explore Our Work — filterable portfolio */}
      {/* <PortfolioSection /> */}

      {/* 8. Bogat Marketplace — product showcase */}
      <MaterialsBogatSection />

      {/* 9. Why Choose TBM + Testimonials + Final CTA */}
      <WhyChooseTBM />

      {/* 10. App Download */}
      {/* <AppDownloadBanner /> */}
    </main>
  );
}
