/** Normaliza texto para compararlo: minúsculas, sin tildes, sin puntuación, espacios simples. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Palabras que no ayudan a entender qué se quiere hacer. */
export const STOPWORDS = new Set(
  (
    'a al algo alla aqui ay bueno como con cual de del dime el ella ellos en es esa ese eso esta este esto estoy favor ' +
    'hay hola la las le les lo los me mi mis mucho muy necesito o oiga oye para pero por porfa porfavor puedo pues ' +
    'que quiero quisiera se ser si sobre su sus tambien te tengo tu un una uno unos usted vamos voy y ya yo ' +
    'ayudame ayudeme hacer hago podria puede quería queria gustaria'
  ).split(' '),
)

export function tokens(normalized: string): string[] {
  return normalized.split(' ').filter((t) => t && !STOPWORDS.has(t))
}

/** Distancia de edición (Levenshtein) entre dos palabras cortas. */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = temp
    }
  }
  return prev[b.length]
}
