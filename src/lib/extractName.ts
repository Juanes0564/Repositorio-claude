/** Saca el nombre de pila de lo que dijo la persona: "me llamo Marta Lucía" → "Marta". */
export function extractName(spoken: string): string {
  const cleaned = spoken
    .trim()
    .replace(/[.,!¡¿?]/g, ' ')
    .replace(/^\s*(hola\s+)?(me llamo|mi nombre es|yo soy|soy|me dicen|dime)\s+/i, '')
    .trim()
  const first = cleaned.split(/\s+/)[0] ?? ''
  if (!first) return ''
  return (first.charAt(0).toLocaleUpperCase('es-CO') + first.slice(1).toLocaleLowerCase('es-CO')).slice(0, 40)
}
