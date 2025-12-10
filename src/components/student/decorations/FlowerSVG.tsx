interface FlowerSVGProps {
  className?: string;
}

export function FlowerSVG({ className = "" }: FlowerSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <path
        d="M40 60 Q38 75 40 90"
        stroke="#52A447"
        strokeWidth="3"
        fill="none"
      />
      {/* Leaf left */}
      <path
        d="M38 70 Q25 72 20 68"
        stroke="#52A447"
        strokeWidth="2"
        fill="#7FB069"
      />
      {/* Leaf right */}
      <path
        d="M42 75 Q55 77 60 73"
        stroke="#52A447"
        strokeWidth="2"
        fill="#7FB069"
      />
      {/* Petals */}
      <circle cx="40" cy="35" r="8" fill="#FF6B6B" />
      <circle cx="50" cy="40" r="8" fill="#FF6B6B" />
      <circle cx="52" cy="50" r="8" fill="#FF6B6B" />
      <circle cx="40" cy="55" r="8" fill="#FF6B6B" />
      <circle cx="28" cy="50" r="8" fill="#FF6B6B" />
      <circle cx="30" cy="40" r="8" fill="#FF6B6B" />
      {/* Center */}
      <circle cx="40" cy="45" r="7" fill="#FFD93D" />
    </svg>
  );
}

export function FlowerVariant2({ className = "" }: FlowerSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <path
        d="M40 55 Q42 70 40 85"
        stroke="#52A447"
        strokeWidth="3"
        fill="none"
      />
      {/* Petals - Purple flower */}
      <circle cx="40" cy="30" r="8" fill="#B197FC" />
      <circle cx="50" cy="35" r="8" fill="#B197FC" />
      <circle cx="52" cy="45" r="8" fill="#B197FC" />
      <circle cx="40" cy="50" r="8" fill="#B197FC" />
      <circle cx="28" cy="45" r="8" fill="#B197FC" />
      <circle cx="30" cy="35" r="8" fill="#B197FC" />
      {/* Center */}
      <circle cx="40" cy="40" r="7" fill="#FFA94D" />
    </svg>
  );
}
