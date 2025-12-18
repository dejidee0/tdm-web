import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="relative w-full">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/footer-bg.png" // Adjust the filename to match your actual background image
          alt="Footer Background"
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Top Border Line */}
        <div className="w-full h-px bg-white/20 mb-16"></div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Services Column */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wide">
              SERVICES
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-base"
                >
                  Strategy Design
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-base"
                >
                  Product Design
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-base"
                >
                  Content Strategy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-base"
                >
                  Brand Strategy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-base"
                >
                  Development
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wide">
              COMPANY
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-base"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-base"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-base"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors duration-200 text-base"
                >
                  Jobs
                </a>
              </li>
            </ul>
          </div>

          {/* Get In Touch Column */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wide">
              GET IN TOUCH
            </h3>
            <p className="text-white/80 text-base mb-6 leading-relaxed">
              Feel free to get in touch with us via email
            </p>
            <a
              href="mailto:tbmdigitals@gmail.com"
              className="text-white text-xl font-semibold hover:text-white/90 transition-colors duration-200 inline-block"
            >
              tbmdigitals@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Border Line */}
        <div className="w-full h-px bg-white/20 mb-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-white/70 text-sm">
            © 2025@TBM Digitals. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
