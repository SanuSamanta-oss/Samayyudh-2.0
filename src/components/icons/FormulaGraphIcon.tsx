import React from 'react';

export function FormulaGraphIcon({ className = 'w-5 h-5', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <g transform="rotate(-5 12 12)">
        {/* Outer Square Grid Frame */}
        <rect
          x="2.5"
          y="2.5"
          width="19"
          height="19"
          rx="0.75"
          strokeWidth="1.3"
          strokeOpacity="0.7"
        />
        {/* Horizontal Grid Lines */}
        <line x1="2.5" y1="6.3" x2="21.5" y2="6.3" strokeWidth="0.8" strokeOpacity="0.5" />
        <line x1="2.5" y1="10.1" x2="21.5" y2="10.1" strokeWidth="0.8" strokeOpacity="0.5" />
        <line x1="2.5" y1="13.9" x2="21.5" y2="13.9" strokeWidth="0.8" strokeOpacity="0.5" />
        <line x1="2.5" y1="17.7" x2="21.5" y2="17.7" strokeWidth="0.8" strokeOpacity="0.5" />
        {/* Vertical Grid Lines */}
        <line x1="6.3" y1="2.5" x2="6.3" y2="21.5" strokeWidth="0.8" strokeOpacity="0.5" />
        <line x1="10.1" y1="2.5" x2="10.1" y2="21.5" strokeWidth="0.8" strokeOpacity="0.5" />
        <line x1="13.9" y1="2.5" x2="13.9" y2="21.5" strokeWidth="0.8" strokeOpacity="0.5" />
        <line x1="17.7" y1="2.5" x2="17.7" y2="21.5" strokeWidth="0.8" strokeOpacity="0.5" />
        {/* Bold Rising Zigzag Graph Plot */}
        <polyline
          points="2.5,19.2 6.8,14.0 10.1,16.0 13.9,7.5 17.5,9.8 21.5,2.5"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

