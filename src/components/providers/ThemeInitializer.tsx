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

    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('SW registered:', reg.scope))
          .catch((err) => console.log('SW error:', err));
      });
    }
  }, []);

  return null;
}
