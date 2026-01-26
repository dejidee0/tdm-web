// components/dashboard/ActionCards.jsx
"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Wand2, Calendar } from "lucide-react";
import Link from "next/link";

const cards = [
  {
    icon: ShoppingBag,
    iconBg: "bg-[#3b82f6]/10",
    iconColor: "text-[#3b82f6]",
    title: "Shop Materials",
    description: "Browse flooring, tiles, and fixtures.",
    href: "/shop",
  },
  {
    icon: Wand2,
    iconBg: "bg-[#a855f7]/10",
    iconColor: "text-[#a855f7]",
    title: "Try AI Visualizer",
    description: "See your room with new styles instantly.",
    href: "/visualizer",
  },
  {
    icon: Calendar,
    iconBg: "bg-[#f97316]/10",
    iconColor: "text-[#f97316]",
    title: "Book Consultation",
    description: "Talk to a pro designer today.",
    href: "/consultation",
  },
];

export default function ActionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="h-full"
          >
            <Link
              href={card.href}
              className="
                block h-full
                bg-white border border-[#e5e5e5]
                rounded-2xl p-5
                transition-all hover:shadow-lg
                md:flex flex-col
                min-h-[180px]
              "
            >
              {/* Top content */}
              <div>
                <div
                  className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>

                <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">
                  {card.title}
                </h3>

                <p className="text-[14px] text-[#666666] leading-relaxed">
                  {card.description}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
