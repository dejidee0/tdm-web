import AIVisualizerView from "@/components/shared/ai-visualizer/visualizer-view";

export const metadata = {
  title: "Ziora AI Visualizer — See Your Space Before You Build",
  description:
    "Upload a room photo, choose a style, and see a photorealistic redesign in seconds. Use the result to get an estimate, shop matching materials, or book a consultation.",
  keywords: [
    "AI home design Nigeria",
    "interior visualizer Abuja",
    "room redesign AI",
    "Ziora AI",
    "before and after renovation AI",
    "AI interior design Lagos",
  ],
  openGraph: {
    title: "Ziora AI Visualizer | TBM Building Services",
    description:
      "See your space redesigned before a single tile is laid. Powered by Ziora AI.",
    type: "website",
  },
};

export default function AIVisualizerPage() {
  return <AIVisualizerView />;
}
