/**
 * Ayuda humana (pantalla 10 del brief).
 *
 * Por ahora NO hay guías disponibles: la pantalla muestra "Próximamente" y nunca
 * indicadores falsos como "En línea".
 *
 * CÓMO ACTIVARLA cuando el equipo tenga personas guías:
 * 1. Cambia HUMAN_HELP_ENABLED a true.
 * 2. Escribe en WHATSAPP_NUMBER el número del equipo, con indicativo y sin signos
 *    (por ejemplo, para Colombia: '57' seguido del celular).
 * 3. Opcional: cambia el mensaje inicial en WHATSAPP_MESSAGE.
 * 4. Corre `npm test` y `npm run build`.
 * Los botones abrirán WhatsApp con un enlace wa.me. (No se usa ninguna API ni servicio de pago.)
 */
export const HUMAN_HELP_ENABLED = false

/** Número de WhatsApp del equipo de guías. Vacío mientras no haya guías. */
export const WHATSAPP_NUMBER = ''

export const WHATSAPP_MESSAGE = 'Hola, necesito ayuda con Vínculo.'

/** Enlace de WhatsApp (wa.me) o null si la ayuda humana no está activa. */
export function humanHelpLink(): string | null {
  if (!HUMAN_HELP_ENABLED || !/^\d{8,15}$/.test(WHATSAPP_NUMBER)) return null
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
}
