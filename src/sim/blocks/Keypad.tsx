import { Delete } from 'lucide-react'
import { simulator } from '../../content'
import type { SimBlock } from '../types'
import { KEY_DELETE, keyId } from '../engine'
import { useSim } from '../SimContext'
import { SimButton } from './SimButton'

type KeypadBlock = Extract<SimBlock, { type: 'keypad' }>

export function formatMoney(digits: string): string {
  if (!digits) return '$ 0'
  return '$ ' + Number(digits).toLocaleString('es-CO').replace(/,/g, '.')
}

function display(block: KeypadBlock, value: string): string {
  if (block.display === 'masked') return value ? '●'.repeat(value.length) : ''
  if (block.display === 'money') return formatMoney(value)
  return value
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', KEY_DELETE, '0']

/** Teclado numérico grande con visor. Las teclas no cuentan como error; solo el botón final se revisa. */
export function Keypad({ block }: { block: KeypadBlock }) {
  const { onKey, highlight, values, text } = useSim()
  const value = values[block.id] ?? ''
  const shown = display(block, value)
  return (
    <div className="keypad">
      <p className="keypad__label" id={`${block.id}-label`}>
        {text(block.label)}
      </p>
      <output className="keypad__display" aria-labelledby={`${block.id}-label`} aria-live="polite">
        {shown || <span className="keypad__empty">{simulator.keypadEmpty}</span>}
        {block.display === 'masked' && value && (
          <span className="visually-hidden">{`${value.length} de ${block.maxLength}`}</span>
        )}
      </output>
      <div className="keypad__grid">
        {KEYS.map((key) => {
          const id = keyId(block.id, key)
          const isDelete = key === KEY_DELETE
          return (
            <button
              key={key}
              type="button"
              data-sim-id={id}
              className={`keypad__key ${isDelete ? 'keypad__key--delete' : ''} ${highlight === id ? 'is-highlighted' : ''}`}
              onClick={() => onKey(block.id, key)}
            >
              {isDelete ? (
                <>
                  <Delete className="icon" aria-hidden="true" />
                  <span>{simulator.keypadDelete}</span>
                </>
              ) : (
                key
              )}
              {highlight === id && <span className="sim-pointer sim-pointer--key">{simulator.pointer}</span>}
            </button>
          )
        })}
      </div>
      <SimButton id={block.submit.id} className="sim-action sim-action--primary">
        {text(block.submit.label)}
      </SimButton>
    </div>
  )
}
