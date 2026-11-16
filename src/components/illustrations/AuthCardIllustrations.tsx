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

export function SuperAdminWelcomeIllustration({ className = '', size = 180 }: IllustrationProps) {
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

      {/* Circle Crop Container for Super Admin (Snoopy as Executive Boss at Desk) */}
      <div className="relative w-[80%] h-[80%] rounded-full overflow-hidden shadow-[0_12px_28px_-6px_rgba(245,158,11,0.4)] z-0 bg-[#FBBF24]/20">
        <img
          src="/images/super-admin-snoopy.jpg"
          alt="Super Admin Commander"
          className="w-full h-full object-cover object-[62%_38%]"
        />
      </div>
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
      <div className="relative w-[80%] h-[80%] rounded-full overflow-hidden shadow-[0_12px_28px_-6px_rgba(245,158,11,0.4)] z-0 bg-[#FBBF24]/20">
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

