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

  useEffect(() => {
    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setHasChecked(true);
      setShouldPlay(false);
      return;
    }

    // Check session storage
    try {
      const played = sessionStorage.getItem(SESSION_KEY);
      if (played === 'true') {
        setShouldPlay(false);
      } else {
        // Mark as playing immediately to prevent duplicate instances on refresh
        sessionStorage.setItem(SESSION_KEY, 'true');
        setShouldPlay(true);
      }
    } catch {
      // sessionStorage unavailable (e.g. private browsing in some browsers)
      setShouldPlay(false);
    }
    setHasChecked(true);
  }, []);

  const markComplete = useCallback(() => {
    setShouldPlay(false);
  }, []);

  return { shouldPlay, hasChecked, markComplete };
}
