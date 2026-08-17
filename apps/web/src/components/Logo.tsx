/**
 * MedikQuantis brand mark: an "MQ" monogram whose two letters are drawn as
 * separate letterforms sharing a baseline, rather than fused into one trace.
 *
 * "MQ" is a wide object, so the identity is two pieces rather than one shape
 * squeezed into a square: `Logo` is the full monogram, `LogoMark` is the same
 * M on its own for the favicon, the PWA icons and the mobile header. Both are
 * built from `M_PATH`, so the letter can only ever be changed in one place.
 *
 * The M inherits `currentColor`; only the Q carries brand colour, mirroring
 * the "Medik" / "Quantis" split in the wordmark beside it.
 */

// Cap height 20 on the centreline (y 6 to 26), 24 in ink once the 4-unit round
// caps are counted. The vertex reaches the baseline, so its round join forms
// the same dome as the two feet and all three supports land on one line.
const M_PATH = "M4 26 L4 6 L16 26 L28 6 L28 26";

const STROKE = {
  strokeWidth: 4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 59 32"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={M_PATH} stroke="currentColor" {...STROKE} />
      {/* The bowl is 2.5% heavier than the stems: a curve drawn at a stem's
          width reads lighter than the stem. Its radius carries no overshoot —
          the M's round caps already supply the optical overshoot. */}
      <circle
        cx="44.95"
        cy="16"
        r="10"
        className="stroke-trust-700 dark:stroke-neon"
        {...STROKE}
        strokeWidth={4.1}
      />
      {/* The tail leaves off-radius and breaks below the bowl. A radial tail
          that stays inside the bowl's box reads as a magnifier handle, and at
          small sizes the letter collapses into an O. */}
      <path
        d="M48.70 24.4 L53.30 28.2"
        className="stroke-trust-700 dark:stroke-neon"
        {...STROKE}
      />
    </svg>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* The group is scaled whole, stroke included, so the letterform is
          identical to the monogram's M rather than a redrawn one. */}
      <g transform="translate(0.57 0.57) scale(0.9643)">
        <path d={M_PATH} stroke="currentColor" {...STROKE} />
      </g>
    </svg>
  );
}
