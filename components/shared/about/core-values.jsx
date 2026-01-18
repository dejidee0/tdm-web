"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CoreValues() {
  const values = [
    {
      icon: "/icons/bulb.svg",
      title: "Innovation",
      description: "Leveraging technology to simplify the complex.",
      delay: 0.1,
    },
    {
      icon: "/icons/shield.png",
      title: "Quality",
      description: "Highest standards of craftsmanship.",
      delay: 0.2,
    },
    {
      icon: "/icons/customers.svg",
      title: "Customer First",
      description: "Clients at the heart of everything.",
      delay: 0.3,
    },
    {
      icon: "/icons/eye.svg",
      title: "Transparency",
      description: "Open communication & honesty.",
      delay: 0.4,
    },
  ];

  return (
    <section className="bg-background py-20 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 font-primary">
            Our Core Values
          </h2>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: value.delay }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Icon Circle */}
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src={value.icon}
                  alt={value.title}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
