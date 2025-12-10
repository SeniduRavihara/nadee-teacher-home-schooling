interface BalloonSVGProps {
  className?: string;
  color?: string;
}

export function BalloonSVG({
  className = "",
  color = "#FF6B6B",
}: BalloonSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Balloon */}
      <ellipse cx="30" cy="30" rx="22" ry="28" fill={color} />
      <ellipse cx="22" cy="22" rx="8" ry="10" fill="white" opacity="0.4" />
      {/* Knot */}
      <path
        d="M30 58 Q28 62 30 66"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* String */}
      <path
        d="M30 66 Q32 75 28 85 Q26 95 30 100"
        stroke="#999"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
