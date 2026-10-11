'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Swords, GraduationCap, Library,
  History, BarChart3, StickyNote, User, Search, Menu, X, ShieldAlert, LogOut, Trophy
} from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/components/providers/AuthProvider';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Swords: <Swords className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Library: <Library className="w-5 h-5" />,
  History: <History className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  StickyNote: <StickyNote className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
};

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/practice', label: 'Practice', icon: 'Swords' },
  { href: '/exams', label: 'Exams', icon: 'GraduationCap' },
  { href: '/achievements', label: 'Badges', icon: 'Trophy' },
  { href: '/questions', label: 'Questions', icon: 'Library' },
  { href: '/history', label: 'History', icon: 'History' },
  { href: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { href: '/admin', label: 'Admin', icon: 'ShieldAlert' },
];

const mobileNavItems = [
  { href: '/dashboard', label: 'Home', icon: 'LayoutDashboard' },
  { href: '/practice', label: 'Practice', icon: 'Swords' },
  { href: '/exams', label: 'Exams', icon: 'GraduationCap' },
  { href: '/analytics', label: 'Stats', icon: 'BarChart3' },
  { href: '/profile', label: 'Me', icon: 'User' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();

  // Don't show nav during active exam
  if (pathname?.startsWith('/exam/') && pathname !== '/exams') return null;

  // Get user display info
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'S';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Desktop Navbar */}
      <header className="hidden md:block sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="text-xl font-bold text-gradient-brand">সময়যুদ্ধ</span>
              <span className="text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950 dark:text-brand-400 px-1.5 py-0.5 rounded-md">2.0</span>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300',
                      isActive
                        ? 'bg-purple-500/20 dark:bg-purple-500/25 text-purple-900 dark:text-purple-200 border border-purple-400/40 dark:border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.35)] backdrop-blur-md'
                        : 'text-black dark:text-white hover:text-black dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/10'
                    )}
                  >
                    <span className={cn('transition-colors', isActive ? 'text-purple-700 dark:text-purple-300' : 'text-stone-800 dark:text-white/80')}>
                      {iconMap[item.icon]}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              {isAuthenticated && (
                <button
                  onClick={signOut}
                  className="p-2 rounded-lg text-stone-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
              <Link
                href="/profile"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden"
              >
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={displayName} width={32} height={32} className="w-full h-full object-cover" />
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="p-1.5 rounded-lg text-stone-500" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
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

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-lg">
        <div className="flex items-center justify-around h-14 px-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-0',
                  isActive ? 'text-brand-600' : 'text-stone-400'
                )}
              >
                {item.icon === 'User' ? <User className="w-5 h-5" /> : iconMap[item.icon]}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-card pt-12">
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
                      ? 'bg-purple-500/20 dark:bg-purple-500/25 text-purple-900 dark:text-purple-200 border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                      : 'text-black dark:text-white hover:bg-stone-50 dark:hover:bg-white/10'
                  )}
                >
                  <span className={isActive ? 'text-purple-700 dark:text-purple-300' : 'text-stone-800 dark:text-white/80'}>
                    {iconMap[item.icon]}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
