// ============================================================
// SamayYudh 2.0 — Web Audio & Haptic Vibration Engine
// Synthesizes pleasant, rich study tones with zero external assets.
// ============================================================

import { ReminderTone } from '@/types/reminders';
import { getStoredCustomAudioTone } from './custom-audio';

let audioCtx: AudioContext | null = null;
let currentCustomAudio: HTMLAudioElement | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Stops any actively playing custom audio ringtone preview.
 */
export function stopReminderSound(): void {
  if (currentCustomAudio) {
    try {
      currentCustomAudio.pause();
      currentCustomAudio.currentTime = 0;
    } catch {
      // Ignore pause errors
    }
    currentCustomAudio = null;
  }
}

/**
 * Plays built-in synthesized study reminder tone.
 */
function playBuiltInTone(tone: string = 'chime'): Promise<void> {
  return new Promise((resolve) => {
    const ctx = getAudioContext();
    if (!ctx) {
      resolve();
      return;
    }

    try {
      const now = ctx.currentTime;

      if (tone === 'gong') {
        // Deep Tibetan singing bowl / meditation gong
        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.exponentialRampToValueAtTime(0.35, now + 0.08);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        // Low fundamental (F3 = 174Hz - Solfeggio healing frequency)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(174.6, now);
        osc1.connect(masterGain);
        osc1.start(now);
        osc1.stop(now + 2.9);

        // Upper harmonic overtone (C4 = 261.6Hz)
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(261.6, now);
        osc2.connect(masterGain);
        osc2.start(now);
        osc2.stop(now + 2.9);

        // Subtle shimmer overtone
        const osc3 = ctx.createOscillator();
        osc3.type = 'triangle';
        osc3.frequency.setValueAtTime(523.2, now);
        const gain3 = ctx.createGain();
        gain3.gain.setValueAtTime(0.08, now);
        osc3.connect(gain3);
        gain3.connect(masterGain);
        osc3.start(now);
        osc3.stop(now + 1.8);

        setTimeout(resolve, 2900);
      } else if (tone === 'bell') {
        // Crystal temple bell (triple sparkle pulse)
        const frequencies = [880, 1046.5, 1318.5]; // A5, C6, E6
        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const delay = idx * 0.12;
          const noteStart = now + delay;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteStart);

          gain.gain.setValueAtTime(0.001, noteStart);
          gain.gain.exponentialRampToValueAtTime(0.25, noteStart + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(noteStart);
          osc.stop(noteStart + 1.5);
        });

        setTimeout(resolve, 1800);
      } else if (tone === 'marimba') {
        // Upbeat motivational marimba arpeggio (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteStart = now + idx * 0.09;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteStart);

          gain.gain.setValueAtTime(0.001, noteStart);
          gain.gain.linearRampToValueAtTime(0.28, noteStart + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.65);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(noteStart);
          osc.stop(noteStart + 0.7);
        });

        setTimeout(resolve, 1200);
      } else {
        // Default 'chime': Luminous dual harmonic study chime (528Hz + 660Hz)
        const primary = ctx.createOscillator();
        const secondary = ctx.createOscillator();
        const gain = ctx.createGain();

        primary.type = 'sine';
        primary.frequency.setValueAtTime(528, now); // Solfeggio clarity frequency
        primary.frequency.exponentialRampToValueAtTime(532, now + 0.5);

        secondary.type = 'sine';
        secondary.frequency.setValueAtTime(792, now); // Harmonic fifth

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.32, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        primary.connect(gain);
        secondary.connect(gain);
        gain.connect(ctx.destination);

        primary.start(now);
        secondary.start(now);
        primary.stop(now + 2.3);
        secondary.stop(now + 2.3);

        setTimeout(resolve, 2300);
      }
    } catch {
      resolve();
    }
  });
}

/**
 * Plays the requested study alarm sound (either built-in tone or custom uploaded audio).
 */
export function playReminderSound(tone: ReminderTone = 'chime', customAudioData?: string): Promise<void> {
  stopReminderSound();

  if (tone === 'custom' || customAudioData) {
    return new Promise(async (resolve) => {
      try {
        let src = customAudioData;
        if (!src) {
          const stored = await getStoredCustomAudioTone();
          src = stored?.dataUrl;
        }

        if (src) {
          const audio = new Audio(src);
          currentCustomAudio = audio;
          audio.volume = 0.95;
          audio.onended = () => {
            currentCustomAudio = null;
            resolve();
          };
          audio.onerror = () => {
            currentCustomAudio = null;
            playBuiltInTone('chime').then(resolve);
          };
          await audio.play();
          return;
        }
      } catch {
        // Fallback
      }
      playBuiltInTone('chime').then(resolve);
    });
  }

  return playBuiltInTone(tone);
}

/**
 * Triggers device haptic vibration on mobile devices / PWA.
 * Default pattern: Alert pulse [200ms vibrate, 100ms pause, 200ms vibrate]
 */
export function triggerHapticVibration(pattern: number[] = [200, 100, 200]): boolean {
  if (typeof window === 'undefined' || !('navigator' in window)) return false;
  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      return navigator.vibrate(pattern);
    }
  } catch {
    // Ignore vibration errors
  }
  return false;
}
