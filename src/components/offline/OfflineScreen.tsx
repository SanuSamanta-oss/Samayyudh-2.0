'use client';

import React, { useEffect, useState } from 'react';
import { SokhaBotCharacter } from '@/components/sokha/SokhaBotCharacter';

export function OfflineScreen() {
  const [isOffline, setIsOffline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    // Initial check on mount
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);

      const handleOffline = () => {
        setIsOffline(true);
        setStatusMessage(null);
      };

      const handleOnline = () => {
        setIsOffline(false);
        setStatusMessage(null);
      };

      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);

      // Expose a window helper for testing offline mode in dev console
      (window as unknown as { __toggleOfflineMode?: (show?: boolean) => void }).__toggleOfflineMode = (show?: boolean) => {
        setIsOffline((prev) => (typeof show === 'boolean' ? show : !prev));
      };

      return () => {
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('online', handleOnline);
        delete (window as unknown as { __toggleOfflineMode?: unknown }).__toggleOfflineMode;
      };
    }
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    setStatusMessage('Checking network connection...');
    try {
      // Ping cache-busted local asset
      const response = await fetch(`/favicon.ico?_=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
      });

      if (response.ok || response.type === 'opaque') {
        setStatusMessage('Connected! Restoring application...');
        setTimeout(() => {
          setIsOffline(false);
          setIsChecking(false);
          setStatusMessage(null);
        }, 800);
        return;
      }
      throw new Error('No internet');
    } catch {
      setStatusMessage('Still offline. Please check your Wi-Fi or mobile data.');
      setIsChecking(false);
    }
  };

  if (!isOffline) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="offline-title"
      className="fixed inset-0 z-[999999] bg-white text-stone-900 overflow-y-auto flex flex-col justify-center items-center select-none"
      style={{ fontFamily: "var(--font-arvo), 'Arvo', serif" }}
    >
      <section className="page_404 w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            {/* Animated GIF Background Container */}
            <div className="four_zero_four_bg flex flex-col items-center justify-center relative">
              <div className="mb-2">
                <SokhaBotCharacter size="lg" isThinking={isChecking} />
              </div>
              <h1 className="text-center font-bold tracking-tight text-[#1c1917] select-none">
                Offline
              </h1>
            </div>

            {/* Content Box */}
            <div className="contant_box_404">
              <h3 id="offline-title" className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
                Look like you're offline
              </h3>

              <p className="text-stone-600 text-base sm:text-lg max-w-md mx-auto mb-6">
                Your internet connection is currently off or unavailable. Check your network connection to continue!
              </p>

              {statusMessage && (
                <div
                  className={`text-sm mb-4 px-3 py-1.5 rounded-md inline-block ${
                    statusMessage.includes('Connected')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {statusMessage}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={checkConnection}
                  disabled={isChecking}
                  className="link_404 cursor-pointer font-bold border-none transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-70 rounded shadow-md"
                >
                  {isChecking ? 'Checking...' : 'Retry Connection'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOffline(false)}
                  className="px-5 py-2.5 text-stone-600 hover:text-stone-900 text-sm font-semibold hover:bg-stone-100 rounded transition-colors cursor-pointer"
                >
                  Dismiss &amp; Continue
                </button>
              </div>

              <div className="mt-8 text-xs text-stone-400">
                <p>SamayYudh 2.0 • Offline Detection</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
