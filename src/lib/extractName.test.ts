import { describe, expect, it } from 'vitest'
import { extractName } from './extractName'

describe('nombre dicho en voz alta', () => {
  it.each([
    ['Marta', 'Marta'],
    ['me llamo Marta Lucía', 'Marta'],
    ['Mi nombre es JOSÉ', 'José'],
    ['soy luis', 'Luis'],
    ['hola me llamo Rosa.', 'Rosa'],
    ['me dicen Chepe', 'Chepe'],
    ['', ''],
  ])('"%s" → "%s"', (input, expected) => {
    expect(extractName(input)).toBe(expected)
  })
})
