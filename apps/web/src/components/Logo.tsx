/**
 * MedikQuantis brand mark: an ECG heartbeat that rises into the "M" of an
 * MQ monogram, paired with a "Q" ring. The line work uses `currentColor` so
 * the mark inherits the header text colour and stays legible in both the
 * light and dark themes; only the signature cyan→blue accent (the second
 * peak + the Q's upper-right arc) is fixed, since that hue reads on either
 * background.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 64"
      className={className}
      role="img"
      aria-label="MedikQuantis"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mq-accent" x1="0" y1="64" x2="128" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      <g
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* ECG lead-in + first half of the M (theme colour) */}
        <path
          d="M4 40 H22 l4 -6 4 6 H38 L50 12 58 44"
          stroke="currentColor"
        />
        {/* Second peak of the M — the cyan→blue accent stroke */}
        <path d="M58 44 L70 12 76 40 H86" stroke="url(#mq-accent)" />

        {/* Q ring (theme colour) with its upper-right arc as the accent */}
        <path
          d="M104 18 A21 21 0 1 0 105 47"
          stroke="currentColor"
        />
        <path d="M104 18 a21 21 0 0 1 1 29" stroke="url(#mq-accent)" />
        {/* Q tail */}
        <path d="M99 41 L118 56" stroke="currentColor" />
      </g>
    </svg>
  );
}
