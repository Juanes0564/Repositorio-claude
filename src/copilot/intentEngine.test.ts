import { describe, expect, it } from 'vitest'
import { detectIntent, keywordMatch } from './intentEngine'
import { editDistance, normalize, tokens } from './normalize'
import type { IntentId } from '../content/intents'

describe('normalizar', () => {
  it('quita tildes, mayúsculas y puntuación', () => {
    expect(normalize('¡Quiero sacar una CITA médica, por favor!')).toBe('quiero sacar una cita medica por favor')
  })
  it('quita palabras vacías', () => {
    expect(tokens(normalize('Hola, quiero que me ayudes con el taxi'))).toEqual(['ayudes', 'taxi'])
  })
  it('distancia de edición', () => {
    expect(editDistance('wasap', 'wasap')).toBe(0)
    expect(editDistance('trasferir', 'transferir')).toBe(1)
  })
  it('acepta raíces y pequeños errores', () => {
    expect(keywordMatch('transferencia', 'transfer*')).toBe(1)
    expect(keywordMatch('trasferencia', 'transfer*')).toBeGreaterThan(0)
    expect(keywordMatch('pin', 'pin')).toBe(1)
    expect(keywordMatch('pintar', 'pin')).toBe(0)
  })
})

/** Frases coloquiales reales (con errores de dictado y de escritura) → intención esperada. */
const PHRASES: [string, IntentId][] = [
  // Transferencias
  ['Quiero mandar plata a mi hija', 'transfer'],
  ['necesito pasarle plata a mi hijo', 'transfer'],
  ['¿Cómo hago para girar plata?', 'transfer'],
  ['quiero consignar a la cuenta de mi nieta', 'transfer'],
  ['Quiero hacer una transferencia', 'transfer'],
  ['enviar dinero', 'transfer'],
  ['mandarle platica a la vecina', 'transfer'],
  ['como trasfiero 50 mil pesos', 'transfer'],
  ['hacer una trasferencia', 'transfer'],
  ['tengo que pagarle a la señora del aseo por el banco', 'transfer'],
  // Citas médicas
  ['Necesito sacar una cita médica', 'medical'],
  ['quiero un turno con el doctor', 'medical'],
  ['pedir cita con el médico general', 'medical'],
  ['cómo saco la cita en la EPS', 'medical'],
  ['necesito una cita con el especialista', 'medical'],
  ['tengo que pedir turno para el odontólogo', 'medical'],
  ['me toca ir al médico', 'medical'],
  // Transporte
  ['Quiero pedir un transporte', 'transport'],
  ['pedir un carro para ir al centro', 'transport'],
  ['necesito un taxi', 'transport'],
  ['quiero que me lleven al aeropuerto', 'transport'],
  ['cómo pido un servicio de taxi por el celular', 'transport'],
  ['necesito un carro que me recoja', 'transport'],
  // Compras
  ['quiero comprar por internet', 'shopping'],
  ['pedir un domicilio', 'shopping'],
  ['cómo hago un pedido del mercado', 'shopping'],
  ['quiero comprar unos zapatos en línea', 'shopping'],
  ['me traen el domicilio a la casa', 'shopping'],
  // WhatsApp
  ['ayúdame con el wasap', 'whatsapp'],
  ['no sé usar el guasap', 'whatsapp'],
  ['cómo mando un audio por WhatsApp', 'whatsapp'],
  ['quiero hacer una videollamada con mi nieto', 'whatsapp'],
  ['enviar una foto a mi hija', 'whatsapp'],
  ['salir de un grupo del whats', 'whatsapp'],
  // Configurar el celular
  ['cómo pongo la letra del celular más grande', 'phoneSettings'],
  ['quiero subir el volumen', 'phoneSettings'],
  ['conectarme al wifi', 'phoneSettings'],
  ['cómo quito el modo avión', 'phoneSettings'],
  ['el brillo de la pantalla está muy bajito', 'phoneSettings'],
  ['tengo que actualizar el celular', 'phoneSettings'],
  // Estafas y mensajes sospechosos
  ['Me llamaron del banco', 'scam'],
  ['me pidieron la clave por teléfono', 'scam'],
  ['me llegó un link raro', 'scam'],
  ['dice que me gané un premio', 'scam'],
  ['creo que es una estafa', 'scam'],
  ['me están pidiendo plata urgente', 'scam'],
  ['me pidieron el código que me llegó', 'scam'],
  ['me quieren tumbar', 'scam'],
  ['dicen que mi cuenta está bloqueada', 'scam'],
  ['No entiendo un mensaje', 'message'],
  ['me llegó un mensaje y no sé qué significa', 'message'],
  // Claves y seguridad
  ['quiero cambiar mi clave', 'security'],
  ['cómo hago una contraseña segura', 'security'],
  ['cómo bloqueo la pantalla del celular', 'security'],
  ['me da miedo que me jaqueen el celular', 'security'],
  // Ayuda humana
  ['quiero hablar con una persona', 'humanHelp'],
  ['necesito un asesor', 'humanHelp'],
  // Controles
  ['repite por favor', 'repeat'],
  ['otra vez', 'repeat'],
  ['no te entendí', 'repeat'],
  ['Háblame más despacio', 'slower'],
  ['más lento por favor', 'slower'],
  ['volver atrás', 'back'],
  ['regresar', 'back'],
  ['ir al inicio', 'home'],
  ['llévame al menú principal', 'home'],
  ['quiero practicar', 'practice'],
  ['usar el simulador', 'practice'],
  ['quiero la letra más grande', 'simpleMode'],
  ['activar el modo sencillo', 'simpleMode'],
  ['no veo bien las letras', 'simpleMode'],
  ['ver mis avances', 'progress'],
  ['cómo voy en mi pasaporte', 'progress'],
]

describe('motor de intención: frases coloquiales', () => {
  it(`cubre al menos 60 frases distintas (hay ${PHRASES.length})`, () => {
    expect(new Set(PHRASES.map(([p]) => p)).size).toBeGreaterThanOrEqual(60)
  })

  for (const [phrase, expected] of PHRASES) {
    it(`"${phrase}" → ${expected}`, () => {
      const r = detectIntent(phrase)
      expect(r.best, JSON.stringify(r.scores)).toBe(expected)
      expect(r.confidence).not.toBe('low')
    })
  }
})

describe('motor de intención: confianza', () => {
  it('alta cuando la frase es clara', () => {
    expect(detectIntent('quiero mandar plata a mi hija').confidence).toBe('high')
    expect(detectIntent('me llamaron del banco').confidence).toBe('high')
  })

  it('media cuando hay dos posibilidades: ofrece 2 o 3 opciones', () => {
    const r = detectIntent('quiero pagar en la tienda con el banco')
    expect(r.confidence).toBe('medium')
    expect(r.candidates.length).toBeGreaterThanOrEqual(2)
    expect(r.candidates.length).toBeLessThanOrEqual(3)
  })

  it('baja cuando no tiene que ver con nada', () => {
    for (const p of ['¿Cómo va a estar el clima mañana?', 'el gato de mi vecina', '', '   ', 'hola']) {
      const r = detectIntent(p)
      expect(r.confidence, p).toBe('low')
      expect(r.best).toBeNull()
    }
  })
})
