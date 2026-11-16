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

        {/* Ambient yellow circular sun backdrop */}
        <path
          d="M100 18 C144 18, 180 54, 176 100 C172 144, 142 180, 98 180 C54 180, 22 144, 22 100 C22 56, 56 18, 100 18 Z"
          fill="url(#passkeyYellowGrad)"
          filter="url(#softShadowPasskey)"
        />

        {/* Orbit circle with telemetry dashed line */}
        <circle cx="100" cy="100" r="82" stroke="#18181B" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.35" />

        {/* Floating Academic Cap / Command Laurel at top right */}
        <g transform="translate(128, 36) rotate(12)">
          <polygon points="20,4 38,12 20,20 2,12" fill="#18181B" />
          <polygon points="10,16 10,24 30,24 30,16" fill="#18181B" />
          <path d="M36 12 L38 26" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
          <circle cx="38" cy="27" r="2.5" fill="#FDE047" />
        </g>

        {/* Ground platform */}
        <ellipse cx="100" cy="156" rx="55" ry="12" fill="#18181B" />

        {/* Verified Security Pedestal & Identity Stand */}
        <path
          d="M68 152 C68 124, 80 110, 100 110 C120 110, 132 124, 132 152 Z"
          fill="#FFFFFF"
        />
        {/* Telemetry points */}
        <circle cx="86" cy="130" r="2" fill="#18181B" />
        <circle cx="104" cy="128" r="2" fill="#18181B" />
        <circle cx="95" cy="142" r="2" fill="#18181B" />

        {/* Head / top kiosk curvature */}
        <circle cx="100" cy="86" r="16" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
        <path d="M96 93 Q100 96 104 93" stroke="#18181B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path
          d="M84 82 C84 70, 96 66, 100 66 C108 66, 116 70, 116 82 Z"
          fill="#18181B"
        />
        <circle cx="82" cy="74" r="6" fill="#18181B" />

        {/* Big ID Badge & Passkey Credential held in front */}
        <g transform="translate(75, 78)">
          <rect width="50" height="60" rx="8" fill="#18181B" />
          {/* Lanyard / Passkey clip */}
          <rect x="20" y="-8" width="10" height="10" rx="2" fill="#FDE047" />
          {/* Inner card */}
          <rect x="4" y="4" width="42" height="52" rx="6" fill="#FFFFFF" />
          {/* Photo / Key frame */}
          <rect x="8" y="8" width="16" height="18" rx="3" fill="#FDE047" />
          <circle cx="16" cy="15" r="4" fill="#18181B" />
          {/* Credential telemetry lines */}
          <line x1="28" y1="11" x2="40" y2="11" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="17" x2="38" y2="17" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="28" y1="23" x2="42" y2="23" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          {/* Verified Checkmark Seal */}
          <circle cx="25" cy="40" r="10" fill="#F59E0B" />
          <path d="M21 40 L24 43 L29 37" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Floating geometric particles */}
        <circle cx="45" cy="55" r="3" fill="#18181B" />
        <rect x="156" y="105" width="6" height="6" rx="1.5" fill="#18181B" transform="rotate(45 156 105)" />
      </svg>
    </div>
  );
}

