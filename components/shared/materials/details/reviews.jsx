"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function RatingsReviews({
  averageRating = 4.8,
  totalReviews = 42,
  ratingDistribution = { 5: 78, 4: 15, 3: 5, 2: 2, 1: 0 },
}) {
  // Safely get max percentage with fallback
  const maxPercentage = ratingDistribution
    ? Math.max(...Object.values(ratingDistribution))
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Ratings & Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">
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
                <span className="text-sm font-medium text-gray-700 w-3">
                  {rating}
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.1 * (5 - rating),
                      ease: "easeOut",
                    }}
                    className="h-full bg-yellow-400 rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-600 w-10 text-right">
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
