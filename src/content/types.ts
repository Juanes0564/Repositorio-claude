/**
 * Un texto puede ser una frase normal o tener una versión más corta
 * para el "lenguaje sencillo" (campo `simple`).
 */
export type Copy = string | { text: string; simple: string }

export function resolveCopy(copy: Copy, simpleLanguage: boolean): string {
  if (typeof copy === 'string') return copy
  return simpleLanguage ? copy.simple : copy.text
}

/** Texto con versión corta para el lenguaje sencillo: sv(textoNormal, textoSencillo). */
export function sv(text: string, simple: string): Copy {
  return { text, simple }
}
