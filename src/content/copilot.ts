import { sv } from './types'
import type { IntentId } from './intents'
import { tv } from './treatment'

export const copilot = {
  title: 'Copiloto',
  greeting: sv(tv('Estoy aquí para ayudarte. ¿Qué quieres hacer?', 'Estoy aquí para ayudarle. ¿Qué quiere hacer?'), tv('¿Qué quieres hacer?', '¿Qué quiere hacer?')),
  greetingAgain: tv('Está bien. ¿Qué quieres hacer?', 'Está bien. ¿Qué quiere hacer?'),
  suggestionsLabel: 'Sugerencias',
  /** Botones de sugerencia de la pantalla 5. */
  suggestions: [
    { label: 'Quiero hacer una transferencia', intent: 'transfer' },
    { label: 'Necesito sacar una cita médica', intent: 'medical' },
    { label: 'Quiero pedir un transporte', intent: 'transport' },
    { label: 'No entiendo un mensaje', intent: 'message' },
    { label: tv('Háblame más despacio', 'Hábleme más despacio'), intent: 'slower' },
  ] satisfies { label: string; intent: IntentId }[],
  /** Opciones que se ofrecen cuando no se entendió. */
  fallbackIntents: ['transfer', 'medical', 'transport', 'shopping', 'whatsapp', 'message', 'humanHelp'] satisfies IntentId[],
  notUnderstood: sv(
    tv('No te entendí bien. ¿Quieres hacer alguna de estas cosas?', 'No le entendí bien. ¿Quiere hacer alguna de estas cosas?'),
    tv('No entendí. Elige una opción.', 'No entendí. Elija una opción.'),
  ),
  choose: tv('Creo que quieres una de estas cosas. ¿Cuál?', 'Creo que quiere una de estas cosas. ¿Cuál?'),
  noneOfThese: 'Ninguna de estas',
  yes: 'Sí',
  noOther: 'No, otra cosa',
  you: tv('Tú dijiste:', 'Usted dijo:'),
  typeLabel: tv('O escríbelo aquí', 'O escríbalo aquí'),
  typePlaceholder: 'Por ejemplo: quiero pedir un taxi',
  send: 'Enviar',
  slowerDone: tv('Listo. Ahora te hablo más despacio.', 'Listo. Ahora le hablo más despacio.'),
  nothingToRepeat: tv('Todavía no he dicho nada. ¿Qué quieres hacer?', 'Todavía no he dicho nada. ¿Qué quiere hacer?'),
  voiceOff: tv(
    'La voz está apagada. Puedes activarla en Perfil.',
    'La voz está apagada. Puede activarla en Perfil.',
  ),
  noMicNote: tv(
    'Puedes tocar un botón o escribir lo que necesitas.',
    'Puede tocar un botón o escribir lo que necesita.',
  ),
  guide: {
    stepOf: (n: number, total: number) => `Paso ${n} de ${total}`,
    done: 'Ya lo hice',
    repeat: 'Repetir',
    slower: 'Más despacio',
    notUnderstand: 'No entiendo',
    practice: 'Practicar esto en el simulador',
    previous: 'Paso anterior',
    exit: 'Salir de la guía',
    explainTitle: tv('Te lo explico de otra forma', 'Se lo explico de otra forma'),
    explainExtra: tv(
      'Si sigues con dudas, pide ayuda a un familiar o practica primero aquí.',
      'Si sigue con dudas, pida ayuda a un familiar o practique primero aquí.',
    ),
    finished: tv('¡Muy bien! Terminaste todos los pasos.', '¡Muy bien! Terminó todos los pasos.'),
    finishedMore: tv('Lo estás haciendo muy bien.', 'Lo está haciendo muy bien.'),
    backToCopilot: 'Volver al copiloto',
    reminder: tv(
      'Recuerda: no puedo ver otras aplicaciones. Te digo qué hacer y tú me confirmas.',
      'Recuerde: no puedo ver otras aplicaciones. Le digo qué hacer y usted me confirma.',
    ),
  },
  message: {
    practice: 'Practicar cómo identificar estafas',
  },
  avatarLabel: 'Copiloto de Vínculo',
}
