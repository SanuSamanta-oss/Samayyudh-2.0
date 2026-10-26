'use client';

// ============================================================
// SamayYudh 2.0 — Mystic Sacred Chakra & Aura Energy Field
// Exact match to reference pin (https://pin.it/2JZL1HP2o)
// Seamless, borderless, pure transparent blending (NO black background)
// Extracts real-time alpha from video luminance onto HTML5 Canvas
// Floating Doctor Strange / Vedic fiery chakra animation with zero black box.
// ============================================================

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SokhaChakraProps {
  size?: 'sm' | 'md' | 'lg';
  isThinking?: boolean;
  className?: string;
}

export function SokhaChakra({
  size = 'md',
  isThinking = false,
  className,
}: SokhaChakraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  // Responsive dimensions
  const dimensions = {
    sm: {
      container: 'w-10 h-10',
      glowBlur: 'blur-md',
      canvasSize: 120,
    },
    md: {
      container: 'w-36 h-36 sm:w-40 sm:h-40',
      glowBlur: 'blur-2xl',
      canvasSize: 260,
    },
    lg: {
      container: 'w-52 h-52 sm:w-60 sm:h-60',
      glowBlur: 'blur-3xl',
      canvasSize: 360,
    },
  }[size];

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animId: number;
    const targetSize = dimensions.canvasSize;
    canvas.width = targetSize;
    canvas.height = targetSize;

    const renderLoop = () => {
      // Loop video smoothly between 1.8s and 14.3s for seamless continuous spinning
      if (video.currentTime >= 14.3) {
        video.currentTime = 1.8;
      }

      if (
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        !video.paused &&
        !video.ended
      ) {
        const vw = video.videoWidth || 736;
        const vh = video.videoHeight || 414;
        // Center-crop video to perfect 1:1 square matching the sacred chakra
        const cropSize = vh;
        const sx = (vw - cropSize) / 2;
        const sy = 0;

        ctx.clearRect(0, 0, targetSize, targetSize);
        ctx.drawImage(video, sx, sy, cropSize, cropSize, 0, 0, targetSize, targetSize);

        const imgData = ctx.getImageData(0, 0, targetSize, targetSize);
        const data = imgData.data;
        const len = data.length;

        const halfSize = targetSize / 2;
        const maxRadius = halfSize * 0.94;
        const maxRadiusSq = maxRadius * maxRadius;
        const fadeZone = halfSize * 0.08;

        // Chroma-key black removal: Convert brightness to transparent alpha
        // Leaves ONLY the glowing orange/golden runes and fire particles.
        // Pure transparent background, zero black surface, zero square borders.
        for (let i = 0; i < len; i += 4) {
          const pixelIdx = i / 4;
          const px = pixelIdx % targetSize;
          const py = Math.floor(pixelIdx / targetSize);
          const dx = px - halfSize;
          const dy = py - halfSize;
          const distSq = dx * dx + dy * dy;

          if (distSq > maxRadiusSq) {
            data[i + 3] = 0;
            continue;
          }

          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const maxVal = Math.max(r, g, b);

          // Video background noise cutoff: below 34 is 100% transparent
          if (maxVal < 34) {
            data[i + 3] = 0;
            continue;
          }

          // Smooth alpha transition from 34 to 200
          const rawAlpha = Math.min(1, Math.max(0, (maxVal - 34) / 166));

          // Circular outer edge feathering to guarantee no hard clipping
          const dist = Math.sqrt(distSq);
          const circFade = Math.min(1, Math.max(0, (maxRadius - dist) / fadeZone));

          const finalAlpha = Math.floor(rawAlpha * circFade * 255);
          data[i + 3] = finalAlpha;

          // Boost flame brightness so on light mode it renders rich warm amber/gold flame, not dark tones
          if (finalAlpha > 0) {
            data[i] = Math.min(255, Math.floor(r * 1.2));
            data[i + 1] = Math.min(255, Math.floor(g * 1.2));
            data[i + 2] = Math.min(255, Math.floor(b * 1.2));
          }
        }

        ctx.putImageData(imgData, 0, 0);
      }

      animId = requestAnimationFrame(renderLoop);
    };

    const handleLoadedData = () => {
      video.play().catch(() => {});
    };

    const handleError = () => {
      setVideoFailed(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    video.play().catch(() => {});
    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [dimensions.canvasSize]);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center select-none shrink-0 group bg-transparent',
        dimensions.container,
        className
      )}
    >
      {/* ── Hidden Video Source (Provides frames for transparent canvas processing) ──── */}
      <video
        ref={videoRef}
        src="/mystic-chakra.mp4"
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="hidden pointer-events-none"
      />

      {/* ── Outer Radiant Amber-Golden Aura Bloom (Soft, pure warm light, zero black) ── */}
      <motion.div
        animate={{
          scale: isThinking ? [1, 1.25, 0.95, 1.2, 1] : [1, 1.08, 0.96, 1],
          opacity: isThinking ? [0.75, 0.95, 0.75] : [0.45, 0.7, 0.45],
        }}
        transition={{
          repeat: Infinity,
          duration: isThinking ? 1.8 : 4.5,
          ease: 'easeInOut',
        }}
        className={cn(
          'absolute inset-[-8%] rounded-full pointer-events-none transition-all',
          dimensions.glowBlur
        )}
        style={{
          background:
            'radial-gradient(circle, rgba(251,191,36,0.35) 0%, rgba(245,158,11,0.18) 35%, transparent 70%)',
        }}
      />

      {/* ── Secondary Subtle Solar Halo (Soft blur, no harsh strokes) ────────────────── */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: isThinking ? [0.95, 1.15, 0.95] : [0.98, 1.05, 0.98],
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 25, ease: 'linear' },
          scale: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
        }}
        className="absolute inset-[-4%] rounded-full pointer-events-none opacity-30 blur-xl"
        style={{
          background:
            'radial-gradient(circle, rgba(251,191,36,0.25) 0%, rgba(245,158,11,0.1) 45%, transparent 70%)',
        }}
      />

      {/* ── Transparent Alpha Canvas (Pure Glowing Animation ONLY, No Black Surface) ── */}
      <div className="relative w-full h-full flex items-center justify-center rounded-full overflow-hidden bg-transparent pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none rounded-full"
          style={{
            filter:
              'drop-shadow(0 0 14px rgba(251, 191, 36, 0.7)) drop-shadow(0 0 28px rgba(245, 158, 11, 0.4))',
          }}
        />

        {/* Fallback Animated SVG Chakra if video is unavailable or loading */}
        {videoFailed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
              className="w-[85%] h-[85%] rounded-full opacity-80 flex items-center justify-center bg-gradient-to-tr from-amber-500/20 via-orange-500/30 to-yellow-400/20 blur-sm"
            >
              <div className="w-5 h-5 rounded-full bg-amber-400 blur-[2px] shadow-[0_0_15px_rgba(251,191,36,0.9)]" />
            </motion.div>
          </div>
        )}
      </div>

      {/* ── Floating Amber Ember Sparks (Soft, seamless light particles) ────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {[
          { top: '15%', left: '22%', delay: 0, duration: 3.2, size: 'w-1 h-1' },
          { top: '75%', left: '74%', delay: 1.1, duration: 2.8, size: 'w-1.5 h-1.5' },
          { top: '28%', left: '78%', delay: 0.5, duration: 3.5, size: 'w-1 h-1' },
          { top: '68%', left: '18%', delay: 1.8, duration: 4.0, size: 'w-1 h-1' },
          { top: '48%', left: '88%', delay: 2.2, duration: 2.6, size: 'w-1.5 h-1.5' },
        ].map((spark, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [-6, 6, -6],
              x: [-4, 4, -4],
              opacity: [0.2, 0.85, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: spark.duration,
              delay: spark.delay,
              ease: 'easeInOut',
            }}
            className={cn('absolute rounded-full bg-amber-200 blur-[0.6px]', spark.size)}
            style={{
              top: spark.top,
              left: spark.left,
              boxShadow: '0 0 6px 2px rgba(251, 191, 36, 0.7)',
            }}
          />
        ))}
      </div>

      {/* ── Central Bindu Luminous Star ───────────────────────────────────────────── */}
      <motion.div
        animate={{
          scale: isThinking ? [1, 1.4, 1] : [0.95, 1.15, 0.95],
          opacity: isThinking ? [0.85, 1, 0.85] : [0.65, 0.9, 0.65],
        }}
        transition={{
          repeat: Infinity,
          duration: isThinking ? 1.4 : 2.5,
          ease: 'easeInOut',
        }}
        className="absolute w-2 h-2 rounded-full bg-white blur-[0.5px] pointer-events-none"
        style={{
          boxShadow:
            '0 0 10px 3px rgba(255, 255, 255, 0.95), 0 0 24px 6px rgba(251, 191, 36, 0.85)',
        }}
      />
    </div>
  );
}
