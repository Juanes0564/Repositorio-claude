/**
 * Un texto puede ser una frase normal o tener una versión más corta
 * para el "lenguaje sencillo" (campo `simple`).
 */
export type Copy = string | { text: string; simple: string }

export function resolveCopy(copy: Copy, simpleLanguage: boolean): string {
  if (typeof copy === 'string') return copy
  return simpleLanguage ? copy.simple : copy.text
}
