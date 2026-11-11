'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Bell,
  Upload,
  Menu,
  Copy,
  Check,
  ExternalLink,
  CheckCheck,
  Shield,
} from 'lucide-react';
import type { AdminSectionId, CommandNotification, CommandRole } from '@/types/admin';

interface CommandTopbarProps {
  activeSection: AdminSectionId;
  role: CommandRole;
  publicId: string | null;
  notifications: CommandNotification[];
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onQuickUpload: () => void;
  onMarkNotificationsRead: () => void;
  onNavigate: (section: AdminSectionId) => void;
}

const SECTION_TITLES: Record<AdminSectionId, string> = {
  overview: 'Command Overview',
  questions: 'Question Bank Management',
  resources: 'Resource Library & PDF Studio',
  assignments: 'Assignments & Assessments',
  classrooms: 'Classrooms & Private Groups',
  students: 'Student & Faculty Directory',
  connections: 'Connections & Discovery',
  analytics: 'Performance & Bank Analytics',
  notifications: 'Notifications Center',
  settings: 'Security & System Settings',
};

export function CommandTopbar({
  activeSection,
  role,
  publicId,
  notifications,
  onOpenMobileMenu,
  onOpenSearch,
  onQuickUpload,
  onMarkNotificationsRead,
  onNavigate,
}: CommandTopbarProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifContainerRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    if (!notifOpen) return;
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (target && notifContainerRef.current?.contains(target)) return;
      setNotifOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotifOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notifOpen]);

  function copyPublicId() {
    if (!publicId) return;
    navigator.clipboard?.writeText(publicId).catch(() => undefined);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1800);
  }

  return (
    <header className="w-full rounded-3xl bg-white/85 dark:bg-[#111A2E]/90 backdrop-blur-xl px-4 sm:px-6 py-3.5 shadow-[0_8px_30px_-8px_rgba(88,28,135,0.06)] dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)] flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open command menu"
          className="md:hidden p-2 rounded-2xl bg-stone-100/90 dark:bg-[#162032] text-slate-700 dark:text-slate-200 hover:bg-[#EAE6F5] dark:hover:bg-[#231B3E] transition-colors outline-none focus:outline-none cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white truncate">
              {SECTION_TITLES[activeSection]}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAE6F5] text-[#6D28D9] dark:bg-[#231B3E] dark:text-[#C4B5FD] capitalize">
              <Shield className="w-3 h-3" />
              {role.replace('_', ' ')}
            </span>
          </div>
          {publicId && (
            <button
              type="button"
              onClick={copyPublicId}
              className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-[#6D28D9] dark:hover:text-[#C4B5FD] transition-colors outline-none focus:outline-none cursor-pointer"
            >
              <span>ID: {publicId}</span>
              {copiedId ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Right Action Cluster */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-stone-100/90 dark:bg-[#162032] hover:bg-[#EAE6F5] dark:hover:bg-[#1E2A45] text-xs sm:text-sm text-slate-600 dark:text-slate-300 transition-colors outline-none focus:outline-none cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="hidden md:inline">Global Search...</span>
          <kbd className="hidden md:inline-flex px-1.5 py-0.5 rounded-md bg-white/80 dark:bg-[#0B1120] text-[10px] font-mono text-slate-500">
            Ctrl K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onQuickUpload}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#6C63FF] via-[#635BFF] to-[#564AE6] hover:brightness-105 text-white text-xs sm:text-sm font-medium transition-all shadow-[0_6px_18px_-4px_rgba(99,91,255,0.45)] outline-none focus:outline-none cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Resource</span>
        </button>

        {/* Notifications Dropdown */}
        <div ref={notifContainerRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative p-2.5 rounded-2xl bg-stone-100/90 dark:bg-[#162032] hover:bg-[#EAE6F5] dark:hover:bg-[#1E2A45] text-slate-700 dark:text-slate-200 transition-colors outline-none focus:outline-none cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#6D28D9] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 460, damping: 32, mass: 0.7 }}
                className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-5.5rem))] rounded-3xl bg-white/95 dark:bg-[#131D33]/98 backdrop-blur-2xl p-4 shadow-[0_22px_54px_-10px_rgba(15,23,42,0.22)] dark:shadow-[0_26px_64px_-10px_rgba(0,0,0,0.75)] z-50 origin-top-right"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        onMarkNotificationsRead();
                        setNotifOpen(false);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#6D28D9] dark:text-[#C4B5FD] hover:underline outline-none focus:outline-none cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    No recent alerts yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.slice(0, 8).map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          if (n.category === 'connection_request' || n.category === 'connection_accepted') {
                            onNavigate('connections');
                          } else if (n.category === 'classroom_invite') {
                            onNavigate('classrooms');
                          }
                          setNotifOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-2xl transition-colors outline-none focus:outline-none cursor-pointer ${
                          n.is_read
                            ? 'bg-stone-50 dark:bg-[#111A2E]/60 text-slate-600 dark:text-slate-400'
                            : 'bg-[#EAE6F5]/70 dark:bg-[#231B3E]/70 text-slate-900 dark:text-white'
                        }`}
                      >
                        <p className="text-xs font-semibold">{n.title}</p>
                        {n.body && (
                          <p className="text-[11px] opacity-80 mt-0.5 line-clamp-2">{n.body}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link
          href="/dashboard"
          title="Open Student Workspace"
          className="hidden sm:inline-flex p-2.5 rounded-2xl bg-stone-100/90 dark:bg-[#162032] hover:bg-[#EAE6F5] dark:hover:bg-[#1E2A45] text-slate-600 dark:text-slate-300 transition-colors outline-none focus:outline-none"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
