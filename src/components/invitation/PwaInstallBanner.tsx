'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, Smartphone, Check, X, Shield, ArrowRight } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PwaInstallBannerProps {
  onInstalled?: () => void;
  examCode?: string;
}

export function PwaInstallBanner({ onInstalled, examCode }: PwaInstallBannerProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect iOS
    const ua = window.navigator.userAgent;
    const isIosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setInstallSuccess(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      if (onInstalled) onInstalled();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallSuccess(true);
          if (onInstalled) onInstalled();
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
        setShowManualGuide(true);
      }
    } else {
      setShowManualGuide(true);
    }
  };

  return (
    <>
      <div className="w-full">
        <motion.button
          type="button"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={handleInstallClick}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(124,58,237,0.35)] transition-all cursor-pointer border-0 outline-none ring-0"
        >
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
            <Download className="w-4 h-4 text-white" />
          </div>
          <span>Install SamayYudh App</span>
          <ArrowRight className="w-4 h-4 opacity-80" />
        </motion.button>
      </div>

      {/* Manual Installation Guide Modal if native prompt is blocked or iOS */}
      <AnimatePresence>
        {showManualGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#111827] shadow-2xl space-y-5 text-slate-800 dark:text-slate-100 border-0 outline-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Install SamayYudh
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isIOS ? 'iOS Safari Installation' : 'Android & Chrome App Installation'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowManualGuide(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border-0 outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {isIOS ? (
                  <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                    <p className="font-semibold text-slate-900 dark:text-white">How to install on iPhone/iPad:</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <li>Tap the <strong>Share</strong> button at the bottom of Safari.</li>
                      <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                      <li>Tap <strong>Add</strong> at top right to complete installation.</li>
                    </ol>
                  </div>
                ) : (
                  <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                    <p className="font-semibold text-slate-900 dark:text-white">To add to your device:</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <li>Tap browser menu (<strong>⋮</strong> or three dots).</li>
                      <li>Select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.</li>
                      <li>Your examination invitation token <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">{examCode}</span> is automatically saved.</li>
                    </ol>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Exam token preserved. First app launch will open this exact exam.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowManualGuide(false)}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold transition-all border-0 outline-none"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
