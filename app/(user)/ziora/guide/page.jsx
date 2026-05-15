import ZioraGuideClient from "./client";

export const metadata = {
  title: "How to Use Ziora AI — Full Guide | TBM Building Services",
  description:
    "Step-by-step guide to using Ziora AI: upload your space, choose a style, get a 3D visualization, review your cost estimate, and share with TBM to start building.",
  keywords: [
    "Ziora guide",
    "how to use Ziora AI",
    "AI interior design guide",
    "3D room design tutorial",
    "cost estimate AI Nigeria",
    "Ziora tutorial",
  ],
  openGraph: {
    title: "How to Use Ziora AI — Your Complete Guide | TBM",
    description:
      "Everything you need to know to get stunning 3D designs and accurate project estimates from Ziora AI.",
    type: "website",
  },
};

export default function ZioraGuidePage() {
  return <ZioraGuideClient />;
}
