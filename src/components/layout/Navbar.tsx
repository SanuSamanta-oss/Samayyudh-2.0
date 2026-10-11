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
import { motion } from 'framer-motion';
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

            {/* Nav Links with Goo Bubble Indicator */}
            <nav className="relative flex items-center p-1 rounded-full bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200/60 dark:border-white/10 backdrop-blur-md">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 select-none',
                      isActive
                        ? 'text-white'
                        : 'text-stone-600 dark:text-stone-300 hover:text-purple-600 dark:hover:text-purple-300'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeBubblePill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-brand-600 to-indigo-600 shadow-[0_0_18px_rgba(147,51,234,0.55),0_2px_8px_rgba(0,0,0,0.15)] border border-purple-400/40"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      >
                        {/* Floating ambient glow bubble */}
                        <div className="absolute -inset-1 rounded-full bg-purple-500/25 blur-sm -z-10" />
                        <div className="absolute top-0 left-1/4 right-1/4 h-1/2 bg-white/25 rounded-full blur-[1px]" />
                      </motion.div>
                    )}
                    <span
                      className={cn(
                        'relative z-10 transition-transform duration-200',
                        isActive ? 'text-white scale-110 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]' : ''
                      )}
                    >
                      {iconMap[item.icon]}
                    </span>
                    <span
                      className={cn(
                        'relative z-10 font-bold',
                        isActive ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]' : ''
                      )}
                    >
                      {item.label}
                    </span>
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
        <div className="flex items-center justify-around h-14 px-2 relative">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-colors min-w-0 z-10',
                  isActive ? 'text-white font-bold' : 'text-stone-500 dark:text-stone-400'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMobileBubble"
                    className="absolute inset-0 -top-1.5 -bottom-1 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-[0_4px_14px_rgba(147,51,234,0.45)] -z-10"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  >
                    <div className="absolute top-0 inset-x-2 h-1 bg-white/40 rounded-full blur-[0.5px]" />
                  </motion.div>
                )}
                <span className={cn('transition-transform duration-200', isActive ? 'scale-110 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]' : '')}>
                  {item.icon === 'User' ? <User className="w-5 h-5" /> : iconMap[item.icon]}
                </span>
                <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
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
          </nav>
        </div>
      )}
    </>
  );
}
