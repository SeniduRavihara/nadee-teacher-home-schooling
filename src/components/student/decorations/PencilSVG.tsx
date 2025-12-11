interface PencilSVGProps {
  className?: string;
}

export function PencilSVG({ className = "" }: PencilSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="28" y="30" width="48" height="60" rx="10" fill="#FFE17B" />
      <rect x="38" y="24" width="28" height="8" rx="4" fill="#FFB347" />
      <rect x="34" y="84" width="36" height="10" rx="3" fill="#6ED9A0" />
      <path d="M52 94 L60 114 L68 94 Z" fill="#F5C16C" stroke="#D39B4B" strokeWidth="2" />
      <path d="M52 94 L60 108 L68 94 Z" fill="#F8E7D0" />
      <circle cx="44" cy="48" r="3" fill="#74B3FF" />
      <circle cx="44" cy="60" r="3" fill="#74B3FF" />
      <circle cx="44" cy="72" r="3" fill="#74B3FF" />
      <rect x="40" y="46" width="28" height="4" rx="2" fill="#74B3FF" opacity="0.6" />
      <rect x="40" y="58" width="28" height="4" rx="2" fill="#74B3FF" opacity="0.6" />
      <rect x="40" y="70" width="28" height="4" rx="2" fill="#74B3FF" opacity="0.6" />
    </svg>
  );
}
