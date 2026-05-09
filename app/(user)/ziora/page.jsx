import AIVisualizerView from "@/components/shared/ai-visualizer/visualizer-view";

export const metadata = {
  title: "Ziora AI — Design, Visualize & Know the Cost Before You Build",
  description:
    "Ziora AI by TBM creates stunning 3D interior designs and generates accurate project cost estimates in minutes. Upload a room photo, choose a style, and get a full breakdown — smart, fast, accurate.",
  keywords: [
    "Ziora AI",
    "AI interior design Nigeria",
    "3D home design Abuja",
    "interior visualizer Lagos",
    "room redesign AI",
    "AI project estimate Nigeria",
    "before and after renovation AI",
    "AI interior design Lagos",
    "Ziora AI visualizer",
  ],
  openGraph: {
    title: "Ziora AI — Design, Visualize & Know the Cost | TBM Building Services",
    description:
      "See your space redesigned before a single tile is laid. 3D designs + instant cost estimates. Powered by Ziora AI.",
    type: "website",
  },
};

export default function ZioraPage() {
  return <AIVisualizerView />;
}
