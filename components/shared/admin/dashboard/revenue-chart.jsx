"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function RevenueChart({ data }) {
  const [activePoint, setActivePoint] = useState(null);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  if (!data) {
    return null;
  }

  // Calculate chart dimensions and points
  const chartConfig = useMemo(() => {
    const width = 800;
    const height = 280;
    const padding = { top: 30, right: 40, bottom: 40, left: 60 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find min and max revenue
    const revenues = data.chartData.map((d) => d.revenue);
    const maxRevenue = Math.max(...revenues);
    const minRevenue = Math.min(...revenues);
    const revenueRange = maxRevenue - minRevenue;

    // Calculate points
    const points = data.chartData.map((item, index) => {
      const x =
        padding.left + (index / (data.chartData.length - 1)) * chartWidth;
      const y =
        padding.top +
        chartHeight -
        ((item.revenue - minRevenue) / revenueRange) * chartHeight;
      return { x, y, month: item.month, revenue: item.revenue };
    });

    // Generate SVG path
    const path = points.reduce((acc, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${acc} L ${point.x} ${point.y}`;
    }, "");

    // Generate area path (for gradient fill)
    const areaPath = `${path} L ${points[points.length - 1].x} ${
      padding.top + chartHeight
    } L ${padding.left} ${padding.top + chartHeight} Z`;

    // Generate Y-axis labels
    const yAxisLabels = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const value = minRevenue + (revenueRange / steps) * i;
      const y = padding.top + chartHeight - (i / steps) * chartHeight;
      yAxisLabels.push({
        value: `$${(value / 1000).toFixed(0)}k`,
        y,
      });
    }

    return {
      width,
      height,
      padding,
      chartWidth,
      chartHeight,
      points,
      path,
      areaPath,
      yAxisLabels,
      maxRevenue,
      minRevenue,
    };
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl border border-[#E5E7EB] p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-manrope text-[18px] font-bold text-[#1E293B]">
              Revenue Summary
            </h2>
            <div className="relative">
              <select className="appearance-none bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-3 py-1.5 pr-8 font-manrope text-[12px] text-[#64748B] cursor-pointer hover:bg-[#F1F5F9] transition-colors">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>Last Year</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
              />
            </div>
          </div>
          <p className="font-manrope text-[13px] text-[#64748B]">
            Monthly recurring revenue & growth trends
          </p>
        </div>

        {/* Key Metrics */}
        <div className="flex gap-6">
          <div>
            <p className="text-[12px] text-[#64748B] mb-1">
              Total Revenue (YTD)
            </p>
            <p className="text-[24px] font-bold text-[#1E293B]">
              ${data.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-[#64748B] mb-1">
              Monthly Recurring (MRR)
            </p>
            <p className="text-[24px] font-bold text-[#1E293B]">
              ${data.monthlyRecurring.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative overflow-x-auto">
        <svg
          width="100%"
          height={chartConfig.height}
          viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}
          className="min-w-[600px]"
        >
          <defs>
            {/* Gradient for area fill */}
            <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {chartConfig.yAxisLabels.map((label, i) => (
            <g key={i}>
              <line
                x1={chartConfig.padding.left}
                y1={label.y}
                x2={chartConfig.padding.left + chartConfig.chartWidth}
                y2={label.y}
                stroke="#E5E7EB"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={chartConfig.padding.left - 10}
                y={label.y + 4}
                textAnchor="end"
                className="text-[11px] fill-[#94A3B8] font-manrope"
              >
                {label.value}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <motion.path
            d={chartConfig.areaPath}
            fill="url(#revenueGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />

          {/* Line path */}
          <motion.path
            d={chartConfig.path}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Data points */}
          {chartConfig.points.map((point, i) => (
            <g key={i}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={activePoint === i ? 6 : 4}
                fill="#3B82F6"
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer"
                onMouseEnter={() => {
                  setActivePoint(i);
                  setHoveredTooltip(point);
                }}
                onMouseLeave={() => {
                  setActivePoint(null);
                  setHoveredTooltip(null);
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.3 }}
              />
            </g>
          ))}

          {/* X-axis labels */}
          {chartConfig.points.map((point, i) => (
            <text
              key={i}
              x={point.x}
              y={chartConfig.padding.top + chartConfig.chartHeight + 25}
              textAnchor="middle"
              className="text-[12px] fill-[#64748B] font-manrope"
            >
              {point.month}
            </text>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bg-[#1E293B] text-white px-4 py-2.5 rounded-lg shadow-lg pointer-events-none"
            style={{
              left: `${(hoveredTooltip.x / chartConfig.width) * 100}%`,
              top: `${(hoveredTooltip.y / chartConfig.height) * 100 - 15}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <p className="font-manrope text-[11px] text-[#94A3B8] mb-1">
              {hoveredTooltip.month}
            </p>
            <p className="font-manrope text-[15px] font-bold">
              ${hoveredTooltip.revenue.toLocaleString()}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
