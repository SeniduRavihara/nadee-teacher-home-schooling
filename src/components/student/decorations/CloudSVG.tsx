interface CloudSVGProps {
  className?: string;
  color?: string;
}

export function CloudSVG({ className = "", color = "#FFFFFF" }: CloudSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 40C30 40 15 40 15 28C15 16 25 15 30 15C30 15 30 5 45 5C60 5 60 15 60 15C60 15 75 12 85 20C95 28 90 40 90 40H30Z"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}

export function CloudVariant2({
  className = "",
  color = "#F0F4FF",
}: CloudSVGProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="25" cy="30" rx="20" ry="18" fill={color} />
      <ellipse cx="45" cy="25" rx="25" ry="22" fill={color} />
      <ellipse cx="70" cy="30" rx="22" ry="20" fill={color} />
      <rect x="20" y="30" width="55" height="15" fill={color} />
    </svg>
  );
}
