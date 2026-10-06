import { tv } from './treatment'

/**
 * Rama "No entiendo un mensaje" del copiloto (secciones 6 y 13 del brief).
 * Como el copiloto no puede ver la pantalla, pregunta qué pide el mensaje y responde con orientación segura.
 * IMPORTANTE: contenido de seguridad. reviewed: false hasta que una persona del equipo lo revise.
 * No incluir teléfonos ni enlaces reales.
 */
export const messageHelp = {
  reviewed: false,
  question: tv(
    'No puedo ver tu pantalla. ¿Qué te pide el mensaje o la llamada?',
    'No puedo ver su pantalla. ¿Qué le pide el mensaje o la llamada?',
  ),
  options: [
    {
      id: 'password',
      label: 'Me pide una clave',
      answer: tv(
        'No la des. Ningún banco te pide la clave por mensaje ni por llamada. No respondas. Si dudas, llama al número que aparece en tu tarjeta.',
        'No la dé. Ningún banco le pide la clave por mensaje ni por llamada. No responda. Si duda, llame al número que aparece en su tarjeta.',
      ),
    },
    {
      id: 'code',
      label: 'Me pide un código que me llegó por mensaje',
      answer: tv(
        'Ese código es solo para ti. No se lo digas a nadie, aunque diga que es del banco. Cuelga o no respondas.',
        'Ese código es solo para usted. No se lo diga a nadie, aunque diga que es del banco. Cuelgue o no responda.',
      ),
    },
    {
      id: 'blocked',
      label: 'Dice que mi cuenta está bloqueada',
      answer: tv(
        'Es una trampa común. No toques el enlace del mensaje. Abre tú mismo la aplicación de tu banco, o llama al número que aparece en tu tarjeta.',
        'Es una trampa común. No toque el enlace del mensaje. Abra usted mismo la aplicación de su banco, o llame al número que aparece en su tarjeta.',
      ),
    },
    {
      id: 'money',
      label: 'Me pide dinero',
      answer: tv(
        'Para un momento. Si alguien te pide dinero con urgencia, llama tú a esa persona a su número de siempre. Consulta con un familiar antes de enviar nada.',
        'Pare un momento. Si alguien le pide dinero con urgencia, llame usted a esa persona a su número de siempre. Consulte con un familiar antes de enviar nada.',
      ),
    },
    {
      id: 'prize',
      label: 'Dice que me gané un premio',
      answer: tv(
        'Si no participaste en nada, no ganaste nada. No toques enlaces ni pagues para recibir un premio. Borra el mensaje.',
        'Si no participó en nada, no ganó nada. No toque enlaces ni pague para recibir un premio. Borre el mensaje.',
      ),
    },
    {
      id: 'other',
      label: 'Otra cosa',
      answer: tv(
        'Si dudas, no hagas nada todavía. Muéstrale el mensaje a un familiar de confianza. No abras enlaces que no esperabas.',
        'Si duda, no haga nada todavía. Muéstrele el mensaje a un familiar de confianza. No abra enlaces que no esperaba.',
      ),
    },
  ],
  remember: tv(
    'Recuerda: si te apuran, desconfía. Tomarte un tiempo te protege.',
    'Recuerde: si le apuran, desconfíe. Tomarse un tiempo le protege.',
  ),
  otherQuestion: 'Revisar otro mensaje',
}
