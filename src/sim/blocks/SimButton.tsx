import type { ReactNode } from 'react'
import { ArrowDown, Check } from 'lucide-react'
import { simulator } from '../../content'
import { useSim } from '../SimContext'

/**
 * Todo lo que se puede tocar dentro de una pantalla simulada.
 * Cuando el motor lo pide, muestra contorno grueso y una flecha con la palabra "Aquí" (no solo color).
 */
export function SimButton({
  id,
  className = '',
  children,
  label,
}: {
  id: string
  className?: string
  children: ReactNode
  /** Nombre accesible si el contenido visible no basta. */
  label?: string
}) {
  const { onTap, highlight, doneId } = useSim()
  const highlighted = highlight === id
  const done = doneId === id
  return (
    <button
      type="button"
      data-sim-id={id}
      aria-label={label}
      className={`sim-btn ${className} ${highlighted ? 'is-highlighted' : ''} ${done ? 'is-done' : ''}`}
      onClick={() => onTap(id)}
    >
      {children}
      {highlighted && (
        <span className="sim-pointer">
          <ArrowDown className="sim-pointer__icon" aria-hidden="true" />
          {simulator.pointer}
        </span>
      )}
      {done && (
        <span className="sim-done" aria-hidden="true">
          <Check strokeWidth={3} />
        </span>
      )}
    </button>
  )
}
