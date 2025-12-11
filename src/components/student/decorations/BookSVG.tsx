interface BookSVGProps {
  className?: string;
}

export function BookSVG({ className = "" }: BookSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="28" width="44" height="70" rx="8" fill="#74B3FF" />
      <rect x="76" y="28" width="44" height="70" rx="8" fill="#6ED9A0" />
      <rect x="24" y="36" width="36" height="54" rx="6" fill="white" opacity="0.9" />
      <rect x="80" y="36" width="36" height="54" rx="6" fill="white" opacity="0.9" />
      <path d="M64 30 L76 30 L76 98 L64 98 Z" fill="#F5C16C" />
      <rect x="32" y="46" width="20" height="6" rx="3" fill="#B197FC" opacity="0.7" />
      <rect x="32" y="58" width="20" height="6" rx="3" fill="#B197FC" opacity="0.7" />
      <rect x="88" y="46" width="20" height="6" rx="3" fill="#FFB347" opacity="0.7" />
      <rect x="88" y="58" width="20" height="6" rx="3" fill="#FFB347" opacity="0.7" />
    </svg>
  );
}
