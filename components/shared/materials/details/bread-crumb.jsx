"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-white/20" />}
          {index === items.length - 1 ? (
            <span className="text-white/70 font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="text-white/40 hover:text-white/70 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
