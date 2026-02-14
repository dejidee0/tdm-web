"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ServerLoad({ data }) {
  if (!data) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-[#273054] p-5 rounded-none"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-manrope text-[16px] font-bold text-white mb-1">
            Server Load
          </h3>
          <p className="text-[12px] text-[#94A3B8]">{data.cluster}</p>
        </div>

        {/* Server Icon */}
        <Image
          src="/assets/svgs/admin dashboard overview/vector.svg"
          alt="Server"
          width={80}
          height={84}
          className="opacity-15 flex-shrink-0"
        />
      </div>

      {/* Capacity */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[28px] font-bold text-white leading-none">
          {data.capacity}%
        </span>
        <span className="text-[13px] text-[#94A3B8]">Capacity</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full" style={{ width: `${data.capacity}%` }} />
      </div>
    </motion.div>
  );
}
