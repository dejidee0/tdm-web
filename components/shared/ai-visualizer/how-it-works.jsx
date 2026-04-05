"use client";
import React from "react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Upload Your Space",
      description:
        "Take a photo of your room. Ziora identifies walls, furniture, and lighting.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      supportText: "Supported: JPG, PNG, HEIC",
    },
    {
      number: "02",
      title: "Select Style & Room",
      description:
        "Choose from 50+ presets or create a custom mood board for your renovation.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3H10V10H3V3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 3H21V10H14V3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 14H21V21H14V14Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 14H10V21H3V14Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      colors: ["#FFB3C1", "#C3B5F5", "#A8E6CF", "#C9A55A"],
    },
    {
      number: "03",
      title: "Instant Preview",
      description:
        "Watch the magic happen. Compare before/after with our interactive slider.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      preview: true,
    },
    {
      number: "04",
      title: "Save & Consult",
      description:
        "Save to your project board or send directly to a TBM Designer for a quote.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 6L12 2L8 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 2V15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "VIEW DESIGN PERKS →",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="bg-[#FAF8F5] py-16 sm:py-20 font-manrope">
      <div className="max-w-315 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
            The Process
          </span>
          <h2 className="font-primary text-4xl sm:text-5xl font-bold text-[#0A0A0A] tracking-tight">
            How It Works
          </h2>
          <p className="font-manrope text-base text-[#7A736C] mt-3 max-w-lg">
            Simple steps to your dream renovation. Scroll to explore the process.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white p-8 flex flex-col"
            >
              {/* Step number + icon */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 border border-stone flex items-center justify-center text-[#0A0A0A]">
                  {step.icon}
                </div>
                <span className="text-gold font-bold text-lg tracking-wider">
                  {step.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-[#0A0A0A] mb-2 font-primary">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#7A736C] leading-relaxed mb-4 grow">
                {step.description}
              </p>

              {/* Footer Content */}
              {step.supportText && (
                <div className="flex items-center gap-2 text-xs text-[#7A736C] border-t border-stone pt-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 4V8L10.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {step.supportText}
                </div>
              )}

              {step.colors && (
                <div className="flex gap-2 border-t border-stone pt-3">
                  {step.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 border border-stone"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}

              {step.preview && (
                <div className="w-full h-8 bg-stone border-t border-stone mt-auto" />
              )}

              {step.link && (
                <div className="text-xs font-semibold text-[#0A0A0A] cursor-pointer tracking-wider border-t border-stone pt-3 hover:text-gold transition-colors">
                  {step.link}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
