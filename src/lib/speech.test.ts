import { describe, expect, it } from 'vitest'
import { pickVoice, splitSentences } from './speech'

describe('voz', () => {
  it('prefiere español de Colombia', () => {
    expect(pickVoice([{ lang: 'en-US' }, { lang: 'es-MX' }, { lang: 'es-CO' }])).toBe(2)
  })
  it('luego es-419, es-MX y es-US', () => {
    expect(pickVoice([{ lang: 'es-US' }, { lang: 'es-419' }])).toBe(1)
    expect(pickVoice([{ lang: 'es-US' }, { lang: 'es-MX' }])).toBe(1)
    expect(pickVoice([{ lang: 'es_US' }])).toBe(0)
  })
  it('si no, cualquier español; si no hay, -1', () => {
    expect(pickVoice([{ lang: 'en-GB' }, { lang: 'es-ES' }])).toBe(1)
    expect(pickVoice([{ lang: 'en-GB' }])).toBe(-1)
  })
  it('divide en frases', () => {
    expect(splitSentences('Hola. ¿Cómo estás? Toca aquí.')).toEqual(['Hola.', '¿Cómo estás?', 'Toca aquí.'])
  })
})
