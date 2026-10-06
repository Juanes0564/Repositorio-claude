import { tv } from './treatment'

/** Textos del micrófono, comunes a toda la app. */
export const voice = {
  consent: {
    title: 'Antes de usar la voz',
    body: tv(
      'Tu navegador puede enviar tu voz a su proveedor para entenderla. Si prefieres no usar la voz, puedes tocar los botones.',
      'Su navegador puede enviar su voz a su proveedor para entenderla. Si prefiere no usar la voz, puede tocar los botones.',
    ),
    yes: 'Usar voz',
    no: 'Prefiero botones',
  },
  talk: tv('Toca para hablar', 'Toque para hablar'),
  listening: tv('Te escucho…', 'Le escucho…'),
  stopListening: 'Dejar de escuchar',
  heard: 'Entendí:',
  stopVoice: 'Detener voz',
  errors: {
    blocked: tv(
      'El micrófono está bloqueado. Para activarlo, toca el candado junto a la dirección y permite el micrófono. Mientras tanto, usa los botones.',
      'El micrófono está bloqueado. Para activarlo, toque el candado junto a la dirección y permita el micrófono. Mientras tanto, use los botones.',
    ),
    noSpeech: tv(
      'No te escuché. Intenta de nuevo, un poco más cerca del celular. O toca un botón.',
      'No le escuché. Intente de nuevo, un poco más cerca del celular. O toque un botón.',
    ),
    offline: tv(
      'Para entender tu voz se necesita internet. Puedes escribir o tocar los botones.',
      'Para entender su voz se necesita internet. Puede escribir o tocar los botones.',
    ),
    noMic: tv(
      'No encontramos un micrófono. Puedes escribir o tocar los botones.',
      'No encontramos un micrófono. Puede escribir o tocar los botones.',
    ),
    other: tv(
      'La voz no funcionó esta vez. Puedes escribir o tocar los botones.',
      'La voz no funcionó esta vez. Puede escribir o tocar los botones.',
    ),
  },
  tryAgain: 'Intentar de nuevo',
  sayName: 'Decir mi nombre',
  profile: {
    toggle: 'Hablarle a Vínculo con el micrófono',
    help: tv(
      'Si lo apagas, usas solo botones y texto.',
      'Si lo apaga, usa solo botones y texto.',
    ),
    unsupported: tv(
      'Este navegador no permite usar el micrófono. Puedes usar los botones y escribir.',
      'Este navegador no permite usar el micrófono. Puede usar los botones y escribir.',
    ),
  },
}
