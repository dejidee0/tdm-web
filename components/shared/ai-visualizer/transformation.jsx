"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, FileText, Video } from "lucide-react";

const paths = [
  {
    icon: ImageIcon,
    title: "Image to Image",
    description:
      "Upload a photo of your current room. Ziora re-skins the existing geometry with your chosen styles.",
    features: ["Preserves room layout", "Swap furniture and materials"],
  },
  {
    icon: FileText,
    title: "Text to Image",
    description:
      "Describe your dream space from scratch. Perfect for planning new additions or full-floor transformations.",
    features: ["Complete creative freedom", "AI-guided layout generation"],
  },
  {
    icon: Video,
    title: "Image to Video",
    description:
      "Animate your renders. Walk through your renovated kitchen or pan across your new patio in cinematic 4K.",
    features: ["360° pan & walkthroughs", "Dynamic lighting and motion"],
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
});

export default function TransformationPath() {
  return (
    <section className="bg-black py-16 px-4 sm:px-6 font-manrope">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="text-center mb-10">
        <h2 className="text-white text-3xl sm:text-4xl font-bold mb-2.5 tracking-tight">
          Choose Your Transformation Path
        </h2>
        <p className="text-white/40 text-sm sm:text-base">
          Three powerful ways to visualize your future space.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="max-w-275 mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        {paths.map((path, i) => {
          const Icon = path.icon;
          return (
            <motion.div
              key={path.title}
              {...fadeUp(0.1 + i * 0.1)}
              className="rounded-2xl p-7 flex flex-col gap-4 border border-white/08"
              style={{ background: "#0d0b08" }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(212,175,55,0.08)" }}
              >
                <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.6} />
              </div>

              {/* Title + Description */}
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-lg font-bold">{path.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {path.description}
                </p>
              </div>

              {/* Feature list */}
              <ul className="flex flex-col gap-2 mt-auto pt-2">
                {path.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 shrink-0 text-green-500"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        opacity="0.3"
                      />
                      <path
                        d="M6.5 10.5l2.5 2.5 4.5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-white/40 text-sm">{feat}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
