interface DepuySynthesLogoProps {
  className?: string
}

export function DepuySynthesLogo({ className }: DepuySynthesLogoProps) {
  return (
    <svg
      viewBox="0 0 200 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DePuy Synthes"
    >
      {/* DePuy text */}
      <text x="0" y="28" className="fill-[#c41230]" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="24">
        DePuy
      </text>
      {/* Synthes text */}
      <text x="72" y="28" className="fill-foreground" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="24">
        Synthes
      </text>
    </svg>
  )
}
