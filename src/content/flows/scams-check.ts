import type { Flow, SimBlock } from '../../sim/types'
import { tv } from '../treatment'

/**
 * Identificar estafas (sección 13.8 del brief): mensajes y llamadas de práctica.
 * La persona decide "Es seguro" o "Es una estafa" y luego ve las señales.
 * CONTENIDO SENSIBLE: borrador (reviewed: false) hasta que una persona del equipo lo revise.
 * Los "enlaces" son texto inventado, no se pueden abrir, y no imitan dominios reales.
 */
const decide = (prefix: string): SimBlock => ({
  type: 'decision',
  prompt: '¿Qué cree?',
  options: [
    { id: `${prefix}-safe`, label: 'Es seguro', tone: 'safe' },
    { id: `${prefix}-scam`, label: 'Es una estafa', tone: 'danger' },
  ],
})

export const scamsCheck: Flow = {
  id: 'scams-check',
  skill: 'scams',
  platform: 'chat',
  title: '¿Es seguro o es una estafa?',
  summary: tv(
    'Practica con mensajes y llamadas de mentira. Tú decides.',
    'Practique con mensajes y llamadas de mentira. Usted decide.',
  ),
  minutes: 6,
  reviewed: false,
  steps: [
    {
      id: 'blocked-link',
      coach: tv('Te llegó este mensaje. ¿Es seguro o es una estafa?', 'Le llegó este mensaje. ¿Es seguro o es una estafa?'),
      hint: tv(
        'Fíjate: te apura y trae un enlace que no esperabas.',
        'Fíjese: le apura y trae un enlace que no esperaba.',
      ),
      wrong: tv(
        'Mira otra vez: te apura y pide entrar a un enlace.',
        'Mire otra vez: le apura y pide entrar a un enlace.',
      ),
      success: tv('¡Muy bien! Es una estafa.', '¡Muy bien! Es una estafa.'),
      explain: tv(
        'Te asusta con un bloqueo, te apura y trae un enlace. Los bancos no hacen eso. No abras el enlace: abre tú la app de tu banco o llama al número de tu tarjeta.',
        'Le asusta con un bloqueo, le apura y trae un enlace. Los bancos no hacen eso. No abra el enlace: abra usted la app de su banco o llame al número de su tarjeta.',
      ),
      target: { kind: 'tap', id: 's1-scam' },
      screen: {
        chrome: 'phone',
        title: 'Mensajes',
        blocks: [
          {
            type: 'sms',
            sender: 'Número desconocido',
            time: 'Ahora',
            body: 'BANCO: Su cuenta será BLOQUEADA hoy. Ingrese ya sus datos en el enlace: banco-ejemplo-verifica.falso',
          },
          decide('s1'),
        ],
      },
    },
    {
      id: 'bank-call',
      coach: tv('Te están llamando. ¿Es seguro o es una estafa?', 'Le están llamando. ¿Es seguro o es una estafa?'),
      hint: tv('Fíjate en lo que te pide.', 'Fíjese en lo que le pide.'),
      wrong: tv(
        'Mira otra vez: te pide el código que te llegó.',
        'Mire otra vez: le pide el código que le llegó.',
      ),
      success: '¡Muy bien! Es una estafa.',
      explain: tv(
        'Ningún banco pide claves ni códigos por llamada. Cuelga y llama tú al número que aparece en tu tarjeta.',
        'Ningún banco pide claves ni códigos por llamada. Cuelgue y llame usted al número que aparece en su tarjeta.',
      ),
      target: { kind: 'tap', id: 's2-scam' },
      screen: {
        chrome: 'phone',
        title: 'Teléfono',
        blocks: [
          {
            type: 'call',
            caller: '"Seguridad del banco"',
            note: 'Número desconocido',
            transcript:
              'Le hablamos del banco. Detectamos un movimiento raro. Para protegerlo, díganos el código que le acaba de llegar.',
          },
          decide('s2'),
        ],
      },
    },
    {
      id: 'prize',
      coach: tv('Otro mensaje. ¿Es seguro o es una estafa?', 'Otro mensaje. ¿Es seguro o es una estafa?'),
      hint: tv('¿Participaste en algún sorteo?', '¿Participó en algún sorteo?'),
      wrong: tv(
        'Mira otra vez: te piden pagar para recibir un premio.',
        'Mire otra vez: le piden pagar para recibir un premio.',
      ),
      success: '¡Muy bien! Es una estafa.',
      explain: tv(
        'Si no participaste en nada, no ganaste nada. Nadie pide pagar para entregar un premio. Borra el mensaje.',
        'Si no participó en nada, no ganó nada. Nadie pide pagar para entregar un premio. Borre el mensaje.',
      ),
      target: { kind: 'tap', id: 's3-scam' },
      screen: {
        chrome: 'phone',
        title: 'Mensajes',
        blocks: [
          {
            type: 'sms',
            sender: 'Número desconocido',
            time: 'Hace 5 min',
            body: '¡FELICIDADES! Usted ganó un televisor. Para recibirlo pague $ 30.000 del envío hoy mismo.',
          },
          decide('s3'),
        ],
      },
    },
    {
      id: 'family',
      coach: tv('Un mensaje de un "familiar". ¿Es seguro o es una estafa?', 'Un mensaje de un "familiar". ¿Es seguro o es una estafa?'),
      hint: tv('Fíjate: número nuevo, urgencia y que pide dinero.', 'Fíjese: número nuevo, urgencia y que pide dinero.'),
      wrong: tv(
        'Mira otra vez: es un número nuevo, hay prisa y pide plata.',
        'Mire otra vez: es un número nuevo, hay prisa y pide plata.',
      ),
      success: '¡Muy bien! Es una estafa.',
      explain: tv(
        'Número nuevo, prisa, plata y secreto: son señales de estafa. Llama tú a tu familiar a su número de siempre antes de enviar nada.',
        'Número nuevo, prisa, plata y secreto: son señales de estafa. Llame usted a su familiar a su número de siempre antes de enviar nada.',
      ),
      target: { kind: 'tap', id: 's4-scam' },
      screen: {
        chrome: 'platform',
        title: 'Número desconocido',
        blocks: [
          {
            type: 'chat',
            contact: 'Número desconocido',
            messages: [
              { from: 'them', text: 'Hola, soy yo, tu nieto. Cambié de número.' },
              { from: 'them', text: 'Tuve un problema. Necesito que me consignes $ 500.000 ya. No le digas a nadie, por favor.' },
            ],
          },
          decide('s4'),
        ],
      },
    },
    {
      id: 'family-safe',
      coach: tv('Ahora un mensaje de tu hija. ¿Es seguro?', 'Ahora un mensaje de su hija. ¿Es seguro?'),
      hint: tv(
        'Es un contacto que ya tienes guardado y no pide nada.',
        'Es un contacto que ya tiene guardado y no pide nada.',
      ),
      wrong: tv(
        'Mira otra vez: es un contacto guardado y no pide dinero ni datos.',
        'Mire otra vez: es un contacto guardado y no pide dinero ni datos.',
      ),
      success: tv('¡Muy bien! Es seguro.', '¡Muy bien! Es seguro.'),
      explain: tv(
        'Viene de un contacto que ya conoces, no te apura y no pide dinero, claves ni códigos. No todo mensaje es una estafa.',
        'Viene de un contacto que ya conoce, no le apura y no pide dinero, claves ni códigos. No todo mensaje es una estafa.',
      ),
      target: { kind: 'tap', id: 's5-safe' },
      screen: {
        chrome: 'platform',
        title: 'Rosa (hija)',
        blocks: [
          {
            type: 'chat',
            contact: 'Rosa (hija) · contacto guardado',
            messages: [
              { from: 'them', text: 'Hola, llego a las 6 para la comida. ¿Necesitas que lleve algo?' },
              { from: 'me', text: 'Trae pan, por favor.' },
            ],
          },
          decide('s5'),
        ],
      },
    },
    {
      id: 'purchase-notice',
      coach: tv('Un aviso de tu banco. ¿Es seguro o es una estafa?', 'Un aviso de su banco. ¿Es seguro o es una estafa?'),
      hint: tv(
        'Es un aviso de una compra que tú hiciste. No trae enlace ni pide datos.',
        'Es un aviso de una compra que usted hizo. No trae enlace ni pide datos.',
      ),
      wrong: tv(
        'Mira otra vez: no tiene enlace ni pide nada. Te manda al número de tu tarjeta.',
        'Mire otra vez: no tiene enlace ni pide nada. Le manda al número de su tarjeta.',
      ),
      success: '¡Muy bien! Es seguro.',
      explain: tv(
        'Solo te avisa de una compra que hiciste. No pide claves, no trae enlaces y te manda al número de tu tarjeta, no a uno nuevo. Si un aviso trae otro número o un enlace, desconfía.',
        'Solo le avisa de una compra que hizo. No pide claves, no trae enlaces y le manda al número de su tarjeta, no a uno nuevo. Si un aviso trae otro número o un enlace, desconfíe.',
      ),
      target: { kind: 'tap', id: 's6-safe' },
      screen: {
        chrome: 'phone',
        title: 'Mensajes',
        blocks: [
          {
            type: 'notice',
            tone: 'info',
            text: tv(
              'Hoy compraste una olla de $ 20.000 en Tienda Ejemplo.',
              'Hoy compró una olla de $ 20.000 en Tienda Ejemplo.',
            ),
          },
          {
            type: 'sms',
            sender: 'Banco Ejemplo',
            time: 'Hace 1 min',
            body: 'Compra aprobada por $ 20.000 en Tienda Ejemplo. Si no la reconoce, llame al número que aparece en su tarjeta.',
          },
          decide('s6'),
        ],
      },
    },
  ],
  finish: {
    learned: [
      'Ningún banco pide claves ni códigos por llamada o mensaje.',
      'No abrir enlaces que no esperaba.',
      'Un premio que pide pagar es una estafa.',
      'Ante prisa y pedidos de plata, llamar uno mismo a su familiar.',
      'No todo mensaje es una estafa: hay que mirar las señales.',
    ],
    tip: tv(
      'Si dudas, cuelga o no respondas. Llama al número que aparece en tu tarjeta y consulta con un familiar antes de actuar.',
      'Si duda, cuelgue o no responda. Llame al número que aparece en su tarjeta y consulte con un familiar antes de actuar.',
    ),
  },
}
