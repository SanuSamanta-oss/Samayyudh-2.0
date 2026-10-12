'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Swords, GraduationCap, Library,
  History, BarChart3, StickyNote, User, Search, Menu, X, ShieldAlert, LogOut, Trophy
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/components/providers/AuthProvider';
import { getSelectedAvatar } from '@/lib/avatars';

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
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', color: '#9333ea' },
  { href: '/practice', label: 'Practice', icon: 'Swords', color: '#7c3aed' },
  { href: '/exams', label: 'Exams', icon: 'GraduationCap', color: '#6366f1' },
  { href: '/achievements', label: 'Badges', icon: 'Trophy', color: '#a855f7' },
  { href: '/questions', label: 'Questions', icon: 'Library', color: '#8b5cf6' },
  { href: '/history', label: 'History', icon: 'History', color: '#7e22ce' },
  { href: '/analytics', label: 'Analytics', icon: 'BarChart3', color: '#6b21a8' },
  { href: '/admin', label: 'Admin', icon: 'ShieldAlert', color: '#581c87' },
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
  const [mounted, setMounted] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();

  // Navigation track and bubble animation refs
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const bgBubbleRef = useRef<HTMLDivElement>(null);
  const activeBubbleRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef<number>(0);

  // Determine active nav index
  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href)))
  );

  // Animate the gooey fluid bubble to the active tab
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

  // Don't show nav during active exam
  if (pathname?.startsWith('/exam/') && pathname !== '/exams') return null;

  // Get user display info
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'S';
  const avatarUrl = mounted ? (currentAvatar?.src || user?.user_metadata?.avatar_url) : null;
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

            {/* Nav Links with Exact Gooey Fluid Wave and Popping Bubble */}
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
                          'relative z-10 flex items-center justify-center min-w-[76px] h-8 px-3.5 rounded-full text-xs transition-all duration-200 select-none cursor-pointer text-center',
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
