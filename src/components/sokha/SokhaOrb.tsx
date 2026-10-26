'use client';

// ============================================================
// SamayYudh 2.0 — SokhaOrb / Mystic Chakra Reference
// Forwards directly to SokhaChakra for the exact Doctor Strange / Vedic
// rotating golden-amber chakra animation from Pinterest (pin.it/2JZL1HP2o).
// ============================================================

import React from 'react';
import { SokhaChakra } from './SokhaChakra';

interface SokhaOrbProps {
  size?: 'sm' | 'md' | 'lg';
  isThinking?: boolean;
  className?: string;
}

export function SokhaOrb(props: SokhaOrbProps) {
  return <SokhaChakra {...props} />;
}
