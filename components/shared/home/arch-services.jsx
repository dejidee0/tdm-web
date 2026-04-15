"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/common/reveal";

export default function ArchServicesSection() {
  return (
    <section className="bg-black py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        {/* Title */}
        <Reveal direction="up">
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-white text-center mb-10 sm:mb-14">
            Bespoke Architectural Services
          </h2>
        </Reveal>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

          {/* Left — large hero card */}
          <Reveal direction="left" delay={80}>
            <Link
              href="/services#construction"
              className="group relative overflow-hidden rounded-2xl min-h-80 sm:min-h-125 bg-card flex flex-col justify-end"
            >
              <Image
                src="/about2.png"
                alt="Master Construction"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              {/* Text */}
              <div className="relative z-10 p-7 sm:p-8">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block mb-4" />
                <h3 className="font-poppins font-bold text-xl sm:text-2xl text-white mb-2 leading-snug">
                  Master Construction
                </h3>
                <p className="text-white/50 text-sm font-manrope leading-relaxed max-w-xs">
                  From foundation to finish, we handle structures of any scale with original precision.
                </p>
              </div>
            </Link>
          </Reveal>

          {/* Right — three stacked smaller cards */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {[
              { label: "Interior Design",    src: "/product-3.jpg",  href: "/services#interiors",  desc: "Spaces that breathe luxury and purpose." },
              { label: "Renovation",         src: "/product-2.jpg",  href: "/services#renovation", desc: "Breathing new life into existing structures." },
              { label: "Curated Materials",  src: "/product-1.jpg",  href: "/materials",            desc: "Finest global materials sourced for your project." },
            ].map(({ label, src, href, desc }, i) => (
              <Reveal key={label} direction="right" delay={i * 80 + 80}>
                <Link
                  href={href}
                  className="group relative overflow-hidden rounded-2xl h-36 sm:h-40 bg-card flex items-end"
                >
                  <Image
                    src={src}
                    alt={label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
                  <div className="relative z-10 p-5">
                    <h3 className="font-manrope font-semibold text-[15px] text-white leading-tight mb-1">
                      {label}
                    </h3>
                    <p className="text-white/45 text-xs font-manrope">{desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
