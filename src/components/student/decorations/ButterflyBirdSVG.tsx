interface ButterflyBirdSVGProps {
  className?: string;
}

export function ButterflySVG({ className = "" }: ButterflyBirdSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left wings */}
      <ellipse
        cx="25"
        cy="35"
        rx="18"
        ry="25"
        fill="#FF6B6B"
        transform="rotate(-20 25 35)"
      />
      <ellipse
        cx="20"
        cy="50"
        rx="15"
        ry="20"
        fill="#FFA94D"
        transform="rotate(-10 20 50)"
      />

      {/* Right wings */}
      <ellipse
        cx="75"
        cy="35"
        rx="18"
        ry="25"
        fill="#FF6B6B"
        transform="rotate(20 75 35)"
      />
      <ellipse
        cx="80"
        cy="50"
        rx="15"
        ry="20"
        fill="#FFA94D"
        transform="rotate(10 80 50)"
      />

      {/* Body */}
      <ellipse cx="50" cy="40" rx="8" ry="30" fill="#333" />

      {/* Head */}
      <circle cx="50" cy="20" r="7" fill="#333" />

      {/* Antennae */}
      <path
        d="M48 15 Q45 8 42 5"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M52 15 Q55 8 58 5"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="42" cy="5" r="2" fill="#FF6B6B" />
      <circle cx="58" cy="5" r="2" fill="#FF6B6B" />

      {/* Wing patterns */}
      <circle cx="25" cy="35" r="5" fill="#FFD93D" opacity="0.6" />
      <circle cx="75" cy="35" r="5" fill="#FFD93D" opacity="0.6" />
    </svg>
  );
}

export function BirdSVG({ className = "" }: ButterflyBirdSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <ellipse cx="50" cy="35" rx="15" ry="18" fill="#4D9EFF" />

      {/* Wing left */}
      <path d="M40 30 Q20 20 15 25 Q18 32 35 35" fill="#74B3FF" />

      {/* Wing right */}
      <path d="M60 30 Q80 20 85 25 Q82 32 65 35" fill="#74B3FF" />

      {/* Head */}
      <circle cx="50" cy="20" r="10" fill="#4D9EFF" />

      {/* Beak */}
      <path d="M55 20 L65 18 L55 22 Z" fill="#FFA94D" />

      {/* Eye */}
      <circle cx="53" cy="18" r="2" fill="#333" />
      <circle cx="54" cy="17" r="1" fill="white" />

      {/* Tail */}
      <path d="M40 45 L30 50 L35 45 L30 43 Z" fill="#74B3FF" />
    </svg>
  );
}
