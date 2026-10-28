'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  AnimatePresence,
} from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

interface CurvedTabBarProps {
  items: TabItem[];
  pathname: string;
  variant?: 'mobile' | 'desktop';
  className?: string;
}

export function CurvedTabBar({
  items,
  pathname,
  variant = 'mobile',
  className,
}: CurvedTabBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const isMobile = variant === 'mobile';

  // Compute active index from route
  const computedActiveIndex = useMemo(() => {
    const idx = items.findIndex((item) => {
      if (item.href === '/dashboard') {
        return pathname === '/dashboard';
      }
      return pathname === item.href || pathname?.startsWith(item.href + '/');
    });
    return idx >= 0 ? idx : 0;
  }, [items, pathname]);

  // Local active tab index with immediate response
  const [activeTab, setActiveTab] = useState(computedActiveIndex);

  useEffect(() => {
    setActiveTab(computedActiveIndex);
  }, [computedActiveIndex]);

  const [mounted, setMounted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(isMobile ? 64 : 48);

  // Motion value for smooth horizontal tracking
  const centerX = useMotionValue(0);

  // Buttery-smooth, organic spring physics
  const springX = useSpring(centerX, {
    stiffness: 240,
    damping: 25,
    mass: 0.65,
  });

  // Calculate velocity for subtle liquid squash & stretch
  const xVelocity = useVelocity(springX);
  const rawScaleX = useTransform(xVelocity, [-1200, 0, 1200], [1.07, 1, 1.07]);
  const rawScaleY = useTransform(xVelocity, [-1200, 0, 1200], [0.94, 1, 0.94]);
  const scaleX = useSpring(rawScaleX, { stiffness: 350, damping: 25 });
  const scaleY = useSpring(rawScaleY, { stiffness: 350, damping: 25 });

  // Active item & accent color
  const activeItem = items[activeTab] || items[0];
  const activeColor = activeItem?.color || '#7c3aed';

  // Adaptive geometry matching Purrweb UX curve, scaling cleanly for 7+ items on mobile
  const isManyItems = isMobile && items.length >= 7;
  const notchHalfWidth = isMobile ? (isManyItems ? 28 : 36) : 34;
  const notchDepth = isMobile ? (isManyItems ? 22 : 28) : 24;
  const circleDiameter = isMobile ? (isManyItems ? 38 : 46) : 40;
  const circleTop = isMobile ? (isManyItems ? -9 : -13) : -11;

  // Measure and align active indicator
  const updateActivePosition = useCallback(
    (instant = false) => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const cRect = container.getBoundingClientRect();
      if (cRect.width === 0) return;

      setContainerWidth(cRect.width);
      setContainerHeight(isMobile ? 64 : cRect.height || 48);

      const targetElement = itemRefs.current[activeTab];
      let targetCenter = 0;

      if (targetElement) {
        const iRect = targetElement.getBoundingClientRect();
        targetCenter = iRect.left - cRect.left + iRect.width / 2;
      } else {
        const sidePadding = isMobile ? 6 : 12;
        const usableWidth = cRect.width - sidePadding * 2;
        const itemWidth = usableWidth / items.length;
        targetCenter = sidePadding + (activeTab + 0.5) * itemWidth;
      }

      if (instant) {
        springX.jump(targetCenter);
      } else {
        centerX.set(targetCenter);
      }
    },
    [activeTab, isMobile, items.length, centerX, springX]
  );

  useEffect(() => {
    setMounted(true);
    updateActivePosition(true);

    const handleResize = () => {
      updateActivePosition(false);
    };

    window.addEventListener('resize', handleResize);

    let ro: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updateActivePosition(false);
      });
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
    };
  }, [updateActivePosition]);

  useEffect(() => {
    if (mounted) {
      updateActivePosition(false);
    }
  }, [activeTab, mounted, updateActivePosition]);

  // Framer Motion transform for background SVG path with silky cubic beziers
  const pathD = useTransform(springX, (x) => {
    const w = containerWidth;
    const h = containerHeight;
    if (w <= 0 || h <= 0) return '';

    const nw = notchHalfWidth;
    const nd = notchDepth;

    if (!isMobile) {
      // Desktop: Rounded pill capsule with top scoop
      const r = h / 2;
      const xLeft = Math.max(r, x - nw);
      const xRight = Math.min(w - r, x + nw);

      const cp1X = x - nw * 0.58;
      const cp2X = x - nw * 0.40;
      const cp3X = x + nw * 0.40;
      const cp4X = x + nw * 0.58;

      return `M ${r} 0 
        L ${xLeft} 0 
        C ${cp1X} 0, ${cp2X} ${nd}, ${x} ${nd} 
        C ${cp3X} ${nd}, ${cp4X} 0, ${xRight} 0 
        L ${w - r} 0 
        A ${r} ${r} 0 0 1 ${w} ${r} 
        A ${r} ${r} 0 0 1 ${w - r} ${h} 
        L ${r} ${h} 
        A ${r} ${r} 0 0 1 0 ${r} 
        A ${r} ${r} 0 0 1 ${r} 0 
        Z`;
    }

    // Mobile: Full-bleed bottom tab bar with smooth top curved scoop
    const xLeft = Math.max(0, x - nw);
    const xRight = Math.min(w, x + nw);

    const cp1X = x - nw * 0.58;
    const cp2X = x - nw * 0.40;
    const cp3X = x + nw * 0.40;
    const cp4X = x + nw * 0.58;

    return `M 0 0 
      L ${xLeft} 0 
      C ${cp1X} 0, ${cp2X} ${nd}, ${x} ${nd} 
      C ${cp3X} ${nd}, ${cp4X} 0, ${xRight} 0 
      L ${w} 0 
      L ${w} ${h + 50} 
      L 0 ${h + 50} 
      Z`;
  });

  // Top stroke path following the scoop curve for crisp definition
  const strokePathD = useTransform(springX, (x) => {
    const w = containerWidth;
    const h = containerHeight;
    if (w <= 0 || h <= 0) return '';

    const nw = notchHalfWidth;
    const nd = notchDepth;

    if (!isMobile) {
      const r = h / 2;
      const xLeft = Math.max(r, x - nw);
      const xRight = Math.min(w - r, x + nw);
      const cp1X = x - nw * 0.58;
      const cp2X = x - nw * 0.40;
      const cp3X = x + nw * 0.40;
      const cp4X = x + nw * 0.58;

      return `M ${r} 0 
        L ${xLeft} 0 
        C ${cp1X} 0, ${cp2X} ${nd}, ${x} ${nd} 
        C ${cp3X} ${nd}, ${cp4X} 0, ${xRight} 0 
        L ${w - r} 0 
        A ${r} ${r} 0 0 1 ${w} ${r} 
        A ${r} ${r} 0 0 1 ${w - r} ${h} 
        L ${r} ${h} 
        A ${r} ${r} 0 0 1 0 ${r} 
        A ${r} ${r} 0 0 1 ${r} 0 
        Z`;
    }

    const xLeft = Math.max(0, x - nw);
    const xRight = Math.min(w, x + nw);
    const cp1X = x - nw * 0.58;
    const cp2X = x - nw * 0.40;
    const cp3X = x + nw * 0.40;
    const cp4X = x + nw * 0.58;

    return `M 0 0 
      L ${xLeft} 0 
      C ${cp1X} 0, ${cp2X} ${nd}, ${x} ${nd} 
      C ${cp3X} ${nd}, ${cp4X} 0, ${xRight} 0 
      L ${w} 0`;
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative select-none',
        isMobile
          ? 'w-full h-16 pb-[env(safe-area-inset-bottom)] px-0.5 sm:px-1.5'
          : 'flex items-center h-11 px-2',
        className
      )}
    >
      {/* 1. Underlying SVG Background with Animated Curved Notch */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
        style={{
          filter: isMobile
            ? 'drop-shadow(0 -4px 18px rgba(0,0,0,0.07)) drop-shadow(0 -1px 3px rgba(0,0,0,0.04))'
            : 'drop-shadow(0 6px 20px rgba(0,0,0,0.12))',
        }}
      >
        {/* Main Tab Bar Fill */}
        <motion.path
          d={pathD}
          className="fill-white dark:fill-[#0F172A] transition-colors duration-300"
        />

        {/* Crisp Top Stroke / Border */}
        <motion.path
          d={strokePathD}
          fill="none"
          className="stroke-stone-200/90 dark:stroke-white/10"
          strokeWidth={isMobile ? 1.5 : 1}
        />
      </svg>

      {/* 2. Floating Circular Active Button with Liquid Stretch Physics */}
      <motion.div
        style={{
          x: springX,
          top: circleTop,
          scaleX,
          scaleY,
        }}
        className="absolute -translate-x-1/2 pointer-events-none z-20 flex items-center justify-center will-change-transform"
      >
        {/* Ambient Radial Glow */}
        <div
          className="absolute rounded-full blur-md opacity-45 dark:opacity-70 transition-colors duration-300"
          style={{
            width: circleDiameter + 10,
            height: circleDiameter + 10,
            backgroundColor: activeColor,
          }}
        />

        {/* Circular Token with Accent Border */}
        <div
          className="relative rounded-full flex items-center justify-center transition-colors duration-300 bg-white dark:bg-[#0B0F17] shadow-xl overflow-hidden"
          style={{
            width: circleDiameter,
            height: circleDiameter,
            border: `${isManyItems ? '2.5px' : '3.5px'} solid ${activeColor}`,
            boxShadow: `0 8px 22px -3px ${activeColor}55, 0 3px 8px rgba(0,0,0,0.22)`,
          }}
        >
          {/* Seamless Icon Cross-Fade (no empty circle delay) */}
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence initial={false}>
              <motion.div
                key={activeTab}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0, position: 'absolute' }}
                transition={{
                  duration: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                  'flex items-center justify-center',
                  isManyItems && '[&_svg]:w-4 [&_svg]:h-4'
                )}
                style={{ color: activeColor }}
              >
                {activeItem?.icon}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* 3. Navigation Items Row */}
      <nav
        className={cn(
          'relative z-10 w-full h-full flex items-center',
          isMobile ? 'justify-around' : 'justify-center gap-0.5'
        )}
      >
        {items.map((item, idx) => {
          const isActive = idx === activeTab;

          return (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              onClick={() => {
                setActiveTab(idx);
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(10);
                }
              }}
              className={cn(
                'relative flex items-center justify-end select-none group',
                isMobile
                  ? 'flex-1 flex-col pb-1.5 h-full min-w-0'
                  : 'flex-row gap-1.5 px-3 py-1 rounded-full text-xs font-semibold'
              )}
            >
              {/* Inactive Icon: smoothly fades away when active, zero layout shift */}
              <div
                className={cn(
                  'flex items-center justify-center transition-all duration-250',
                  isManyItems ? 'w-5 h-5 [&_svg]:w-4 [&_svg]:h-4' : 'w-6 h-6',
                  isActive
                    ? 'opacity-0 scale-75 -translate-y-1 pointer-events-none'
                    : 'opacity-65 group-hover:opacity-100 group-hover:scale-105 text-stone-500 dark:text-stone-400'
                )}
              >
                {item.icon}
              </div>

              {/* Text Label: anchored to bottom baseline, zero vertical jump */}
              <span
                className={cn(
                  'text-center truncate transition-colors duration-200 block w-full px-0.5',
                  isMobile
                    ? cn(
                        isManyItems ? 'text-[9px] sm:text-[10px]' : 'text-[10px]',
                        'tracking-tight leading-tight mt-0.5',
                        isActive
                          ? 'font-bold text-purple-700 dark:text-purple-300'
                          : 'font-medium text-stone-500 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200'
                      )
                    : cn(
                        'text-xs tracking-tight',
                        isActive
                          ? 'font-extrabold text-purple-700 dark:text-purple-300'
                          : 'text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white'
                      )
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
