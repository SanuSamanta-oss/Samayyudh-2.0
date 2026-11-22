'use client';

/**
 * SamayYudh 2.0 — Platform Detection Utility
 * Detects whether the current client is running in the native Android App context:
 * 1. Explicit query parameter or hash: ?platform=android or ?app=android
 * 2. Persisted session/localStorage flag: samayyudh_platform = 'android'
 * 3. Android Standalone PWA / TWA (display-mode: standalone on Android)
 * 4. Android WebView / Custom Tab / App wrapper
 */

export function isAndroidApp(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Query parameter check (e.g. ?platform=android or ?app=android)
    const searchParams = new URLSearchParams(window.location.search);
    const platformParam = searchParams.get('platform') || searchParams.get('app');
    if (platformParam?.toLowerCase() === 'android') {
      try {
        localStorage.setItem('samayyudh_platform', 'android');
      } catch {
        // ignore storage errors
      }
      return true;
    }

    if (platformParam?.toLowerCase() === 'web') {
      try {
        localStorage.removeItem('samayyudh_platform');
      } catch {
        // ignore storage errors
      }
      return false;
    }

    // 2. Persisted flag check
    try {
      if (localStorage.getItem('samayyudh_platform') === 'android') {
        return true;
      }
    } catch {
      // ignore storage errors
    }

    // 3. Android User Agent & Environment checks
    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);

    if (!isAndroid) {
      return false;
    }

    // Check for standalone PWA mode on Android
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    // Check for Android WebView / TWA / Trusted Web Activity
    const isAndroidWebView =
      /Version\/[0-9.]+/i.test(ua) ||
      /wv/i.test(ua) ||
      typeof (window as unknown as { Android?: unknown }).Android !== 'undefined';

    const isAndroidReferrer =
      typeof document !== 'undefined' &&
      document.referrer &&
      document.referrer.startsWith('android-app://');

    if (isStandalone || isAndroidWebView || isAndroidReferrer) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Returns an Android intent URI for explicitly opening the installed app
 * with fallback to web if app is not present.
 */
export function getAndroidIntentUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const host = typeof window !== 'undefined' ? window.location.host : 'samayyudh-2-0.vercel.app';
  return `intent://${host}/${cleanPath}#Intent;scheme=https;package=com.samayyudh.app;S.browser_fallback_url=https://${host}/${cleanPath};end`;
}

/**
 * Checks if the application is currently running in an installed standalone window or mobile wrapper.
 */
export function isStandaloneApp(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
    isAndroidApp()
  );
}

