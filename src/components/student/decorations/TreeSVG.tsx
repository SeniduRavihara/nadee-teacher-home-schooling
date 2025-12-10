interface TreeSVGProps {
  className?: string;
}

export function TreeSVG({ className = "" }: TreeSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Trunk */}
      <rect x="32" y="70" width="16" height="50" rx="2" fill="#8B5A3C" />
      {/* Leaves - Three layers */}
      <circle cx="40" cy="40" r="30" fill="#52A447" />
      <circle cx="25" cy="50" r="25" fill="#52A447" />
      <circle cx="55" cy="50" r="25" fill="#52A447" />
      <circle cx="40" cy="60" r="28" fill="#7FB069" />
    </svg>
  );
}

export function TreeVariant2({ className = "" }: TreeSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Trunk */}
      <rect x="42" y="85" width="16" height="55" rx="3" fill="#A0826D" />
      {/* Triangle leaves */}
      <path d="M50 20 L20 70 L80 70 Z" fill="#52A447" />
      <path d="M50 40 L25 80 L75 80 Z" fill="#7FB069" />
      <path d="M50 60 L30 90 L70 90 Z" fill="#52A447" />
    </svg>
  );
}
