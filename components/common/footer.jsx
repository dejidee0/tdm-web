"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  {
    title: "Services",
    links: [
      { label: "Renovation", href: "/services#renovation" },
      { label: "Construction", href: "/services#construction" },
      { label: "Bogat Materials", href: "/materials" },
      { label: "Design with Ziora", href: "/ai-visualizer" },
      { label: "Get Estimate", href: "/contact?type=estimate" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About TBM", href: "/about" },
      { label: "Projects", href: "/project" },
      { label: "Contact", href: "/contact" },
      { label: "Sign Up", href: "/sign-up" },
    ],
  },
];

function AccordionSection({ title, links }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 md:border-none">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 md:py-0 md:cursor-default md:pointer-events-none"
      >
        <h3 className="text-white text-[10px] font-bold tracking-[0.25em] uppercase">
          {title}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-white/40 transition-transform duration-300 md:hidden ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Links — always visible on desktop, animated on mobile */}
      <AnimatePresence initial={false}>
        {/* Mobile: conditionally rendered */}
        <motion.ul
          key="mobile"
          initial={false}
          animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          className="overflow-hidden md:hidden"
        >
          <div className="pb-4 space-y-3">
            {links.map((item) => (
              <li key={item.label} className="list-none">
                <Link
                  href={item.href}
                  className="text-white/50 hover:text-white transition-colors text-sm font-manrope"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </div>
        </motion.ul>
      </AnimatePresence>

      {/* Desktop: always visible */}
      <ul className="hidden md:block mt-7 space-y-4">
        {links.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-white/50 hover:text-white transition-colors text-sm font-manrope"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="relative w-full font-manrope">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/footer-bg.png"
          alt="Footer Background"
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-10 md:py-16">
        {/* Top Border */}
        <div className="w-full h-px bg-white mb-8 md:mb-12" />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1px_1.4fr] gap-0 md:gap-8 mb-8 md:mb-12 items-start">
          {/* Accordion sections */}
          {SECTIONS.map((s) => (
            <AccordionSection key={s.title} title={s.title} links={s.links} />
          ))}

          {/* Vertical Divider — desktop only */}
          <div className="hidden md:block w-px h-full bg-white self-stretch" />

          {/* Get In Touch — always fully visible, no accordion needed */}
          <div className="pt-4 md:pt-0">
            <h3 className="text-white text-[10px] font-bold mb-4 md:mb-7 tracking-[0.25em] uppercase">
              Get In Touch
            </h3>
            <p className="text-white/50 text-sm font-manrope leading-relaxed mb-3">
              Ready to start your renovation or construction project?
            </p>
            <a
              href="mailto:info@tbmbuilding.com"
              className="text-white text-base md:text-xl font-bold hover:text-gold transition-colors block mb-5 md:mb-7 break-all font-manrope"
            >
              info@tbmbuilding.com
            </a>

            {/* App Store Badges */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white text-black rounded-xl px-4 py-2.5 hover:bg-white/90 transition-colors min-w-35"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
                  <path d="M3.18 1.07C2.47 1.46 2 2.21 2 3.09v17.82c0 .88.47 1.63 1.18 2.02l.1.05 9.98-9.98v-.23L3.28 1.02l-.1.05z" fill="#4285F4" />
                  <path d="M16.58 16.3l-3.32-3.32v-.23l3.32-3.32.07.04 3.93 2.23c1.12.64 1.12 1.68 0 2.32l-3.93 2.23-.07.05z" fill="#FBBC04" />
                  <path d="M16.65 16.25L13.26 12.85 3.18 22.93c.37.39.95.44 1.61.08l11.86-6.76" fill="#34A853" />
                  <path d="M16.65 7.75L4.79 1c-.66-.37-1.24-.32-1.61.08l10.08 10.08 3.39-3.41z" fill="#EA4335" />
                </svg>
                <div>
                  <div className="text-[9px] font-medium text-black/60 leading-none uppercase tracking-wide">GET IT ON</div>
                  <div className="text-sm font-bold leading-tight">Google Play</div>
                </div>
              </a>

              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white text-black rounded-xl px-4 py-2.5 hover:bg-white/90 transition-colors min-w-35"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <div className="text-[9px] font-medium text-black/60 leading-none uppercase tracking-wide">Download on the</div>
                  <div className="text-sm font-bold leading-tight">Apple Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="w-full h-px bg-white mb-6" />

        {/* Copyright */}
        <div className="flex justify-end">
          <p className="text-white/30 text-xs font-manrope tracking-wide">
            © 2025 TBM Building Services. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
