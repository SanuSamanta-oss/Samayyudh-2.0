'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  BellOff,
  Search,
  Sun,
  Moon,
  Volume2,
  X,
  User as UserIcon,
} from 'lucide-react';
import { getSelectedAvatar, type AvatarDef } from '@/lib/avatars';

interface ReminderTopbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notificationsEnabled: boolean;
  upcomingCount: number;
  onToggleNotifications: () => void;
  onJumpToSound: () => void;
  userName?: string;
}

export function ReminderTopbar({
  searchQuery,
  onSearchChange,
  notificationsEnabled,
  upcomingCount,
  onToggleNotifications,
  onJumpToSound,
  userName,
}: ReminderTopbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [avatar, setAvatar] = useState<AvatarDef | null>(null);

  useEffect(() => {
    const syncState = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
      setAvatar(getSelectedAvatar());
    };
    const timer = window.setTimeout(syncState, 0);

    const handleTheme = (e: Event) => {
      const custom = e as CustomEvent<{ isDark?: boolean }>;
      if (typeof custom.detail?.isDark === 'boolean') {
        setIsDark(custom.detail.isDark);
      }
    };
    const handleAvatar = () => setAvatar(getSelectedAvatar());

    window.addEventListener('samayyudh:theme-change', handleTheme);
    window.addEventListener('samayyudh:avatar-change', handleAvatar);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('samayyudh:theme-change', handleTheme);
      window.removeEventListener('samayyudh:avatar-change', handleAvatar);
    };
  }, []);

  const handleThemeToggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new CustomEvent('samayyudh:theme-change', { detail: { isDark: next } }));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#FFFFFF] dark:bg-[#181822] px-4 py-2.5 shadow-[0_2px_8px_rgba(30,25,60,0.035)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.28)]">
      {/* Left: Subtle Context Path */}
      <div className="flex items-center gap-2 text-[13px] min-w-0">
        <Link
          href="/dashboard"
          className="font-medium text-[#77758A] dark:text-[#B0ADBF] hover:text-[#25233A] dark:hover:text-[#F5F3FF] transition-colors truncate"
        >
          SamayYudh
        </Link>
        <span className="text-[#A19EB1] dark:text-[#858195]" aria-hidden="true">
          /
        </span>
        <span className="font-semibold text-[#25233A] dark:text-[#F5F3FF] truncate">
          Reminders
        </span>
      </div>

      {/* Right: Search & Quick Utility Controls */}
      <div className="flex items-center gap-2 flex-1 sm:flex-initial sm:justify-end">
        {/* Live Search Input */}
        <div className="relative flex-1 sm:w-60 md:w-72">
          <Search className="w-3.5 h-3.5 text-[#A19EB1] dark:text-[#858195] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reminders or time..."
            aria-label="Search reminders"
            className="w-full h-9 pl-8 pr-8 rounded-xl bg-[#F0EDF8] dark:bg-[#20202C] text-[13px] text-[#25233A] dark:text-[#F5F3FF] placeholder:text-[#A19EB1] dark:placeholder:text-[#858195] focus:outline-none focus:ring-2 focus:ring-[#7667C8]/40 dark:focus:ring-[#8D7BE0]/40 transition-shadow"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#77758A] hover:text-[#25233A] dark:hover:text-[#F5F3FF]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Notification Status Button */}
        <button
          type="button"
          onClick={onToggleNotifications}
          title={notificationsEnabled ? 'Pause all reminders' : 'Enable all reminders'}
          aria-label={notificationsEnabled ? 'Reminders active' : 'Reminders paused'}
          className={`relative h-9 px-2.5 rounded-xl inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/40 ${
            notificationsEnabled
              ? 'bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0]'
              : 'bg-[#F0EDF8] dark:bg-[#20202C] text-[#77758A] dark:text-[#B0ADBF]'
          }`}
        >
          {notificationsEnabled ? (
            <Bell className="w-4 h-4" />
          ) : (
            <BellOff className="w-4 h-4" />
          )}
          {upcomingCount > 0 && notificationsEnabled && (
            <span className="hidden md:inline text-[11px] font-semibold tabular-nums">
              {upcomingCount}
            </span>
          )}
        </button>

        {/* Jump to Sound Settings */}
        <button
          type="button"
          onClick={onJumpToSound}
          title="Sound & Notification Settings"
          aria-label="Jump to Sound & Notification Settings"
          className="h-9 w-9 rounded-xl bg-[#F0EDF8] dark:bg-[#20202C] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] text-[#77758A] dark:text-[#B0ADBF] hover:text-[#25233A] dark:hover:text-[#F5F3FF] inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/40"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {/* Quick Theme Switch */}
        <button
          type="button"
          onClick={handleThemeToggle}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="h-9 w-9 rounded-xl bg-[#F0EDF8] dark:bg-[#20202C] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] text-[#77758A] dark:text-[#B0ADBF] hover:text-[#25233A] dark:hover:text-[#F5F3FF] inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/40"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Profile Avatar Shortcut */}
        <Link
          href="/profile"
          title={userName ? `Profile (${userName})` : 'Profile'}
          aria-label="Open profile"
          className="h-9 w-9 rounded-xl overflow-hidden bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0] inline-flex items-center justify-center shrink-0 transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/40"
        >
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar.src}
              alt={avatar.label}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-4 h-4" />
          )}
        </Link>
      </div>
    </div>
  );
}
