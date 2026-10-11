'use client';

// ============================================================
// SamayYudh 2.0 — Procedural Spider-Web SVG Renderer
// Generates realistic, irregular spiderweb geometry using
// seeded pseudo-random math. Multiple web clusters with
// varied radial patterns, connecting threads, and loose
// strands for a haunted-house atmosphere.
// ============================================================

import React, { useMemo } from 'react';

// ── Seeded PRNG ─────────────────────────────────────────────
// Mulberry32 — deterministic, so geometry is stable per-render
function createRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Types ───────────────────────────────────────────────────
interface Point { x: number; y: number }

interface WebCluster {
  center: Point;
  anchorAngles: number[];
  anchorLengths: number[];
  rings: number[];   // radial distances for connecting rings
  id: string;
  layer: number;     // 0 = background, 1 = mid, 2 = foreground
}

interface StrandPath {
  d: string;
  opacity: number;
  strokeWidth: number;
  layer: number;
  delay: number;      // animation delay in seconds
  duration: number;    // animation duration for draw-in
  length: number;      // approximate path length for dasharray
  id: string;
}

// ── Geometry helpers ────────────────────────────────────────
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function polarToCart(cx: number, cy: number, angle: number, radius: number): Point {
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
}

// ── Web generation ──────────────────────────────────────────
function generateClusters(
  w: number, h: number, isMobile: boolean, rng: () => number
): WebCluster[] {
  const clusters: WebCluster[] = [];

  // Utility to push a cluster
  const addCluster = (
    cx: number, cy: number,
    numSpokes: number, minLen: number, maxLen: number,
    numRings: number, layer: number, id: string
  ) => {
    const angles: number[] = [];
    const lengths: number[] = [];
    let angle = rng() * Math.PI * 2;
    for (let i = 0; i < numSpokes; i++) {
      angle += (Math.PI * 2 / numSpokes) * (0.7 + rng() * 0.6);
      angles.push(angle);
      lengths.push(lerp(minLen, maxLen, 0.4 + rng() * 0.6));
    }
    const rings: number[] = [];
    for (let r = 0; r < numRings; r++) {
      rings.push(lerp(minLen * 0.2, maxLen * 0.9, (r + 0.5 + rng() * 0.3) / numRings));
    }
    clusters.push({ center: { x: cx, y: cy }, anchorAngles: angles, anchorLengths: lengths, rings, id, layer });
  };

  // Large corner webs
  addCluster(w * 0.03, h * 0.02, isMobile ? 8 : 14, w * 0.08, w * 0.32, isMobile ? 3 : 5, 1, 'tl');
  addCluster(w * 0.97, h * 0.04, isMobile ? 7 : 12, w * 0.07, w * 0.28, isMobile ? 3 : 5, 1, 'tr');

  // Central suspended web (slightly off-center)
  if (!isMobile) {
    addCluster(w * (0.45 + rng() * 0.15), h * (0.35 + rng() * 0.15), 16, w * 0.06, w * 0.22, 6, 2, 'center');
  }

  // Side webs
  addCluster(w * 0.02, h * (0.4 + rng() * 0.2), isMobile ? 5 : 8, w * 0.04, w * 0.18, isMobile ? 2 : 4, 0, 'left');
  addCluster(w * 0.98, h * (0.55 + rng() * 0.2), isMobile ? 5 : 8, w * 0.04, w * 0.16, isMobile ? 2 : 4, 0, 'right');

  // Bottom partial web
  addCluster(w * (0.3 + rng() * 0.4), h * 0.97, isMobile ? 5 : 9, w * 0.05, w * 0.2, isMobile ? 2 : 3, 1, 'bottom');

  // Background large sparse web
  if (!isMobile) {
    addCluster(w * 0.7, h * 0.15, 10, w * 0.1, w * 0.35, 4, 0, 'bg');
  }

  return clusters;
}

function generateStrands(
  clusters: WebCluster[], w: number, h: number, isMobile: boolean, rng: () => number
): StrandPath[] {
  const strands: StrandPath[] = [];
  let strandIdx = 0;

  const layerProps = (layer: number) => {
    if (layer === 0) return { opRange: [0.25, 0.5], swRange: [0.5, 1.0] };
    if (layer === 1) return { opRange: [0.35, 0.65], swRange: [0.6, 1.4] };
    return { opRange: [0.5, 0.85], swRange: [0.8, 1.8] };
  };

  for (const cluster of clusters) {
    const { center, anchorAngles, anchorLengths, rings, layer, id } = cluster;
    const { opRange, swRange } = layerProps(layer);

    // ── Radial spokes ───────────────────────────────────
    for (let i = 0; i < anchorAngles.length; i++) {
      const angle = anchorAngles[i];
      const len = anchorLengths[i];
      const end = polarToCart(center.x, center.y, angle, len);

      // Add slight curve via control point
      const wobble = (rng() - 0.5) * len * 0.12;
      const mid = polarToCart(center.x, center.y, angle, len * 0.5);
      const perpAngle = angle + Math.PI / 2;
      const cp = { x: mid.x + Math.cos(perpAngle) * wobble, y: mid.y + Math.sin(perpAngle) * wobble };

      const d = `M ${center.x.toFixed(1)} ${center.y.toFixed(1)} Q ${cp.x.toFixed(1)} ${cp.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
      const approxLen = len * 1.05;

      strands.push({
        d,
        opacity: lerp(opRange[0], opRange[1], rng()),
        strokeWidth: lerp(swRange[0], swRange[1], rng()),
        layer,
        delay: 0.1 + rng() * 1.5,      // Phase 1 timing
        duration: 0.8 + rng() * 1.2,
        length: approxLen,
        id: `${id}-spoke-${i}`,
      });
      strandIdx++;
    }

    // ── Connecting ring threads ──────────────────────────
    for (let r = 0; r < rings.length; r++) {
      const radius = rings[r];
      // Connect adjacent spokes at this ring radius
      for (let i = 0; i < anchorAngles.length; i++) {
        const next = (i + 1) % anchorAngles.length;
        const aLen = anchorLengths[i];
        const bLen = anchorLengths[next];
        if (radius > aLen * 0.95 || radius > bLen * 0.95) continue;

        // Occasionally skip a connection for irregularity
        if (rng() < 0.15) continue;

        const pa = polarToCart(center.x, center.y, anchorAngles[i], radius);
        const pb = polarToCart(center.x, center.y, anchorAngles[next], radius);

        // Sag the connecting thread slightly inward
        const midAngle = (anchorAngles[i] + anchorAngles[next]) / 2;
        const sag = radius * (0.03 + rng() * 0.08);
        const cp2 = polarToCart(center.x, center.y, midAngle, radius - sag);

        const d = `M ${pa.x.toFixed(1)} ${pa.y.toFixed(1)} Q ${cp2.x.toFixed(1)} ${cp2.y.toFixed(1)} ${pb.x.toFixed(1)} ${pb.y.toFixed(1)}`;
        const arcLen = Math.hypot(pb.x - pa.x, pb.y - pa.y) * 1.2;

        strands.push({
          d,
          opacity: lerp(opRange[0] * 0.8, opRange[1] * 0.85, rng()),
          strokeWidth: lerp(swRange[0] * 0.8, swRange[1] * 0.85, rng()),
          layer,
          delay: 1.5 + r * 0.3 + rng() * 1.0,   // Phase 2 timing
          duration: 0.5 + rng() * 0.8,
          length: arcLen,
          id: `${id}-ring-${r}-${i}`,
        });
        strandIdx++;
      }
    }
  }

  // ── Loose hanging strands (top and sides) ─────────────
  const looseCount = isMobile ? 6 : 14;
  for (let i = 0; i < looseCount; i++) {
    const edge = rng();
    let sx: number, sy: number, ex: number, ey: number;
    if (edge < 0.4) {
      // From top
      sx = rng() * w;
      sy = 0;
      ex = sx + (rng() - 0.5) * w * 0.3;
      ey = h * (0.15 + rng() * 0.4);
    } else if (edge < 0.7) {
      // From left
      sx = 0;
      sy = rng() * h * 0.7;
      ex = w * (0.1 + rng() * 0.3);
      ey = sy + (rng() - 0.5) * h * 0.2;
    } else {
      // From right
      sx = w;
      sy = rng() * h * 0.7;
      ex = w * (0.7 + rng() * 0.2);
      ey = sy + (rng() - 0.5) * h * 0.2;
    }

    // Gravity sag
    const cpx = (sx + ex) / 2 + (rng() - 0.5) * 30;
    const cpy = Math.max(sy, ey) + 20 + rng() * 50;
    const d = `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
    const approxLen = Math.hypot(ex - sx, ey - sy) * 1.3;

    strands.push({
      d,
      opacity: 0.2 + rng() * 0.35,
      strokeWidth: 0.5 + rng() * 0.8,
      layer: rng() < 0.5 ? 0 : 1,
      delay: 0.3 + rng() * 2.0,
      duration: 1.0 + rng() * 1.5,
      length: approxLen,
      id: `loose-${i}`,
    });
    strandIdx++;
  }

  return strands;
}

// ── Highlight points (intersection glints) ──────────────
function generateGlints(strands: StrandPath[], rng: () => number, count: number) {
  const glints: { cx: number; cy: number; r: number; delay: number; id: string }[] = [];
  // Pick random strands and place glints along them
  for (let i = 0; i < count; i++) {
    const strand = strands[Math.floor(rng() * strands.length)];
    // Parse a rough midpoint from the path
    const nums = strand.d.match(/-?\d+\.?\d*/g);
    if (!nums || nums.length < 4) continue;
    const midX = (parseFloat(nums[0]) + parseFloat(nums[nums.length - 2])) / 2;
    const midY = (parseFloat(nums[1]) + parseFloat(nums[nums.length - 1])) / 2;
    glints.push({
      cx: midX + (rng() - 0.5) * 15,
      cy: midY + (rng() - 0.5) * 15,
      r: 0.8 + rng() * 1.5,
      delay: 5.0 + rng() * 2.5,   // Phase 3 glint timing
      id: `glint-${i}`,
    });
  }
  return glints;
}


// ── Component ───────────────────────────────────────────────
interface SpiderWebSVGProps {
  width: number;
  height: number;
  seed?: number;
  /** 0–1 progress of the wipe removal (0 = fully visible, 1 = fully gone) */
  wipeProgress: number;
  /** Current animation phase: 'arrival' | 'formation' | 'atmosphere' | 'removal' | 'done' */
  phase: 'arrival' | 'formation' | 'atmosphere' | 'removal' | 'done';
}

const SpiderWebSVG = React.memo(function SpiderWebSVG({
  width, height, seed = 42, wipeProgress, phase,
}: SpiderWebSVGProps) {

  const isMobile = width < 768;

  const { strands, glints } = useMemo(() => {
    if (width === 0 || height === 0) return { strands: [], glints: [] };
    const rng = createRng(seed);
    const clusters = generateClusters(width, height, isMobile, rng);
    const s = generateStrands(clusters, width, height, isMobile, rng);
    const g = generateGlints(s, rng, isMobile ? 8 : 20);
    return { strands: s, glints: g };
  }, [width, height, seed, isMobile]);

  if (phase === 'done' || width === 0) return null;

  // Wipe direction: left-to-right gradient mask
  // wipeProgress 0 → fully visible, 1 → fully hidden
  const maskId = 'haunted-wipe-mask';

  return (
    <svg
      className="haunted-web-svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        {/* Progressive wipe mask — sweeps left to right */}
        <linearGradient id={`${maskId}-grad`} x1="0" y1="0" x2="1" y2="0.3">
          <stop
            offset={`${Math.max(0, wipeProgress * 1.4 - 0.4) * 100}%`}
            stopColor="black"
          />
          <stop
            offset={`${Math.min(1, wipeProgress * 1.4) * 100}%`}
            stopColor="white"
          />
        </linearGradient>
        <mask id={maskId}>
          <rect x="0" y="0" width={width} height={height} fill={`url(#${maskId}-grad)`} />
        </mask>

        {/* Subtle glow filter for foreground strands */}
        <filter id="silk-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Blur filter for background layer */}
        <filter id="silk-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      <g mask={wipeProgress > 0 ? `url(#${maskId})` : undefined}>
        {/* Layer 0: background (blurred, low opacity) */}
        <g filter="url(#silk-blur)" opacity={0.85}>
          {strands.filter(s => s.layer === 0).map((strand) => (
            <path
              key={strand.id}
              d={strand.d}
              fill="none"
              stroke="rgba(200,210,225,1)"
              strokeWidth={strand.strokeWidth}
              strokeLinecap="round"
              opacity={strand.opacity}
              strokeDasharray={strand.length}
              strokeDashoffset={strand.length}
              style={{
                animation: `haunted-strand-draw ${strand.duration}s ease-out ${strand.delay}s forwards`,
              }}
            />
          ))}
        </g>

        {/* Layer 1: mid-ground */}
        <g>
          {strands.filter(s => s.layer === 1).map((strand) => (
            <path
              key={strand.id}
              d={strand.d}
              fill="none"
              stroke="rgba(215,220,235,1)"
              strokeWidth={strand.strokeWidth}
              strokeLinecap="round"
              opacity={strand.opacity}
              strokeDasharray={strand.length}
              strokeDashoffset={strand.length}
              style={{
                animation: `haunted-strand-draw ${strand.duration}s ease-out ${strand.delay}s forwards`,
              }}
            />
          ))}
        </g>

        {/* Layer 2: foreground (glow, crisp) */}
        <g filter="url(#silk-glow)">
          {strands.filter(s => s.layer === 2).map((strand) => (
            <path
              key={strand.id}
              d={strand.d}
              fill="none"
              stroke="rgba(230,235,250,1)"
              strokeWidth={strand.strokeWidth}
              strokeLinecap="round"
              opacity={strand.opacity}
              strokeDasharray={strand.length}
              strokeDashoffset={strand.length}
              style={{
                animation: `haunted-strand-draw ${strand.duration}s ease-out ${strand.delay}s forwards`,
              }}
            />
          ))}
        </g>

        {/* Intersection glints */}
        {(phase === 'atmosphere' || phase === 'removal') && glints.map((g) => (
          <circle
            key={g.id}
            cx={g.cx}
            cy={g.cy}
            r={g.r}
            fill="rgba(255,255,255,0.7)"
            opacity={0}
            style={{
              animation: `haunted-glint 2.5s ease-in-out ${g.delay}s infinite`,
            }}
          />
        ))}
      </g>
    </svg>
  );
});

export { SpiderWebSVG };
export type { SpiderWebSVGProps };
