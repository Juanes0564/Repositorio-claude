/**
 * Esquema de los flujos de práctica del simulador.
 * Cada práctica es un archivo de datos en `src/content/flows/` que cumple este esquema.
 * El motor (`engine.ts`) y las piezas visuales (`blocks/`) son los mismos para todas.
 */
import type { Copy } from '../content/types'
import type { SkillId } from '../lib/storage'

export type PlatformId =
  | 'bank'
  | 'wallet'
  | 'eps'
  | 'transport'
  | 'delivery'
  | 'store'
  | 'chat'
  | 'settings'

/** Nombre de ícono disponible para las pantallas simuladas (ver `blocks/icons.ts`). */
export type SimIconName =
  | 'send'
  | 'pay'
  | 'history'
  | 'help'
  | 'user'
  | 'card'
  | 'calendar'
  | 'pin'
  | 'car'
  | 'cart'
  | 'bag'
  | 'chat'
  | 'phone'
  | 'video'
  | 'mic'
  | 'camera'
  | 'image'
  | 'bell'
  | 'wifi'
  | 'sun'
  | 'volume'
  | 'text'
  | 'plane'
  | 'download'
  | 'lock'
  | 'home'
  | 'search'
  | 'star'
  | 'check'
  | 'link'

/** Un elemento que se puede tocar dentro de la pantalla simulada. */
export interface Tappable {
  id: string
  label: Copy
}

export type SimBlock =
  | { type: 'heading'; text: Copy }
  | { type: 'text'; text: Copy; tone?: 'normal' | 'muted' }
  | { type: 'notice'; text: Copy; tone?: 'info' | 'warning' }
  | { type: 'balance'; label: Copy; amount: string; note?: Copy }
  /** Cuadrícula de botones con ícono (apps del celular o accesos de una app). */
  | {
      type: 'tiles'
      items: (Tappable & { icon?: SimIconName; platform?: PlatformId })[]
      columns?: 2 | 3
    }
  | { type: 'list'; title?: Copy; items: (Tappable & { detail?: Copy; icon?: SimIconName })[] }
  /** Campos de formulario que se tocan (por ejemplo "¿A dónde vas?"). */
  | { type: 'form'; fields: (Tappable & { value?: Copy; placeholder?: Copy })[] }
  | { type: 'actions'; items: (Tappable & { variant?: 'primary' | 'secondary' | 'link' })[] }
  /** Teclado numérico con su visor. El valor escrito lo guarda el motor. */
  | {
      type: 'keypad'
      id: string
      label: Copy
      display: 'masked' | 'money' | 'plain'
      maxLength: number
      submit: Tappable
    }
  /** Resumen para confirmar (pares etiqueta / valor). */
  | { type: 'summary'; title?: Copy; rows: { label: Copy; value: Copy }[] }
  | { type: 'receipt'; title: Copy; status: Copy; rows: { label: Copy; value: Copy }[] }
  /** Mensaje de texto (SMS) recibido. El enlace, si existe, se puede tocar. */
  | { type: 'sms'; sender: Copy; time?: Copy; body: Copy; link?: Tappable }
  | {
      type: 'chat'
      contact: Copy
      messages: { from: 'me' | 'them'; text: Copy; kind?: 'text' | 'audio' | 'photo' }[]
      /** Caja para escribir. `value` = texto ya escrito (el simulador no tiene teclado de letras). */
      composer?: { placeholder: Copy; value?: Copy; buttons: (Tappable & { icon: SimIconName })[] }
    }
  /** Decisión con botones grandes, por ejemplo "Es seguro" / "Es una estafa". */
  | { type: 'decision'; prompt?: Copy; options: (Tappable & { tone: 'safe' | 'danger' | 'neutral' })[] }
  /** Llamada entrante: quién llama y lo que dice. */
  | { type: 'call'; caller: Copy; note?: Copy; transcript: Copy }
  /** Placa de un carro, como se ve en la calle. */
  | { type: 'plate'; label: Copy; plate: string; detail?: Copy }
  /** Calificar con estrellas: cada estrella es tocable (id + ".star." + número). */
  | { type: 'rating'; id: string; label: Copy }
  | {
      type: 'settings'
      rows: (Tappable & { icon?: SimIconName; value?: Copy; control: 'toggle' | 'chevron'; on?: boolean })[]
    }

export interface SimScreen {
  /** 'phone' = pantalla de inicio del celular; 'platform' = dentro de la app ficticia. */
  chrome: 'phone' | 'platform'
  /** Título de la pantalla. En 'phone' reemplaza "Pantalla de inicio del celular" (por ejemplo "Mensajes"). */
  title?: Copy
  blocks: SimBlock[]
}

export type StepTarget =
  /** Tocar un elemento. */
  | { kind: 'tap'; id: string }
  /** Escribir un valor en un teclado y tocar el botón de enviar. */
  | { kind: 'input'; keypadId: string; expected: string }

export interface FlowStep {
  id: string
  screen: SimScreen
  target: StepTarget
  /** Instrucción del coach (máximo unas 12 palabras). */
  coach: Copy
  /** Pista: en modo Guiado se ve siempre; en Libre, solo al pedir Ayuda. */
  hint: Copy
  /** Mensaje si se equivoca. Si falta, se usa el mensaje amable general. */
  wrong?: Copy
  /** Mensaje al acertar. Si falta, "¡Bien!". */
  success?: Copy
  /** Explicación que aparece después de acertar (por ejemplo, las señales de una estafa). */
  explain?: Copy
}

export interface Flow {
  id: string
  skill: SkillId
  platform: PlatformId
  title: Copy
  /** Una frase que explica qué se practica. */
  summary: Copy
  minutes: number
  steps: FlowStep[]
  finish: {
    learned: Copy[]
    tip: Copy
  }
  /** Contenido sensible (seguridad, dinero): false hasta que una persona del equipo lo revise. */
  reviewed: boolean
}

export type SimMode = 'guided' | 'free'
