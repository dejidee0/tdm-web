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
            <p className="text-gray-700 leading-relaxed mb-4">
              {material.description ||
                "Elevate your space with the timeless elegance of Carrara White Marble. Sourced directly from Italy, each 12x24 tile features a pristine white background with subtle grey veining. Perfect for bathroom floors, kitchen backsplashes, or statement walls."}
            </p>
            <ul className="space-y-2 text-gray-700">
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
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-900">
                Material
              </span>
              <span className="text-sm text-gray-700">
                {material.material || "Natural Marble"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-900">Size</span>
              <span className="text-sm text-gray-700">
                {material.size || "12x24 inches"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-900">Finish</span>
              <span className="text-sm text-gray-700">
                {material.finish || "Polished"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-900">
                Thickness
              </span>
              <span className="text-sm text-gray-700">
                {material.thickness || "10mm"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-900">
                Edge Type
              </span>
              <span className="text-sm text-gray-700">
                {material.edgeType || "Rectified"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-900">
                Application
              </span>
              <span className="text-sm text-gray-700">
                {material.application || "Floor & Wall"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-900">Origin</span>
              <span className="text-sm text-gray-700">
                {material.origin || "Italy"}
              </span>
            </div>
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
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Shipping
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Free shipping on orders over $500. Standard delivery takes 5-7
                business days. Express shipping available at checkout. Due to
                the weight and fragility of natural stone, signature upon
                delivery is required.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Returns
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                We accept returns within 30 days of delivery for unopened boxes
                in original condition. Return shipping costs are the
                responsibility of the customer unless the item is defective or
                damaged upon arrival. Please inspect your order immediately upon
                delivery.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Damaged Items
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                If your order arrives damaged, please take photos and contact us
                within 48 hours. We'll arrange for a replacement or refund at no
                additional cost to you.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
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
