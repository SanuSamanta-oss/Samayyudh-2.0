'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { ProctoringEventType, ProctoringEventSeverity, WebRTCSignalingMessage } from '@/types/proctoring';

interface UseProctoringMonitorOptions {
  sessionId: string;
  examSessionId: string;
  studentId: string;
  stream: MediaStream | null;
  enabled: boolean;
  currentQuestionIndex: number;
  questionsAnswered: number;
  onPauseExam?: () => void;
  onResumeExam?: () => void;
}

export function useProctoringMonitor({
  sessionId,
  examSessionId,
  studentId,
  stream,
  enabled,
  currentQuestionIndex,
  questionsAnswered,
  onPauseExam,
  onResumeExam,
}: UseProctoringMonitorOptions) {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'fair' | 'poor' | 'offline'>('good');
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Send an event to the backend telemetry
  const logEvent = useCallback(
    async (eventType: ProctoringEventType, severity: ProctoringEventSeverity = 'info', details: Record<string, any> = {}) => {
      if (!enabled || !sessionId) return;
      try {
        await fetch('/api/proctoring/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            eventType,
            severity,
            details,
          }),
        });
      } catch (err) {
        console.warn('[ProctoringMonitor] Event dispatch notice:', err);
      }
    },
    [enabled, sessionId]
  );

  // 1. Tab & Window Focus Visibility Detector
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((c) => c + 1);
        logEvent('tab_switched', 'warning', {
          count: tabSwitchCount + 1,
          timestamp: new Date().toISOString(),
        });
      } else {
        logEvent('tab_restored', 'info', {
          timestamp: new Date().toISOString(),
        });
      }
    };

    const handleWindowBlur = () => {
      logEvent('tab_switched', 'warning', {
        type: 'window_blur',
        timestamp: new Date().toISOString(),
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [enabled, tabSwitchCount, logEvent]);

  // 2. Fullscreen detector
  useEffect(() => {
    if (!enabled) return;

    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      if (isFullscreen) {
        logEvent('fullscreen_entered', 'info');
      } else {
        logEvent('fullscreen_exited', 'warning');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [enabled, logEvent]);

  // 3. Network connection quality listener
  useEffect(() => {
    if (!enabled) return;

    const handleOnline = () => {
      setConnectionQuality('good');
      logEvent('network_online', 'info');
    };

    const handleOffline = () => {
      setConnectionQuality('offline');
      logEvent('network_offline', 'critical');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enabled, logEvent]);

  // 4. Camera stream track monitoring
  useEffect(() => {
    if (!enabled || !stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;

    const handleMute = () => {
      logEvent('camera_disconnected', 'warning', { reason: 'track_muted' });
    };

    const handleUnmute = () => {
      logEvent('camera_connected', 'info', { reason: 'track_unmuted' });
    };

    const handleEnded = () => {
      logEvent('camera_disconnected', 'critical', { reason: 'track_ended' });
    };

    videoTrack.addEventListener('mute', handleMute);
    videoTrack.addEventListener('unmute', handleUnmute);
    videoTrack.addEventListener('ended', handleEnded);

    logEvent('camera_connected', 'info');

    return () => {
      videoTrack.removeEventListener('mute', handleMute);
      videoTrack.removeEventListener('unmute', handleUnmute);
      videoTrack.removeEventListener('ended', handleEnded);
    };
  }, [enabled, stream, logEvent]);

  // 5. Periodic Heartbeat to Server
  useEffect(() => {
    if (!enabled || !examSessionId) return;

    const sendHeartbeat = async () => {
      try {
        await fetch('/api/proctoring/session', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            examSessionId,
            currentQuestionIndex,
            questionsAnswered,
            cameraActive: Boolean(stream && stream.getVideoTracks().some((t) => t.readyState === 'live')),
          }),
        });
      } catch {}
    };

    sendHeartbeat();
    heartbeatTimerRef.current = setInterval(sendHeartbeat, 15000);

    return () => {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
    };
  }, [enabled, examSessionId, currentQuestionIndex, questionsAnswered, stream]);

  // 6. Realtime Channel Listener for Teacher Interventions
  useEffect(() => {
    if (!enabled || !sessionId || !isSupabaseConfigured) return;

    const supabase = createClient();
    const channel = supabase.channel(`proctor_session_${sessionId}`);

    channel
      .on('broadcast', { event: 'signal' }, ({ payload }: { payload: WebRTCSignalingMessage }) => {
        if (!payload || payload.type !== 'intervention') return;

        const { action, message } = payload.payload || {};
        if (message) {
          setWarningMessage(message);
        }

        if (action === 'pause') {
          setIsPaused(true);
          onPauseExam?.();
        } else if (action === 'resume') {
          setIsPaused(false);
          onResumeExam?.();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, sessionId, onPauseExam, onResumeExam]);

  return {
    warningMessage,
    isPaused,
    connectionQuality,
    tabSwitchCount,
    dismissWarning: () => setWarningMessage(null),
    logCustomEvent: logEvent,
  };
}
