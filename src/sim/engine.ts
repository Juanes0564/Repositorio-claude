/**
 * Motor del simulador: lógica pura, sin pantalla.
 * Recibe acciones (tocar, escribir, siguiente, volver…) y devuelve el nuevo estado.
 */
import type { Flow, FlowStep, SimBlock, SimMode } from './types'

export type Feedback = 'success' | 'wrong' | null

export interface StepState {
  done: boolean
  /** Errores seguidos en este paso. */
  errors: number
  /** Lo escrito en el teclado (si el paso lo tiene). */
  value: string
  /** En modo Libre, si la persona pidió la pista. */
  hintShown: boolean
}

export interface SimState {
  index: number
  steps: StepState[]
  feedback: Feedback
  finished: boolean
}

export type SimAction =
  | { type: 'tap'; id: string }
  | { type: 'key'; keypadId: string; key: string }
  | { type: 'help' }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'restart' }

export const ERRORS_BEFORE_HIGHLIGHT = 2

export const KEY_DELETE = 'delete'

export function keyId(keypadId: string, key: string): string {
  return `${keypadId}.key.${key}`
}

export function initialState(flow: Flow): SimState {
  return {
    index: 0,
    steps: flow.steps.map(() => ({ done: false, errors: 0, value: '', hintShown: false })),
    feedback: null,
    finished: false,
  }
}

function findKeypad(step: FlowStep, keypadId: string): Extract<SimBlock, { type: 'keypad' }> | undefined {
  return step.screen.blocks.find(
    (b): b is Extract<SimBlock, { type: 'keypad' }> => b.type === 'keypad' && b.id === keypadId,
  )
}

function updateStep(state: SimState, patch: Partial<StepState>, feedback: Feedback): SimState {
  const steps = state.steps.slice()
  steps[state.index] = { ...steps[state.index], ...patch }
  return { ...state, steps, feedback }
}

export function simReducer(flow: Flow, state: SimState, action: SimAction): SimState {
  const step = flow.steps[state.index]
  const current = state.steps[state.index]

  switch (action.type) {
    case 'tap': {
      if (state.finished || current.done) return state
      const target = step.target
      if (target.kind === 'tap') {
        if (action.id === target.id) return updateStep(state, { done: true, errors: 0 }, 'success')
        return updateStep(state, { errors: current.errors + 1 }, 'wrong')
      }
      const keypad = findKeypad(step, target.keypadId)
      if (keypad && action.id === keypad.submit.id) {
        if (current.value === target.expected) return updateStep(state, { done: true, errors: 0 }, 'success')
        return updateStep(state, { errors: current.errors + 1 }, 'wrong')
      }
      return updateStep(state, { errors: current.errors + 1 }, 'wrong')
    }

    case 'key': {
      if (state.finished || current.done) return state
      const keypad = findKeypad(step, action.keypadId)
      if (!keypad) return state
      let value = current.value
      if (action.key === KEY_DELETE) value = value.slice(0, -1)
      else if (/^\d$/.test(action.key) && value.length < keypad.maxLength) value += action.key
      else return state
      // Escribir nunca cuenta como error; borra el aviso anterior para no confundir.
      return updateStep(state, { value }, null)
    }

    case 'help':
      return updateStep(state, { hintShown: true }, state.feedback)

    case 'next': {
      if (!current.done) return state
      if (state.index === flow.steps.length - 1) return { ...state, finished: true, feedback: null }
      return { ...state, index: state.index + 1, feedback: state.steps[state.index + 1].done ? 'success' : null }
    }

    case 'back': {
      if (state.finished) return { ...state, finished: false, feedback: 'success' }
      if (state.index === 0) return state
      return { ...state, index: state.index - 1, feedback: state.steps[state.index - 1].done ? 'success' : null }
    }

    case 'restart':
      return initialState(flow)
  }
}

/**
 * Qué elemento resaltar (contorno y flecha). Solo en modo Guiado y después de dos errores seguidos.
 * En pasos de teclado, señala la siguiente tecla correcta, "Borrar" si hay un número de más, o el botón final.
 */
export function highlightId(flow: Flow, state: SimState, mode: SimMode): string | null {
  if (mode !== 'guided' || state.finished) return null
  const current = state.steps[state.index]
  if (current.done || current.errors < ERRORS_BEFORE_HIGHLIGHT) return null
  return expectedElementId(flow.steps[state.index], current.value)
}

export function expectedElementId(step: FlowStep, value: string): string | null {
  const target = step.target
  if (target.kind === 'tap') return target.id
  const keypad = findKeypad(step, target.keypadId)
  if (!keypad) return null
  if (value === target.expected) return keypad.submit.id
  if (target.expected.startsWith(value)) return keyId(keypad.id, target.expected[value.length])
  return keyId(keypad.id, KEY_DELETE)
}

/** Todos los ids que se pueden tocar en una pantalla (sirve para validar los flujos). */
export function tappableIds(step: FlowStep): string[] {
  const ids: string[] = []
  for (const b of step.screen.blocks) {
    switch (b.type) {
      case 'tiles':
      case 'list':
      case 'actions':
        ids.push(...b.items.map((i) => i.id))
        break
      case 'form':
        ids.push(...b.fields.map((f) => f.id))
        break
      case 'settings':
        ids.push(...b.rows.map((r) => r.id))
        break
      case 'keypad':
        ids.push(b.submit.id)
        break
      case 'sms':
        if (b.link) ids.push(b.link.id)
        break
      case 'chat':
        if (b.composer) ids.push(...b.composer.buttons.map((x) => x.id))
        break
      default:
        break
    }
  }
  return ids
}
