"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, Upload } from "lucide-react";

export default function AddProductModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    category: "",
    description: "",
    warehouseLocation: "",
    initialQuantity: 0,
    reorderPoint: 10,
    unitPrice: 0,
    productImages: [],
  });

  const [isAutoSKU, setIsAutoSKU] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateSKU = () => {
    const randomSKU = `SKU-${Math.floor(Math.random() * 9000) + 1000}`;
    handleChange("sku", randomSKU);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log("Files dropped:", e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file selection
      console.log("Files selected:", e.target.files);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    // Reset form
    setFormData({
      productName: "",
      sku: "",
      category: "",
      description: "",
      warehouseLocation: "",
      initialQuantity: 0,
      reorderPoint: 10,
      unitPrice: 0,
      productImages: [],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-[#E5E7EB]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-manrope text-[20px] font-bold text-[#1E293B] mb-1">
                      Add New Product
                    </h2>
                    <p className="font-manrope text-[13px] text-[#64748B]">
                      Enter the details to add a new item to the Bogat
                      inventory.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="text-[#94A3B8] hover:text-[#64748B] transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* General Information Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 bg-[#1E293B] rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">
                        ℹ
                      </span>
                    </div>
                    <h3 className="font-manrope text-[14px] font-bold text-[#1E293B]">
                      General Information
                    </h3>
                  </div>

                  {/* Product Name */}
                  <div className="mb-4">
                    <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Industrial Hydraulic Pump V4"
                      value={formData.productName}
                      onChange={(e) =>
                        handleChange("productName", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                    />
                  </div>

                  {/* SKU and Category Row */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* SKU */}
                    <div>
                      <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                        SKU
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="SKU-0000"
                          value={formData.sku}
                          onChange={(e) => handleChange("sku", e.target.value)}
                          disabled={isAutoSKU}
                          className="w-full px-4 py-2.5 pr-16 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent disabled:bg-[#F8FAFC] disabled:text-[#94A3B8]"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleGenerateSKU}
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded text-[#64748B] transition-colors"
                        >
                          <RefreshCw size={12} />
                          <span className="font-manrope text-[11px] font-medium">
                            Auto
                          </span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          handleChange("category", e.target.value)
                        }
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="">Select Category</option>
                        <option value="industrial">Industrial Grade</option>
                        <option value="electronics">Electronics</option>
                        <option value="logistics">Logistics</option>
                        <option value="hardware">Hardware</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Provide a detailed product description..."
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Inventory & Pricing Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 bg-[#1E293B] rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">
                        📦
                      </span>
                    </div>
                    <h3 className="font-manrope text-[14px] font-bold text-[#1E293B]">
                      Inventory & Pricing
                    </h3>
                  </div>

                  {/* Warehouse, Initial Quantity, Reorder Point Row */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* Warehouse Location */}
                    <div>
                      <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                        Warehouse Location
                      </label>
                      <select
                        value={formData.warehouseLocation}
                        onChange={(e) =>
                          handleChange("warehouseLocation", e.target.value)
                        }
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="">Select Warehouse</option>
                        <option value="warehouse-a">Warehouse A</option>
                        <option value="warehouse-b">Warehouse B</option>
                        <option value="warehouse-c">Warehouse C</option>
                        <option value="warehouse-d">Warehouse D</option>
                      </select>
                    </div>

                    {/* Initial Quantity */}
                    <div>
                      <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                        Initial Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.initialQuantity}
                        onChange={(e) =>
                          handleChange(
                            "initialQuantity",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                      />
                    </div>

                    {/* Reorder Point */}
                    <div>
                      <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                        Reorder Point
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="10"
                        value={formData.reorderPoint}
                        onChange={(e) =>
                          handleChange(
                            "reorderPoint",
                            parseInt(e.target.value) || 10,
                          )
                        }
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div>
                    <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                      Unit Price ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] font-manrope text-[13px]">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.unitPrice}
                        onChange={(e) =>
                          handleChange(
                            "unitPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-full pl-8 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Images Section */}
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 bg-[#1E293B] rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">
                        📷
                      </span>
                    </div>
                    <h3 className="font-manrope text-[14px] font-bold text-[#1E293B]">
                      Product Images
                    </h3>
                  </div>

                  {/* Upload Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                      relative border-2 border-dashed rounded-xl p-12 text-center
                      transition-colors cursor-pointer
                      ${
                        dragActive
                          ? "border-[#1E293B] bg-[#F8FAFC]"
                          : "border-[#E5E7EB] bg-[#F8FAFC] hover:border-[#94A3B8]"
                      }
                    `}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Upload size={20} className="text-[#64748B]" />
                      </div>
                      <div>
                        <p className="font-manrope text-[14px] font-medium text-[#1E293B] mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="font-manrope text-[12px] text-[#94A3B8]">
                          PNG, JPG or WEBP (Max. 800×400px)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-[#1E293B] text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors"
                >
                  Add Product
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
