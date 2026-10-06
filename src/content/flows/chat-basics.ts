import type { Flow, SimBlock } from '../../sim/types'
import { tv } from '../treatment'

/**
 * Mensajería con Chat Ejemplo (sección 13.6 del brief). Contactos y mensajes son de práctica.
 * En la app real el audio se graba manteniendo el dedo; aquí basta tocar (el brief prohíbe gestos obligatorios).
 */
const chatButtons = (value?: string): SimBlock => ({
  type: 'chat',
  contact: 'Rosa (hija)',
  messages: [{ from: 'them', text: 'Hola, ¿cómo amaneció?' }],
  composer: {
    placeholder: 'Mensaje',
    value,
    buttons: [
      { id: 'send', label: 'Enviar', icon: 'send' },
      { id: 'audio', label: 'Audio', icon: 'mic' },
      { id: 'photo', label: 'Foto', icon: 'camera' },
    ],
  },
})

const callButtons: SimBlock = {
  type: 'tiles',
  columns: 2,
  items: [
    { id: 'call', label: 'Llamar', icon: 'phone' },
    { id: 'video', label: 'Videollamada', icon: 'video' },
  ],
}

export const chatBasics: Flow = {
  id: 'chat-basics',
  skill: 'whatsapp',
  platform: 'chat',
  title: 'Mensajes, audios y videollamadas',
  summary: tv(
    'Practica lo más útil de los chats con Chat Ejemplo.',
    'Practique lo más útil de los chats con Chat Ejemplo.',
  ),
  minutes: 6,
  reviewed: false,
  steps: [
    {
      id: 'open-app',
      coach: tv('Abre la aplicación de mensajes.', 'Abra la aplicación de mensajes.'),
      hint: tv('Toca el cuadro que dice "Chat Ejemplo".', 'Toque el cuadro que dice "Chat Ejemplo".'),
      wrong: tv(
        'Esa es otra aplicación. Busca la que dice Chat Ejemplo.',
        'Esa es otra aplicación. Busque la que dice Chat Ejemplo.',
      ),
      target: { kind: 'tap', id: 'app-chat' },
      screen: {
        chrome: 'phone',
        blocks: [
          {
            type: 'tiles',
            columns: 3,
            items: [
              { id: 'app-bank', label: 'Banco Ejemplo', platform: 'bank' },
              { id: 'app-eps', label: 'EPS Salud Ejemplo', platform: 'eps' },
              { id: 'app-chat', label: 'Chat Ejemplo', platform: 'chat' },
              { id: 'app-transport', label: 'Transporte Ejemplo', platform: 'transport' },
              { id: 'app-store', label: 'Tienda Ejemplo', platform: 'store' },
              { id: 'app-settings', label: 'Ajustes', platform: 'settings' },
            ],
          },
        ],
      },
    },
    {
      id: 'open-chat',
      coach: tv('Abre la conversación con Rosa, tu hija.', 'Abra la conversación con Rosa, su hija.'),
      hint: tv('Toca el nombre "Rosa (hija)".', 'Toque el nombre "Rosa (hija)".'),
      wrong: tv('Esa no es Rosa. Lee los nombres con calma.', 'Esa no es Rosa. Lea los nombres con calma.'),
      target: { kind: 'tap', id: 'chat-rosa' },
      screen: {
        chrome: 'platform',
        title: 'Chats',
        blocks: [
          {
            type: 'list',
            items: [
              { id: 'chat-family', label: 'Familia (grupo)', detail: 'Tío Jorge: ¡Feliz domingo a todos!', icon: 'user' },
              { id: 'chat-rosa', label: 'Rosa (hija)', detail: 'Hola, ¿cómo amaneció?', icon: 'user' },
              { id: 'chat-carlos', label: 'Carlos Ejemplo', detail: 'Gracias, vecina.', icon: 'user' },
            ],
          },
        ],
      },
    },
    {
      id: 'send-text',
      coach: tv('Ya escribimos un saludo. Toca Enviar para enviarlo.', 'Ya escribimos un saludo. Toque Enviar para enviarlo.'),
      hint: tv(
        'El botón "Enviar" tiene una flecha. Está debajo de la caja del mensaje.',
        'El botón "Enviar" tiene una flecha. Está debajo de la caja del mensaje.',
      ),
      wrong: tv('Para enviar el mensaje escrito, toca Enviar.', 'Para enviar el mensaje escrito, toque Enviar.'),
      success: tv('¡Bien! Ya se envió.', '¡Bien! Ya se envió.'),
      target: { kind: 'tap', id: 'send' },
      screen: { chrome: 'platform', title: 'Rosa (hija)', blocks: [callButtons, chatButtons('Muy bien, mija. ¿Y usted?')] },
    },
    {
      id: 'send-audio',
      coach: tv('Ahora manda un audio. Toca el micrófono.', 'Ahora mande un audio. Toque el micrófono.'),
      hint: tv(
        'Toca "Audio". En el celular de verdad, mantén el dedo mientras hablas.',
        'Toque "Audio". En el celular de verdad, mantenga el dedo mientras habla.',
      ),
      wrong: tv('Busca el botón Audio, el del micrófono.', 'Busque el botón Audio, el del micrófono.'),
      target: { kind: 'tap', id: 'audio' },
      screen: {
        chrome: 'platform',
        title: 'Rosa (hija)',
        blocks: [
          callButtons,
          {
            type: 'chat',
            contact: 'Rosa (hija)',
            messages: [
              { from: 'them', text: 'Hola, ¿cómo amaneció?' },
              { from: 'me', text: 'Muy bien, mija. ¿Y usted?' },
            ],
            composer: {
              placeholder: 'Mensaje',
              buttons: [
                { id: 'send', label: 'Enviar', icon: 'send' },
                { id: 'audio', label: 'Audio', icon: 'mic' },
                { id: 'photo', label: 'Foto', icon: 'camera' },
              ],
            },
          },
        ],
      },
    },
    {
      id: 'send-photo',
      coach: tv('Envíale una foto. Toca el botón Foto.', 'Envíele una foto. Toque el botón Foto.'),
      hint: tv('Toca "Foto", el de la cámara.', 'Toque "Foto", el de la cámara.'),
      wrong: tv('Busca el botón Foto, el de la cámara.', 'Busque el botón Foto, el de la cámara.'),
      target: { kind: 'tap', id: 'photo' },
      screen: {
        chrome: 'platform',
        title: 'Rosa (hija)',
        blocks: [
          callButtons,
          {
            type: 'chat',
            contact: 'Rosa (hija)',
            messages: [
              { from: 'them', text: 'Hola, ¿cómo amaneció?' },
              { from: 'me', text: 'Muy bien, mija. ¿Y usted?' },
              { from: 'me', text: 'Audio de 0:05', kind: 'audio' },
            ],
            composer: {
              placeholder: 'Mensaje',
              buttons: [
                { id: 'send', label: 'Enviar', icon: 'send' },
                { id: 'audio', label: 'Audio', icon: 'mic' },
                { id: 'photo', label: 'Foto', icon: 'camera' },
              ],
            },
          },
        ],
      },
    },
    {
      id: 'video-call',
      coach: tv('Ahora haz una videollamada a Rosa.', 'Ahora haga una videollamada a Rosa.'),
      hint: tv('Toca "Videollamada", arriba de la conversación.', 'Toque "Videollamada", arriba de la conversación.'),
      wrong: tv('Ese es otro botón. Busca Videollamada, arriba.', 'Ese es otro botón. Busque Videollamada, arriba.'),
      explain: tv(
        'Para colgar una videollamada, toca el botón rojo. Si no se ve, toca la pantalla una vez.',
        'Para colgar una videollamada, toque el botón rojo. Si no se ve, toque la pantalla una vez.',
      ),
      target: { kind: 'tap', id: 'video' },
      screen: {
        chrome: 'platform',
        title: 'Rosa (hija)',
        blocks: [
          callButtons,
          {
            type: 'chat',
            contact: 'Rosa (hija)',
            messages: [
              { from: 'me', text: 'Muy bien, mija. ¿Y usted?' },
              { from: 'me', text: 'Audio de 0:05', kind: 'audio' },
              { from: 'me', text: 'Foto de las flores', kind: 'photo' },
              { from: 'them', text: '¡Qué lindas! ¿Hablamos por video?' },
            ],
          },
        ],
      },
    },
    {
      id: 'open-group',
      coach: tv('El grupo de la familia suena mucho. Ábrelo.', 'El grupo de la familia suena mucho. Ábralo.'),
      hint: tv('Toca "Familia (grupo)".', 'Toque "Familia (grupo)".'),
      wrong: tv('Busca el grupo que dice Familia.', 'Busque el grupo que dice Familia.'),
      target: { kind: 'tap', id: 'chat-family' },
      screen: {
        chrome: 'platform',
        title: 'Chats',
        blocks: [
          {
            type: 'list',
            items: [
              { id: 'chat-rosa', label: 'Rosa (hija)', detail: '¡Qué lindas! ¿Hablamos por video?', icon: 'user' },
              { id: 'chat-family', label: 'Familia (grupo)', detail: '25 mensajes nuevos', icon: 'user' },
              { id: 'chat-carlos', label: 'Carlos Ejemplo', detail: 'Gracias, vecina.', icon: 'user' },
            ],
          },
        ],
      },
    },
    {
      id: 'mute-group',
      coach: tv('Silencia el grupo para que no suene tanto.', 'Silencie el grupo para que no suene tanto.'),
      hint: tv('Toca "Silenciar notificaciones".', 'Toque "Silenciar notificaciones".'),
      wrong: tv(
        'Para que no suene, toca Silenciar notificaciones.',
        'Para que no suene, toque Silenciar notificaciones.',
      ),
      explain: tv(
        'Silenciar no te saca del grupo: solo deja de sonar. Si quieres salir, usa "Salir del grupo".',
        'Silenciar no lo saca del grupo: solo deja de sonar. Si quiere salir, use "Salir del grupo".',
      ),
      target: { kind: 'tap', id: 'mute' },
      screen: {
        chrome: 'platform',
        title: 'Familia (grupo)',
        blocks: [
          { type: 'text', tone: 'muted', text: '12 participantes' },
          {
            type: 'settings',
            rows: [
              { id: 'mute', label: 'Silenciar notificaciones', icon: 'bell', control: 'toggle', on: false },
              { id: 'media', label: 'Fotos y videos', icon: 'image', control: 'chevron' },
              { id: 'leave', label: 'Salir del grupo', icon: 'home', control: 'chevron' },
            ],
          },
        ],
      },
    },
  ],
  finish: {
    learned: [
      'Abrir una conversación y enviar un mensaje.',
      'Enviar un audio y una foto.',
      'Hacer una videollamada.',
      'Silenciar un grupo o salir de él.',
    ],
    tip: tv(
      'Si un contacto nuevo te pide dinero o códigos por chat, no respondas. Llama a esa persona a su número de siempre.',
      'Si un contacto nuevo le pide dinero o códigos por chat, no responda. Llame a esa persona a su número de siempre.',
    ),
  },
}
