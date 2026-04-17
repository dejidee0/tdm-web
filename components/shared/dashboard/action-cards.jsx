// components/dashboard/ActionCards.jsx
"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Wand2, Calendar } from "lucide-react";
import Link from "next/link";

const cards = [
  {
    icon: ShoppingBag,
    title: "Shop Materials",
    description: "Browse flooring, tiles, and fixtures.",
    href: "/materials",
  },
  {
    icon: Wand2,
    title: "Design with Ziora",
    description: "See your room with new styles instantly.",
    href: "/dashboard/ai-designs",
  },
  {
    icon: Calendar,
    title: "Book Consultation",
    description: "Talk to a pro designer today.",
    href: "/contact",
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
              className="block h-full rounded-2xl p-5 transition-all md:flex flex-col min-h-45 border border-white/08 hover:border-[#D4AF37]/30"
              style={{ background: "#0d0b08" }}
            >
              <div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(212,175,55,0.10)" }}
                >
                  <Icon className="w-6 h-6 text-[#D4AF37]" />
                </div>

                <h3 className="text-[16px] font-semibold text-white mb-1">
                  {card.title}
                </h3>

                <p className="text-[14px] text-white/40 leading-relaxed">
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
