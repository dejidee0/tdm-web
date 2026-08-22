import AIVisualizerView from "@/components/shared/ai-visualizer/visualizer-view";

export const metadata = {
  title: "Ziora AI — Design, Visualize & Know the Cost Before You Build",
  description:
    "Ziora AI by TBM creates 3D interior designs and generates project cost estimate ranges. Upload a room photo, choose a style, and see what's possible before you build.",
  keywords: [
    "Ziora AI",
    "AI interior design Nigeria",
    "3D home design Abuja",
    "interior visualizer Lagos",
    "room redesign AI",
    "AI project estimate Nigeria",
    "before and after renovation AI",
    "AI interior design Lagos",
    "Design with Ziora",
  ],
  openGraph: {
    title:
      "Ziora AI — Design, Visualize & Know the Cost | TBM Building Services",
    description:
      "See your space redesigned before a single tile is laid. 3D designs + cost estimate ranges. Powered by Ziora AI.",
    type: "website",
  },
};

export default function ZioraPage() {
  return <AIVisualizerView />;
}
