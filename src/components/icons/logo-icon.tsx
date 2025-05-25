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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m12 14-4-2 4-2 4 2-4 2Z" />
      <path d="M12 14v4" />
      <path d="m10 12-2-1" />
      <path d="m14 12 2-1" />
    </svg>
  );
}
