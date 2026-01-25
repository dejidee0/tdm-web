// components/dashboard/Consultations.jsx
"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { useConsultations } from "@/hooks/use-user-dashboard";

export default function Consultations() {
  const { data: consultations, isLoading, isError } = useConsultations();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e5e5e5]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h2 className="text-[16px] font-semibold text-[#1a1a1a]">
              Consultations
            </h2>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="h-12 bg-gray-200 rounded-lg w-full" />
        </div>
      </div>
    );
  }

  if (isError || !consultations) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e5e5e5]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#666666]" />
            <h2 className="text-[16px] font-semibold text-[#1a1a1a]">
              Consultations
            </h2>
          </div>
        </div>
        <p className="text-[14px] text-[#999999] text-center py-8">
          No consultations scheduled
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl p-6 border border-[#e5e5e5]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#666666]" />
          <h2 className="text-[16px] font-semibold text-[#1a1a1a]">
            Consultations
          </h2>
        </div>
        {consultations.canBook && (
          <button className="text-[13px] text-[#3b82f6] font-medium hover:text-[#2563eb] transition-colors">
            Book New
          </button>
        )}
      </div>

      {consultations.upcoming && (
        <>
          {/* Upcoming Consultation */}
          <div className="mb-4">
            <p className="text-[12px] text-[#999999] mb-3">UP NEXT</p>

            <div className="flex items-start gap-3 mb-4">
              {/* Avatar */}
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src={consultations.upcoming.consultant.avatar}
                  alt={consultations.upcoming.consultant.name}
                  fill
                  className="object-cover rounded-full"
                  sizes="40px"
                />
              </div>

              {/* Consultant Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-[#1a1a1a]">
                  Video Call with {consultations.upcoming.consultant.name}
                </h3>
                <p className="text-[13px] text-[#666666] mt-0.5">
                  {consultations.upcoming.date}
                </p>
              </div>
            </div>

            {/* Topic */}
            <div className="bg-[#f8f8f8] rounded-lg p-4 mb-4">
              <p className="text-[12px] text-[#999999] mb-1">Topic:</p>
              <p className="text-[13px] text-[#1a1a1a] leading-relaxed">
                {consultations.upcoming.topic}
              </p>
            </div>
          </div>

          {/* Prepare Button */}
          <button className="w-full bg-[#1a1a1a] text-white text-[14px] font-medium py-3 rounded-lg hover:bg-[#2a2a2a] transition-colors">
            Prepare for Call
          </button>
        </>
      )}
    </motion.div>
  );
}
