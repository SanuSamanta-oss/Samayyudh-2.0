'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Swords, GraduationCap, Library,
  History, BarChart3, StickyNote, User, Search, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Swords: <Swords className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Library: <Library className="w-5 h-5" />,
  History: <History className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  StickyNote: <StickyNote className="w-5 h-5" />,
};

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/practice', label: 'Practice', icon: 'Swords' },
  { href: '/exams', label: 'Exams', icon: 'GraduationCap' },
  { href: '/questions', label: 'Questions', icon: 'Library' },
  { href: '/history', label: 'History', icon: 'History' },
  { href: '/analytics', label: 'Analytics', icon: 'BarChart3' },
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

  // Don't show nav during active exam
  if (pathname?.startsWith('/exam/') && pathname !== '/exams') return null;

  return (
    <>
      {/* Desktop Navbar */}
      <header className="hidden md:block sticky top-0 z-30 border-b border-border bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="text-xl font-bold text-gradient-brand">সময়যুদ্ধ</span>
              <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-md">2.0</span>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    )}
                  >
                    {iconMap[item.icon]}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/profile"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold"
              >
                S
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur-lg">
        <div className="flex items-center justify-between h-12 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-gradient-brand">সময়যুদ্ধ</span>
            <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-1 py-0.5 rounded">2.0</span>
          </Link>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg text-stone-500" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-lg text-stone-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-white/95 backdrop-blur-lg">
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
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-12">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-stone-600 hover:bg-stone-50'
                  )}
                >
                  {iconMap[item.icon]}
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
