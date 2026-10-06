import { sv } from './types'
import { tv } from './treatment'
import type { PlatformCategory } from './platforms'

export const picker = {
  title: 'Simular y practicar',
  intro: sv(
    tv('Elige dónde quieres practicar. Nada de esto es real.', 'Elija dónde quiere practicar. Nada de esto es real.'),
    tv('Elige dónde practicar.', 'Elija dónde practicar.'),
  ),
  filtersLabel: 'Mostrar',
  filters: {
    popular: 'Más usadas',
    banks: 'Bancos',
    health: 'Salud',
    transport: 'Transporte',
    shopping: 'Compras',
  },
  practicesCount: (n: number) => (n === 0 ? 'Muy pronto' : n === 1 ? '1 práctica' : `${n} prácticas`),
  empty: 'No hay plataformas en este grupo.',
  categoryNames: {
    banks: 'Bancos',
    health: 'Salud',
    transport: 'Transporte',
    shopping: 'Compras',
    messaging: 'Mensajes',
    phone: 'Celular',
  } satisfies Record<PlatformCategory, string>,
}

export const platformDetail = {
  practicesTitle: 'Prácticas',
  comingSoon: tv(
    'Estamos preparando las prácticas de esta plataforma. Muy pronto podrás usarlas.',
    'Estamos preparando las prácticas de esta plataforma. Muy pronto podrá usarlas.',
  ),
  minutes: (n: number) => `${n} min`,
  steps: (n: number) => `${n} pasos`,
  guided: 'Practicar con guía',
  guidedHelp: tv('Te muestro cada paso.', 'Le muestro cada paso.'),
  free: 'Practicar solo',
  freeHelp: tv('Lo haces tú. Pide ayuda si la necesitas.', 'Lo hace usted. Pida ayuda si la necesita.'),
  freeLocked: tv(
    'Se activa cuando termines la práctica con guía.',
    'Se activa cuando termine la práctica con guía.',
  ),
  done: tv('Ya la hiciste', 'Ya la hizo'),
  notFound: 'No encontramos esta plataforma.',
}

export const simulator = {
  ribbon: 'PRÁCTICA – no es real',
  stepOf: (n: number, total: number) => `Paso ${n} de ${total}`,
  coachStep: (n: number) => `Paso ${n}`,
  modeGuided: 'Con guía',
  modeFree: 'Solo',
  next: 'Siguiente',
  finish: 'Terminar',
  back: 'Volver',
  help: 'Ayuda',
  stopVoice: 'Detener voz',
  exit: 'Salir',
  restart: 'Reiniciar',
  success: '¡Bien!',
  wrong: sv('No pasa nada. Intentemos de nuevo.', 'No pasa nada. Otra vez.'),
  highlighted: sv(tv('Mira el recuadro con la flecha.', 'Mire el recuadro con la flecha.'), tv('Toca donde dice Aquí.', 'Toque donde dice Aquí.')),
  hintLabel: 'Pista',
  nextLocked: sv(tv('Primero haz lo que dice el paso.', 'Primero haga lo que dice el paso.'), tv('Primero haz el paso.', 'Primero haga el paso.')),
  pointer: 'Aquí',
  keypadDelete: 'Borrar',
  keypadEmpty: 'Vacío',
  exitConfirm: {
    title: tv('¿Quieres salir de la práctica?', '¿Quiere salir de la práctica?'),
    body: tv('Si sales, empezarás de nuevo la próxima vez.', 'Si sale, empezará de nuevo la próxima vez.'),
    yes: 'Sí, salir',
    no: 'No, seguir practicando',
  },
  restartConfirm: {
    title: tv('¿Quieres empezar de nuevo?', '¿Quiere empezar de nuevo?'),
    body: 'La práctica vuelve al paso 1.',
    yes: 'Sí, empezar de nuevo',
    no: 'No, seguir aquí',
  },
  done: {
    title: tv('¡Lo lograste!', '¡Lo logró!'),
    body: sv(tv('Terminaste la práctica. Lo hiciste muy bien.', 'Terminó la práctica. Lo hizo muy bien.'), '¡Muy bien!'),
    learnedTitle: tv('Lo que aprendiste', 'Lo que aprendió'),
    tipTitle: 'Consejo de seguridad',
    freeUnlocked: tv(
      'Ahora también puedes practicar solo, sin guía.',
      'Ahora también puede practicar solo, sin guía.',
    ),
    passport: tv('Tu avance quedó guardado en Mis avances.', 'Su avance quedó guardado en Mis avances.'),
    again: 'Practicar otra vez',
    workshop: 'Ver taller',
    home: 'Volver al inicio',
  },
  notFound: 'No encontramos esta práctica.',
  phoneHome: 'Pantalla de inicio del celular',
  stars: (n: number) => (n === 1 ? '1 estrella' : `${n} estrellas`),
  incomingCall: 'Llamada entrante',
  explainTitle: 'Las señales',
  practiceScreen: 'Pantalla de práctica',
}
