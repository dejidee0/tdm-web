"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import {
  useUpdateProductQuantity,
  useDeleteProduct,
} from "@/hooks/use-inventory";

const stockStatusStyles = {
  success: {
    bg: "bg-[#D1FAE5]",
    text: "text-[#065F46]",
    dot: "bg-[#10B981]",
  },
  warning: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    dot: "bg-[#F59E0B]",
  },
  error: {
    bg: "bg-[#FEF2F2]",
    text: "text-[#DC2626]",
    dot: "bg-[#EF4444]",
  },
};

export default function InventoryProductsTable({ products, isLoading }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const updateQuantity = useUpdateProductQuantity();
  const deleteProduct = useDeleteProduct();

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
      <div className="bg-white rounded-xl border border-[#E5E7EB]">
        <div className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#64748B] font-manrope text-[14px]">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
        <p className="text-[#64748B] font-manrope text-[14px]">
          No products found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      {/* Scroll Hint - Mobile only */}
      <div className="md:hidden px-4 py-2 bg-[#F8FAFC] border-b border-[#E5E7EB] flex items-center justify-center gap-2 text-[#64748B]">
        <ChevronRight size={14} className="animate-pulse" />
        <span className="font-manrope text-[11px]">
          Swipe to see more options
        </span>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden md:block px-6 py-4 bg-[#F8FAFC] border-b border-[#E5E7EB]">
        <div className="grid grid-cols-[40px_1fr_140px_140px_160px_180px_120px] gap-4 items-center">
          <input
            type="checkbox"
            checked={selectedProducts.length === products.length}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-[#E5E7EB] text-primary focus:ring-2 focus:ring-primary cursor-pointer"
          />
          <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            PRODUCT DETAILS
          </span>
          <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            SKU
          </span>
          <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            LOCATION
          </span>
          <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            STOCK STATUS
          </span>
          <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            QUANTITY
          </span>
          <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            ACTIONS
          </span>
        </div>
      </div>

      {/* Table Body - Scrollable on mobile */}
      <div className="divide-y divide-[#E5E7EB]">
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
              <div className="hidden md:grid md:grid-cols-[40px_1fr_140px_140px_160px_180px_120px] gap-4 items-center px-6 py-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectProduct(product.id)}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                />

                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: product.imageColor + "20" }}
                  >
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-[10px]"
                      style={{ backgroundColor: product.imageColor }}
                    >
                      {product.name.substring(0, 2)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-manrope text-[14px] font-medium text-primary truncate">
                      {product.name}
                    </h3>
                    <p className="font-manrope text-[12px] text-[#64748B]">
                      {product.category}
                    </p>
                  </div>
                </div>

                <span className="font-manrope text-[13px] text-primary">
                  {product.sku}
                </span>

                <span className="font-manrope text-[13px] text-[#64748B]">
                  {product.location}
                </span>

                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                  <span
                    className={`px-3 py-1 rounded-full font-manrope text-[11px] font-bold ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {product.stockStatus}
                  </span>
                </div>

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
                    className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-[#334155] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus size={14} />
                  </motion.button>

                  <div className="text-center min-w-[60px]">
                    <span className="font-manrope text-[16px] font-bold text-primary block">
                      {product.quantity}
                    </span>
                    <span className="font-manrope text-[10px] text-[#64748B]">
                      Reorder: {product.reorderPoint}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      handleQuantityChange(product.id, product.quantity, 1)
                    }
                    disabled={updateQuantity.isLoading}
                    className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-[#334155] transition-colors disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </motion.button>
                </div>

                <div className="flex items-center gap-2">
                  {isOutOfStock ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                      title="Reorder Product"
                    >
                      <ShoppingCart size={18} />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                      title="Refresh Stock"
                    >
                      <RefreshCw size={18} />
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 size={18} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this product?")
                      ) {
                        deleteProduct.mutate(product.id);
                      }
                    }}
                    className="p-2 text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#EF4444] rounded-lg transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 size={18} />
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
                    className="w-4 h-4 rounded border-[#E5E7EB] text-primary focus:ring-2 focus:ring-primary cursor-pointer mt-1"
                  />
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: product.imageColor + "20" }}
                  >
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-[10px]"
                      style={{ backgroundColor: product.imageColor }}
                    >
                      {product.name.substring(0, 2)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-manrope text-[14px] font-medium text-primary">
                      {product.name}
                    </h3>
                    <p className="font-manrope text-[12px] text-[#64748B]">
                      {product.category}
                    </p>
                    <p className="font-manrope text-[11px] text-[#94A3B8] mt-1">
                      {product.sku} • {product.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${statusStyle.dot}`}
                    />
                    <span
                      className={`px-3 py-1 rounded-full font-manrope text-[11px] font-bold ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {product.stockStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        handleQuantityChange(product.id, product.quantity, -1)
                      }
                      disabled={
                        product.quantity === 0 || updateQuantity.isLoading
                      }
                      className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center active:bg-[#334155] transition-colors disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </motion.button>

                    <div className="text-center min-w-[50px]">
                      <span className="font-manrope text-[16px] font-bold text-primary">
                        {product.quantity}
                      </span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        handleQuantityChange(product.id, product.quantity, 1)
                      }
                      disabled={updateQuantity.isLoading}
                      className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center active:bg-[#334155] transition-colors"
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
                  {isOutOfStock && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                    >
                      <ShoppingCart size={18} />
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this product?")
                      ) {
                        deleteProduct.mutate(product.id);
                      }
                    }}
                    className="p-2 text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#EF4444] rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
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
