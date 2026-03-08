"use client";

import { motion } from "framer-motion";

export default function MaterialLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <motion.div
              className="w-full aspect-square bg-gray-200 rounded-lg"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-9 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
            <div className="h-8 bg-gray-200 rounded-full w-48 animate-pulse" />
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-40 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse" />
              <div className="h-10 bg-gray-200 rounded-lg w-full animate-pulse" />
            </div>
            <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        <div className="mb-12 h-96 bg-gray-200 rounded-lg animate-pulse" />
        <div className="mb-12 h-64 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
