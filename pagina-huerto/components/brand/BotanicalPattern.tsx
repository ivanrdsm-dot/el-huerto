/**
 * Hojas lineales decorativas inspiradas en los laterales oficiales del kiosco.
 * Trazo orgánico, un solo color vía currentColor.
 */
export function HojaRama({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 320"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M100 310 C 96 220, 92 140, 100 20"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {[
        "M100 60 C 70 55, 45 35, 40 8 C 70 12, 92 32, 100 60",
        "M100 60 C 130 55, 155 35, 160 8 C 130 12, 108 32, 100 60",
        "M99 130 C 66 126, 40 104, 34 74 C 66 80, 90 100, 99 130",
        "M99 130 C 132 126, 158 104, 164 74 C 132 80, 108 100, 99 130",
        "M99 205 C 66 200, 40 178, 34 148 C 66 154, 90 174, 99 205",
        "M99 205 C 132 200, 158 178, 164 148 C 132 154, 108 174, 99 205",
        "M100 275 C 74 271, 54 254, 49 230 C 74 235, 92 251, 100 275",
        "M100 275 C 126 271, 146 254, 151 230 C 126 235, 108 251, 100 275",
      ].map((d, i) => (
        <path key={i} d={d} stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

/** Brote pequeño, como el del encabezado "COMBOS" de los laterales */
export function Brote({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 56" fill="none" aria-hidden="true" className={className}>
      <path d="M32 54 C 31 42, 31 32, 32 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M32 26 C 20 24, 10 16, 8 4 C 20 6, 29 14, 32 26 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M32 26 C 44 24, 54 16, 56 4 C 44 6, 35 14, 32 26 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
