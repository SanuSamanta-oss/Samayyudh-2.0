'use client';

import Link from 'next/link';
import {
  Bell,
  LayoutDashboard,
  Swords,
  GraduationCap,
  BarChart3,
  BookOpen,
  Trophy,
  User,
  Volume2,
  CalendarClock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export type ReminderFocusView = 'all' | 'today' | 'upcoming' | 'completed';

interface ReminderSidebarProps {
  activeView: ReminderFocusView;
  onSelectView: (view: ReminderFocusView) => void;
  totalActiveCount: number;
  completedTodayCount: number;
  upcomingCount: number;
  notificationsActive: boolean;
  soundEnabled: boolean;
  onJumpToSound: () => void;
}

const APP_NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: false },
  { href: '/practice', label: 'Practice & Battles', icon: Swords, active: false },
  { href: '/exams', label: 'Exams', icon: GraduationCap, active: false },
  { href: '/settings', label: 'Reminders', icon: Bell, active: true },
  { href: '/analytics', label: 'Progress', icon: BarChart3, active: false },
  { href: '/pyq', label: 'Explore PYQ', icon: BookOpen, active: false },
  { href: '/achievements', label: 'Badges', icon: Trophy, active: false },
  { href: '/profile', label: 'Profile', icon: User, active: false },
] as const;

export function ReminderSidebar({
  activeView,
  onSelectView,
  totalActiveCount,
  completedTodayCount,
  upcomingCount,
  notificationsActive,
  soundEnabled,
  onJumpToSound,
}: ReminderSidebarProps) {
  const focusViews: Array<{
    id: ReminderFocusView;
    label: string;
    count?: number;
    icon: typeof CalendarClock;
  }> = [
    { id: 'all', label: 'All Scheduled', count: totalActiveCount, icon: CalendarClock },
    { id: 'today', label: 'Today Focus', icon: Sparkles },
    { id: 'upcoming', label: 'Upcoming', count: upcomingCount, icon: Bell },
    { id: 'completed', label: 'Completed', count: completedTodayCount, icon: CheckCircle2 },
  ];

  return (
    <aside
      aria-label="Productivity navigation"
      className="hidden lg:flex lg:flex-col lg:w-[236px] xl:w-[244px] shrink-0 sticky top-6 self-start rounded-2xl bg-[#FFFFFF] dark:bg-[#181822] p-4 shadow-[0_8px_24px_rgba(30,25,60,0.055)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.36)]"
    >
      {/* Workspace Heading */}
      <div className="px-2.5 pt-1 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0] flex items-center justify-center shrink-0">
            <CalendarClock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold tracking-tight text-[#25233A] dark:text-[#F5F3FF] truncate">
              Productivity Hub
            </p>
            <p className="text-[11px] font-medium text-[#77758A] dark:text-[#B0ADBF] truncate">
              Study &amp; Alarms
            </p>
          </div>
        </div>
      </div>

      {/* Primary Workspace Navigation */}
      <div className="space-y-0.5">
        <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#A19EB1] dark:text-[#858195]">
          Workspace
        </p>
        {APP_NAV_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/40 dark:focus-visible:ring-[#8D7BE0]/40 ${
                item.active
                  ? 'bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0] font-semibold'
                  : 'text-[#77758A] dark:text-[#B0ADBF] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] hover:text-[#25233A] dark:hover:text-[#F5F3FF]'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </span>
              {item.active && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#7667C8] dark:bg-[#8D7BE0] shrink-0" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Reminder View Filters */}
      <div className="mt-5 pt-4 bg-[#F6F4FB]/80 dark:bg-[#20202C]/70 rounded-xl p-2 space-y-0.5">
        <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#A19EB1] dark:text-[#858195]">
          Views
        </p>
        {focusViews.map((view) => {
          const Icon = view.icon;
          const isSelected = activeView === view.id;
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onSelectView(view.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/40 dark:focus-visible:ring-[#8D7BE0]/40 ${
                isSelected
                  ? 'bg-[#FFFFFF] dark:bg-[#181822] text-[#7667C8] dark:text-[#8D7BE0] font-semibold shadow-[0_2px_8px_rgba(30,25,60,0.035)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.28)]'
                  : 'text-[#77758A] dark:text-[#B0ADBF] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] hover:text-[#25233A] dark:hover:text-[#F5F3FF]'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{view.label}</span>
              </span>
              {typeof view.count === 'number' && (
                <span
                  className={`text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0]'
                      : 'text-[#A19EB1] dark:text-[#858195]'
                  }`}
                >
                  {view.count}
                </span>
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={onJumpToSound}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-[#77758A] dark:text-[#B0ADBF] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] hover:text-[#25233A] dark:hover:text-[#F5F3FF] transition-colors duration-150"
        >
          <span className="flex items-center gap-2 truncate">
            <Volume2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Alarm Tone</span>
          </span>
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
              soundEnabled
                ? 'bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0]'
                : 'text-[#A19EB1] dark:text-[#858195]'
            }`}
          >
            {soundEnabled ? 'On' : 'Muted'}
          </span>
        </button>
      </div>

      {/* Bottom Engine Status */}
      <div className="mt-4 px-2.5 py-2.5 rounded-xl bg-[#F0EDF8] dark:bg-[#20202C] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              notificationsActive ? 'bg-emerald-500' : 'bg-[#A19EB1] dark:bg-[#858195]'
            }`}
          />
          <span className="text-[11px] font-medium text-[#25233A] dark:text-[#F5F3FF] truncate">
            {notificationsActive ? 'Alerts Active' : 'Alerts Local'}
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#77758A] dark:text-[#B0ADBF]">
          24/7
        </span>
      </div>
    </aside>
  );
}

