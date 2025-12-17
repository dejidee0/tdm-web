"use client";

import React from "react";
import { Store, Sparkles, Users } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Store,
      title: "Shop Premium Materials",
      description:
        "Browse a curated selection of high-quality materials from top brands.",
    },
    {
      icon: Sparkles,
      title: "Visualize with AI",
      description:
        "See your design come to life. Upload a photo and let our AI show you the possibilities.",
    },
    {
      icon: Users,
      title: "Expert Consultations",
      description:
        "Connect with our experienced designers for personalized guidance and project planning.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-16 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-primary font-bold text-primary mb-4 sm:mb-6">
            Everything You Need to Transform Your Home
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-inter text-gray-600 max-w-4xl mx-auto">
            From high-quality materials to cutting-edge technology and expert
            advice, we provide a complete solution for your renovation journey.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 sm:w-14 sm:h-14 flex items-center justify-center">
                    <Icon
                      className="w-8 h-8 sm:w-7 sm:h-7 text-primary"
                      strokeWidth={2}
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-xl font-inter font-bold text-gray-900 mb-3 sm:mb-4">
                  {service.title}
                </h3>
                <p className="text-base sm:text-lg font-inter text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
