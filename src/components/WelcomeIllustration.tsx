/** Ilustración provisional de la bienvenida: un celular con una marca de "bien hecho". */
export function WelcomeIllustration() {
  return (
    <svg viewBox="0 0 240 180" width="100%" className="illustration" aria-hidden="true" focusable="false">
      <circle cx="186" cy="44" r="26" fill="var(--logo-yellow)" opacity="0.55" />
      <ellipse cx="120" cy="166" rx="86" ry="8" fill="var(--c-shadow)" />
      <rect x="82" y="18" width="76" height="140" rx="14" fill="var(--surface)" stroke="var(--ink)" strokeWidth="4" />
      <rect x="94" y="38" width="52" height="10" rx="5" fill="var(--primary-soft)" />
      <rect x="94" y="56" width="52" height="22" rx="6" fill="var(--primary-soft)" />
      <rect x="94" y="86" width="52" height="22" rx="6" fill="var(--primary-soft)" />
      <rect x="106" y="140" width="28" height="6" rx="3" fill="var(--ink)" />
      <circle cx="60" cy="96" r="30" fill="var(--primary)" />
      <path d="M46 96 l10 10 l19 -21" fill="none" stroke="var(--on-primary)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
