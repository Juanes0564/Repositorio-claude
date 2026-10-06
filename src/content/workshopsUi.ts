import { sv } from './types'
import { tv } from './treatment'
import type { WorkshopCategory } from './workshops'

export const workshopsUi = {
  title: 'Tutoriales y talleres',
  intro: sv(
    tv(
      'Explicaciones cortas, una tarjeta a la vez. Puedes escucharlas en voz alta.',
      'Explicaciones cortas, una tarjeta a la vez. Puede escucharlas en voz alta.',
    ),
    'Una tarjeta a la vez.',
  ),
  filtersLabel: 'Mostrar',
  filters: { all: 'Todos', banks: 'Bancos', health: 'Salud', security: 'Seguridad', more: 'Más temas' } satisfies Record<
    WorkshopCategory | 'all',
    string
  >,
  minutes: (n: number) => `${n} min`,
  levels: { basic: 'Básico', intermediate: 'Intermedio' },
  cardsCount: (n: number) => `${n} tarjetas`,
  seen: 'Visto',
  empty: 'No hay talleres en este grupo.',
  cardOf: (n: number, total: number) => `Tarjeta ${n} de ${total}`,
  readAloud: 'Leer en voz alta',
  stopVoice: 'Detener voz',
  tipLabel: 'Ojo:',
  previous: 'Anterior',
  next: 'Siguiente',
  finish: 'Terminar',
  video: {
    title: 'Video del taller',
    show: 'Ver el video aquí',
    note: tv(
      'El video viene de YouTube. Se carga solo si tocas el botón.',
      'El video viene de YouTube. Se carga solo si toca el botón.',
    ),
    open: 'Abrir el video en YouTube',
    frameTitle: (title: string) => `Video: ${title}`,
  },
  done: {
    title: tv('¡Terminaste el taller!', '¡Terminó el taller!'),
    body: tv('Lo estás haciendo muy bien.', 'Lo está haciendo muy bien.'),
    passport: tv('Tu avance quedó guardado en Mis avances.', 'Su avance quedó guardado en Mis avances.'),
    quiz: 'Hacer el mini repaso (3 preguntas)',
    practice: 'Practicar en el simulador',
    again: 'Ver el taller otra vez',
    back: 'Volver a los talleres',
  },
  quiz: {
    title: 'Mini repaso',
    questionOf: (n: number, total: number) => `Pregunta ${n} de ${total}`,
    correct: '¡Muy bien!',
    incorrect: 'Casi. La respuesta es otra.',
    yourAnswer: tv('Tu respuesta', 'Su respuesta'),
    rightAnswer: 'Respuesta correcta',
    next: 'Siguiente pregunta',
    finish: 'Ver resultado',
    result: (right: number, total: number) => tv(`Acertaste ${right} de ${total}.`, `Acertó ${right} de ${total}.`),
    encourage: tv(
      'Repasar ayuda a recordar. Puedes volver cuando quieras.',
      'Repasar ayuda a recordar. Puede volver cuando quiera.',
    ),
  },
  notFound: 'No encontramos este taller.',
}
