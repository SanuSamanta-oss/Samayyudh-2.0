'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Swords, GraduationCap, Library,
  History, BarChart3, StickyNote, User, Search, Menu, X, ShieldAlert, LogOut, Trophy,
  Bot, Bell, Settings
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/components/providers/AuthProvider';
import { getSelectedAvatar } from '@/lib/avatars';
import { CurvedTabBar, TabItem } from './CurvedTabBar';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4.5 h-4.5" />,
  Swords: <Swords className="w-4.5 h-4.5" />,
  GraduationCap: <GraduationCap className="w-4.5 h-4.5" />,
  Bot: <Bot className="w-4.5 h-4.5" />,
  Library: <Library className="w-4.5 h-4.5" />,
  History: <History className="w-4.5 h-4.5" />,
  BarChart3: <BarChart3 className="w-4.5 h-4.5" />,
  StickyNote: <StickyNote className="w-4.5 h-4.5" />,
  ShieldAlert: <ShieldAlert className="w-4.5 h-4.5" />,
  Trophy: <Trophy className="w-4.5 h-4.5" />,
  User: <User className="w-4.5 h-4.5" />,
};

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', color: '#7c3aed' },
  { href: '/practice', label: 'Practice', icon: 'Swords', color: '#6366f1' },
  { href: '/exams', label: 'Exams', icon: 'GraduationCap', color: '#8b5cf6' },
  { href: '/achievements', label: 'Badges', icon: 'Trophy', color: '#a855f7' },
  { href: '/questions', label: 'Questions', icon: 'Library', color: '#9333ea' },
  { href: '/history', label: 'History', icon: 'History', color: '#7e22ce' },
  { href: '/analytics', label: 'Stats', icon: 'BarChart3', color: '#6b21a8' },
  { href: '/admin', label: 'Admin', icon: 'ShieldAlert', color: '#581c87' },
];

const mobileNavItems = [
  { href: '/dashboard', label: 'Home', icon: 'LayoutDashboard', color: '#7c3aed' },
  { href: '/practice', label: 'Practice', icon: 'Swords', color: '#6366f1' },
  { href: '/exams', label: 'Exams', icon: 'GraduationCap', color: '#8b5cf6' },
  { href: '/achievements', label: 'Badges', icon: 'Trophy', color: '#a855f7' },
  { href: '/analytics', label: 'Stats', icon: 'BarChart3', color: '#9333ea' },
  { href: '/profile', label: 'Me', icon: 'User', color: '#7c3aed' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();
  const [currentAvatar, setCurrentAvatar] = useState<ReturnType<typeof getSelectedAvatar>>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentAvatar(getSelectedAvatar());

    const handleAvatarChange = () => {
      setCurrentAvatar(getSelectedAvatar());
    };

    window.addEventListener('samayyudh:avatar-change', handleAvatarChange);
    return () => {
      window.removeEventListener('samayyudh:avatar-change', handleAvatarChange);
    };
  }, []);

  // Format tab items for CurvedTabBar
  const desktopTabs: TabItem[] = useMemo(
    () =>
      navItems.map((item) => ({
        href: item.href,
        label: item.label,
        icon: iconMap[item.icon],
        color: item.color,
      })),
    []
  );

  const mobileTabs: TabItem[] = useMemo(
    () =>
      mobileNavItems.map((item) => ({
        href: item.href,
        label: item.label,
        icon: item.icon === 'User' ? <User className="w-5 h-5" /> : iconMap[item.icon],
        color: item.color,
      })),
    []
  );

  // Don't show nav during active exam
  if (pathname?.startsWith('/exam/') && pathname !== '/exams') return null;

  // Get user display info
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'S';
  const avatarUrl = mounted ? (currentAvatar?.src || user?.user_metadata?.avatar_url) : null;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Desktop Navbar with Purrweb UX Animated Curved Tab Bar */}
      <header className="hidden md:block sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-lg overflow-visible">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-15 py-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="text-xl font-bold text-gradient-brand">সময়যুদ্ধ</span>
              <span className="text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950 dark:text-brand-400 px-1.5 py-0.5 rounded-md">2.0</span>
            </Link>

            {/* Exact Purrweb UX Animated Curved Tab Bar for Desktop */}
            <div className="relative flex items-center justify-center">
              <CurvedTabBar items={desktopTabs} pathname={pathname} variant="desktop" />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/settings"
                className="p-2 rounded-lg text-stone-500 hover:text-purple-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Study Alarms & Reminders"
                aria-label="Study Alarms & Reminders"
              >
                <Bell className="w-5 h-5" />
              </Link>
              <button className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              {isAuthenticated && (
                <button
                  onClick={signOut}
                  className="p-2 rounded-lg text-stone-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950/40 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
              <Link
                href="/profile"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden clickable-avatar"
                aria-label="Profile"
              >
                {avatarUrl ? (
                  avatarUrl.startsWith('data:') ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <Image src={avatarUrl} alt={displayName} width={32} height={32} className="w-full h-full object-cover" />
                  )
                ) : (
                  initial
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-lg">
        <div className="flex items-center justify-between h-12 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-gradient-brand">সময়যুদ্ধ</span>
            <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950 dark:text-brand-400 px-1 py-0.5 rounded">2.0</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link
              href="/settings"
              className="p-1.5 rounded-lg text-stone-500 hover:text-purple-600 transition-colors"
              title="Study Reminders & Settings"
              aria-label="Settings"
            >
              <Bell className="w-5 h-5" />
            </Link>
            <button className="p-1.5 rounded-lg text-stone-500" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/profile"
              className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden clickable-avatar"
              aria-label="Profile"
            >
              {avatarUrl ? (
                avatarUrl.startsWith('data:') ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <Image src={avatarUrl} alt={displayName} width={28} height={28} className="w-full h-full object-cover" />
                )
              ) : (
                initial
              )}
            </Link>
            <button
              className="p-1.5 rounded-lg text-stone-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav with Exact Purrweb UX Animated Curved Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 overflow-visible">
        <CurvedTabBar items={mobileTabs} pathname={pathname} variant="mobile" />
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-card pt-12">
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-all',
                    isActive
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-950 dark:text-purple-100 border border-purple-300 dark:border-purple-500/50 shadow-[0_0_14px_rgba(168,85,247,0.3)]'
                      : 'text-stone-950 dark:text-white hover:bg-stone-100 dark:hover:bg-white/10'
                  )}
                >
                  <span className={isActive ? 'text-purple-700 dark:text-purple-300' : 'text-stone-950 dark:text-white'}>
                    {iconMap[item.icon]}
                  </span>
                  <span className={isActive ? 'font-bold text-purple-950 dark:text-purple-100' : 'text-stone-950 dark:text-white'}>{item.label}</span>
                </Link>
              );
            })}

            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-all',
                pathname === '/settings'
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-950 dark:text-purple-100 border border-purple-300 dark:border-purple-500/50 shadow-[0_0_14px_rgba(168,85,247,0.3)]'
                  : 'text-stone-950 dark:text-white hover:bg-stone-100 dark:hover:bg-white/10'
              )}
            >
              <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Reminders & Settings</span>
            </Link>

            {isAuthenticated && (
              <div className="pt-3 mt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
