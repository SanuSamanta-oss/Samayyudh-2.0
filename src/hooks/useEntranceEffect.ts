'use client';

// ============================================================
// SamayYudh 2.0 — Entrance Effect Session Hook
// Tracks whether the haunted-web intro has played this session.
// Uses sessionStorage so it fires once per browser session and
// never replays on internal route changes.
// ============================================================

import { useState, useCallback, useEffect } from 'react';

const SESSION_KEY = 'samayyudh_haunted_intro_played';

export function useEntranceEffect() {
  const [shouldPlay, setShouldPlay] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const checkAndTrigger = useCallback((force = false) => {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion (allow override if force)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches && !force) {
      setHasChecked(true);
      setShouldPlay(false);
      return;
    }

    // Check URL parameters for explicit replay or preview
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const hasForceParam =
      search.includes('replay') ||
      search.includes('intro') ||
      search.includes('spider') ||
      search.includes('web') ||
      hash.includes('replay');

    if (force || hasForceParam) {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {}
      setShouldPlay(true);
      setHasChecked(true);
      return;
    }

    // Normal session storage check
    try {
      const played = sessionStorage.getItem(SESSION_KEY);
      if (played === 'true') {
        setShouldPlay(false);
      } else {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setShouldPlay(true);
      }
    } catch {
      setShouldPlay(false);
    }
    setHasChecked(true);
  }, []);

  useEffect(() => {
    checkAndTrigger(false);

    // Global replay event listener
    const handleReplayEvent = () => {
      checkAndTrigger(true);
    };
    window.addEventListener('samayyudh:replay-intro', handleReplayEvent);

    // Attach convenience methods to window
    (window as unknown as { replaySpiderWeb?: () => void; replayIntro?: () => void }).replaySpiderWeb = () => {
      window.dispatchEvent(new CustomEvent('samayyudh:replay-intro'));
    };
    (window as unknown as { replayIntro?: () => void }).replayIntro = () => {
      window.dispatchEvent(new CustomEvent('samayyudh:replay-intro'));
    };

    return () => {
      window.removeEventListener('samayyudh:replay-intro', handleReplayEvent);
    };
  }, [checkAndTrigger]);

  const markComplete = useCallback(() => {
    setShouldPlay(false);
  }, []);

  const replay = useCallback(() => {
    checkAndTrigger(true);
  }, [checkAndTrigger]);

  return { shouldPlay, hasChecked, markComplete, replay };
}
