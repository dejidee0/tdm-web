import React from "react";
import Image from "next/image";
import Link from "next/link";

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

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-12 py-16">
        {/* Top Border */}
        <div className="w-full h-px bg-white mb-12" />

        {/* Footer Grid — 4 cols: Services | Company | divider | Get In Touch */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1px_1.4fr] gap-10 md:gap-8 mb-12 items-start">
          {/* Services */}
          <div>
            <h3 className="text-white text-xs font-bold mb-7 tracking-[0.18em] uppercase">
              Services
            </h3>
            <ul className="space-y-4">
              {[
                { label: "Renovation", href: "/project" },
                { label: "Construction", href: "/project" },
                { label: "Bogat Materials", href: "/materials" },
                { label: "Design with Ziora", href: "/ai-visualizer" },
                { label: "Get Estimate", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-xs font-bold mb-7 tracking-[0.18em] uppercase">
              Company
            </h3>
            <ul className="space-y-4">
              {[
                { label: "About TBM", href: "/about" },
                { label: "Projects", href: "/project" },
                { label: "Contact", href: "/contact" },
                { label: "Sign Up", href: "/sign-up" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical Divider — hidden on mobile */}
          <div className="hidden md:block w-px h-full bg-white self-stretch" />

          {/* Get In Touch */}
          <div>
            <h3 className="text-white text-xs font-bold mb-7 tracking-[0.18em] uppercase">
              Get In Touch
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Ready to start your renovation or construction project? Reach out to TBM Building Services.
            </p>
            <a
              href="mailto:info@tbmbuilding.com"
              className="text-white text-xl font-bold hover:text-white/90 transition-colors block mb-7"
            >
              info@tbmbuilding.com
            </a>

            {/* App Store Badges */}
            <div className="flex flex-wrap gap-3">
              {/* Google Play */}
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white text-black rounded-xl px-4 py-2.5 hover:bg-white/90 transition-colors min-w-[145px]"
              >
                {/* Google Play SVG icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 shrink-0"
                  fill="none"
                >
                  <path
                    d="M3.18 1.07C2.47 1.46 2 2.21 2 3.09v17.82c0 .88.47 1.63 1.18 2.02l.1.05 9.98-9.98v-.23L3.28 1.02l-.1.05z"
                    fill="#4285F4"
                  />
                  <path
                    d="M16.58 16.3l-3.32-3.32v-.23l3.32-3.32.07.04 3.93 2.23c1.12.64 1.12 1.68 0 2.32l-3.93 2.23-.07.05z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M16.65 16.25L13.26 12.85 3.18 22.93c.37.39.95.44 1.61.08l11.86-6.76"
                    fill="#34A853"
                  />
                  <path
                    d="M16.65 7.75L4.79 1c-.66-.37-1.24-.32-1.61.08l10.08 10.08 3.39-3.41z"
                    fill="#EA4335"
                  />
                </svg>
                <div>
                  <div className="text-[9px] font-medium text-black/60 leading-none uppercase tracking-wide">
                    GET IT ON
                  </div>
                  <div className="text-sm font-bold leading-tight">
                    Google Play
                  </div>
                </div>
              </a>

              {/* Apple Store */}
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white text-black rounded-xl px-4 py-2.5 hover:bg-white/90 transition-colors min-w-[145px]"
              >
                {/* Apple SVG icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 shrink-0"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <div className="text-[9px] font-medium text-black/60 leading-none uppercase tracking-wide">
                    Download on the
                  </div>
                  <div className="text-sm font-bold leading-tight">
                    Apple Store
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="w-full h-px bg-white mb-8" />

        {/* Copyright — right-aligned matching design */}
        <div className="flex justify-end">
          <p className="text-white/60 text-sm">
            © 2025 TBM Building Services. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
