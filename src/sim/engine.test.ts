import { describe, expect, it } from 'vitest'
import { KEY_DELETE, expectedElementId, highlightId, initialState, keyId, simReducer, type SimAction, type SimState } from './engine'
import { transferBank as flow } from '../content/flows/transfer-bank'

const run = (actions: SimAction[], start: SimState = initialState(flow)) =>
  actions.reduce((s, a) => simReducer(flow, s, a), start)

const typeKeys = (keypadId: string, digits: string): SimAction[] =>
  [...digits].map((key) => ({ type: 'key', keypadId, key }))

describe('motor del simulador', () => {
  it('empieza en el paso 1 sin nada hecho', () => {
    const s = initialState(flow)
    expect(s.index).toBe(0)
    expect(s.finished).toBe(false)
    expect(s.steps.every((x) => !x.done)).toBe(true)
  })

  it('tocar lo correcto marca "¡Bien!" pero no avanza solo', () => {
    const s = run([{ type: 'tap', id: 'app-bank' }])
    expect(s.feedback).toBe('success')
    expect(s.steps[0].done).toBe(true)
    expect(s.index).toBe(0)
  })

  it('"Siguiente" no hace nada si el paso no está hecho', () => {
    expect(run([{ type: 'next' }]).index).toBe(0)
  })

  it('tocar algo equivocado da un aviso amable y cuenta el error', () => {
    const s = run([{ type: 'tap', id: 'app-chat' }])
    expect(s.feedback).toBe('wrong')
    expect(s.steps[0].errors).toBe(1)
    expect(s.steps[0].done).toBe(false)
  })

  it('resalta lo correcto tras dos errores seguidos, solo en modo Guiado', () => {
    const one = run([{ type: 'tap', id: 'app-chat' }])
    expect(highlightId(flow, one, 'guided')).toBeNull()
    const two = run([{ type: 'tap', id: 'app-eps' }], one)
    expect(highlightId(flow, two, 'guided')).toBe('app-bank')
    expect(highlightId(flow, two, 'free')).toBeNull()
  })

  it('acertar quita el resaltado y reinicia los errores', () => {
    const s = run([{ type: 'tap', id: 'x' }, { type: 'tap', id: 'y' }, { type: 'tap', id: 'app-bank' }])
    expect(s.steps[0].errors).toBe(0)
    expect(highlightId(flow, s, 'guided')).toBeNull()
  })

  describe('teclado', () => {
    const atLogin = run([{ type: 'tap', id: 'app-bank' }, { type: 'next' }])

    it('escribir números no cuenta como error', () => {
      const s = run(typeKeys('pin', '12'), atLogin)
      expect(s.steps[1].value).toBe('12')
      expect(s.steps[1].errors).toBe(0)
    })

    it('no deja escribir más de lo permitido', () => {
      expect(run(typeKeys('pin', '123456'), atLogin).steps[1].value).toBe('1234')
    })

    it('"Borrar" quita el último número', () => {
      const s = run([...typeKeys('pin', '125'), { type: 'key', keypadId: 'pin', key: KEY_DELETE }], atLogin)
      expect(s.steps[1].value).toBe('12')
    })

    it('enviar un valor equivocado es un error amable', () => {
      const s = run([...typeKeys('pin', '9999'), { type: 'tap', id: 'login-submit' }], atLogin)
      expect(s.feedback).toBe('wrong')
      expect(s.steps[1].done).toBe(false)
    })

    it('enviar el valor correcto completa el paso', () => {
      const s = run([...typeKeys('pin', '1234'), { type: 'tap', id: 'login-submit' }], atLogin)
      expect(s.feedback).toBe('success')
      expect(s.steps[1].done).toBe(true)
    })

    it('el resaltado señala la siguiente tecla, "Borrar" o el botón final', () => {
      const step = flow.steps[1]
      expect(expectedElementId(step, '')).toBe(keyId('pin', '1'))
      expect(expectedElementId(step, '12')).toBe(keyId('pin', '3'))
      expect(expectedElementId(step, '19')).toBe(keyId('pin', KEY_DELETE))
      expect(expectedElementId(step, '1234')).toBe('login-submit')
    })
  })

  it('"Volver" regresa al paso anterior y conserva lo hecho', () => {
    const s = run([{ type: 'tap', id: 'app-bank' }, { type: 'next' }, { type: 'back' }])
    expect(s.index).toBe(0)
    expect(s.steps[0].done).toBe(true)
    expect(s.feedback).toBe('success')
    expect(run([{ type: 'back' }]).index).toBe(0)
  })

  it('"Ayuda" muestra la pista', () => {
    expect(run([{ type: 'help' }]).steps[0].hintShown).toBe(true)
  })

  it('se puede completar el flujo entero y reiniciar', () => {
    const s = run([
      { type: 'tap', id: 'app-bank' }, { type: 'next' },
      ...typeKeys('pin', '1234'), { type: 'tap', id: 'login-submit' }, { type: 'next' },
      { type: 'tap', id: 'transfer' }, { type: 'next' },
      { type: 'tap', id: 'contact-rosa' }, { type: 'next' },
      ...typeKeys('amount', '50000'), { type: 'tap', id: 'amount-submit' }, { type: 'next' },
      { type: 'tap', id: 'confirm' }, { type: 'next' },
      ...typeKeys('otp', '5678'), { type: 'tap', id: 'otp-submit' }, { type: 'next' },
      { type: 'tap', id: 'save-receipt' }, { type: 'next' },
    ])
    expect(s.finished).toBe(true)
    expect(run([{ type: 'restart' }], s)).toEqual(initialState(flow))
  })
})
