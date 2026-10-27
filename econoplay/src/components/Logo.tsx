/** Logo original de Econoplay: una curva de utilidad marginal y una moneda. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ep-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#ep-g)" />
      <path d="M14 16 C 20 38, 30 46, 50 48" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path d="M14 50 H 50" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 50 V 14" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="20" r="9" fill="#fbbf24" stroke="#fff" strokeWidth="2.5" />
      <path d="M44 15.5 V 24.5" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
