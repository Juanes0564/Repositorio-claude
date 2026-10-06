/**
 * Ilustraciones provisionales de los talleres: dibujos simples y originales en SVG.
 * Usan los colores del tema, así se ven bien también en alto contraste. Reemplazables (docs/ASSETS.md).
 */
import type { ReactNode } from 'react'

export type IllustrationName =
  | 'bank'
  | 'phone'
  | 'check'
  | 'code'
  | 'receipt'
  | 'calendar'
  | 'clinic'
  | 'car'
  | 'plate'
  | 'map'
  | 'cart'
  | 'shop'
  | 'warning'
  | 'lock'
  | 'shield'
  | 'update'
  | 'chat'
  | 'mic'
  | 'photo'
  | 'video'
  | 'group'
  | 'settings'
  | 'text'
  | 'sun'
  | 'volume'
  | 'wifi'
  | 'plane'
  | 'hurry'
  | 'link'
  | 'gift'
  | 'family'
  | 'hangup'

const S = { stroke: 'var(--ink)', strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const soft = 'var(--primary-soft)'
const green = 'var(--logo-green)'
const yellow = 'var(--logo-yellow)'
const white = 'var(--surface)'

/** Celular base con contenido adentro. */
function Phone({ children }: { children?: ReactNode }) {
  return (
    <>
      <rect x="70" y="14" width="80" height="132" rx="14" fill={white} {...S} />
      <rect x="98" y="132" width="24" height="5" rx="2.5" fill="var(--ink)" />
      {children}
    </>
  )
}

const drawings: Record<IllustrationName, ReactNode> = {
  bank: (
    <>
      <path d="M50 64 L110 30 L170 64 Z" fill={yellow} {...S} />
      <rect x="52" y="64" width="116" height="10" fill={white} {...S} />
      {[66, 96, 126, 156].map((x) => (
        <rect key={x} x={x - 6} y="78" width="12" height="44" fill={soft} {...S} />
      ))}
      <rect x="46" y="124" width="128" height="12" fill={green} {...S} />
    </>
  ),
  phone: (
    <Phone>
      <rect x="82" y="32" width="56" height="12" rx="6" fill={soft} />
      <rect x="82" y="52" width="56" height="26" rx="8" fill={yellow} />
      <rect x="82" y="86" width="56" height="26" rx="8" fill={soft} />
    </Phone>
  ),
  check: (
    <>
      <circle cx="110" cy="80" r="56" fill={green} {...S} />
      <path d="M84 82 L102 100 L138 62" fill="none" stroke="var(--surface)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  code: (
    <Phone>
      <rect x="80" y="40" width="60" height="34" rx="8" fill={yellow} {...S} />
      <text x="110" y="64" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--ink)">• • • •</text>
      <rect x="84" y="88" width="52" height="10" rx="5" fill={soft} />
      <rect x="84" y="104" width="36" height="10" rx="5" fill={soft} />
    </Phone>
  ),
  receipt: (
    <>
      <path d="M72 18 H148 V142 L136 134 L124 142 L112 134 L100 142 L88 134 L76 142 L72 140 Z" fill={white} {...S} />
      <circle cx="110" cy="50" r="16" fill={green} />
      <path d="M102 50 L108 56 L119 44" fill="none" stroke="var(--surface)" strokeWidth="5" strokeLinecap="round" />
      <rect x="86" y="80" width="48" height="8" rx="4" fill={soft} />
      <rect x="86" y="96" width="36" height="8" rx="4" fill={soft} />
      <rect x="86" y="112" width="44" height="8" rx="4" fill={yellow} />
    </>
  ),
  calendar: (
    <>
      <rect x="50" y="30" width="120" height="110" rx="14" fill={white} {...S} />
      <rect x="50" y="30" width="120" height="28" rx="14" fill={green} {...S} />
      {[0, 1, 2, 3].map((c) =>
        [0, 1, 2].map((r) => (
          <rect key={`${c}-${r}`} x={64 + c * 26} y={70 + r * 22} width="16" height="12" rx="3" fill={c === 2 && r === 1 ? yellow : soft} />
        )),
      )}
      <path d="M78 22 V40 M142 22 V40" {...S} />
    </>
  ),
  clinic: (
    <>
      <rect x="60" y="40" width="100" height="100" rx="10" fill={white} {...S} />
      <rect x="98" y="58" width="24" height="64" rx="4" fill={green} />
      <rect x="78" y="78" width="64" height="24" rx="4" fill={green} />
    </>
  ),
  car: (
    <>
      <path d="M44 104 L56 70 Q60 60 72 60 H148 Q160 60 164 70 L176 104 Z" fill={yellow} {...S} />
      <rect x="38" y="100" width="144" height="26" rx="10" fill={yellow} {...S} />
      <path d="M70 70 H150 L158 96 H62 Z" fill={white} {...S} />
      <circle cx="74" cy="128" r="14" fill="var(--ink)" />
      <circle cx="146" cy="128" r="14" fill="var(--ink)" />
    </>
  ),
  plate: (
    <>
      <rect x="40" y="50" width="140" height="62" rx="10" fill={yellow} {...S} />
      <text x="110" y="92" textAnchor="middle" fontSize="28" fontWeight="700" fill="var(--ink)">ABC 123</text>
      <circle cx="166" cy="40" r="20" fill={green} {...S} />
      <path d="M157 40 L164 47 L176 34" fill="none" stroke="var(--surface)" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  map: (
    <>
      <path d="M40 40 L84 28 L136 44 L180 32 V128 L136 140 L84 124 L40 136 Z" fill={soft} {...S} />
      <path d="M84 28 V124 M136 44 V140" {...S} />
      <path d="M110 58 C 92 58 88 80 110 106 C 132 80 128 58 110 58 Z" fill={green} {...S} />
      <circle cx="110" cy="74" r="7" fill="var(--surface)" />
    </>
  ),
  cart: (
    <>
      <path d="M40 40 H64 L80 110 H156 L170 60 H72" fill="none" {...S} />
      <rect x="86" y="62" width="30" height="30" rx="4" fill={yellow} {...S} />
      <rect x="122" y="68" width="24" height="24" rx="4" fill={soft} {...S} />
      <circle cx="90" cy="128" r="10" fill="var(--ink)" />
      <circle cx="146" cy="128" r="10" fill="var(--ink)" />
    </>
  ),
  shop: (
    <>
      <rect x="54" y="62" width="112" height="78" fill={white} {...S} />
      <path d="M46 62 L58 30 H162 L174 62 Z" fill={green} {...S} />
      <rect x="96" y="96" width="28" height="44" fill={yellow} {...S} />
      <rect x="66" y="78" width="22" height="20" fill={soft} {...S} />
      <rect x="132" y="78" width="22" height="20" fill={soft} {...S} />
    </>
  ),
  warning: (
    <>
      <path d="M110 24 L176 136 H44 Z" fill={yellow} {...S} />
      <path d="M110 64 V100" stroke="var(--ink)" strokeWidth="10" strokeLinecap="round" />
      <circle cx="110" cy="118" r="6" fill="var(--ink)" />
    </>
  ),
  lock: (
    <>
      <path d="M80 72 V54 a30 30 0 0 1 60 0 V72" fill="none" stroke="var(--ink)" strokeWidth="10" strokeLinecap="round" />
      <rect x="62" y="70" width="96" height="72" rx="12" fill={yellow} {...S} />
      <circle cx="110" cy="100" r="9" fill="var(--ink)" />
      <rect x="106" y="104" width="8" height="20" rx="3" fill="var(--ink)" />
    </>
  ),
  shield: (
    <>
      <path d="M110 22 L162 40 V80 C162 112 140 134 110 144 C80 134 58 112 58 80 V40 Z" fill={green} {...S} />
      <path d="M88 82 L104 98 L134 66" fill="none" stroke="var(--surface)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  update: (
    <Phone>
      <path d="M110 46 a26 26 0 1 1 -24 16" fill="none" stroke={green} strokeWidth="8" strokeLinecap="round" />
      <path d="M78 52 L86 64 L98 56" fill="none" stroke={green} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="84" y="104" width="52" height="10" rx="5" fill={soft} />
    </Phone>
  ),
  chat: (
    <>
      <path d="M40 40 H140 a10 10 0 0 1 10 10 V90 a10 10 0 0 1 -10 10 H76 L56 118 V100 H40 a10 10 0 0 1 -10 -10 V50 a10 10 0 0 1 10 -10 Z" fill={white} {...S} />
      <path d="M100 76 H170 a10 10 0 0 1 10 10 V116 a10 10 0 0 1 -10 10 H164 V142 L146 126 H100 a10 10 0 0 1 -10 -10 V86 a10 10 0 0 1 10 -10 Z" fill={yellow} {...S} />
      <rect x="48" y="58" width="60" height="8" rx="4" fill={soft} />
      <rect x="48" y="74" width="40" height="8" rx="4" fill={soft} />
    </>
  ),
  mic: (
    <>
      <rect x="90" y="24" width="40" height="72" rx="20" fill={yellow} {...S} />
      <path d="M70 80 a40 40 0 0 0 80 0" fill="none" {...S} />
      <path d="M110 120 V140 M90 140 H130" {...S} />
    </>
  ),
  photo: (
    <>
      <rect x="40" y="46" width="140" height="94" rx="14" fill={white} {...S} />
      <rect x="84" y="32" width="52" height="20" rx="6" fill={white} {...S} />
      <circle cx="110" cy="93" r="28" fill={soft} {...S} />
      <circle cx="110" cy="93" r="12" fill={green} />
    </>
  ),
  video: (
    <Phone>
      <circle cx="110" cy="62" r="20" fill={yellow} {...S} />
      <path d="M90 110 a20 16 0 0 1 40 0" fill={yellow} {...S} />
      <circle cx="132" cy="38" r="8" fill={green} />
    </Phone>
  ),
  group: (
    <>
      {[70, 110, 150].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="62" r="18" fill={i === 1 ? yellow : soft} {...S} />
          <path d={`M${x - 28} 128 a28 28 0 0 1 56 0`} fill={i === 1 ? yellow : soft} {...S} />
        </g>
      ))}
    </>
  ),
  settings: (
    <>
      <circle cx="110" cy="80" r="44" fill={soft} {...S} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <rect key={a} x="102" y="22" width="16" height="22" rx="4" fill={green} {...S} transform={`rotate(${a} 110 80)`} />
      ))}
      <circle cx="110" cy="80" r="18" fill={white} {...S} />
    </>
  ),
  text: (
    <Phone>
      <text x="96" y="72" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--ink)">a</text>
      <text x="122" y="80" textAnchor="middle" fontSize="40" fontWeight="700" fill={green}>A</text>
      <rect x="82" y="100" width="56" height="8" rx="4" fill={soft} />
      <circle cx="120" cy="104" r="8" fill={yellow} {...S} />
    </Phone>
  ),
  sun: (
    <>
      <circle cx="110" cy="80" r="30" fill={yellow} {...S} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path key={a} d="M110 30 V16" {...S} transform={`rotate(${a} 110 80)`} />
      ))}
    </>
  ),
  volume: (
    <>
      <path d="M50 66 H74 L104 40 V120 L74 94 H50 Z" fill={yellow} {...S} />
      <path d="M124 60 a28 28 0 0 1 0 40 M142 44 a50 50 0 0 1 0 72" fill="none" {...S} />
    </>
  ),
  wifi: (
    <>
      <path d="M50 70 a86 86 0 0 1 120 0 M70 92 a56 56 0 0 1 80 0 M90 114 a26 26 0 0 1 40 0" fill="none" stroke={green} strokeWidth="12" strokeLinecap="round" />
      <circle cx="110" cy="134" r="9" fill="var(--ink)" />
    </>
  ),
  plane: (
    <>
      <path d="M110 22 C118 22 120 34 120 46 V68 L170 96 V110 L120 96 V122 L136 134 V144 L110 136 L84 144 V134 L100 122 V96 L50 110 V96 L100 68 V46 C100 34 102 22 110 22 Z" fill={yellow} {...S} />
    </>
  ),
  hurry: (
    <>
      <circle cx="110" cy="84" r="54" fill={white} {...S} />
      <path d="M110 50 V84 L134 98" fill="none" stroke="var(--ink)" strokeWidth="8" strokeLinecap="round" />
      <path d="M44 34 L60 50 M176 34 L160 50" stroke={yellow} strokeWidth="10" strokeLinecap="round" />
    </>
  ),
  link: (
    <Phone>
      <rect x="80" y="36" width="60" height="40" rx="8" fill={soft} {...S} />
      <path d="M96 100 a10 10 0 0 1 0 -14 l8 -8 a10 10 0 0 1 14 14 M124 92 a10 10 0 0 1 0 14 l-8 8 a10 10 0 0 1 -14 -14" fill="none" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="146" cy="30" r="16" fill={yellow} {...S} />
      <path d="M146 22 V32" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="146" cy="38" r="2.5" fill="var(--ink)" />
    </Phone>
  ),
  gift: (
    <>
      <rect x="56" y="62" width="108" height="78" rx="6" fill={yellow} {...S} />
      <rect x="48" y="48" width="124" height="22" rx="6" fill={yellow} {...S} />
      <path d="M110 48 V140" stroke={green} strokeWidth="14" />
      <path d="M110 48 C 90 20 66 36 86 48 M110 48 C 130 20 154 36 134 48" fill="none" {...S} />
      <text x="168" y="40" fontSize="34" fontWeight="700" fill="var(--ink)">?</text>
    </>
  ),
  family: (
    <>
      <circle cx="84" cy="54" r="20" fill={soft} {...S} />
      <path d="M50 136 a34 34 0 0 1 68 0" fill={soft} {...S} />
      <circle cx="142" cy="66" r="16" fill={yellow} {...S} />
      <path d="M116 136 a26 26 0 0 1 52 0" fill={yellow} {...S} />
      <path d="M104 96 h14" {...S} />
    </>
  ),
  hangup: (
    <>
      <path d="M44 92 C 80 54 140 54 176 92 L162 112 L136 100 V84 C 120 78 100 78 84 84 V100 L58 112 Z" fill="#B3261E" {...S} />
    </>
  ),
}

export function Illustration({ name, size = 'md' }: { name: IllustrationName; size?: 'sm' | 'md' }) {
  return (
    <svg viewBox="0 0 220 160" className={`illustration illustration--${size}`} aria-hidden="true" focusable="false">
      {drawings[name]}
    </svg>
  )
}
