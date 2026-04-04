"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Hammer,
  Building2,
  Bath,
  UtensilsCrossed,
  HardHat,
  Wrench,
  Palette,
  ClipboardCheck,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const SERVICES = [
  {
    icon: Hammer,
    title: "Renovation",
    slug: "renovation",
    tagline: "Transform existing spaces into premium environments",
    intro:
      "TBM specialises in full-scope renovation projects for homes, apartments, and commercial spaces — from structural upgrades to complete interior overhauls.",
    includes: [
      "Site assessment and feasibility review",
      "Full demolition and structural works",
      "Plastering, screeding, and dry-lining",
      "Electrical rewiring and plumbing upgrade",
      "Tiling, flooring, and painting",
      "Final snag, clean, and handover",
    ],
    whoFor: "Homeowners, landlords, and developers upgrading existing properties",
    timeline: "4 – 16 weeks depending on scope",
    pricing: "Fixed-price contract after inspection",
    faqs: [
      { q: "Do I need to vacate during renovation?", a: "For full-scope projects we strongly recommend it. For phased renovations we can work around occupancy." },
      { q: "Can I supply my own materials?", a: "Yes, but we recommend sourcing through Bogat to ensure quality and warranty coverage." },
    ],
  },
  {
    icon: Palette,
    title: "Interior Fit-Out",
    slug: "interior-fit-out",
    tagline: "Turn a shell into a space that speaks",
    intro:
      "Our interior fit-out service covers everything from partition walls and ceilings to bespoke joinery, feature walls, and lighting design.",
    includes: [
      "Space planning and layout design",
      "Partition walls and suspended ceilings",
      "Bespoke joinery and built-ins",
      "Feature wall and surface treatments",
      "Lighting design and installation",
      "Furnishing coordination",
    ],
    whoFor: "Commercial offices, retail spaces, hospitality venues, and premium residential",
    timeline: "3 – 10 weeks",
    pricing: "Itemised quote after design brief",
    faqs: [
      { q: "Do you handle FF&E procurement?", a: "Yes — we can coordinate furniture, fixtures, and equipment sourcing through Bogat or third-party suppliers." },
    ],
  },
  {
    icon: Bath,
    title: "Bathroom Remodeling",
    slug: "bathroom-remodeling",
    tagline: "Luxury bathrooms, delivered",
    intro:
      "From simple refreshes to full wet-room transformations, our bathroom team handles waterproofing, tiling, sanitaryware installation, and all plumbing works.",
    includes: [
      "Waterproofing and tanking",
      "Floor and wall tiling",
      "Concealed cistern and WC installation",
      "Basin, vanity, and mirror fitting",
      "Shower enclosure or wet room construction",
      "Towel rail, heated floor, and accessories",
    ],
    whoFor: "Homeowners wanting a premium bathroom without the project management headache",
    timeline: "2 – 4 weeks",
    pricing: "Fixed price after site visit",
    faqs: [
      { q: "Can I use my own tiles?", a: "Yes. We also recommend tiles and sanitaryware from the Bogat store for convenience and warranty." },
      { q: "Do you handle small bathroom refreshes?", a: "Yes — re-tiling, fixture swap-outs, and regrouting are all within scope." },
    ],
  },
  {
    icon: UtensilsCrossed,
    title: "Kitchen Remodeling",
    slug: "kitchen-remodeling",
    tagline: "The kitchen you always wanted",
    intro:
      "Full kitchen design and installation — custom cabinetry, countertops, splashbacks, appliance integration, and all associated plumbing and electrical works.",
    includes: [
      "Kitchen layout and design",
      "Cabinet and drawer unit supply and fitting",
      "Countertop fabrication and installation",
      "Splashback tiling",
      "Sink, tap, and appliance plumbing",
      "Electrical sockets and under-cabinet lighting",
    ],
    whoFor: "Homeowners and developers remodelling existing kitchens or fitting out new builds",
    timeline: "3 – 6 weeks",
    pricing: "Quote based on kitchen dimensions and spec",
    faqs: [
      { q: "Do you supply kitchen units?", a: "Yes — we can supply through Bogat or work with your chosen brand." },
    ],
  },
  {
    icon: Building2,
    title: "Construction",
    slug: "construction",
    tagline: "Ground up. Done right.",
    intro:
      "TBM manages new-build construction projects from foundation to finishing — residential and light commercial, with full project management and supervision.",
    includes: [
      "Foundation and substructure",
      "Structural frame and roofing",
      "Block-work, plastering, and screeding",
      "MEP (mechanical, electrical, plumbing) coordination",
      "Internal and external finishing",
      "Handover documentation",
    ],
    whoFor: "Landowners, developers, and investors building new residential or commercial structures",
    timeline: "6 – 24 months depending on size and complexity",
    pricing: "Bills of quantities and fixed-price contract",
    faqs: [
      { q: "Do you handle planning approvals?", a: "We can advise and partner with approved architects and consultants for permit applications." },
    ],
  },
  {
    icon: Wrench,
    title: "Maintenance",
    slug: "maintenance",
    tagline: "Keep your property in peak condition",
    intro:
      "Planned and reactive maintenance services for residential and commercial properties — plumbing, electrical, painting, tiling repairs, and general works.",
    includes: [
      "Plumbing repairs and emergency callouts",
      "Electrical fault-finding and repairs",
      "Repainting and touch-ups",
      "Tile replacement and grouting",
      "Door and window repairs",
      "General snag-fixing",
    ],
    whoFor: "Property owners and managers who need reliable, responsive maintenance support",
    timeline: "Same-day to 5 days depending on job type",
    pricing: "Hourly or fixed-rate depending on scope",
    faqs: [
      { q: "Do you do emergency callouts?", a: "Yes — emergency plumbing and electrical callouts are available for clients in Abuja and Lagos." },
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Design Consultation",
    slug: "design-consultation",
    tagline: "Start with clarity",
    intro:
      "A structured design consultation gives you a full project brief, Ziora AI concepts, material recommendations, and a realistic budget — before any work begins.",
    includes: [
      "Site visit or remote session",
      "Ziora AI concept generation",
      "Style and material recommendations",
      "Rough order of cost",
      "Project phasing advice",
      "Written consultation summary",
    ],
    whoFor: "Anyone starting a renovation or fit-out who wants clarity before committing",
    timeline: "1–2 days for output after session",
    pricing: "Fixed consultation fee — credited toward project if you proceed",
    faqs: [
      { q: "Is the consultation fee refundable?", a: "It's not refundable, but it is credited in full toward your project cost if you proceed with TBM." },
    ],
  },
  {
    icon: HardHat,
    title: "Project Supervision",
    slug: "project-supervision",
    tagline: "Eyes on site, every day",
    intro:
      "If you have your own contractors but need professional oversight, TBM provides dedicated site supervisors to ensure quality, schedule, and compliance.",
    includes: [
      "Daily site inspection and reporting",
      "Contractor coordination",
      "Quality control sign-off",
      "Schedule tracking",
      "Client progress updates",
      "Final snag walkthrough",
    ],
    whoFor: "Clients who have sourced their own builders but need independent oversight",
    timeline: "Duration of the construction phase",
    pricing: "Monthly retainer or project-based fee",
    faqs: [
      { q: "Can you supervise projects outside Abuja and Lagos?", a: "On a case-by-case basis — contact us to discuss." },
    ],
  },
];

function ServiceCard({ service, index }) {
  const [faqOpen, setFaqOpen] = useState(null);
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
      className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
      id={service.slug}
    >
      {/* Header */}
      <div className="p-8 sm:p-10 border-b border-gray-100">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
            <Icon className="w-7 h-7 text-primary" strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-primary font-bold text-gray-900 mb-1">
              {service.title}
            </h2>
            <p className="text-primary font-inter font-medium text-sm">{service.tagline}</p>
          </div>
        </div>
        <p className="mt-5 text-gray-600 font-inter leading-relaxed">{service.intro}</p>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        <div className="p-6 sm:p-8">
          <p className="text-xs font-inter font-semibold text-gray-400 uppercase tracking-widest mb-3">
            What&apos;s Included
          </p>
          <ul className="space-y-2">
            {service.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-inter text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-inter font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Who It&apos;s For
            </p>
            <p className="text-sm font-inter text-gray-700">{service.whoFor}</p>
          </div>
          <div className="mb-6">
            <p className="text-xs font-inter font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Typical Timeline
            </p>
            <p className="text-sm font-inter text-gray-700">{service.timeline}</p>
          </div>
          <div>
            <p className="text-xs font-inter font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Pricing Approach
            </p>
            <p className="text-sm font-inter text-gray-700">{service.pricing}</p>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-xs font-inter font-semibold text-gray-400 uppercase tracking-widest mb-3">FAQ</p>
          <div className="space-y-2">
            {service.faqs.map((faq, fi) => (
              <div key={fi} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === fi ? null : fi)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="text-xs font-inter font-semibold text-gray-800">{faq.q}</span>
                  <motion.div animate={{ rotate: faqOpen === fi ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {faqOpen === fi && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-4 pb-3 text-xs font-inter text-gray-600 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link href="/contact?type=consultation">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-inter font-semibold text-sm px-5 py-3 rounded-xl transition-all duration-200 group"
              >
                Book Inspection
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/contact?type=estimate">
              <button className="w-full text-sm font-inter font-medium text-primary border border-primary/30 hover:bg-primary/5 px-5 py-2.5 rounded-xl transition-colors">
                Get Quote
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServiceList() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.slug} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
