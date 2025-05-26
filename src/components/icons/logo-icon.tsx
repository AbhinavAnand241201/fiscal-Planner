
import type React from 'react';

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  // You can add any custom props here if needed
}

export function LogoIcon({ width = 24, height = 24, ...props }: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Compass-like design */}
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 2 10 10 2 12 10 14 12 22 14 14 22 12 14 10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
