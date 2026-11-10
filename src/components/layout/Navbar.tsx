'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Swords, GraduationCap,
  History, BarChart3, User, Search, Menu, X, ShieldAlert, LogOut, Trophy,
  Bell, BookOpen
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/components/providers/AuthProvider';
import { getSelectedAvatar } from '@/lib/avatars';
import { LightNavBar, LightNavItem } from './LightNavBar';
import { FormulaGraphIcon } from '@/components/icons/FormulaGraphIcon';
import { isAndroidApp } from '@/lib/platform';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4.5 h-4.5 sm:w-5 sm:h-5" />,
  Swords: <Swords className="w-4.5 h-4.5 sm:w-5 sm:h-5" />,
  GraduationCap: <GraduationCap className="w-4.5 h-4.5 sm:w-5 sm:h-5" />,
  BookOpen: <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5" />,
  FormulaGraph: <FormulaGraphIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />,
  History: <History className="w-4.5 h-4.5 sm:w-5 sm:h-5" />,
  BarChart3: <BarChart3 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />,
  ShieldAlert: <ShieldAlert className="w-4.5 h-4.5 sm:w-5 sm:h-5" />,
  Trophy: <Trophy className="w-4.5 h-4.5 sm:w-5 sm:h-5" />,
  User: <User className="w-4.5 h-4.5 sm:w-5 sm:h-5" />,
};

// Desktop: 9 destinations with authentic SamayYudh palette
const desktopNavItemsRaw = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', color: '#9333ea' },
  { href: '/practice', label: 'Practice', icon: 'Swords', color: '#7c3aed' },
  { href: '/exams', label: 'Exams', icon: 'GraduationCap', color: '#6366f1' },
  { href: '/pyq', label: 'Explore PYQ', icon: 'BookOpen', color: '#0ea5e9' },
  { href: '/formulas', label: 'Formulas', icon: 'FormulaGraph', color: '#0284c7' },
  { href: '/achievements', label: 'Badges', icon: 'Trophy', color: '#a855f7' },
  { href: '/history', label: 'History', icon: 'History', color: '#7e22ce' },
  { href: '/analytics', label: 'Analytics', icon: 'BarChart3', color: '#6b21a8' },
  { href: '/admin', label: 'Admin', icon: 'ShieldAlert', color: '#581c87' },
];

// Android & Mobile PWA: Exactly 7 required destinations
const mobileNavItemsRaw = [
  { href: '/dashboard', label: 'Home', icon: 'LayoutDashboard', color: '#7c3aed' },
  { href: '/practice', label: 'Practice', icon: 'Swords', color: '#6366f1' },
  { href: '/exams', label: 'Exams', icon: 'GraduationCap', color: '#8b5cf6' },
  { href: '/formulas', label: 'Formulas', icon: 'FormulaGraph', color: '#0284c7' },
  { href: '/achievements', label: 'Badges', icon: 'Trophy', color: '#a855f7' },
  { href: '/analytics', label: 'Stats', icon: 'BarChart3', color: '#9333ea' },
  { href: '/profile', label: 'Me', icon: 'User', color: '#7c3aed' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();
  const [currentAvatar, setCurrentAvatar] = useState<ReturnType<typeof getSelectedAvatar>>(null);

  useEffect(() => {
    setMounted(true);
    setIsAndroid(isAndroidApp());
    setCurrentAvatar(getSelectedAvatar());

    const handleAvatarChange = () => {
      setCurrentAvatar(getSelectedAvatar());
    };

    window.addEventListener('samayyudh:avatar-change', handleAvatarChange);
    return () => {
      window.removeEventListener('samayyudh:avatar-change', handleAvatarChange);
    };
  }, []);

  // Format desktop items for LightNavBar
  const desktopStockItems: LightNavItem[] = useMemo(
    () =>
      desktopNavItemsRaw.map((item) => ({
        href: item.href,
        label: item.label,
        icon: iconMap[item.icon],
        color: item.color,
      })),
    []
  );

  // Format mobile items (7 destinations) for LightNavBar
  const mobileStockItems: LightNavItem[] = useMemo(
    () =>
      mobileNavItemsRaw.map((item) => ({
        href: item.href,
        label: item.label,
        icon: iconMap[item.icon],
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
      {/* Desktop Header with Premium Animated Navigation */}
      <header
        className={cn(
          'sticky top-0 z-30 border-b border-stone-200/60 dark:border-white/[0.06] bg-card/90 backdrop-blur-xl',
          isAndroid ? 'hidden' : 'hidden md:block'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-[70px]">
            {/* Left: Brand Identity with dedicated anchor width */}
            <div className="flex items-center gap-3 shrink-0 min-w-[200px]">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-black border border-stone-200/80 dark:border-stone-800 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Image src="/samayyudh-logo.png" alt="সময়যুদ্ধ 2.0 Logo" width={32} height={32} className="w-full h-full object-cover" priority />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-gradient-brand">সময়যুদ্ধ</span>
                  <span className="text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950 dark:text-brand-400 px-1.5 py-0.5 rounded-md">2.0</span>
                </div>
              </Link>
            </div>

            {/* Center: Light Nav Bar Animation (Cleanly centered & balanced) */}
            <div className="flex-1 flex items-center justify-center px-4">
              <LightNavBar
                items={desktopStockItems}
                pathname={pathname}
                variant="desktop"
              />
            </div>

            {/* Right: Actions with refined pill buttons and generous spacing */}
            <div className="flex items-center justify-end gap-3.5 shrink-0 min-w-[200px]">
              <ThemeToggle />
              <Link
                href="/settings"
                className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-stone-200/60 dark:hover:border-white/10"
                title="Study Alarms & Reminders"
                aria-label="Study Alarms & Reminders"
              >
                <Bell className="w-4.5 h-4.5" />
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 py-1 pl-1 pr-3 rounded-full hover:bg-stone-100 dark:hover:bg-white/5 transition-colors border border-stone-200/70 dark:border-white/10 hover:border-brand-500/40"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden clickable-avatar">
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
                    </div>
                    <span className="text-xs font-semibold text-foreground max-w-[100px] truncate">
                      {displayName}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-brand hover:opacity-95 shadow-sm transition-all"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile / Android App Top Header */}
      <header
        className={cn(
          'sticky top-0 z-30 border-b border-border/40 bg-card/90 backdrop-blur-lg',
          isAndroid ? 'block' : 'md:hidden'
        )}
      >
        <div className="flex items-center justify-between h-12 px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-black border border-border shadow-xs flex items-center justify-center shrink-0">
              <Image src="/samayyudh-logo.png" alt="সময়যুদ্ধ 2.0 Logo" width={28} height={28} className="w-full h-full object-cover" priority />
            </div>
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

      {/* Mobile / Android App Docked Bottom Navigation Bar */}
      <div
        className={cn(
          'fixed bottom-0 inset-x-0 z-40 w-full',
          isAndroid ? 'block' : 'md:hidden'
        )}
      >
        <LightNavBar
          items={mobileStockItems}
          pathname={pathname}
          variant="mobile"
        />
      </div>

      {/* Mobile / Android App Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className={cn('fixed inset-0 z-50 bg-card pt-12', isAndroid ? 'block' : 'md:hidden')}>
          <nav className="p-4 space-y-1.5">
            {desktopNavItemsRaw.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-all',
                    isActive
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-950 dark:text-purple-100'
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
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-950 dark:text-purple-100'
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
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
