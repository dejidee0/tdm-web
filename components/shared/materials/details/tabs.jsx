"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const tabs = [
  { id: "description", label: "Description" },
  { id: "specifications", label: "Specifications" },
  { id: "shipping", label: "Shipping & Returns" },
];

export default function ProductTabs({ material }) {
  const [activeTab, setActiveTab] = useState("description");

  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="prose prose-sm max-w-none"
          >
            <p className="text-white/60 leading-relaxed mb-4">
              {material.description ||
                "Elevate your space with the timeless elegance of Carrara White Marble. Sourced directly from Italy, each 12x24 tile features a pristine white background with subtle grey veining. Perfect for bathroom floors, kitchen backsplashes, or statement walls."}
            </p>
            <ul className="space-y-2 text-white/60">
              <li>Genuine Italian Carrara Marble</li>
              <li>Polished finish for a high-gloss reflection</li>
              <li>Rectified edges for minimal grout lines</li>
              <li>Suitable for residential and commercial traffic</li>
            </ul>
          </motion.div>
        );

      case "specifications":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {[
              { label: "Material", value: material.material || "Natural Marble" },
              { label: "Size", value: material.size || "12x24 inches" },
              { label: "Finish", value: material.finish || "Polished" },
              { label: "Thickness", value: material.thickness || "10mm" },
              { label: "Edge Type", value: material.edgeType || "Rectified" },
              { label: "Application", value: material.application || "Floor & Wall" },
              { label: "Origin", value: material.origin || "Italy" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-3 border-b border-white/06">
                <span className="text-sm font-medium text-white/70">{label}</span>
                <span className="text-sm text-white/50">{value}</span>
              </div>
            ))}
          </motion.div>
        );

      case "shipping":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {[
              {
                title: "Shipping",
                body: "Free shipping on orders over ₦500,000. Standard delivery takes 5–7 business days. Express shipping available at checkout. Due to the weight and fragility of natural stone, signature upon delivery is required.",
              },
              {
                title: "Returns",
                body: "We accept returns within 30 days of delivery for unopened boxes in original condition. Return shipping costs are the responsibility of the customer unless the item is defective or damaged upon arrival.",
              },
              {
                title: "Damaged Items",
                body: "If your order arrives damaged, please take photos and contact us within 48 hours. We'll arrange for a replacement or refund at no additional cost to you.",
              },
            ].map(({ title, body }) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-white mb-2">{title}</h4>
                <p className="text-sm text-white/50 leading-relaxed">{body}</p>
              </div>
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-white/08" style={{ background: "#0d0b08" }}>
      {/* Tab Headers */}
      <div className="border-b border-white/08">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "linear-gradient(90deg, #D4AF37, #b8962e)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">{renderContent()}</div>
    </div>
  );
}
