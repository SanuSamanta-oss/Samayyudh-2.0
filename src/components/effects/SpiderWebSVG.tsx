'use client';

// ============================================================
// SamayYudh 2.0 — Photorealistic Spider-Web SVG Renderer
// Inspired directly by atmospheric haunted cobweb photography:
// Dense gossamer veils, illuminated primary silk tension cables,
// organic polygonal sheets, and delicate dew glints.
// ============================================================

import React, { useMemo } from 'react';

// ── Seeded PRNG (Mulberry32) ────────────────────────────────
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
interface Point {
  x: number;
  y: number;
}

interface StrandPath {
  d: string;
  opacity: number;
  strokeWidth: number;
  layer: number; // 0 = background blur, 1 = midground, 2 = foreground glow
  delay: number; // seconds
  duration: number; // seconds
  length: number;
  id: string;
  color?: string;
}

interface Glint {
  cx: number;
  cy: number;
  r: number;
  delay: number;
  id: string;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function polarToCart(cx: number, cy: number, angle: number, radius: number): Point {
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
}

// ── Web Generation ──────────────────────────────────────────
function generateHauntedWebs(
  w: number,
  h: number,
  isMobile: boolean,
  rng: () => number
): { strands: StrandPath[]; glints: Glint[] } {
  const strands: StrandPath[] = [];
  let strandCounter = 0;

  // Helper to add strand
  const addStrand = (
    d: string,
    layer: number,
    baseLen: number,
    opt?: {
      opacity?: number;
      strokeWidth?: number;
      delay?: number;
      duration?: number;
      color?: string;
    }
  ) => {
    const sw = opt?.strokeWidth ?? (layer === 2 ? 1.6 : layer === 1 ? 0.9 : 0.6);
    const op = opt?.opacity ?? (layer === 2 ? 0.85 : layer === 1 ? 0.6 : 0.35);
    const del = opt?.delay ?? 0.2 + rng() * 1.8;
    const dur = opt?.duration ?? 0.8 + rng() * 1.4;

    strands.push({
      d,
      layer,
      strokeWidth: sw,
      opacity: op,
      delay: del,
      duration: dur,
      length: Math.max(20, Math.round(baseLen)),
      id: `sw-${strandCounter++}`,
      color: opt?.color,
    });
  };

  // 1. PRIMARY STRUCTURAL TENSION CABLES (Like the reference photo)
  // Sweeping diagonal silk ropes with 2-3 bundled parallel micro-fibers
  const cableAnchors: [Point, Point, Point][] = [
    // Top-left across to top-center
    [
      { x: 0, y: h * 0.05 },
      { x: w * 0.45, y: h * 0.18 },
      { x: w * 0.95, y: h * 0.02 },
    ],
    // Deep swoop from top-left toward center
    [
      { x: w * 0.02, y: h * 0.12 },
      { x: w * 0.35, y: h * 0.42 },
      { x: w * 0.75, y: h * 0.52 },
    ],
    // Transverse bridge from mid-left to mid-right
    [
      { x: 0, y: h * 0.48 },
      { x: w * 0.52, y: h * 0.58 },
      { x: w, y: h * 0.38 },
    ],
    // Top-right drape across corner
    [
      { x: w * 0.65, y: 0 },
      { x: w * 0.82, y: h * 0.28 },
      { x: w, y: h * 0.72 },
    ],
    // Bottom sweeping veil support
    [
      { x: w * 0.05, y: h * 0.78 },
      { x: w * 0.42, y: h * 0.88 },
      { x: w * 0.92, y: h * 0.96 },
    ],
  ];

  cableAnchors.forEach(([p1, cp, p2], cIdx) => {
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y) * 1.15;
    // Bundle of 3 micro-strands
    [-2, 0, 2.5].forEach((offsetY, subIdx) => {
      const d = `M ${p1.x.toFixed(1)} ${(p1.y + offsetY).toFixed(1)} Q ${cp.x.toFixed(1)} ${(cp.y + offsetY * 1.2).toFixed(1)} ${p2.x.toFixed(1)} ${(p2.y + offsetY).toFixed(1)}`;
      addStrand(d, subIdx === 1 ? 2 : 1, dist, {
        strokeWidth: subIdx === 1 ? (isMobile ? 1.6 : 2.4) : (isMobile ? 0.8 : 1.2),
        opacity: subIdx === 1 ? 0.95 : 0.6,
        delay: 0.1 + cIdx * 0.25 + subIdx * 0.1,
        duration: 1.2,
      });
    });
  });

  // 2. DENSE ORGANIC COBWEB CLUSTERS (Corners and anchor hubs)
  // Instead of plain geometric circles, realistic irregular spider web sheets
  const clusterDefs = [
    // Top Left (Massive dense corner veil)
    { cx: w * 0.02, cy: h * 0.03, count: isMobile ? 14 : 22, maxR: w * 0.45, rings: isMobile ? 6 : 10, layer: 1 },
    // Top Right (High intricate corner)
    { cx: w * 0.98, cy: h * 0.04, count: isMobile ? 12 : 20, maxR: w * 0.4, rings: isMobile ? 6 : 9, layer: 1 },
    // Center-left suspended web
    { cx: w * 0.32, cy: h * 0.45, count: isMobile ? 10 : 16, maxR: w * 0.25, rings: isMobile ? 4 : 7, layer: 2 },
    // Right mid suspended web
    { cx: w * 0.88, cy: h * 0.5, count: isMobile ? 9 : 14, maxR: w * 0.26, rings: isMobile ? 4 : 6, layer: 1 },
    // Bottom left corner web
    { cx: w * 0.04, cy: h * 0.96, count: isMobile ? 10 : 16, maxR: w * 0.32, rings: isMobile ? 4 : 7, layer: 1 },
    // Deep background broad web
    { cx: w * 0.62, cy: h * 0.2, count: isMobile ? 8 : 14, maxR: w * 0.35, rings: 5, layer: 0 },
  ];

  clusterDefs.forEach(({ cx, cy, count, maxR, rings, layer }, cIdx) => {
    const spokes: { angle: number; len: number; end: Point }[] = [];
    let curAngle = rng() * Math.PI * 2;

    // Build radiating spokes with natural organic irregularity
    for (let i = 0; i < count; i++) {
      curAngle += (Math.PI * 2 / count) * (0.7 + rng() * 0.6);
      const len = lerp(maxR * 0.35, maxR, 0.4 + rng() * 0.6);
      const end = polarToCart(cx, cy, curAngle, len);
      spokes.push({ angle: curAngle, len, end });

      // Spoke curvature
      const mid = polarToCart(cx, cy, curAngle, len * 0.5);
      const perp = curAngle + Math.PI / 2;
      const wobble = (rng() - 0.5) * len * 0.08;
      const cp = { x: mid.x + Math.cos(perp) * wobble, y: mid.y + Math.sin(perp) * wobble };
      const d = `M ${cx.toFixed(1)} ${cy.toFixed(1)} Q ${cp.x.toFixed(1)} ${cp.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;

      addStrand(d, layer, len, {
        strokeWidth: layer === 2 ? 1.4 : 0.85,
        opacity: layer === 2 ? 0.8 : 0.55,
        delay: 0.1 + cIdx * 0.2 + (i / count) * 0.8,
        duration: 0.9,
      });
    }

    // Build connecting web spirals / sheets between spokes
    for (let r = 0; r < rings; r++) {
      const ringRadius = lerp(maxR * 0.12, maxR * 0.92, (r + 0.6) / rings);

      for (let i = 0; i < spokes.length; i++) {
        const next = (i + 1) % spokes.length;
        if (ringRadius > spokes[i].len * 0.96 || ringRadius > spokes[next].len * 0.96) continue;

        // Skip random sections for broken/haunted antique feel
        if (rng() < 0.12) continue;

        const pA = polarToCart(cx, cy, spokes[i].angle, ringRadius);
        const pB = polarToCart(cx, cy, spokes[next].angle, ringRadius);

        // Sagging silk arc
        const midAngle = (spokes[i].angle + spokes[next].angle) / 2;
        const sag = ringRadius * (0.04 + rng() * 0.07);
        const cp = polarToCart(cx, cy, midAngle, ringRadius - sag);

        const arcLen = Math.hypot(pB.x - pA.x, pB.y - pA.y) * 1.15;
        const d = `M ${pA.x.toFixed(1)} ${pA.y.toFixed(1)} Q ${cp.x.toFixed(1)} ${cp.y.toFixed(1)} ${pB.x.toFixed(1)} ${pB.y.toFixed(1)}`;

        addStrand(d, layer, arcLen, {
          strokeWidth: layer === 2 ? 1.1 : 0.65,
          opacity: (layer === 2 ? 0.75 : 0.48) * (0.7 + rng() * 0.4),
          delay: 1.2 + r * 0.25 + rng() * 0.9,
          duration: 0.7,
        });

        // Delicate micro-mesh crossover thread
        if (rng() < 0.4) {
          const crossA = polarToCart(cx, cy, spokes[i].angle, ringRadius * 0.94);
          const crossB = polarToCart(cx, cy, spokes[next].angle, ringRadius * 1.04);
          const crossD = `M ${crossA.x.toFixed(1)} ${crossA.y.toFixed(1)} L ${crossB.x.toFixed(1)} ${crossB.y.toFixed(1)}`;
          addStrand(crossD, 0, arcLen * 0.9, {
            strokeWidth: 0.45,
            opacity: 0.32,
            delay: 2.0 + rng() * 1.5,
            duration: 0.6,
          });
        }
      }
    }
  });

  // 3. LOOSE HANGING WISPS & VERTICAL DRAPES (Abandoned mansion cobwebs)
  const looseCount = isMobile ? 12 : 24;
  for (let i = 0; i < looseCount; i++) {
    const sx = rng() * w;
    const sy = rng() < 0.65 ? 0 : rng() * h * 0.35;
    const lenY = lerp(h * 0.15, h * 0.55, rng());
    const ex = sx + (rng() - 0.5) * w * 0.18;
    const ey = sy + lenY;

    const cpx = (sx + ex) / 2 + (rng() - 0.5) * 45;
    const cpy = sy + lenY * (0.45 + rng() * 0.2);

    const d = `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
    const approxLen = Math.hypot(ex - sx, ey - sy) * 1.1;

    addStrand(d, rng() < 0.5 ? 0 : 1, approxLen, {
      strokeWidth: 0.5 + rng() * 0.7,
      opacity: 0.25 + rng() * 0.35,
      delay: 0.4 + rng() * 2.2,
      duration: 1.2 + rng() * 1.0,
    });
  }

  // 4. DEW / MOONLIGHT GLINT PARTICLES AT SILK INTERSECTIONS
  const glints: Glint[] = [];
  const glintCount = isMobile ? 16 : 38;
  for (let i = 0; i < glintCount; i++) {
    const strand = strands[Math.floor(rng() * strands.length)];
    const nums = strand.d.match(/-?\d+\.?\d*/g);
    if (!nums || nums.length < 4) continue;
    const midX = (parseFloat(nums[0]) + parseFloat(nums[nums.length - 2])) / 2;
    const midY = (parseFloat(nums[1]) + parseFloat(nums[nums.length - 1])) / 2;

    glints.push({
      cx: midX + (rng() - 0.5) * 12,
      cy: midY + (rng() - 0.5) * 12,
      r: 0.7 + rng() * 1.6,
      delay: 4.0 + rng() * 3.0,
      id: `glint-${i}`,
    });
  }

  return { strands, glints };
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
  width,
  height,
  seed = 42,
  wipeProgress,
  phase,
}: SpiderWebSVGProps) {
  const isMobile = width < 768;

  const { strands, glints } = useMemo(() => {
    if (width === 0 || height === 0) return { strands: [], glints: [] };
    const rng = createRng(seed);
    return generateHauntedWebs(width, height, isMobile, rng);
  }, [width, height, seed, isMobile]);

  if (phase === 'done' || width === 0) return null;

  const maskId = 'haunted-wipe-mask';

  return (
    <svg
      className="haunted-web-svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Progressive Left-to-Right Dissolve / Wipe Mask */}
        <linearGradient id={`${maskId}-grad`} x1="0" y1="0" x2="1" y2="0.2">
          <stop
            offset={`${Math.max(0, wipeProgress * 1.45 - 0.45) * 100}%`}
            stopColor="black"
          />
          <stop
            offset={`${Math.min(1, wipeProgress * 1.45) * 100}%`}
            stopColor="white"
          />
        </linearGradient>
        <mask id={maskId}>
          <rect x="0" y="0" width={width} height={height} fill={`url(#${maskId}-grad)`} />
        </mask>

        {/* Luminous Silk Glow for structural tension cables */}
        <filter id="silk-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Atmospheric Blur for background gossamer veil */}
        <filter id="silk-blur" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      <g mask={wipeProgress > 0 ? `url(#${maskId})` : undefined}>
        {/* Layer 0: Background Deep Gossamer Veil (Soft blur, eerie depth) */}
        <g filter="url(#silk-blur)" opacity={0.75}>
          {strands
            .filter((s) => s.layer === 0)
            .map((strand) => (
              <path
                key={strand.id}
                d={strand.d}
                fill="none"
                stroke="rgba(195, 210, 235, 0.95)"
                strokeWidth={strand.strokeWidth}
                strokeLinecap="round"
                opacity={strand.opacity}
                style={
                  {
                    '--strand-length': strand.length,
                    strokeDasharray: strand.length,
                    strokeDashoffset: strand.length,
                    animation: `haunted-strand-draw ${strand.duration}s ease-out ${strand.delay}s forwards`,
                  } as React.CSSProperties
                }
              />
            ))}
        </g>

        {/* Layer 1: Midground Intricate Web Mesh (Crisp, silvery, delicate) */}
        <g>
          {strands
            .filter((s) => s.layer === 1)
            .map((strand) => (
              <path
                key={strand.id}
                d={strand.d}
                fill="none"
                stroke="rgba(225, 235, 250, 0.95)"
                strokeWidth={strand.strokeWidth}
                strokeLinecap="round"
                opacity={strand.opacity}
                style={
                  {
                    '--strand-length': strand.length,
                    strokeDasharray: strand.length,
                    strokeDashoffset: strand.length,
                    animation: `haunted-strand-draw ${strand.duration}s ease-out ${strand.delay}s forwards`,
                  } as React.CSSProperties
                }
              />
            ))}
        </g>

        {/* Layer 2: Foreground Illuminated Silk Cables (Glow, radiant silver) */}
        <g filter="url(#silk-glow)">
          {strands
            .filter((s) => s.layer === 2)
            .map((strand) => (
              <path
                key={strand.id}
                d={strand.d}
                fill="none"
                stroke="rgba(245, 250, 255, 1)"
                strokeWidth={strand.strokeWidth}
                strokeLinecap="round"
                opacity={strand.opacity}
                style={
                  {
                    '--strand-length': strand.length,
                    strokeDasharray: strand.length,
                    strokeDashoffset: strand.length,
                    animation: `haunted-strand-draw ${strand.duration}s ease-out ${strand.delay}s forwards`,
                  } as React.CSSProperties
                }
              />
            ))}
        </g>

        {/* Moonlight / Dew Glints at Silk Intersections */}
        {(phase === 'atmosphere' || phase === 'removal') &&
          glints.map((g) => (
            <circle
              key={g.id}
              cx={g.cx}
              cy={g.cy}
              r={g.r}
              fill="rgba(255, 255, 255, 0.95)"
              opacity={0}
              style={{
                animation: `haunted-glint 2.6s ease-in-out ${g.delay}s infinite`,
              }}
            />
          ))}
      </g>
    </svg>
  );
});

export { SpiderWebSVG };
export type { SpiderWebSVGProps };
