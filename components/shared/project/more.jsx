"use client";

import AuthModal from "@/components/common/auth-modal";
import { useCurrentUser } from "@/hooks/use-auth";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const RECOMMENDED_PROJECTS = [
  {
    id: 1,
    image: "/product-main.svg",
    title: "Boho Living Room",
  },
  {
    id: 2,
    image: "/product-main.svg",
    title: "Eco-Friendly Kitchen",
  },
  {
    id: 3,
    image: "/product-main.svg",
    title: "Smart Home Office",
  },
  {
    id: 4,
    image: "/product-main.svg",
    title: "Luxury Walk-in Closet",
  },
];

export default function LoadMoreAndRecommended() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState("");
  const { data: user } = useCurrentUser();
  const handleSaveProject = () => {
    if (!user) {
      setShowAuthModal((prev) => !prev);
    }
  };
  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section className="w-full bg-background pb-20 font-manrope">
      <div className="max-w-7xl mx-auto px-4">
        {/* Load More Button */}
        <div className="flex justify-center mb-16">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-8 py-3.5 bg-white border border-gray-300 rounded-full text-gray-900 font-semibold text-base hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load More Projects
                <RefreshCw className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-gray-300 mb-16" />

        {/* Recommended Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-8"
          >
            <Sparkles className="w-5 h-5 text-gray-900" />
            <h2 className="text-2xl font-medium text-gray-900">
              Recommended for You
            </h2>
          </motion.div>

          {/* Recommended Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {RECOMMENDED_PROJECTS.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-2xl cursor-pointer"
              >
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "75%" }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white text-lg font-medium">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-[#1A1D2E] rounded-2xl p-4 w-[60%] overflow-hidden mx-auto"
          >
            {/* Background Pattern (optional decorative element) */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Content */}
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-[#2D3142] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-white text-lg font-semibold mb-1">
                    Love these designs?
                  </h3>
                  <p className="text-white/70 text-sm">
                    Book your free consultation today.
                  </p>
                </div>
              </div>

              {/* Right Buttons */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {!user && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProject}
                    className="px-6 py-2.5 bg-[#2D3142] text-white rounded-lg font-medium text-sm hover:bg-[#3a3f56] transition-colors"
                  >
                    Save for later
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-[#1E3A5F] text-white rounded-lg font-medium text-sm hover:bg-[#2d5080] transition-colors"
                >
                  Book Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
        <AnimatePresence>
          {showAuthModal && (
            <AuthModal
              setShowAuthModal={setShowAuthModal}
              showAuthModal={showAuthModal}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
