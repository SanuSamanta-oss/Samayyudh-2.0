'use client';

// ============================================================
// SamayYudh 2.0 — Haunted Spider-Web Entrance Animation
// A cinematic 12-second entrance effect that plays once per
// browser session. Procedural SVG webs with atmospheric
// canvas particles, vignette, and progressive spatial wipe.
//
// Timeline:
//   Phase 1 (0–2s):  Arrival — darkness, first strands appear
//   Phase 2 (2–5s):  Formation — connecting threads build
//   Phase 3 (5–8s):  Atmosphere — glints, subtle movement
//   Phase 4 (8–12s): Removal — progressive left-to-right wipe
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SpiderWebSVG } from './SpiderWebSVG';
import { useEntranceEffect } from '@/hooks/useEntranceEffect';
import '@/styles/haunted-web.css';

// ── Types ───────────────────────────────────────────────────
type Phase = 'arrival' | 'formation' | 'atmosphere' | 'removal' | 'done';

// ── Phase timing (ms) ───────────────────────────────────────
const PHASE_TIMING = {
  arrival:    0,
  formation:  2000,
  atmosphere: 5000,
  removal:    8000,
  done:       12000,
} as const;

// ── Dust particle for Canvas layer ──────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

// ── Component ───────────────────────────────────────────────
export function HauntedWebIntro() {
  const { shouldPlay, hasChecked, markComplete } = useEntranceEffect();
  const [phase, setPhase] = useState<Phase>('arrival');
  const [wipeProgress, setWipeProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const cleanedUpRef = useRef(false);

  // ── Measure viewport ──────────────────────────────────────
  useEffect(() => {
    if (!shouldPlay) return;

    const measure = () => {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    };
    measure();

    // Debounced resize handler
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
    };
  }, [shouldPlay]);

  // ── Canvas particle initialization ────────────────────────
  const initParticles = useCallback((w: number, h: number) => {
    const count = w < 768 ? 15 : 35;
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.15 + 0.05,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.15 + 0.03,
        life: 0,
        maxLife: 3000 + Math.random() * 4000,
      });
    }
    particlesRef.current = particles;
  }, []);

  // ── Main animation loop ───────────────────────────────────
  const cleanup = useCallback(() => {
    if (cleanedUpRef.current) return;
    cleanedUpRef.current = true;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    particlesRef.current = [];
    markComplete();
  }, [markComplete]);

  useEffect(() => {
    if (!shouldPlay || dimensions.w === 0) return;

    startTimeRef.current = performance.now();
    initParticles(dimensions.w, dimensions.h);

    // Set up canvas for HiDPI
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = dimensions.w * dpr;
      canvas.height = dimensions.h * dpr;
      canvas.style.width = `${dimensions.w}px`;
      canvas.style.height = `${dimensions.h}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    }

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;

      // ── Update phase ──────────────────────────────────
      let currentPhase: Phase = 'arrival';
      if (elapsed >= PHASE_TIMING.done) {
        currentPhase = 'done';
      } else if (elapsed >= PHASE_TIMING.removal) {
        currentPhase = 'removal';
      } else if (elapsed >= PHASE_TIMING.atmosphere) {
        currentPhase = 'atmosphere';
      } else if (elapsed >= PHASE_TIMING.formation) {
        currentPhase = 'formation';
      }

      setPhase(currentPhase);

      // ── Update wipe progress during removal phase ─────
      if (currentPhase === 'removal') {
        const removalElapsed = elapsed - PHASE_TIMING.removal;
        const removalDuration = PHASE_TIMING.done - PHASE_TIMING.removal;
        const progress = Math.min(removalElapsed / removalDuration, 1);
        // Ease-in-out for smooth wipe
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        setWipeProgress(eased);
      }

      // ── Canvas particle rendering ─────────────────────
      if (canvas && (currentPhase === 'atmosphere' || currentPhase === 'removal' || currentPhase === 'formation')) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, dimensions.w, dimensions.h);

          const dt = 16; // approximate frame delta
          for (const p of particlesRef.current) {
            p.life += dt;
            if (p.life > p.maxLife) {
              // Reset particle
              p.x = Math.random() * dimensions.w;
              p.y = -5;
              p.life = 0;
            }
            p.x += p.vx;
            p.y += p.vy;

            // Wrap horizontally
            if (p.x < 0) p.x = dimensions.w;
            if (p.x > dimensions.w) p.x = 0;

            const lifeRatio = p.life / p.maxLife;
            const fadeAlpha = lifeRatio < 0.1
              ? lifeRatio / 0.1
              : lifeRatio > 0.8
                ? (1 - lifeRatio) / 0.2
                : 1;

            const finalAlpha = p.alpha * fadeAlpha * (currentPhase === 'removal' ? (1 - wipeProgress) : 1);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 210, 230, ${finalAlpha})`;
            ctx.fill();
          }
        }
      }

      // ── Continue loop or clean up ─────────────────────
      if (currentPhase === 'done') {
        cleanup();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Safety timeout — ensure we clean up even if rAF is paused
    const safetyTimer = setTimeout(() => {
      cleanup();
      setPhase('done');
    }, PHASE_TIMING.done + 500);

    // Page visibility: pause animation when hidden
    const handleVisibility = () => {
      if (document.hidden && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else if (!document.hidden && !cleanedUpRef.current) {
        // Resume — adjust start time to account for hidden duration
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(safetyTimer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
    // We intentionally exclude wipeProgress from deps — it's read inside the loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlay, dimensions.w, dimensions.h, initParticles, cleanup]);

  // ── Don't render anything until we've checked session ─────
  if (!hasChecked || !shouldPlay) return null;
  if (phase === 'done') return null;

  const isAtmosphericPhase = phase === 'atmosphere' || phase === 'formation';
  const isRemoving = phase === 'removal';

  return (
    <div
      ref={containerRef}
      className="haunted-web-container"
      data-phase={phase}
      role="presentation"
      aria-hidden="true"
    >
      {/* Darkness overlay */}
      <div
        className="haunted-darkness"
        data-active={isAtmosphericPhase || phase === 'arrival' ? 'true' : undefined}
        data-fading={isRemoving ? 'true' : undefined}
      />

      {/* Vignette */}
      <div
        className="haunted-vignette"
        data-active={!isRemoving ? 'true' : undefined}
        data-fading={isRemoving ? 'true' : undefined}
      />

      {/* SVG web layer */}
      {dimensions.w > 0 && (
        <SpiderWebSVG
          width={dimensions.w}
          height={dimensions.h}
          seed={7331}
          wipeProgress={wipeProgress}
          phase={phase}
        />
      )}

      {/* Canvas atmospheric particles */}
      <canvas
        ref={canvasRef}
        className="haunted-canvas"
        data-active={isAtmosphericPhase ? 'true' : undefined}
        data-fading={isRemoving ? 'true' : undefined}
      />
    </div>
  );
}
