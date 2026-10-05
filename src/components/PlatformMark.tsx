import { getPlatform } from '../content/platforms'
import { simIcons } from '../sim/blocks/icons'
import type { PlatformId } from '../sim/types'

/** Marca original de cada plataforma ficticia: cuadro redondeado de su color con un ícono genérico. */
export function PlatformMark({ id, size = 'md' }: { id: PlatformId; size?: 'sm' | 'md' | 'lg' }) {
  const platform = getPlatform(id)
  const Icon = simIcons[platform.icon]
  return (
    <span className={`platform-mark platform-mark--${size}`} style={{ background: platform.color }} aria-hidden="true">
      <Icon className="platform-mark__icon" strokeWidth={2.25} />
    </span>
  )
}
