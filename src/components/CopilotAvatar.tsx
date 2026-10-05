/** Avatar provisional del copiloto: una cara amable con audífonos. Original; reemplazable (docs/ASSETS.md). */
export function CopilotAvatar({ speaking = false }: { speaking?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className={`copilot-avatar ${speaking ? 'is-speaking' : ''}`} aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="56" fill="var(--logo-yellow)" />
      <circle cx="60" cy="64" r="38" fill="#FBF7EE" />
      <path d="M24 60 a36 36 0 0 1 72 0" fill="none" stroke="var(--logo-green)" strokeWidth="8" strokeLinecap="round" />
      <rect x="16" y="56" width="14" height="24" rx="7" fill="var(--logo-green)" />
      <rect x="90" y="56" width="14" height="24" rx="7" fill="var(--logo-green)" />
      <circle cx="47" cy="62" r="5" fill="#1C2629" />
      <circle cx="73" cy="62" r="5" fill="#1C2629" />
      <path d="M46 78 q14 12 28 0" fill="none" stroke="#1C2629" strokeWidth="5" strokeLinecap="round" />
      <circle cx="38" cy="74" r="5" fill="#F2A7A0" opacity="0.7" />
      <circle cx="82" cy="74" r="5" fill="#F2A7A0" opacity="0.7" />
    </svg>
  )
}
