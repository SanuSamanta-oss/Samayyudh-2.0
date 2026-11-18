'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  ShieldCheck,
  GraduationCap,
  Users,
  FileText,
  Radio,
} from 'lucide-react';

export type IdentityEntityType = 'student' | 'guardian' | 'teacher' | 'examination' | 'session';

interface IdentityCardProps {
  code: string;
  entityType: IdentityEntityType;
  name: string;
  sublabel?: string;
  verified?: boolean;
  className?: string;
  compact?: boolean;
}

export function IdentityCard({
  code,
  entityType,
  name,
  sublabel,
  verified = true,
  className = '',
  compact = false,
}: IdentityCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy code:', err);
    }
  };

  const getEntityConfig = (type: IdentityEntityType) => {
    switch (type) {
      case 'student':
        return {
          label: 'Student',
          icon: GraduationCap,
          badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
        };
      case 'guardian':
        return {
          label: 'Guardian',
          icon: Users,
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
        };
      case 'teacher':
        return {
          label: 'Faculty / Invigilator',
          icon: ShieldCheck,
          badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
        };
      case 'examination':
        return {
          label: 'Examination',
          icon: FileText,
          badgeBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
        };
      case 'session':
        return {
          label: 'Live Session',
          icon: Radio,
          badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
        };
    }
  };

  const config = getEntityConfig(entityType);
  const IconComponent = config.icon;

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-neutral-100/80 dark:bg-[#1D2330] border border-neutral-200/50 dark:border-white/10 text-xs ${className}`}
      >
        <span className={`inline-flex items-center gap-1 font-mono font-bold tracking-wide text-neutral-900 dark:text-neutral-100`}>
          <IconComponent className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          {code}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          title="Copy identification code"
          className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors cursor-pointer border-0 outline-none"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative p-4 rounded-[20px] bg-white dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Entity Icon & Details */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-[#1D2330] flex items-center justify-center shrink-0 border border-neutral-200/40 dark:border-white/5">
            <IconComponent className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${config.badgeBg}`}>
                {config.label}
              </span>
              {verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-neutral-900 dark:text-[#F3F5FA] truncate mt-1">
              {name}
            </h4>

            {sublabel && (
              <p className="text-xs text-neutral-500 dark:text-[#737D8E] truncate">
                {sublabel}
              </p>
            )}
          </div>
        </div>

        {/* Identification Code Pill with Copy Action */}
        <div className="flex flex-col items-end shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            title="Click to copy ID"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-[#1D2330] hover:bg-neutral-200/70 dark:hover:bg-[#252C3D] border border-neutral-200/50 dark:border-white/10 transition-all active:scale-95 cursor-pointer outline-none"
          >
            <span className="font-mono text-xs font-bold tracking-wider text-neutral-900 dark:text-white">
              {code}
            </span>
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Copy className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {copied && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              Copied to clipboard
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
