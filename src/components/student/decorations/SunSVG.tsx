interface SunSVGProps {
  className?: string;
}

export function SunSVG({ className = "" }: SunSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rays */}
      <line
        x1="60"
        y1="10"
        x2="60"
        y2="25"
        stroke="#FFD93D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="88"
        y1="18"
        x2="78"
        y2="28"
        stroke="#FFD93D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="110"
        y1="60"
        x2="95"
        y2="60"
        stroke="#FFD93D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="102"
        y1="102"
        x2="92"
        y2="92"
        stroke="#FFD93D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="60"
        y1="110"
        x2="60"
        y2="95"
        stroke="#FFD93D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="102"
        x2="28"
        y2="92"
        stroke="#FFD93D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="60"
        x2="25"
        y2="60"
        stroke="#FFD93D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="18"
        x2="28"
        y2="28"
        stroke="#FFD93D"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Sun circle */}
      <circle cx="60" cy="60" r="28" fill="#FFE17B" />
      <circle cx="60" cy="60" r="24" fill="#FFD93D" />

      {/* Face */}
      <circle cx="52" cy="55" r="3" fill="#FF9E00" />
      <circle cx="68" cy="55" r="3" fill="#FF9E00" />
      <path
        d="M50 68 Q60 75 70 68"
        stroke="#FF9E00"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
