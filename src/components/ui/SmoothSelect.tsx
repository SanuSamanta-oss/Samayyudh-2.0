'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Search } from 'lucide-react';

export interface SmoothSelectOption {
  value: string;
  label: string;
  hint?: string;
}

interface SmoothSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SmoothSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  ariaLabel?: string;
  size?: 'sm' | 'md';
  variant?: 'surface' | 'subtle' | 'elevated';
  align?: 'left' | 'right';
  className?: string;
  menuMinWidth?: number;
}

const emptySubscribe = () => () => {};

/**
 * Animated, borderless dropdown select with portal positioning and automatic
 * Light/Dark theme surfaces. Designed for both Web and Android TWA viewports.
 */
export function SmoothSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  searchable,
  searchPlaceholder = 'Filter options...',
  ariaLabel,
  size = 'md',
  variant = 'surface',
  align = 'left',
  className = '',
  menuMinWidth = 210,
}: SmoothSelectProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [coords, setCoords] = useState<{
    top: number;
    bottom: number;
    left: number;
    width: number;
    placement: 'bottom' | 'top';
    maxHeight: number;
  }>({
    top: 0,
    bottom: 0,
    left: 0,
    width: 210,
    placement: 'bottom',
    maxHeight: 280,
  });

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const showSearch = searchable ?? options.length >= 10;

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) || null,
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q) ||
        (opt.hint && opt.hint.toLowerCase().includes(q))
    );
  }, [options, query]);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padding = 12;
    const gap = 8;

    const targetWidth = Math.min(
      Math.max(rect.width, menuMinWidth),
      Math.max(200, vw - padding * 2)
    );

    let left = align === 'right' ? rect.right - targetWidth : rect.left;
    if (left + targetWidth > vw - padding) {
      left = vw - padding - targetWidth;
    }
    if (left < padding) {
      left = padding;
    }

    const spaceBelow = vh - rect.bottom - gap - padding;
    const spaceAbove = rect.top - gap - padding;
    const placement: 'bottom' | 'top' =
      spaceBelow < 210 && spaceAbove > spaceBelow ? 'top' : 'bottom';
    const available = placement === 'bottom' ? spaceBelow : spaceAbove;
    const maxHeight = Math.max(150, Math.min(310, available));

    setCoords({
      top: rect.bottom + gap,
      bottom: vh - rect.top + gap,
      left,
      width: targetWidth,
      placement,
      maxHeight,
    });
  }, [align, menuMinWidth]);

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleWindowChange = (e: Event) => {
      const target = e.target as Node | null;
      if (target && menuRef.current?.contains(target)) return;
      updatePosition();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (open && showSearch) {
      const id = window.setTimeout(() => searchInputRef.current?.focus(), 40);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open, showSearch]);

  const toggleOpen = () => {
    if (disabled) return;
    if (!open) {
      setQuery('');
      updatePosition();
    }
    setOpen((prev) => !prev);
  };

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
    setQuery('');
  };

  const sizeClass =
    size === 'sm' ? 'px-3 py-2 text-xs rounded-xl' : 'px-3.5 py-2.5 text-xs rounded-2xl';

  const variantClass =
    variant === 'elevated'
      ? open
        ? 'bg-white dark:bg-[#1A2640] text-[#5B4CE6] dark:text-[#DDD6FE] shadow-[0_10px_28px_-6px_rgba(99,91,255,0.28)] dark:shadow-[0_14px_32px_-6px_rgba(0,0,0,0.6)]'
        : 'bg-white dark:bg-[#111A2E] text-slate-800 dark:text-slate-100 hover:bg-[#F5F3FF] dark:hover:bg-[#1A2640] shadow-[0_6px_18px_-6px_rgba(15,23,42,0.08)] dark:shadow-[0_8px_22px_-6px_rgba(0,0,0,0.45)]'
      : variant === 'subtle'
        ? open
          ? 'bg-[#EAE6F5] dark:bg-[#231B3E] text-[#564AE6] dark:text-[#DDD6FE]'
          : 'bg-stone-100/80 dark:bg-[#162032]/85 text-slate-700 dark:text-slate-200 hover:bg-[#EAE6F5]/75 dark:hover:bg-[#1C2840]'
        : open
          ? 'bg-white dark:bg-[#1C2840] text-[#564AE6] dark:text-[#DDD6FE] shadow-[0_10px_26px_-6px_rgba(99,91,255,0.24)] dark:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.65)]'
          : 'bg-stone-100/90 dark:bg-[#162032] text-slate-800 dark:text-slate-100 hover:bg-[#EAE6F5]/80 dark:hover:bg-[#1D2842]';

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={toggleOpen}
        className={`group inline-flex items-center justify-between gap-2 font-medium transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none ${sizeClass} ${variantClass} ${className}`}
      >
        <span className="truncate text-left">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
            open
              ? 'rotate-180 text-[#635BFF] dark:text-[#C4B5FD]'
              : 'text-slate-500 dark:text-slate-400 group-hover:text-[#635BFF] dark:group-hover:text-[#C4B5FD]'
          }`}
        />
      </button>

      {isClient &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={menuRef}
                role="listbox"
                aria-label={ariaLabel || placeholder}
                initial={{
                  opacity: 0,
                  y: coords.placement === 'bottom' ? -6 : 6,
                  scale: 0.96,
                }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: coords.placement === 'bottom' ? -4 : 4,
                  scale: 0.96,
                }}
                transition={{ type: 'spring', stiffness: 460, damping: 32, mass: 0.7 }}
                style={{
                  position: 'fixed',
                  left: coords.left,
                  width: coords.width,
                  ...(coords.placement === 'bottom'
                    ? { top: coords.top }
                    : { bottom: coords.bottom }),
                  zIndex: 95,
                  transformOrigin:
                    coords.placement === 'bottom' ? 'top center' : 'bottom center',
                }}
                className="rounded-2xl bg-white/95 dark:bg-[#131D33]/98 backdrop-blur-2xl p-1.5 shadow-[0_22px_54px_-12px_rgba(30,27,75,0.22)] dark:shadow-[0_26px_64px_-12px_rgba(0,0,0,0.78)] outline-none"
              >
                {showSearch && (
                  <div className="px-1 pb-1.5">
                    <div className="relative flex items-center rounded-xl bg-stone-100/90 dark:bg-[#1A2640]">
                      <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 ml-2.5 shrink-0 pointer-events-none" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full bg-transparent px-2.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div
                  style={{ maxHeight: coords.maxHeight }}
                  className="overflow-y-auto overscroll-contain space-y-0.5 pr-0.5 custom-scrollbar"
                >
                  {filteredOptions.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
                      No matching options
                    </div>
                  ) : (
                    filteredOptions.map((opt) => {
                      const active = opt.value === value;
                      return (
                        <button
                          key={opt.value || '__empty__'}
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => handleSelect(opt.value)}
                          className={`w-full flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-xs text-left transition-all duration-150 outline-none focus:outline-none cursor-pointer ${
                            active
                              ? 'bg-gradient-to-r from-[#635BFF]/14 to-[#7C3AED]/10 dark:from-[#635BFF]/30 dark:to-[#7C3AED]/20 text-[#4F46E5] dark:text-[#DDD6FE] font-semibold'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-[#1C2842] hover:text-slate-950 dark:hover:text-white'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate">{opt.label}</div>
                            {opt.hint && (
                              <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate mt-0.5">
                                {opt.hint}
                              </div>
                            )}
                          </div>
                          {active && (
                            <span className="w-5 h-5 rounded-full bg-[#635BFF]/15 dark:bg-[#635BFF]/35 text-[#564AE6] dark:text-[#DDD6FE] flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

