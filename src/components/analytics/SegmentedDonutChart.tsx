'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DonutSegment } from '@/lib/analytics/data-processor';

interface SegmentedDonutChartProps {
  title: string;
  subtitle?: string;
  data: DonutSegment[];
  totalLabel?: string;
  size?: number;
  thickness?: number;
  className?: string;
}

/**
 * Precision Segmented Donut Chart (Smooth, No Outlines, Refined Sizing)
 * Features:
 * - Thick, smooth donut segments
 * - Clean gaps between segments
 * - Rounded caps on segments
 * - Floating pill badge displaying the percentage on the active/largest segment
 * - Zero harsh borders or outlines
 */
export function SegmentedDonutChart({
  title,
  subtitle,
  data,
  totalLabel = 'Total Questions',
  size = 230,
  thickness = 32,
  className,
}: SegmentedDonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const totalValue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const activeIndex = useMemo(() => {
    if (hoveredIndex !== null) return hoveredIndex;
    if (data.length === 0) return null;
    let maxIdx = 0;
    let maxVal = -1;
    data.forEach((d, i) => {
      if (d.value > maxVal) {
        maxVal = d.value;
        maxIdx = i;
      }
    });
    return maxIdx;
  }, [hoveredIndex, data]);

  const radius = size / 2;
  const arcRadius = radius - thickness / 2 - 8;
  const circumference = 2 * Math.PI * arcRadius;
  const gapAngleDegrees = data.length > 1 ? 5 : 0;
  const totalGapDegrees = gapAngleDegrees * data.length;
  const availableDegrees = 360 - totalGapDegrees;

  const arcs = useMemo(() => {
    if (totalValue === 0 || data.length === 0) return [];

    let currentAngle = -90;
    return data.map((item, idx) => {
      const segmentDegrees = (item.value / totalValue) * availableDegrees;
      const startAngle = currentAngle;
      const endAngle = currentAngle + segmentDegrees;
      const midAngle = startAngle + segmentDegrees / 2;

      currentAngle = endAngle + gapAngleDegrees;

      const midRad = (midAngle * Math.PI) / 180;
      const badgeX = radius + Math.cos(midRad) * arcRadius;
      const badgeY = radius + Math.sin(midRad) * arcRadius;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = radius + Math.cos(startRad) * arcRadius;
      const y1 = radius + Math.sin(startRad) * arcRadius;
      const x2 = radius + Math.cos(endRad) * arcRadius;
      const y2 = radius + Math.sin(endRad) * arcRadius;

      const largeArc = segmentDegrees > 180 ? 1 : 0;
      const pathData = `M ${x1} ${y1} A ${arcRadius} ${arcRadius} 0 ${largeArc} 1 ${x2} ${y2}`;

      return {
        ...item,
        pathData,
        midAngle,
        badgeX,
        badgeY,
        degrees: segmentDegrees,
      };
    });
  }, [data, totalValue, availableDegrees, gapAngleDegrees, radius, arcRadius]);

  const activeSegment = activeIndex !== null ? arcs[activeIndex] : null;

  return (
    <div className={cn(
      'p-5 sm:p-6 rounded-[30px] bg-white dark:bg-[#111A2E] shadow-sm flex flex-col justify-between transition-all',
      className
    )}>
      {/* Card Header */}
      <div className="mb-3">
        <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {data.length === 0 || totalValue === 0 ? (
        <div className="py-10 flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800/60 flex items-center justify-center text-stone-400 font-bold text-[11px]">
            0 Qs
          </div>
          <p className="text-xs font-bold text-stone-600 dark:text-stone-300">No question data yet</p>
          <p className="text-[10px] text-stone-400">Complete practice sessions to populate this chart</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Segmented Donut SVG Visual */}
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
              {/* Background circular guide ring */}
              <circle
                cx={radius}
                cy={radius}
                r={arcRadius}
                fill="none"
                stroke="currentColor"
                className="text-stone-100 dark:text-[#18233C]"
                strokeWidth={thickness}
              />

              {/* Smooth Segmented Arcs with Rounded Ends */}
              {arcs.map((arc, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <motion.path
                    key={arc.name}
                    d={arc.pathData}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth={isActive ? thickness + 4 : thickness}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: idx * 0.08, ease: 'easeOut' }}
                    className="cursor-pointer transition-all"
                    style={{
                      filter: isActive ? 'drop-shadow(0px 3px 6px rgba(0,0,0,0.2))' : 'none',
                    }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}

              {/* Floating Pill Badge on Selected/Largest Segment (Smooth, No Outline) */}
              {activeSegment && (
                <foreignObject
                  x={activeSegment.badgeX - 20}
                  y={activeSegment.badgeY - 13}
                  width="40"
                  height="26"
                  className="pointer-events-none overflow-visible"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-10 h-6 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-extrabold text-[11px] flex items-center justify-center shadow-md font-mono"
                  >
                    {activeSegment.percentage}%
                  </motion.div>
                </foreignObject>
              )}
            </svg>

            {/* Clean Hollow Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSegment ? activeSegment.name : 'total'}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                    {activeSegment ? activeSegment.value : totalValue}
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 max-w-[95px] truncate leading-tight mt-0.5">
                    {activeSegment ? activeSegment.name : totalLabel}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Corresponding Interactive Legend (Smooth, No Outline) */}
          <div className="w-full mt-4 pt-3 grid grid-cols-2 gap-1.5 text-xs">
            {data.map((item, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={item.name}
                  onClick={() => setHoveredIndex(idx)}
                  className={cn(
                    'flex items-center justify-between p-2 rounded-xl transition-all text-left cursor-pointer',
                    isSelected
                      ? 'bg-stone-100 dark:bg-[#1E2D4A] shadow-2xs'
                      : 'hover:bg-stone-50/80 dark:hover:bg-[#152037]'
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-stone-700 dark:text-stone-200 truncate text-[10px] sm:text-[11px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-stone-900 dark:text-white shrink-0 ml-1 text-[11px]">
                    {item.value}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
