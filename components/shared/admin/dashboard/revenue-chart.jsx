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

    // Generate smooth curve SVG path using cubic bezier curves
    const path = points.reduce((acc, point, index, arr) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }

      // Calculate control points for smooth curve
      const prev = arr[index - 1];
      const controlX1 = prev.x + (point.x - prev.x) / 3;
      const controlY1 = prev.y;
      const controlX2 = point.x - (point.x - prev.x) / 3;
      const controlY2 = point.y;

      return `${acc} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${point.x} ${point.y}`;
    }, "");

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
      <div className="mb-6">
        {/* Row 1: Title + Dropdown */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-manrope text-[18px] font-bold text-[#1E293B]">
            Revenue Summary
          </h2>
          <div className="relative">
            <select className="appearance-none bg-[#273054] text-white rounded-[8.44px] px-4 py-2 pr-8 font-manrope text-[12px] font-medium cursor-pointer hover:bg-[#334155] transition-colors">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>Last Year</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white pointer-events-none"
            />
          </div>
        </div>

        {/* Row 2: Subtitle */}
        <p className="font-manrope text-[13px] text-[#64748B] mb-4">
          Monthly recurring revenue & growth trends
        </p>

        {/* Divider */}
        <div className="h-[1px] bg-[#273054] mb-4" />

        {/* Row 3: Key Metrics */}
        <div className="flex gap-8">
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
          className="min-w-[300px] sm:min-w-[500px] md:min-w-[600px]"
          preserveAspectRatio="xMidYMid meet"
        >
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

          {/* Line path */}
          <motion.path
            d={chartConfig.path}
            fill="none"
            stroke="#1E293B"
            strokeWidth="2.5"
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
                r={activePoint === i ? 5 : 3.5}
                fill="#1E293B"
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
