/**
 * Motor de intención del copiloto. 100 % local: no usa internet ni inteligencia artificial externa.
 * Compara lo que dijo la persona con frases y palabras clave de cada intención (src/content/intents.ts).
 */
import { intents, type IntentDef, type IntentId } from '../content/intents'
import { editDistance, normalize, tokens } from './normalize'

export type Confidence = 'high' | 'medium' | 'low'

export interface IntentResult {
  /** La intención más probable, o null si no se entendió. */
  best: IntentId | null
  confidence: Confidence
  /** 1 a 3 opciones para ofrecer cuando la confianza es media. */
  candidates: IntentId[]
  scores: Partial<Record<IntentId, number>>
}

const PHRASE_WEIGHT = 4
/** Umbrales de confianza. */
export const HIGH_MIN = 2.5
export const HIGH_MARGIN = 1.5
export const LOW_MAX = 1

/**
 * ¿La palabra coincide con la clave?
 * - "transfer*" = cualquier palabra que empiece así (transferir, transferencia…).
 * - Tolera un error de escritura o de dictado en claves de 6 letras o más (en claves cortas
 *   un error cambia el sentido: "estar" no es "estafa").
 */
export function keywordMatch(token: string, key: string): number {
  const prefix = key.endsWith('*')
  const root = prefix ? key.slice(0, -1) : key
  if (prefix ? token.startsWith(root) : token === root) return 1
  if (root.length < 6 || token.length < 5) return 0
  if (prefix) {
    for (const k of [root.length - 1, root.length, root.length + 1]) {
      if (k <= token.length && editDistance(token.slice(0, k), root) <= 1) return 0.7
    }
    return 0
  }
  return editDistance(token, root) <= (root.length >= 8 ? 2 : 1) ? 0.7 : 0
}

function scoreIntent(def: IntentDef, text: string, toks: string[]): number {
  let score = 0
  const padded = ` ${text} `
  for (const phrase of def.phrases) {
    if (padded.includes(` ${normalize(phrase)} `)) score += PHRASE_WEIGHT
  }
  for (const [key, weight] of Object.entries(def.keywords)) {
    let best = 0
    for (const t of toks) best = Math.max(best, keywordMatch(t, key))
    score += best * weight
  }
  return score
}

export function detectIntent(input: string): IntentResult {
  const text = normalize(input)
  const toks = tokens(text)
  const scores: Partial<Record<IntentId, number>> = {}
  for (const def of intents) {
    const s = scoreIntent(def, text, toks)
    if (s > 0) scores[def.id] = Math.round(s * 100) / 100
  }
  const ranked = (Object.entries(scores) as [IntentId, number][]).sort((a, b) => b[1] - a[1])
  const [first, second] = ranked
  if (!first || first[1] < LOW_MAX) return { best: null, confidence: 'low', candidates: [], scores }

  const top = first[1]
  const gap = top - (second?.[1] ?? 0)
  if (top >= HIGH_MIN && gap >= HIGH_MARGIN) {
    return { best: first[0], confidence: 'high', candidates: [first[0]], scores }
  }
  const candidates = ranked.filter(([, s]) => s >= top * 0.4).slice(0, 3).map(([id]) => id)
  return { best: first[0], confidence: 'medium', candidates, scores }
}
