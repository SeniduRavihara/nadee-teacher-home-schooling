interface GrassSVGProps {
  className?: string;
}

export function GrassSVG({ className = "" }: GrassSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 100 Q10 80 20 100" fill="#7FB069" />
      <path d="M15 100 Q25 75 35 100" fill="#52A447" />
      <path d="M30 100 Q40 85 50 100" fill="#7FB069" />
      <path d="M45 100 Q55 70 65 100" fill="#52A447" />
      <path d="M60 100 Q70 80 80 100" fill="#7FB069" />
      <path d="M75 100 Q85 75 95 100" fill="#52A447" />
      <path d="M90 100 Q100 85 110 100" fill="#7FB069" />
      <path d="M105 100 Q115 70 125 100" fill="#52A447" />
      <path d="M120 100 Q130 80 140 100" fill="#7FB069" />
      <path d="M135 100 Q145 75 155 100" fill="#52A447" />
      <path d="M150 100 Q160 85 170 100" fill="#7FB069" />
      <path d="M165 100 Q175 70 185 100" fill="#52A447" />
      <path d="M180 100 Q190 80 200 100" fill="#7FB069" />
      <path d="M195 100 Q205 75 215 100" fill="#52A447" />
      <path d="M210 100 Q220 85 230 100" fill="#7FB069" />
      <path d="M225 100 Q235 70 245 100" fill="#52A447" />
      <path d="M240 100 Q250 80 260 100" fill="#7FB069" />
      <path d="M255 100 Q265 75 275 100" fill="#52A447" />
      <path d="M270 100 Q280 85 290 100" fill="#7FB069" />
      <path d="M285 100 Q295 70 305 100" fill="#52A447" />
    </svg>
  );
}
