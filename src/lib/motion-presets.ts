// ============================================================
// SamayYudh 2.0 — Global Motion & Animation Language
// High-performance Framer Motion presets supporting reduced-motion
// ============================================================

import type { Variants, Transition } from 'framer-motion';

// Standard spring transitions
export const smoothSpring: Transition = {
  type: 'spring',
  damping: 26,
  stiffness: 340,
  mass: 0.9,
};

export const softSpring: Transition = {
  type: 'spring',
  damping: 30,
  stiffness: 280,
  mass: 1,
};

export const gentleEase: Transition = {
  duration: 0.28,
  ease: [0.16, 1, 0.3, 1],
};

// 1. Page Entrance & Exit
export const pageMotionVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
};

// 2. Modal / Dialog Entrance & Exit
export const modalMotionVariants: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: softSpring },
  exit: { opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.18, ease: 'easeIn' } },
};

// 3. Drawer / Side Panel Sliding
export const drawerSlideVariants: Variants = {
  initial: { opacity: 0, x: '100%' },
  animate: { opacity: 1, x: 0, transition: softSpring },
  exit: { opacity: 0, x: '100%', transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
};

// 4. Floating Controls (Bubble / Calculator)
export const floatingControlVariants: Variants = {
  initial: { opacity: 0, scale: 0.88, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0, transition: smoothSpring },
  exit: { opacity: 0, scale: 0.88, y: 16, transition: { duration: 0.18 } },
};

// 5. Dropdown & Accordion Expansion
export const dropdownMotionVariants: Variants = {
  initial: { opacity: 0, height: 0, y: -4 },
  animate: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, height: 0, y: -4, transition: { duration: 0.16, ease: 'easeIn' } },
};

// 6. OTP Digit Shake on Invalid
export const otpShakeVariants: Variants = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.45 },
  },
};

// 7. Live Indicator Pulse (Restrained & non-distracting)
export const livePulseVariants: Variants = {
  pulse: {
    scale: [1, 1.08, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 2.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// 8. Notification Arrival (Toast / Alert)
export const notificationArrivalVariants: Variants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: smoothSpring },
  exit: { opacity: 0, y: -16, scale: 0.95, transition: { duration: 0.2 } },
};

// 9. Card Stagger Container
export const staggerContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

// 10. QR Scanning Laser Continuous Motion
export const qrScanningLaserVariants: Variants = {
  scan: {
    y: ['0%', '100%', '0%'],
    transition: {
      duration: 2.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
