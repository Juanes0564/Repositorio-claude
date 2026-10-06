import type { SkillId } from '../lib/storage'

/** Nombres de las 8 habilidades del Pasaporte Digital (sección 9 del brief). */
export const skillNames: Record<SkillId, string> = {
  transfers: 'Transferencias bancarias',
  medical: 'Citas médicas',
  transport: 'Transporte',
  shopping: 'Compras por internet',
  security: 'Seguridad digital',
  whatsapp: 'WhatsApp',
  phoneSettings: 'Configuración del celular',
  scams: 'Identificar estafas',
}
