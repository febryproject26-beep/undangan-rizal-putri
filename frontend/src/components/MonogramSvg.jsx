import React from 'react';

export default function MonogramSvg({
  initials = 'R & P',
  subtitle = 'THE WEDDING',
  size = 160,
  strokeColor = '#c5a059',
  textColor = '#c5a059',
  subtextColor = '#8f7e6d',
  className = '',
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className={className}
      aria-label={`Monogram ${initials}`}
      role="img"
    >
      <circle
        cx="80"
        cy="80"
        r="74"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />
      <circle
        cx="80"
        cy="80"
        r="70"
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.75"
      />
      <path
        d="M80 16 C85 30 95 40 110 45 C95 50 85 60 80 74 C75 60 65 50 50 45 C65 40 75 30 80 16 Z"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        opacity="0.6"
      />
      <text
        x="80"
        y="88"
        fontFamily="'Playfair Display', serif"
        fontSize="34"
        fontStyle="italic"
        fontWeight="600"
        fill={textColor}
        textAnchor="middle"
        letterSpacing="2"
      >
        {initials}
      </text>
      <text
        x="80"
        y="108"
        fontFamily="'Montserrat', sans-serif"
        fontSize="9"
        fontWeight="400"
        fill={subtextColor}
        textAnchor="middle"
        letterSpacing="4"
      >
        {subtitle}
      </text>
    </svg>
  );
}

