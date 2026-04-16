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
      { label: "Strategy Design", href: "/services" },
      { label: "Product Design", href: "/services" },
      { label: "Content Strategy", href: "/services" },
      { label: "Brand Strategy", href: "/services" },
      { label: "Development", href: "/services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Jobs", href: "/contact" },
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
        <h3 className="text-[#D4AF37] text-[10px] font-bold tracking-[0.25em] uppercase font-manrope">
          {title}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-white/30 transition-transform duration-300 md:hidden ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Mobile: animated accordion */}
      <AnimatePresence initial={false}>
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
                  className="text-white/40 hover:text-white transition-colors text-sm font-manrope"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </div>
        </motion.ul>
      </AnimatePresence>

      {/* Desktop: always visible */}
      <ul className="hidden md:block mt-6 space-y-4">
        {links.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-white/40 hover:text-white transition-colors text-sm font-manrope"
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
    <footer className="relative w-full font-manrope overflow-hidden">
      {/* Topographic background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/footer-bg.png"
          alt=""
          fill
          className="object-cover opacity-30"
          priority={false}
        />
        {/* Dark overlay so the topo map is very subtle */}
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-10 md:py-16">
        {/* Top border */}
        <div className="w-full h-px bg-white mb-8 md:mb-12" />

        {/* Grid: Services | Company | divider | Get In Touch */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1px_1.4fr] gap-0 md:gap-12 mb-8 md:mb-12 items-start">
          {SECTIONS.map((s) => (
            <AccordionSection key={s.title} title={s.title} links={s.links} />
          ))}

          {/* Vertical divider — desktop only */}
          <div className="hidden md:block w-px h-full bg-white/20 self-stretch" />

          {/* Get In Touch */}
          <div className="pt-4 md:pt-0">
            <h3 className="text-[#D4AF37] text-[10px] font-bold mb-5 md:mb-7 tracking-[0.25em] uppercase font-manrope">
              Get In Touch
            </h3>
            <p className="text-white/40 text-sm font-manrope leading-relaxed mb-5">
              Feel free to get in touch with us via email
            </p>
            <a
              href="mailto:tbmdigitals@gmail.com"
              className="text-[#D4AF37] text-xl md:text-2xl font-bold hover:text-[#c49e30] transition-colors block font-manrope break-all"
            >
              tbmdigitals@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom border */}
        <div className="w-full h-px bg-white/20 mb-6" />

        {/* Copyright */}
        <div className="flex justify-end">
          <p className="text-white/30 text-xs font-manrope tracking-wide">
            © 2026@TBM Digitals. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
