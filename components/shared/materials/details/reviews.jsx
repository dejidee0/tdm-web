"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function RatingsReviews({
  averageRating = 4.8,
  totalReviews = 42,
  ratingDistribution = { 5: 78, 4: 15, 3: 5, 2: 2, 1: 0 },
}) {
  const maxPercentage = ratingDistribution
    ? Math.max(...Object.values(ratingDistribution))
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-lg border border-white/08 p-6"
      style={{ background: "#0d0b08" }}
    >
      <h2 className="text-2xl font-semibold text-white mb-6">
        Ratings &amp; Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-5xl font-bold text-white mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating)
                    ? "fill-[#D4AF37] text-[#D4AF37]"
                    : "fill-white/10 text-white/10"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-white/40">
            Based on {totalReviews} verified reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage = ratingDistribution?.[rating] || 0;
            const barWidth =
              maxPercentage > 0 ? (percentage / maxPercentage) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm font-medium text-white/50 w-3">
                  {rating}
                </span>
                <div className="flex-1 h-2 bg-white/08 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.1 * (5 - rating),
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #D4AF37, #b8962e)" }}
                  />
                </div>
                <span className="text-sm text-white/40 w-10 text-right">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
