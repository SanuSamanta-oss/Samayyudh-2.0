'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    } else if (saved === 'light') {
      setDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDark(prefersDark);
      if (prefersDark) document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) return <div className="w-[40px] h-[20px]" />;

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex items-center w-[40px] h-[20px] rounded-full transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-inner overflow-hidden shrink-0"
      style={{
        background: dark ? '#1e293b' : '#60a5fa', // dark blue for night, light blue for day
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
      }}
    >
      {/* --- BACKGROUND ELEMENTS --- */}
      
      {/* Day Mode: Clouds */}
      <AnimatePresence>
        {!dark && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
          >
            {/* Cloud 1 */}
            <div className="absolute top-[3px] right-[6px] w-[8px] h-[2.5px] bg-white rounded-full opacity-80" />
            <div className="absolute top-[1.5px] right-[8px] w-[3px] h-[3px] bg-white rounded-full opacity-80" />
            
            {/* Cloud 2 */}
            <div className="absolute bottom-[2px] right-[3px] w-[6px] h-[2px] bg-white rounded-full opacity-60" />
            <div className="absolute bottom-[1px] right-[4.5px] w-[2.5px] h-[2.5px] bg-white rounded-full opacity-60" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark Mode: Stars */}
      <AnimatePresence>
        {dark && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute top-[3px] left-[5px] w-[1.5px] h-[1.5px] bg-white rounded-full shadow-[0_0_2px_1px_rgba(255,255,255,0.8)]" />
            <div className="absolute top-[10px] left-[11px] w-[1.5px] h-[1.5px] bg-white rounded-full shadow-[0_0_2px_1px_rgba(255,255,255,0.8)]" />
            <div className="absolute top-[5px] left-[16px] w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_1px_rgba(255,255,255,0.8)]" />
            <div className="absolute bottom-[3px] left-[8px] w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_1px_rgba(255,255,255,0.8)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- THE KNOB (Sun / Moon) --- */}
      <motion.div
        className="absolute z-10 w-[16px] h-[16px] rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] overflow-hidden"
        initial={false}
        animate={{ 
          x: dark ? 22 : 2,
          backgroundColor: dark ? '#cbd5e1' : '#fef08a' // Slate for moon, yellow for sun
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Moon Craters (Only visible when dark) */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: dark ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-[2px] left-[8px] w-[4px] h-[4px] rounded-full bg-[#94a3b8] shadow-inner" />
          <div className="absolute top-[8px] left-[4px] w-[4.5px] h-[4.5px] rounded-full bg-[#94a3b8] shadow-inner" />
          <div className="absolute top-[10px] left-[11px] w-[2.5px] h-[2.5px] rounded-full bg-[#94a3b8] shadow-inner" />
        </motion.div>

      </motion.div>
    </button>
  );
}
