import type { SkillId } from '../lib/storage'
import { tv } from './treatment'

export type IntentId =
  | 'transfer'
  | 'medical'
  | 'transport'
  | 'shopping'
  | 'whatsapp'
  | 'phoneSettings'
  | 'scam'
  | 'message'
  | 'security'
  | 'humanHelp'
  | 'repeat'
  | 'slower'
  | 'back'
  | 'home'
  | 'practice'
  | 'simpleMode'
  | 'progress'

export interface IntentDef {
  id: IntentId
  /** Texto del botón cuando se ofrece como opción. */
  label: string
  /** Pregunta de confirmación cuando la confianza es alta. */
  confirm: string
  /**
   * Frases completas (se comparan sin tildes ni mayúsculas). Pesan mucho.
   * Pon aquí expresiones colombianas y formas de decirlo.
   */
  phrases: string[]
  /** Palabras clave con su peso. Termina en * para aceptar cualquier final (transfer* = transferir, transferencia…). */
  keywords: Record<string, number>
  /** Guía "en la vida real" asociada, si la hay. */
  guide?: SkillId
}

/**
 * Intenciones del copiloto (sección 6 del brief). Para enseñarle una nueva forma de decir algo,
 * agrega la frase en `phrases` o la palabra en `keywords` y corre `npm test`.
 */
export const intents: IntentDef[] = [
  {
    id: 'transfer',
    label: 'Enviar dinero',
    confirm: tv('¿Quieres hacer una transferencia?', '¿Quiere hacer una transferencia?'),
    guide: 'transfers',
    phrases: [
      'mandar plata', 'pasar plata', 'girar plata', 'enviar plata', 'mandar platica', 'mandarle plata',
      'enviar dinero', 'mandar dinero', 'pasar dinero', 'enviarle dinero', 'hacer una transferencia',
      'hacer un giro', 'pagarle a', 'consignarle a',
    ],
    keywords: {
      'transfer*': 3, 'trasfer*': 3, 'consign*': 3, 'plata': 1.5, 'platica': 1.5, 'dinero': 1.5, 'gir*': 2,
      'mandar*': 1, 'enviar*': 1, 'deposit*': 2, 'banco': 1, 'cuenta': 0.5, 'pesos': 1, 'billetera': 1.5,
    },
  },
  {
    id: 'medical',
    label: 'Sacar una cita médica',
    confirm: tv('¿Quieres sacar una cita médica?', '¿Quiere sacar una cita médica?'),
    guide: 'medical',
    phrases: [
      'cita medica', 'cita con el doctor', 'cita con el medico', 'turno con el medico', 'turno con el doctor',
      'sacar una cita', 'pedir una cita', 'pedir cita', 'sacar cita', 'pedir turno', 'cita en la eps',
    ],
    keywords: {
      'cita*': 2.5, 'medic*': 2, 'doctor*': 2, 'turno': 2, 'eps': 3, 'salud': 1.5, 'especialista': 2,
      'odontolog*': 2, 'consulta*': 2, 'hospital': 1.5, 'clinica': 1.5, 'enferm*': 1, 'examen*': 1.5,
      'medicament*': 1.5, 'odontologo': 2, 'dentista': 2,
    },
  },
  {
    id: 'transport',
    label: 'Pedir un transporte',
    confirm: tv('¿Quieres pedir un transporte?', '¿Quiere pedir un transporte?'),
    guide: 'transport',
    phrases: ['pedir un carro', 'pedir un taxi', 'pedir transporte', 'que me lleve', 'que me recojan', 'pedir un servicio de taxi'],
    keywords: {
      'taxi': 3, 'carro': 2, 'transport*': 3, 'conductor*': 2, 'viaje': 1.5, 'moverme': 1.5, 'llev*': 1,
      'bus': 1.5, 'buseta': 1.5, 'aeropuerto': 1.5, 'recog*': 1.5, 'carrera': 1,
    },
  },
  {
    id: 'shopping',
    label: 'Comprar por internet',
    confirm: tv('¿Quieres comprar por internet?', '¿Quiere comprar por internet?'),
    guide: 'shopping',
    phrases: [
      'comprar por internet', 'comprar en linea', 'compras en linea', 'hacer un pedido', 'pedir un domicilio',
      'pedir domicilio', 'pedir el mercado', 'comprar algo',
    ],
    keywords: { 'compr*': 2.5, 'domicilio*': 3, 'pedido': 2, 'tienda': 2, 'mercado': 1.5, 'carrito': 2, 'envio': 1 },
  },
  {
    id: 'whatsapp',
    label: 'Usar WhatsApp',
    confirm: tv('¿Quieres ayuda con WhatsApp?', '¿Quiere ayuda con WhatsApp?'),
    guide: 'whatsapp',
    phrases: [
      'mandar un audio', 'enviar un audio', 'mandar una nota de voz', 'mandar una foto', 'enviar una foto',
      'hacer una videollamada', 'escribirle a', 'grupo de la familia', 'salir de un grupo',
    ],
    keywords: {
      'whatsapp': 4, 'wasap': 4, 'guasap': 4, 'wasa': 3, 'whats': 3, 'wpp': 3, 'wsp': 3, 'chat': 2, 'audio*': 2,
      'videollamada': 3, 'foto*': 1.5, 'grupo': 1.5, 'mensaje*': 0.5,
    },
  },
  {
    id: 'phoneSettings',
    label: 'Configurar el celular',
    confirm: tv('¿Quieres configurar tu celular?', '¿Quiere configurar su celular?'),
    guide: 'phoneSettings',
    phrases: [
      'letra del celular', 'letra del telefono', 'configurar el celular', 'modo avion', 'subir el volumen',
      'bajar el volumen', 'conectarme al wifi', 'conectar el wifi', 'actualizar el celular',
    ],
    keywords: {
      'celular': 1.5, 'telefono': 1.5, 'configur*': 2.5, 'ajuste*': 2, 'wifi': 3, 'brillo': 3, 'volumen': 3,
      'sonido': 2, 'actualiz*': 2.5, 'avion': 2.5, 'pantalla': 1, 'bateria': 1.5, 'timbre': 2, 'datos': 1,
    },
  },
  {
    id: 'scam',
    label: 'Revisar si es una estafa',
    confirm: tv('¿Te llegó algo sospechoso? ¿Lo revisamos juntos?', '¿Le llegó algo sospechoso? ¿Lo revisamos juntos?'),
    phrases: [
      'me llamaron del banco', 'me pidieron la clave', 'me pidieron el codigo', 'me llego un link', 'me llego un enlace',
      'me gane un premio', 'me gano un premio', 'gane un premio', 'mensaje raro', 'mensaje sospechoso',
      'es una estafa', 'me quieren robar', 'cuenta bloqueada', 'me pidieron plata', 'me pidieron dinero',
      'me pide dinero', 'me pide un codigo', 'me pide una clave', 'numero desconocido', 'me llamo un desconocido',
      'me quieren tumbar', 'me estan pidiendo',
    ],
    keywords: {
      'estaf*': 4, 'fraud*': 4, 'sospech*': 3, 'premio': 3, 'link': 2.5, 'enlace': 2.5, 'raro': 1.5,
      'extrano': 1.5, 'robar*': 2, 'ladron*': 2.5, 'tumbar': 3, 'bloquead*': 1.5, 'desconocid*': 2,
      'urgente': 1.5, 'engan*': 3, 'falso': 2, 'llamaron': 1, 'pidieron': 1.5,
    },
  },
  {
    id: 'message',
    label: 'No entiendo un mensaje',
    confirm: tv('¿Quieres que revisemos un mensaje juntos?', '¿Quiere que revisemos un mensaje juntos?'),
    phrases: [
      'no entiendo un mensaje', 'no entiendo el mensaje', 'no entiendo este mensaje', 'que significa este mensaje',
      'me llego un mensaje', 'que dice este mensaje', 'no entiendo lo que dice', 'no entiendo lo que me dice',
    ],
    keywords: { 'mensaje*': 1.5, 'significa': 1.5, 'sms': 2 },
  },
  {
    id: 'security',
    label: 'Claves y seguridad',
    confirm: tv('¿Quieres proteger tu celular y tus claves?', '¿Quiere proteger su celular y sus claves?'),
    guide: 'security',
    phrases: [
      'cambiar la clave', 'cambiar mi clave', 'clave segura', 'contrasena segura', 'bloquear el celular',
      'bloquear la pantalla', 'bloqueo la pantalla', 'bloquear el telefono', 'proteger mi celular', 'proteger mi cuenta', 'olvide mi clave', 'olvide la clave',
    ],
    keywords: {
      'clave*': 2, 'contrasena*': 2.5, 'segur*': 2, 'proteg*': 2, 'bloque*': 1.5, 'pin': 1.5, 'huella': 2,
      'virus': 2, 'hacke*': 2.5, 'jaque*': 2.5,
    },
  },
  {
    id: 'humanHelp',
    label: 'Hablar con una persona',
    confirm: tv('¿Quieres ayuda de una persona?', '¿Quiere ayuda de una persona?'),
    phrases: ['hablar con una persona', 'hablar con alguien', 'ayuda humana', 'persona real', 'un guia', 'llamar a alguien', 'con un asesor'],
    keywords: { 'persona': 2, 'humano': 3, 'humana': 3, 'alguien': 1.5, 'asesor*': 3, 'guia': 2, 'operador*': 3 },
  },
  {
    id: 'repeat',
    label: 'Repetir',
    confirm: tv('¿Quieres que lo repita?', '¿Quiere que lo repita?'),
    phrases: ['otra vez', 'de nuevo', 'no te entendi', 'no le entendi', 'no entendi', 'que dijiste', 'como dijiste', 'dimelo otra vez'],
    keywords: { 'repet*': 3, 'repit*': 3 },
  },
  {
    id: 'slower',
    label: 'Hablar más despacio',
    confirm: tv('¿Quieres que hable más despacio?', '¿Quiere que hable más despacio?'),
    phrases: ['mas despacio', 'mas lento', 'habla despacio', 'hable despacio', 'hablame mas despacio', 'no tan rapido'],
    keywords: { 'despacio': 4, 'lento': 3, 'lenta': 3, 'despacito': 4, 'calma': 1.5, 'rapido': 1.5 },
  },
  {
    id: 'back',
    label: 'Volver atrás',
    confirm: tv('¿Quieres volver atrás?', '¿Quiere volver atrás?'),
    phrases: ['volver atras', 'ir atras', 'pagina anterior', 'devolverme'],
    keywords: { 'atras': 3, 'volver': 2, 'regres*': 3, 'devolv*': 2.5, 'anterior': 2 },
  },
  {
    id: 'home',
    label: 'Ir al inicio',
    confirm: tv('¿Quieres ir al inicio?', '¿Quiere ir al inicio?'),
    phrases: ['al inicio', 'volver al inicio', 'ir al inicio', 'pantalla principal', 'menu principal', 'pagina principal'],
    keywords: { 'inicio': 3, 'principal': 2, 'menu': 2.5 },
  },
  {
    id: 'practice',
    label: 'Practicar',
    confirm: tv('¿Quieres practicar en el simulador?', '¿Quiere practicar en el simulador?'),
    phrases: ['quiero practicar', 'practicar un tramite', 'hacer una practica'],
    keywords: { 'practic*': 3, 'simul*': 3, 'ensay*': 3, 'entren*': 2, 'aprend*': 1.5 },
  },
  {
    id: 'simpleMode',
    label: 'Modo sencillo',
    confirm: tv('¿Quieres poner la letra más grande con el modo sencillo?', '¿Quiere poner la letra más grande con el modo sencillo?'),
    phrases: [
      'letra mas grande', 'letras mas grandes', 'letra grande', 'modo sencillo', 'no veo bien', 'agrandar la letra',
      'letra pequena', 'letra muy pequena', 'botones mas grandes', 'mas facil',
    ],
    keywords: { 'sencill*': 3, 'letra*': 2, 'grande*': 1, 'agrand*': 2.5, 'facil': 1.5, 'contraste': 3, 'veo': 1 },
  },
  {
    id: 'progress',
    label: 'Ver mis avances',
    confirm: tv('¿Quieres ver tus avances?', '¿Quiere ver sus avances?'),
    phrases: ['mis avances', 'mi progreso', 'mi pasaporte', 'como voy', 'que he aprendido', 'cuanto llevo'],
    keywords: { 'avance*': 3, 'progreso': 3, 'pasaporte': 3, 'logro*': 2, 'certificado': 2.5, 'insignia*': 2 },
  },
]

export function getIntent(id: IntentId): IntentDef {
  return intents.find((i) => i.id === id)!
}
