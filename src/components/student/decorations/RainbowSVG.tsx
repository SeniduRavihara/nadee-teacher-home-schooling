interface RainbowSVGProps {
  className?: string;
}

export function RainbowSVG({ className = "" }: RainbowSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 90 Q100 -20 190 90"
        stroke="#FF6B6B"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M10 90 Q100 -10 190 90"
        stroke="#FFA94D"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M10 90 Q100 0 190 90"
        stroke="#FFD93D"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M10 90 Q100 10 190 90"
        stroke="#6BCF7F"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M10 90 Q100 20 190 90"
        stroke="#4D9EFF"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M10 90 Q100 30 190 90"
        stroke="#B197FC"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
