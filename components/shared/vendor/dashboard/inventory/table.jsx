"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Edit2,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import {
  useUpdateProductQuantity,
} from "@/hooks/use-inventory";

const productImages = {
  1: "/assets/svgs/vendor/inventory/tbmHydraulicPump.svg",
  2: "/assets/svgs/vendor/inventory/logicController.svg",
  3: "/assets/svgs/vendor/inventory/steelPackaging.svg",
  4: "/assets/svgs/vendor/inventory/proToolKitSet.svg",
};

const stockStatusStyles = {
  success: {
    bg: "bg-[#14532D]/10",
    text: "text-[#4ADE80]",
    dot: "bg-[#4ADE80]",
  },
  warning: {
    bg: "bg-[#7F1D1D]/10",
    text: "text-[#F87171]",
    dot: "bg-[#F87171]",
  },
  error: {
    bg: "bg-[#1F2937]/10",
    text: "text-[#1F2937]",
    dot: "bg-[#1F2937]",
  },
};

export default function InventoryProductsTable({ products, isLoading }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const updateQuantity = useUpdateProductQuantity();


  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = Math.max(0, currentQuantity + change);
    updateQuantity.mutate({ id: productId, quantity: newQuantity });
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products?.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products?.map((p) => p.id) || []);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[6.96px] border-[0.59px] border-[#273054]/10">
        <div className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-[#273054]/10 border-t-[#273054] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#273054]/60 font-inter text-[12.19px]">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-[6.96px] border-[0.59px] border-[#273054]/10 p-12 text-center">
        <p className="text-[#273054]/60 font-inter text-[12.19px]">
          No products found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden">
      {/* Scroll Hint - Mobile only */}
      <div className="md:hidden px-4 py-2 bg-[#F6F8F7] border-b border-[#273054]/10 flex items-center justify-center gap-2 text-[#273054]/60">
        <ChevronRight size={14} className="animate-pulse" />
        <span className="font-inter text-[10.45px]">
          Swipe to see more options
        </span>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden md:block px-6 py-4 bg-[#273054]/15 border-b border-[#273054]/10">
        <div className="grid grid-cols-[40px_1fr_90px_140px_120px_200px_110px] gap-4 items-center">
          <input
            type="checkbox"
            checked={selectedProducts.length === products.length}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-[#273054]/20 text-[#273054] focus:ring-2 focus:ring-[#273054] cursor-pointer"
          />
          <span className="font-inter text-[10.45px] font-bold text-[#273054] uppercase tracking-[0.52px] leading-[13.93px]">
            PRODUCT DETAILS
          </span>
          <span className="font-inter text-[10.45px] font-bold text-[#273054] uppercase tracking-[0.52px] leading-[13.93px]">
            SKU
          </span>
          <span className="font-inter text-[10.45px] font-bold text-[#273054] uppercase tracking-[0.52px] leading-[13.93px]">
            LOCATION
          </span>
          <span className="font-inter text-[10.45px] font-bold text-[#273054] uppercase tracking-[0.52px] leading-[13.93px]">
            STOCK STATUS
          </span>
          <span className="font-inter text-[10.45px] font-bold text-[#273054] uppercase tracking-[0.52px] leading-[13.93px] text-center">
            QUANTITY
          </span>
          <span className="font-inter text-[10.45px] font-bold text-[#273054] uppercase tracking-[0.52px] leading-[13.93px] text-center">
            ACTIONS
          </span>
        </div>
      </div>

      {/* Table Body - Scrollable on mobile */}
      <div className="divide-y divide-[#273054]/10">
        {products.map((product, index) => {
          const statusStyle = stockStatusStyles[product.stockStatusColor];
          const isSelected = selectedProducts.includes(product.id);
          const isOutOfStock = product.quantity === 0;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`transition-colors ${
                isSelected ? "bg-[#F8FAFC]" : "hover:bg-[#F8FAFC]"
              }`}
            >
              {/* Desktop View */}
              <div className="hidden md:grid md:grid-cols-[40px_1fr_90px_140px_120px_200px_110px] gap-4 items-center px-6 py-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectProduct(product.id)}
                  className="w-4 h-4 rounded border-[#273054]/20 text-[#273054] focus:ring-2 focus:ring-[#273054] cursor-pointer"
                />

                <div className="flex items-center gap-3">
                  {productImages[product.id] ? (
                    <img
                      src={productImages[product.id]}
                      alt={product.name}
                      width={35}
                      height={35}
                      className="flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-[35px] h-[35px] rounded-[6.53px] flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: product.imageColor + "20" }}
                    >
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-[8px]"
                        style={{ backgroundColor: product.imageColor }}
                      >
                        {product.name.substring(0, 2)}
                      </div>
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-inter text-[12.19px] font-medium text-[#273054] leading-[17.41px] truncate">
                      {product.name}
                    </h3>
                    <p className="font-inter text-[10.45px] font-normal text-[#273054] leading-[13.93px]">
                      {product.category}
                    </p>
                  </div>
                </div>

                <span className="font-inter text-[12.19px] font-normal text-[#273054] leading-[17.41px]">
                  {product.sku}
                </span>

                <span className="font-inter text-[12.19px] font-normal text-[#273054] leading-[17.41px]">
                  {product.location}
                </span>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full font-inter text-[10.45px] font-medium ${statusStyle.bg} ${statusStyle.text} inline-flex items-center gap-1.5`}
                  >
                    <span className={`w-2 h-2 rounded-full ${statusStyle.dot} flex-shrink-0`} />
                    {product.stockStatus}
                  </span>
                </div>

                <div className="flex justify-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity, -1)
                        }
                        disabled={
                          product.quantity === 0 || updateQuantity.isLoading
                        }
                        className="disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <img src="/assets/svgs/vendor/inventory/removeButton.svg" alt="Remove" width={25} height={25} />
                      </motion.button>

                      <div className="inline-flex items-center justify-center min-w-[50px] px-3 py-1 border-[0.87px] border-[#273054] rounded-[3.48px]">
                        <span className="font-inter text-[12.19px] font-bold text-[#273054] leading-[17.41px]">
                          {product.quantity}
                        </span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity, 1)
                        }
                        disabled={updateQuantity.isLoading}
                        className="disabled:opacity-30"
                      >
                        <img src="/assets/svgs/vendor/inventory/addButton.svg" alt="Add" width={25} height={25} />
                      </motion.button>
                    </div>
                    <span className="font-inter text-[10.45px] font-normal text-[#273054] leading-[13.93px] block mt-0.5">
                      Reorder: {product.reorderPoint}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {isOutOfStock ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Reorder Product"
                    >
                      <img src="/assets/svgs/vendor/inventory/blueCartActions.svg" alt="Reorder" width={28} height={28} />
                    </motion.button>
                  ) : product.stockStatusColor === "warning" ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Low Stock"
                    >
                      <img src="/assets/svgs/vendor/inventory/redCartActions.svg" alt="Low Stock" width={28} height={28} />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Refresh Stock"
                    >
                      <img src="/assets/svgs/vendor/inventory/timerIconActions.svg" alt="Refresh" width={28} height={28} />
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Edit Product"
                  >
                    <img src="/assets/svgs/vendor/inventory/pencilIconActions.svg" alt="Edit" width={28} height={28} />
                  </motion.button>
                </div>
              </div>

              {/* Mobile View - Card Layout */}
              <div className="md:hidden p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectProduct(product.id)}
                    className="w-4 h-4 rounded border-[#273054]/20 text-[#273054] focus:ring-2 focus:ring-[#273054] cursor-pointer mt-1"
                  />
                  {productImages[product.id] ? (
                    <img
                      src={productImages[product.id]}
                      alt={product.name}
                      width={35}
                      height={35}
                      className="flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-[35px] h-[35px] rounded-[6.53px] flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: product.imageColor + "20" }}
                    >
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-[8px]"
                        style={{ backgroundColor: product.imageColor }}
                      >
                        {product.name.substring(0, 2)}
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-inter text-[12.19px] font-medium text-[#273054] leading-[17.41px]">
                      {product.name}
                    </h3>
                    <p className="font-inter text-[10.45px] font-normal text-[#273054] leading-[13.93px]">
                      {product.category}
                    </p>
                    <p className="font-inter text-[10.45px] text-[#273054]/40 mt-1">
                      {product.sku} • {product.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full font-inter text-[10.45px] font-medium ${statusStyle.bg} ${statusStyle.text} inline-flex items-center gap-1.5`}
                  >
                    <span className={`w-2 h-2 rounded-full ${statusStyle.dot} flex-shrink-0`} />
                    {product.stockStatus}
                  </span>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        handleQuantityChange(product.id, product.quantity, -1)
                      }
                      disabled={
                        product.quantity === 0 || updateQuantity.isLoading
                      }
                      className="w-7 h-7 bg-[#273054] text-white rounded-[5.22px] flex items-center justify-center active:bg-[#273054]/90 transition-colors disabled:opacity-30"
                    >
                      <Minus size={12} />
                    </motion.button>

                    <div className="text-center min-w-[50px]">
                      <span className="font-inter text-[12.19px] font-bold text-[#273054]">
                        {product.quantity}
                      </span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        handleQuantityChange(product.id, product.quantity, 1)
                      }
                      disabled={updateQuantity.isLoading}
                      className="w-7 h-7 bg-[#273054] text-white rounded-[5.22px] flex items-center justify-center active:bg-[#273054]/90 transition-colors"
                    >
                      <Plus size={12} />
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#273054]/10">
                  {isOutOfStock && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 text-[#EF4444] hover:bg-[#FEF2F2] rounded-[5.22px] transition-colors"
                    >
                      <ShoppingCart size={16} />
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-1.5 text-[#273054]/60 hover:bg-[#F6F8F7] rounded-[5.22px] transition-colors"
                  >
                    <Edit2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
