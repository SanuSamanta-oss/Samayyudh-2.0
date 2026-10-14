'use client';

import { useEffect } from 'react';

export function ThemeInitializer() {
  useEffect(() => {
    try {
      const t = localStorage.getItem('theme');
      if (t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Ignore localStorage errors
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .catch((err) => console.log('SW registration note:', err));
      });
    }
  }, []);

  return null;
}
