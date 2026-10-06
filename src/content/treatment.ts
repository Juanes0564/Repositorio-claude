/**
 * Trato a la persona usuaria: "tú" o "usted".
 * Para cambiar TODA la app a "usted", cambia 'tu' por 'usted' en la línea de abajo.
 * Cada texto que cambia según el trato se escribe con tv('versión tú', 'versión usted').
 */
export type Treatment = 'tu' | 'usted'

export const TREATMENT: Treatment = 'usted'

export function tv(tu: string, usted: string): string {
  return TREATMENT === 'tu' ? tu : usted
}
