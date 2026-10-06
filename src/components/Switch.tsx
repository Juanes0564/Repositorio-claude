import { useId } from 'react'
import { common } from '../content'

/** Interruptor accesible. Muestra el estado con texto, no solo con color. */
export function Switch({
  label,
  help,
  checked,
  onChange,
}: {
  label: string
  help?: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  const helpId = useId()
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-describedby={help ? helpId : undefined}
      className={checked ? 'switch switch--on' : 'switch'}
      onClick={() => onChange(!checked)}
    >
      <span className="switch__text">
        <span className="switch__label">{label}</span>
        {help && (
          <span id={helpId} className="switch__help">
            {help}
          </span>
        )}
      </span>
      <span className="switch__control" aria-hidden="true">
        <span className="switch__track">
          <span className="switch__thumb" />
        </span>
        <span className="switch__state">{checked ? common.on : common.off}</span>
      </span>
    </button>
  )
}
