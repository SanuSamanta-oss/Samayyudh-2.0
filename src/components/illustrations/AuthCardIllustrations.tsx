'use client';

import React from 'react';

/**
 * Premium 2D Vector Illustrations matching the design reference:
 * - Bright warm amber/yellow backdrop blob (#FBBF24 / #F59E0B)
 * - Hand-crafted black & white character linework with expressive details
 * - Playful floating geometric elements (confetti, squares, rings)
 * - Zero outlines on containers, smooth SVG rendering
 */

interface IllustrationProps {
  className?: string;
  size?: number;
}

export function RoleStudentIllustration({ className = '', size = 180 }: IllustrationProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Decorative SVG Orbit & Floating Accents */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full overflow-visible z-10"
      >
        <circle cx="100" cy="100" r="82" stroke="#18181B" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.35" />
        <circle cx="28" cy="72" r="5" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
        <rect x="165" y="85" width="8" height="8" rx="2" stroke="#18181B" strokeWidth="1.5" fill="none" transform="rotate(15 165 85)" />
        <rect x="42" y="152" width="6" height="6" rx="1.5" fill="#18181B" transform="rotate(45 42 152)" />
        <path d="M152 42 L158 48 M158 42 L152 48" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="78" cy="26" r="2.5" fill="#18181B" />
        <circle cx="132" cy="28" r="2.5" fill="#F59E0B" />
      </svg>

      {/* Circle Crop Container for Student (Shinchan meditating) */}
      <div className="relative w-[80%] h-[80%] rounded-full overflow-hidden shadow-[0_12px_28px_-6px_rgba(245,158,11,0.38)] z-0 bg-[#FBBF24]/20">
        <img
          src="/images/student-shinchan.jpg"
          alt="Student"
          className="w-full h-full object-cover object-[center_38%]"
        />
      </div>
    </div>
  );
}

export function RoleTeacherIllustration({ className = '', size = 180 }: IllustrationProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Decorative SVG Orbit & Floating Accents */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full overflow-visible z-10"
      >
        <circle cx="100" cy="100" r="82" stroke="#18181B" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.35" />
        <circle cx="170" cy="74" r="5" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
        <rect x="25" y="80" width="8" height="8" rx="2" stroke="#18181B" strokeWidth="1.5" fill="none" transform="rotate(-15 25 80)" />
        <path d="M42 45 L48 51 M48 45 L42 51" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="160" cy="140" r="3" fill="#18181B" />
        <circle cx="36" cy="130" r="2.5" fill="#F59E0B" />
      </svg>

      {/* Circle Crop Container for Teacher (Ice Bear teaching math) */}
      <div className="relative w-[80%] h-[80%] rounded-full overflow-hidden shadow-[0_12px_28px_-6px_rgba(245,158,11,0.38)] z-0 bg-[#FBBF24]/20">
        <img
          src="/images/teacher-icebear.jpg"
          alt="Teacher"
          className="w-full h-full object-cover object-[center_35%]"
        />
      </div>
    </div>
  );
}

export function SuperAdminWelcomeIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="adminYellowGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.55" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>
          <filter id="softShadowAdmin" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#F59E0B" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Large golden shield / circular sun backdrop */}
        <path
          d="M100 16 C152 16, 186 52, 182 100 C178 148, 146 184, 100 184 C54 184, 18 148, 18 100 C18 52, 52 16, 100 16 Z"
          fill="url(#adminYellowGrad)"
          filter="url(#softShadowAdmin)"
        />

        {/* Orbit ring with command telemetry ticks */}
        <circle cx="100" cy="100" r="84" stroke="#18181B" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.4" />
        <circle cx="26" cy="65" r="5" stroke="#F59E0B" strokeWidth="2" fill="#FFFFFF" />
        <rect x="168" y="90" width="7" height="7" rx="1.5" stroke="#18181B" strokeWidth="1.5" fill="none" transform="rotate(25 168 90)" />

        {/* Floating Command Crown / Laurel above */}
        <g transform="translate(76, 28)">
          <path
            d="M5 22 L12 8 L24 16 L36 8 L43 22 Z"
            fill="#18181B"
          />
          <circle cx="12" cy="7" r="2.5" fill="#FDE047" />
          <circle cx="24" cy="14" r="2.5" fill="#FDE047" />
          <circle cx="36" cy="7" r="2.5" fill="#FDE047" />
        </g>

        {/* Ground platform */}
        <ellipse cx="100" cy="162" rx="58" ry="12" fill="#18181B" />

        {/* Commanding Guardian Mascot / Figure */}
        {/* Shoulders / Robe */}
        <path
          d="M58 158 C58 120, 75 102, 100 102 C125 102, 142 120, 142 158 Z"
          fill="#18181B"
        />

        {/* Golden Central Insignia Plate on Chest */}
        <path
          d="M90 120 H110 L106 142 H94 Z"
          fill="#FDE047"
        />
        <circle cx="100" cy="130" r="3" fill="#18181B" />

        {/* Left hand holding Command Key */}
        <path
          d="M66 136 C52 118, 56 94, 68 84"
          stroke="#18181B"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <g transform="translate(56, 60) rotate(-25)">
          <circle cx="12" cy="12" r="8" fill="#FDE047" stroke="#18181B" strokeWidth="2.5" />
          <circle cx="12" cy="12" r="3.5" fill="#18181B" />
          <rect x="10" y="20" width="4" height="18" rx="2" fill="#18181B" />
          <rect x="14" y="28" width="5" height="3" rx="1" fill="#18181B" />
          <rect x="14" y="34" width="5" height="3" rx="1" fill="#18181B" />
        </g>

        {/* Right hand holding System Console Shield */}
        <path
          d="M134 136 C148 118, 144 94, 132 84"
          stroke="#18181B"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <g transform="translate(122, 64) rotate(15)">
          <path
            d="M5 5 H25 V20 C25 28, 15 34, 15 34 C15 34, 5 28, 5 20 Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="2.5"
          />
          <path d="M11 16 L14 19 L20 12" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Super Admin Head & Visor */}
        <ellipse cx="100" cy="80" rx="17" ry="19" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
        {/* High-tech Command Visor / Glasses */}
        <rect x="86" y="74" width="28" height="9" rx="4.5" fill="#18181B" />
        <rect x="89" y="77" width="10" height="3" rx="1.5" fill="#FDE047" />
        <circle cx="108" cy="78.5" r="1.5" fill="#38BDF8" />

        {/* Confetti & sparkles */}
        <circle cx="48" cy="48" r="2.5" fill="#18181B" />
        <circle cx="152" cy="46" r="3" fill="#18181B" />
        <path d="M158 132 L164 138 M164 132 L158 138" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function TeacherVerificationIllustration({ className = '', size = 180 }: IllustrationProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Decorative SVG Orbit & Floating Accents */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full overflow-visible z-10"
      >
        <circle cx="100" cy="100" r="82" stroke="#18181B" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.35" />
        <circle cx="28" cy="72" r="5" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
        <rect x="165" y="85" width="8" height="8" rx="2" stroke="#18181B" strokeWidth="1.5" fill="none" transform="rotate(15 165 85)" />
        <rect x="42" y="152" width="6" height="6" rx="1.5" fill="#18181B" transform="rotate(45 42 152)" />
        <circle cx="160" cy="140" r="3" fill="#18181B" />
        <circle cx="100" cy="18" r="3" fill="#F59E0B" />
      </svg>

      {/* Circle Crop Container for Teaching Community (Teacher at blackboard with students) */}
      <div className="relative w-[82%] h-[82%] rounded-full overflow-hidden shadow-[0_14px_32px_-6px_rgba(245,158,11,0.4)] z-0 bg-[#FBBF24]/20">
        <img
          src="/images/teacher-classroom-vintage.jpg"
          alt="Welcome to Teaching Community"
          className="w-full h-full object-cover object-[center_68%]"
        />
      </div>
    </div>
  );
}

export function SecurityPasskeyIllustration({ className = '', size = 180 }: IllustrationProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="passkeyYellowGrad" x1="30" y1="20" x2="170" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.6" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
          <filter id="softShadowPasskey" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#F59E0B" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Ambient yellow blob */}
        <path
          d="M100 18 C144 18, 180 54, 176 100 C172 144, 142 180, 98 180 C54 180, 22 144, 22 100 C22 56, 56 18, 100 18 Z"
          fill="url(#passkeyYellowGrad)"
          filter="url(#softShadowPasskey)"
        />

        <circle cx="100" cy="100" r="82" stroke="#18181B" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.35" />

        {/* Large Vault Padlock in Center */}
        <g transform="translate(68, 55)">
          {/* Padlock Shackle */}
          <path
            d="M18 36 V20 C18 9, 27 0, 36 0 C45 0, 54 9, 54 20 V36"
            stroke="#18181B"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          {/* Padlock Body */}
          <rect y="32" width="72" height="64" rx="16" fill="#18181B" />
          <rect x="6" y="38" width="60" height="52" rx="12" fill="#FFFFFF" />
          {/* Golden Keyhole */}
          <circle cx="36" cy="60" r="7" fill="#F59E0B" />
          <polygon points="33,64 39,64 41,74 31,74" fill="#F59E0B" />
        </g>

        {/* Floating security sparkles & keys */}
        <circle cx="45" cy="50" r="3" fill="#18181B" />
        <rect x="150" y="60" width="7" height="7" rx="2" stroke="#18181B" strokeWidth="1.5" fill="none" transform="rotate(20 150 60)" />
        <path d="M42 140 L48 146 M48 140 L42 146" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="160" cy="130" r="4" fill="#F59E0B" />
      </svg>
    </div>
  );
}

