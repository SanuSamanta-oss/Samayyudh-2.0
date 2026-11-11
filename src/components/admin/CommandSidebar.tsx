'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileQuestion,
  FolderOpen,
  ClipboardCheck,
  GraduationCap,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  ShieldCheck,
} from 'lucide-react';
import type { AdminSectionId, CommandRole } from '@/types/admin';

export interface NavItemConfig {
  id: AdminSectionId;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

interface CommandSidebarProps {
  activeSection: AdminSectionId;
  onSelectSection: (section: AdminSectionId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onOpenMobile: () => void;
  onCloseMobile: () => void;
  onLockSession: () => void;
  pendingRequestsCount: number;
  role: CommandRole;
  fullName: string | null;
}

function TopWaveCap({ compactHeight = false }: { compactHeight?: boolean }) {
  return (
    <div
      className={`w-full overflow-hidden pointer-events-none select-none shrink-0 -mb-px ${
        compactHeight ? 'h-8' : 'h-14'
      }`}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className="w-full h-full block dark:hidden"
        aria-hidden="true"
      >
        <path
          d="M 0 0 C 4 42, 98 28, 100 100 L 0 100 Z"
          fill="#6C63FF"
        />
      </svg>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className="w-full h-full hidden dark:block"
        aria-hidden="true"
      >
        <path
          d="M 0 0 C 4 42, 98 28, 100 100 L 0 100 Z"
          fill="#3B2A82"
        />
      </svg>
    </div>
  );
}

function BottomWaveCap({ compactHeight = false }: { compactHeight?: boolean }) {
  return (
    <div
      className={`w-full overflow-hidden pointer-events-none select-none shrink-0 -mt-px ${
        compactHeight ? 'h-8' : 'h-14'
      }`}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className="w-full h-full block dark:hidden"
        aria-hidden="true"
      >
        <path
          d="M 0 0 L 100 0 C 98 72, 4 58, 0 100 Z"
          fill="#564AE6"
        />
      </svg>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className="w-full h-full hidden dark:block"
        aria-hidden="true"
      >
        <path
          d="M 0 0 L 100 0 C 98 72, 4 58, 0 100 Z"
          fill="#27195B"
        />
      </svg>
    </div>
  );
}

export function CommandSidebar({
  activeSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onOpenMobile,
  onCloseMobile,
  onLockSession,
  pendingRequestsCount,
  role,
  fullName,
}: CommandSidebarProps) {
  const navItems: NavItemConfig[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'questions', label: 'Question Bank', icon: FileQuestion },
    { id: 'resources', label: 'Resource Library', icon: FolderOpen },
    { id: 'assignments', label: 'Assignments', icon: ClipboardCheck },
    { id: 'classrooms', label: 'Classrooms & Groups', icon: GraduationCap },
    { id: 'students', label: 'Student Directory', icon: UserCheck },
    {
      id: 'connections',
      label: 'Connections',
      icon: Users,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderPanelContent = (
    mode: 'desktop' | 'mobile-drawer' | 'mobile-rail'
  ) => {
    const isCompact =
      mode === 'mobile-rail' || (mode === 'desktop' && collapsed);
    const pillLayoutId =
      mode === 'mobile-drawer'
        ? 'cmd-nav-pill-drawer'
        : mode === 'mobile-rail'
        ? 'cmd-nav-pill-rail'
        : 'cmd-nav-pill-desktop';

    return (
      <div
        className={`flex flex-col justify-between h-full select-none ${
          mode === 'mobile-rail' ? 'px-1.5 py-1' : 'px-3 py-1.5'
        }`}
      >
        <div>
          {/* Console Brand Header + Mode Toggle */}
          <div
            className={`flex items-center mb-3 ${
              isCompact ? 'justify-center' : 'justify-between px-1.5'
            }`}
          >
            {!isCompact && (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-white/18 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold tracking-tight text-white truncate">
                    SamayYudh
                  </p>
                  <p className="text-[11px] font-medium text-white/80 truncate capitalize">
                    {role.replace('_', ' ')} Console
                  </p>
                </div>
              </div>
            )}

            {mode === 'mobile-drawer' ? (
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors outline-none focus:outline-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            ) : mode === 'mobile-rail' ? (
              <button
                type="button"
                onClick={onOpenMobile}
                aria-label="Expand console labels"
                title="Open labeled menu"
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors outline-none focus:outline-none cursor-pointer"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={collapsed ? 'Expand console panel' : 'Compact console panel'}
                title={collapsed ? 'Expand labels' : 'Compact dock'}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors outline-none focus:outline-none cursor-pointer"
              >
                {collapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Vertical Dock Items */}
          <nav className="space-y-1" aria-label="Command Center Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(item.id);
                    if (mode === 'mobile-drawer') onCloseMobile();
                  }}
                  aria-current={active ? 'page' : undefined}
                  aria-label={item.label}
                  className={`group relative w-full flex items-center ${
                    isCompact
                      ? mode === 'mobile-rail'
                        ? 'justify-center py-2'
                        : 'justify-center px-0 py-2.5'
                      : 'gap-3 px-3 py-2'
                  } rounded-2xl text-[13px] transition-colors cursor-pointer outline-none focus:outline-none focus-visible:outline-none ${
                    active
                      ? 'text-[#564AE6] dark:text-[#31216E] font-semibold'
                      : 'text-white/85 hover:text-white font-medium hover:bg-white/12'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId={pillLayoutId}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-2xl bg-white dark:bg-[#F5F3FF] shadow-[0_8px_20px_-4px_rgba(24,18,75,0.28)]"
                    />
                  )}

                  <span className="relative z-10 flex items-center justify-center shrink-0">
                    <Icon
                      className={
                        mode === 'mobile-rail' ? 'w-[17px] h-[17px]' : 'w-[18px] h-[18px]'
                      }
                    />
                    {isCompact && item.badge && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 shadow-xs" />
                    )}
                  </span>

                  {!isCompact && (
                    <span className="relative z-10 truncate flex-1 text-left">
                      {item.label}
                    </span>
                  )}

                  {!isCompact && item.badge && (
                    <span
                      className={`relative z-10 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        active
                          ? 'bg-[#635BFF] text-white dark:bg-[#3B2A82]'
                          : 'bg-emerald-400 text-emerald-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Smooth Hover Flyout Label when Desktop Dock is Compact */}
                  {mode === 'desktop' && isCompact && (
                    <span className="pointer-events-none absolute left-full ml-3.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-[#1E293B] text-white text-xs font-medium whitespace-nowrap opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 shadow-lg z-40">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Identity + Lock Control */}
        <div className={mode === 'mobile-rail' ? 'pt-2 mt-2' : 'pt-3 mt-2 space-y-2'}>
          {!isCompact && (
            <div className="px-3 py-2.5 rounded-2xl bg-white/12 backdrop-blur-xs">
              <p className="text-xs font-semibold text-white truncate">
                {fullName || 'Faculty Account'}
              </p>
              <p className="text-[11px] text-white/75 mt-0.5">
                Command Session Active
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onLockSession}
            title={isCompact ? 'Lock Command Center' : undefined}
            aria-label="Lock Console"
            className={`group relative w-full flex items-center ${
              isCompact ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2'
            } rounded-2xl text-[13px] font-medium text-white/90 hover:text-white hover:bg-rose-500/25 transition-colors outline-none focus:outline-none cursor-pointer`}
          >
            <Lock
              className={
                mode === 'mobile-rail' ? 'w-[17px] h-[17px] shrink-0' : 'w-[18px] h-[18px] shrink-0'
              }
            />
            {!isCompact && <span>Lock Console</span>}
            {mode === 'desktop' && isCompact && (
              <span className="pointer-events-none absolute left-full ml-3.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-[#1E293B] text-white text-xs font-medium whitespace-nowrap opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 shadow-lg z-40">
                Lock Console
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop & Tablet FIXED Sculpted Vertical Console Panel (stays strictly below 70px Navbar) */}
      <div className="hidden md:flex fixed left-0 top-[78px] bottom-4 z-30 pointer-events-none items-center">
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 80 : 244 }}
          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
          className="pointer-events-auto flex flex-col max-h-full drop-shadow-[8px_16px_38px_rgba(99,91,255,0.28)] dark:drop-shadow-[10px_18px_42px_rgba(0,0,0,0.65)]"
        >
          <TopWaveCap />
          <div
            className={`min-h-0 flex-1 bg-gradient-to-b from-[#6C63FF] via-[#635BFF] to-[#564AE6] dark:from-[#3B2A82] dark:via-[#31216E] dark:to-[#27195B] ${
              collapsed
                ? 'overflow-visible'
                : 'overflow-y-auto overflow-x-hidden no-scrollbar'
            }`}
          >
            {renderPanelContent('desktop')}
          </div>
          <BottomWaveCap />
        </motion.aside>
      </div>

      {/* Mobile & Android App FIXED Still Vertical Rail (centered strictly between top 48px bar and bottom dock) */}
      <div className="md:hidden fixed left-0 top-[56px] bottom-[74px] z-30 pointer-events-none flex items-center">
        <aside className="pointer-events-auto w-[54px] flex flex-col max-h-full drop-shadow-[6px_12px_28px_rgba(99,91,255,0.3)] dark:drop-shadow-[8px_14px_32px_rgba(0,0,0,0.65)]">
          <TopWaveCap compactHeight />
          <div className="min-h-0 flex-1 bg-gradient-to-b from-[#6C63FF] via-[#635BFF] to-[#564AE6] dark:from-[#3B2A82] dark:via-[#31216E] dark:to-[#27195B] overflow-y-auto no-scrollbar">
            {renderPanelContent('mobile-rail')}
          </div>
          <BottomWaveCap compactHeight />
        </aside>
      </div>

      {/* Mobile / App Expanded Slide-Over Drawer (full labeled text view on tap) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: -290 }}
              animate={{ x: 0 }}
              exit={{ x: -290 }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              className="relative z-10 w-[264px] h-full flex flex-col justify-center py-6"
            >
              <div className="flex flex-col max-h-full drop-shadow-[12px_20px_45px_rgba(67,56,202,0.4)]">
                <TopWaveCap />
                <div className="min-h-0 flex-1 bg-gradient-to-b from-[#6C63FF] via-[#635BFF] to-[#564AE6] dark:from-[#3B2A82] dark:via-[#31216E] dark:to-[#27195B] overflow-y-auto no-scrollbar py-1">
                  {renderPanelContent('mobile-drawer')}
                </div>
                <BottomWaveCap />
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
