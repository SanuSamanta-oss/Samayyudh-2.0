'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LightNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

interface LightNavBarProps {
  items: LightNavItem[];
  pathname: string;
  variant?: 'desktop' | 'mobile';
  className?: string;
  onItemClick?: (item: LightNavItem) => void;
}

/** Comprehensive route matcher so flashlight remains locked to the active section */
function isRouteMatching(itemHref: string, currentPath: string): boolean {
  if (!currentPath) return false;

  // Clean pathname from query params, hashes, and trailing slashes
  const cleanPath = currentPath.split('?')[0].split('#')[0];
  const normPath = cleanPath.length > 1 && cleanPath.endsWith('/')
    ? cleanPath.slice(0, -1)
    : cleanPath;

  if (itemHref === '/dashboard') {
    return normPath === '/' || normPath === '/dashboard' || normPath.startsWith('/dashboard/');
  }
  if (itemHref === '/exams') {
    return (
      normPath === '/exams' ||
      normPath.startsWith('/exams/') ||
      normPath === '/exam' ||
      normPath.startsWith('/exam/') ||
      normPath === '/results' ||
      normPath.startsWith('/results/')
    );
  }
  if (itemHref === '/practice') {
    return (
      normPath === '/practice' ||
      normPath.startsWith('/practice/') ||
      normPath === '/questions' ||
      normPath.startsWith('/questions/')
    );
  }
  if (itemHref === '/pyq') {
    return (
      normPath === '/pyq' ||
      normPath.startsWith('/pyq/')
    );
  }
  if (itemHref === '/formulas') {
    return (
      normPath === '/formulas' ||
      normPath.startsWith('/formulas/') ||
      normPath === '/formula' ||
      normPath.startsWith('/formula/')
    );
  }
  if (itemHref === '/achievements') {
    return (
      normPath === '/achievements' ||
      normPath.startsWith('/achievements/') ||
      normPath === '/badges' ||
      normPath.startsWith('/badges/')
    );
  }
  if (itemHref === '/history') {
    return (
      normPath === '/history' ||
      normPath.startsWith('/history/')
    );
  }
  if (itemHref === '/analytics') {
    return (
      normPath === '/analytics' ||
      normPath.startsWith('/analytics/')
    );
  }
  if (itemHref === '/admin') {
    return (
      normPath === '/admin' ||
      normPath.startsWith('/admin/')
    );
  }
  if (itemHref === '/profile') {
    return (
      normPath === '/profile' ||
      normPath.startsWith('/profile/') ||
      normPath === '/settings' ||
      normPath.startsWith('/settings/')
    );
  }

  return (
    normPath === itemHref ||
    normPath.startsWith(itemHref + '/')
  );
}

export function LightNavBar({
  items,
  pathname,
  variant = 'desktop',
  className,
  onItemClick,
}: LightNavBarProps) {
  const isMobile = variant === 'mobile';
  const shouldReduceMotion = useReducedMotion();

  // Compute active tab index from pathname
  const routeActiveIndex = useMemo(() => {
    return items.findIndex((item) => isRouteMatching(item.href, pathname));
  }, [items, pathname]);

  // Keep track of active tab: initialize with matched index or fallback to 0
  const [activeTab, setActiveTab] = useState(() => (routeActiveIndex >= 0 ? routeActiveIndex : 0));

  // Whenever pathname changes and resolves to a valid tab, lock onto that section
  useEffect(() => {
    if (routeActiveIndex >= 0) {
      setActiveTab(routeActiveIndex);
    }
  }, [routeActiveIndex]);

  // Spring transition for smooth gliding spotlight
  const springTransition = useMemo(
    () =>
      shouldReduceMotion
        ? { duration: 0.05 }
        : {
            type: 'spring' as const,
            stiffness: 380,
            damping: 30,
            mass: 0.65,
          },
    [shouldReduceMotion]
  );

  return (
    <nav
      className={cn(
        // General phone app docked bottom bar for mobile, capsule for desktop
        isMobile
          ? 'w-full flex items-center justify-around select-none backdrop-blur-2xl transition-all duration-300 overflow-hidden bg-white/95 dark:bg-[#121217]/95 text-stone-900 dark:text-white border-t border-stone-200/80 dark:border-white/[0.08] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.6)] h-[calc(56px+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,4px)] pt-1 px-1'
          : 'relative inline-flex items-center justify-center select-none rounded-full backdrop-blur-2xl transition-all duration-300 overflow-hidden bg-stone-100/90 dark:bg-[#16161c]/95 text-stone-900 dark:text-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.65)] border border-stone-200/90 dark:border-white/[0.08] h-[50px] px-1.5 max-w-fit mx-auto gap-0.5',
        className
      )}
      aria-label={isMobile ? 'Mobile Navigation' : 'Main Navigation'}
    >
      {items.map((item, index) => {
        const isActive = index === activeTab;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              // Immediately move flashlight to the clicked section button
              setActiveTab(index);
              onItemClick?.(item);
            }}
            className={cn(
              'relative flex flex-col items-center justify-center focus:outline-none transition-transform active:scale-95 shrink-0 select-none cursor-pointer group',
              isMobile
                ? 'flex-1 h-full py-1 px-0.5 min-w-0'
                : 'h-full py-1 px-2.5 sm:px-3 min-w-[56px] sm:min-w-[62px]'
            )}
            aria-current={isActive ? 'page' : undefined}
            title={item.label}
          >
            {/* ── Active Spotlight Beam & Top Emitter Fixture ── */}
            {isActive && (
              <motion.div
                layoutId={`light-spotlight-${variant}`}
                transition={springTransition}
                className="absolute inset-0 pointer-events-none z-0"
              >
                {/* 1. Top Emitter Cap / Lamp Fixture (Black in Light Theme, White in Dark Theme) */}
                <div
                  className={cn(
                    'absolute top-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full z-20 transition-colors duration-300',
                    isMobile ? 'w-7 sm:w-9' : 'w-8 sm:w-10',
                    'bg-stone-900 shadow-[0_0_8px_1px_rgba(0,0,0,0.35)]',
                    'dark:bg-white dark:shadow-[0_0_12px_2px_rgba(255,255,255,0.95),0_0_20px_4px_rgba(255,255,255,0.5)]'
                  )}
                />

                {/* 2a. Conical Light Beam Trapezoid — BLACK FLASHLIGHT in Light Theme */}
                <div
                  className="absolute inset-0 z-10 dark:hidden"
                  style={{
                    clipPath: isMobile
                      ? 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
                      : 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.08) 42%, rgba(0,0,0,0.01) 85%, transparent 100%)',
                  }}
                />

                {/* 2b. Conical Light Beam Trapezoid — WHITE FLASHLIGHT in Dark Theme */}
                <div
                  className="absolute inset-0 z-10 hidden dark:block"
                  style={{
                    clipPath: isMobile
                      ? 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
                      : 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0.16) 42%, rgba(255,255,255,0.02) 85%, transparent 100%)',
                  }}
                />

                {/* 3a. Soft ambient glow behind the icon — Light Theme (Black aura) */}
                <div
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-8 sm:w-9 h-7 rounded-full blur-md opacity-20 pointer-events-none dark:hidden"
                  style={{
                    background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, transparent 70%)',
                  }}
                />

                {/* 3b. Soft ambient glow behind the icon — Dark Theme (White aura) */}
                <div
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-8 sm:w-9 h-7 rounded-full blur-md opacity-35 pointer-events-none hidden dark:block"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)',
                  }}
                />
              </motion.div>
            )}

            {/* ── Icon & Label ── */}
            <motion.div
              animate={{
                y: isActive ? -1 : 0,
                scale: isActive ? 1.04 : 1,
              }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative z-10 flex flex-col items-center justify-center transition-colors duration-200',
                isActive
                  ? 'text-black dark:text-white'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400/80 dark:group-hover:text-stone-200'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'transition-all duration-200 flex items-center justify-center',
                  isActive
                    ? 'text-black drop-shadow-[0_0_6px_rgba(0,0,0,0.25)] dark:text-white dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                    : 'text-stone-500 group-hover:text-stone-900 dark:text-stone-400 dark:group-hover:text-stone-300'
                )}
              >
                {item.icon}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'transition-all duration-200 mt-0.5 truncate max-w-full',
                  isMobile
                    ? 'text-[9px] sm:text-[9.5px] leading-none font-medium tracking-tight'
                    : 'text-[10px] leading-none font-medium tracking-tight',
                  isActive
                    ? 'text-black dark:text-white font-semibold'
                    : 'text-stone-500 group-hover:text-stone-900 dark:text-stone-400 dark:group-hover:text-stone-300'
                )}
              >
                {item.label}
              </span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
