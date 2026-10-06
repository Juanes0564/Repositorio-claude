import type { Flow } from '../../sim/types'
import { tv } from '../treatment'

/**
 * Seguridad digital (sección 13.5 del brief): práctica en formato de decisiones.
 * Las opciones se ven todas iguales (tono "neutral") para no delatar la respuesta.
 * El mini repaso está en el taller "Cuida sus claves y su celular".
 * CONTENIDO SENSIBLE: borrador (reviewed: false) hasta que una persona del equipo lo revise.
 */
export const securityCheck: Flow = {
  id: 'security-check',
  skill: 'security',
  platform: 'settings',
  title: 'Proteger el celular y las claves',
  summary: tv(
    'Seis decisiones para cuidar tus claves y tu celular.',
    'Seis decisiones para cuidar sus claves y su celular.',
  ),
  minutes: 5,
  reviewed: false,
  steps: [
    {
      id: 'strong-password',
      coach: tv('Vas a crear una clave nueva. ¿Cuál es mejor?', 'Va a crear una clave nueva. ¿Cuál es mejor?'),
      hint: tv(
        'La mejor es fácil para ti y difícil de adivinar para otros.',
        'La mejor es fácil para usted y difícil de adivinar para otros.',
      ),
      wrong: tv(
        'Esa es fácil de adivinar. Busca una que solo tú sepas.',
        'Esa es fácil de adivinar. Busque una que solo usted sepa.',
      ),
      success: '¡Muy bien!',
      explain: tv(
        '1234 y la fecha de nacimiento son lo primero que prueban los ladrones. Una frase corta que solo tú conoces es fácil de recordar y difícil de adivinar.',
        '1234 y la fecha de nacimiento son lo primero que prueban los ladrones. Una frase corta que solo usted conoce es fácil de recordar y difícil de adivinar.',
      ),
      target: { kind: 'tap', id: 'pw-phrase' },
      screen: {
        chrome: 'phone',
        title: 'Crear clave',
        blocks: [
          {
            type: 'decision',
            prompt: '¿Qué clave elige?',
            options: [
              { id: 'pw-1234', label: '1234', tone: 'neutral' },
              { id: 'pw-birthday', label: 'Mi fecha de nacimiento', tone: 'neutral' },
              { id: 'pw-phrase', label: 'Una frase que solo yo sé, como "perro come arepa"', tone: 'neutral' },
            ],
          },
        ],
      },
    },
    {
      id: 'share-code',
      coach: tv('Alguien te escribe pidiendo un código. ¿Qué haces?', 'Alguien le escribe pidiendo un código. ¿Qué hace?'),
      hint: tv('Los códigos que llegan por mensaje son solo para ti.', 'Los códigos que llegan por mensaje son solo para usted.'),
      wrong: tv(
        'Mira otra vez: nunca se comparten los códigos, con nadie.',
        'Mire otra vez: nunca se comparten los códigos, con nadie.',
      ),
      success: '¡Muy bien!',
      explain: tv(
        'Con ese código pueden entrar a tu cuenta o a tus chats. No se lo des a nadie, aunque parezca un conocido o el banco.',
        'Con ese código pueden entrar a su cuenta o a sus chats. No se lo dé a nadie, aunque parezca un conocido o el banco.',
      ),
      target: { kind: 'tap', id: 'code-no' },
      screen: {
        chrome: 'platform',
        title: 'Número desconocido',
        blocks: [
          {
            type: 'chat',
            contact: 'Número desconocido',
            messages: [{ from: 'them', text: 'Hola, le mandé un código de 6 números por error. ¿Me lo reenvía, por favor?' }],
          },
          {
            type: 'decision',
            prompt: '¿Qué hace?',
            options: [
              { id: 'code-yes', label: 'Se lo reenvío', tone: 'neutral' },
              { id: 'code-no', label: 'No se lo doy a nadie', tone: 'neutral' },
            ],
          },
        ],
      },
    },
    {
      id: 'screen-lock',
      coach: tv('Tu celular no tiene bloqueo. ¿Qué pones?', 'Su celular no tiene bloqueo. ¿Qué pone?'),
      hint: tv('Piensa qué pasa si pierdes el celular.', 'Piense qué pasa si pierde el celular.'),
      wrong: tv(
        'Sin bloqueo, cualquiera puede abrir tu celular. Elige otra opción.',
        'Sin bloqueo, cualquiera puede abrir su celular. Elija otra opción.',
      ),
      success: '¡Muy bien!',
      explain: tv(
        'Con un PIN o tu huella, si pierdes el celular nadie puede ver tus mensajes ni entrar a tus aplicaciones.',
        'Con un PIN o su huella, si pierde el celular nadie puede ver sus mensajes ni entrar a sus aplicaciones.',
      ),
      target: { kind: 'tap', id: 'lock-pin' },
      screen: {
        chrome: 'platform',
        title: 'Bloqueo de pantalla',
        blocks: [
          { type: 'notice', tone: 'warning', text: 'Bloqueo actual: ninguno.' },
          {
            type: 'decision',
            prompt: '¿Qué bloqueo pone?',
            options: [
              { id: 'lock-none', label: 'Dejarlo sin bloqueo', tone: 'neutral' },
              { id: 'lock-pin', label: 'Un PIN o mi huella', tone: 'neutral' },
            ],
          },
        ],
      },
    },
    {
      id: 'update',
      coach: tv('El celular pide actualizarse. ¿Qué haces?', 'El celular pide actualizarse. ¿Qué hace?'),
      hint: tv('Las actualizaciones arreglan problemas de seguridad.', 'Las actualizaciones arreglan problemas de seguridad.'),
      wrong: tv(
        'Mira otra vez: actualizar protege tu celular.',
        'Mire otra vez: actualizar protege su celular.',
      ),
      success: '¡Muy bien!',
      explain: tv(
        'Actualizar tapa huecos de seguridad. Hazlo con wifi y con batería cargada.',
        'Actualizar tapa huecos de seguridad. Hágalo con wifi y con batería cargada.',
      ),
      target: { kind: 'tap', id: 'update-yes' },
      screen: {
        chrome: 'platform',
        title: 'Actualización',
        blocks: [
          { type: 'notice', tone: 'info', text: 'Hay una actualización de seguridad lista para instalar.' },
          {
            type: 'decision',
            prompt: '¿Qué hace?',
            options: [
              { id: 'update-never', label: 'La ignoro siempre', tone: 'neutral' },
              { id: 'update-yes', label: 'La instalo con wifi y batería', tone: 'neutral' },
            ],
          },
        ],
      },
    },
    {
      id: 'permissions',
      coach: tv('Una linterna pide ver tus contactos. ¿Qué haces?', 'Una linterna pide ver sus contactos. ¿Qué hace?'),
      hint: tv('¿Una linterna necesita tus contactos?', '¿Una linterna necesita sus contactos?'),
      wrong: tv(
        'Mira otra vez: una linterna no necesita tus contactos ni tu micrófono.',
        'Mire otra vez: una linterna no necesita sus contactos ni su micrófono.',
      ),
      success: '¡Muy bien!',
      explain: tv(
        'Si una aplicación pide algo que no necesita para funcionar, no se lo permitas. Puedes revisar los permisos en Ajustes.',
        'Si una aplicación pide algo que no necesita para funcionar, no se lo permita. Puede revisar los permisos en Ajustes.',
      ),
      target: { kind: 'tap', id: 'perm-deny' },
      screen: {
        chrome: 'platform',
        title: 'Permiso',
        blocks: [
          {
            type: 'notice',
            tone: 'warning',
            text: '"Linterna Ejemplo" quiere acceder a sus contactos y a su micrófono.',
          },
          {
            type: 'decision',
            prompt: '¿Qué hace?',
            options: [
              { id: 'perm-allow', label: 'Permitir', tone: 'neutral' },
              { id: 'perm-deny', label: 'No permitir', tone: 'neutral' },
            ],
          },
        ],
      },
    },
    {
      id: 'install-link',
      coach: tv('Te mandan un enlace para instalar una app. ¿Qué haces?', 'Le mandan un enlace para instalar una app. ¿Qué hace?'),
      hint: tv(
        'Las aplicaciones se instalan solo desde la tienda oficial del celular.',
        'Las aplicaciones se instalan solo desde la tienda oficial del celular.',
      ),
      wrong: tv(
        'Mira otra vez: instalar desde un enlace puede meter un virus.',
        'Mire otra vez: instalar desde un enlace puede meter un virus.',
      ),
      success: '¡Muy bien!',
      explain: tv(
        'Las apps de enlaces sueltos pueden robar tus datos. Instala solo desde la tienda oficial de tu celular y, si dudas, pregunta a un familiar.',
        'Las apps de enlaces sueltos pueden robar sus datos. Instale solo desde la tienda oficial de su celular y, si duda, pregunte a un familiar.',
      ),
      target: { kind: 'tap', id: 'install-no' },
      screen: {
        chrome: 'phone',
        title: 'Mensajes',
        blocks: [
          {
            type: 'sms',
            sender: 'Número desconocido',
            time: 'Ahora',
            body: 'Descargue esta aplicación para cobrar su subsidio hoy: subsidio-ejemplo.falso/app',
          },
          {
            type: 'decision',
            prompt: '¿Qué hace?',
            options: [
              { id: 'install-yes', label: 'La instalo desde el enlace', tone: 'neutral' },
              { id: 'install-no', label: 'No la instalo y borro el mensaje', tone: 'neutral' },
            ],
          },
        ],
      },
    },
  ],
  finish: {
    learned: [
      'Elegir una clave fácil de recordar y difícil de adivinar.',
      'No compartir códigos con nadie.',
      'Poner bloqueo de pantalla y actualizar el celular.',
      'Revisar permisos e instalar apps solo de la tienda oficial.',
    ],
    tip: tv(
      'Si algo te apura o te pide claves, códigos o permisos raros, para. Pregunta a un familiar antes de actuar.',
      'Si algo le apura o le pide claves, códigos o permisos raros, pare. Pregunte a un familiar antes de actuar.',
    ),
  },
}
