/**
 * MedikQuantis brand mark: an "M" drawn as a single trace whose last leg
 * descends into the lens of a "Q", so the monogram reads as one continuous
 * stroke. The whole mark uses `currentColor` — it inherits the header text
 * colour and therefore needs no separate light/dark variant.
 *
 * The viewBox is square so the same geometry backs the favicon and the PWA
 * icons without being rescaled to fit.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="MedikQuantis"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* M — rounded first apex, pointed second, ending tangent to the lens */}
        <path d="M4 25.8 L5.3 11 Q7 4.4 9 10.6 L11.8 18.8 L16.4 4.2 L19.5 13.8" />
        {/* Q bowl, doubling as the lens */}
        <circle cx="20" cy="19.8" r="6" />
        {/* Q tail */}
        <path d="M24.3 24.1 L28 27.8" />
      </g>
    </svg>
  );
}
