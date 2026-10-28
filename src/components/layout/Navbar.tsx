'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Swords, GraduationCap, Library,
  History, BarChart3, StickyNote, User, Search, Menu, X, ShieldAlert, LogOut, Trophy,
  Bot, Bell, Settings, BookOpen
} from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/components/providers/AuthProvider';
import { getSelectedAvatar } from '@/lib/avatars';
import { CurvedTabBar, TabItem } from './CurvedTabBar';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Swords: <Swords className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Bot: <Bot className="w-5 h-5" />,
  Library: <Library className="w-5 h-5" />,
  History: <History className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  StickyNote: <StickyNote className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
};

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', color: '#9333ea' },
  { href: '/practice', label: 'Practice', icon: 'Swords', color: '#7c3aed' },
  { href: '/exams', label: 'Exams', icon: 'GraduationCap', color: '#6366f1' },
  { href: '/formulas', label: 'Formulas', icon: 'BookOpen', color: '#0284c7' },
  { href: '/achievements', label: 'Badges', icon: 'Trophy', color: '#a855f7' },
  { href: '/questions', label: 'Questions', icon: 'Library', color: '#8b5cf6' },
  { href: '/history', label: 'History', icon: 'History', color: '#7e22ce' },
  { href: '/analytics', label: 'Analytics', icon: 'BarChart3', color: '#6b21a8' },
  { href: '/admin', label: 'Admin', icon: 'ShieldAlert', color: '#581c87' },
];

const mobileNavItems = [
  { href: '/dashboard', label: 'Home', icon: 'LayoutDashboard', color: '#7c3aed' },
  { href: '/practice', label: 'Practice', icon: 'Swords', color: '#6366f1' },
  { href: '/exams', label: 'Exams', icon: 'GraduationCap', color: '#8b5cf6' },
  { href: '/formulas', label: 'Formulas', icon: 'BookOpen', color: '#0284c7' },
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

  // Desktop navigation track and bubble animation refs (previous desktop animation)
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const bgBubbleRef = useRef<HTMLDivElement>(null);
  const activeBubbleRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef<number>(0);

  // Determine active nav index for desktop
  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href)))
  );

  // Animate previous desktop gooey fluid bubble to active tab
  useEffect(() => {
    const targetElement = itemRefs.current[activeIndex];
    const navContainer = navRef.current;
    if (!targetElement || !navContainer || !bgBubbleRef.current || !activeBubbleRef.current) return;

    const navRect = navContainer.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const centerX = targetRect.left - navRect.left + targetRect.width / 2;

    const activeItem = navItems[activeIndex];
    const bubbleColor = activeItem.color;

    const tl = gsap.timeline();

    if (prevIndexRef.current === activeIndex) {
      // Initial positioning - droplet hangs downwards below navbar
      gsap.set(bgBubbleRef.current, { left: centerX, bottom: -18, backgroundColor: bubbleColor });
      gsap.set(activeBubbleRef.current, { left: centerX, bottom: -24, backgroundColor: '#ffffff', opacity: 1 });
    } else {
      // Fluid goo droplet wave dipping downwards below the navigation track
      tl.to(bgBubbleRef.current, { duration: 0.15, bottom: 2, ease: 'power2.out' }, 0)
        .to(activeBubbleRef.current, { duration: 0.12, bottom: 6, opacity: 0, ease: 'power2.out' }, 0)
        .to(bgBubbleRef.current, { duration: 0.28, left: centerX, ease: 'power2.inOut' }, 0.08)
        .to(bgBubbleRef.current, { duration: 0.22, bottom: -18, ease: 'back.out(1.8)' }, 0.22)
        .set(activeBubbleRef.current, { left: centerX }, 0.22)
        .to(activeBubbleRef.current, { duration: 0.25, bottom: -24, opacity: 1, ease: 'back.out(2)' }, 0.24)
        .to(bgBubbleRef.current, { duration: 0.3, backgroundColor: bubbleColor, ease: 'power2.out' }, 0);
    }

    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

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

  // Format mobile tab items for the Purrweb animated CurvedTabBar
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
      {/* Desktop Navbar with Previous Gooey Fluid Wave & Bubble Animation */}
      <header className="hidden md:block sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-black border border-stone-200/80 dark:border-stone-800 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                <Image
                  src="/icon-512.png"
                  alt="সময়যুদ্ধ 2.0 Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-gradient-brand">সময়যুদ্ধ</span>
                <span className="text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950 dark:text-brand-400 px-1.5 py-0.5 rounded-md">2.0</span>
              </div>
            </Link>

            {/* Nav Links with Previous Exact Gooey Fluid Wave and Popping Bubble */}
            <div className="relative flex items-center">
              {/* SVG Gooey Filter */}
              <svg width="0" height="0" className="absolute">
                <defs>
                  <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" id="blurFilter" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -9" result="goo" />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                  </filter>
                </defs>
              </svg>

              {/* Gooey Fluid Canvas Container */}
              <div 
                ref={navRef}
                className="relative flex items-center px-2 py-1.5 rounded-full bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/70 dark:border-white/10 backdrop-blur-md shadow-inner"
              >
                {/* Goo Liquid Background Layer with Filter */}
                <div 
                  className="absolute inset-0 rounded-full overflow-visible pointer-events-none -z-10"
                  style={{ filter: 'url(#goo)' }}
                >
                  {/* Fluid Base strip */}
                  <div 
                    className="absolute inset-x-0 bottom-0 top-0 rounded-full transition-colors duration-300 opacity-90"
                    style={{ backgroundColor: navItems[activeIndex]?.color || '#9333ea' }}
                  />
                  {/* Goo Bubble (merges and pulls fluidly) */}
                  <div
                    ref={bgBubbleRef}
                    className="absolute -translate-x-1/2 w-14 h-14 rounded-full pointer-events-none"
                    style={{
                      backgroundColor: navItems[activeIndex]?.color || '#9333ea',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    }}
                  />
                </div>

                {/* The Floating / Droplet Bubble with Icon hanging DOWNWARD below navbar */}
                <div
                  ref={activeBubbleRef}
                  className="absolute -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/80 dark:border-stone-800 pointer-events-none z-20 text-purple-700 dark:text-purple-400 bg-white dark:bg-stone-900 transition-colors duration-300"
                  style={{
                    boxShadow: '0 10px 24px -2px rgba(0,0,0,0.35), 0 3px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <span className="scale-100 flex items-center justify-center">
                    {iconMap[navItems[activeIndex]?.icon]}
                  </span>
                </div>

                {/* Navigation Items (perfectly centered in the middle of track) */}
                <nav className="relative z-10 flex items-center gap-1">
                  {navItems.map((item, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        ref={(el) => {
                          itemRefs.current[idx] = el;
                        }}
                        className={cn(
                          'relative z-10 flex items-center justify-center min-w-[66px] lg:min-w-[72px] h-8 px-2.5 lg:px-3 rounded-full text-xs transition-all duration-200 select-none cursor-pointer text-center whitespace-nowrap',
                          isActive
                            ? 'text-white font-extrabold tracking-wide'
                            : 'text-white/80 hover:text-white hover:opacity-100 opacity-80 font-semibold'
                        )}
                      >
                        <span className="leading-none text-center block">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Right */}
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
            <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-black border border-border shadow-xs flex items-center justify-center shrink-0">
              <Image
                src="/icon-512.png"
                alt="সময়যুদ্ধ 2.0 Logo"
                width={28}
                height={28}
                className="w-full h-full object-cover"
                priority
              />
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
