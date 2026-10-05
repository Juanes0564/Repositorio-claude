/**
 * Logo provisional de Vínculo: dos formas redondeadas (verde y amarilla) que forman una "V"
 * y se unen abajo, como dos personas que se acompañan. Reemplazable (ver docs/ASSETS.md).
 */
export function Logo({ size = 96, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      className="logo"
    >
      <g transform="rotate(24 60 98)">
        <rect x="41" y="10" width="38" height="96" rx="19" fill="var(--logo-yellow)" />
      </g>
      <g transform="rotate(-24 60 98)">
        <rect x="41" y="10" width="38" height="96" rx="19" fill="var(--logo-green)" />
      </g>
      <circle cx="60" cy="96" r="10" fill="var(--logo-center)" />
    </svg>
  )
}
