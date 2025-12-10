interface StarsSVGProps {
  className?: string;
}

export function StarsSVG({ className = "" }: StarsSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 80 L54 92 L66 92 L56 99 L60 111 L50 104 L40 111 L44 99 L34 92 L46 92 Z"
        fill="#FFD93D"
      />
      <path
        d="M120 40 L123 49 L132 49 L125 54 L128 63 L120 58 L112 63 L115 54 L108 49 L117 49 Z"
        fill="#FFA94D"
      />
      <path
        d="M160 120 L163 129 L172 129 L165 134 L168 143 L160 138 L152 143 L155 134 L148 129 L157 129 Z"
        fill="#FFD93D"
      />
      <path
        d="M30 30 L32 36 L38 36 L33 40 L35 46 L30 42 L25 46 L27 40 L22 36 L28 36 Z"
        fill="#FFA94D"
      />
      <path
        d="M170 70 L172 76 L178 76 L173 80 L175 86 L170 82 L165 86 L167 80 L162 76 L168 76 Z"
        fill="#FFE17B"
      />
    </svg>
  );
}
