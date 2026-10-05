import { tv } from './treatment'
import type { PlatformCategory } from './platforms'

export const picker = {
  title: 'Simular y practicar',
  intro: tv(
    'Elige dónde quieres practicar. Nada de esto es real.',
    'Elija dónde quiere practicar. Nada de esto es real.',
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
  done: 'Ya la hiciste',
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
  wrong: 'No pasa nada. Intentemos de nuevo.',
  highlighted: tv('Mira el recuadro con la flecha.', 'Mire el recuadro con la flecha.'),
  hintLabel: 'Pista',
  nextLocked: tv('Primero haz lo que dice el paso.', 'Primero haga lo que dice el paso.'),
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
    body: tv('Terminaste la práctica. Lo hiciste muy bien.', 'Terminó la práctica. Lo hizo muy bien.'),
    learnedTitle: tv('Lo que aprendiste', 'Lo que aprendió'),
    tipTitle: 'Consejo de seguridad',
    freeUnlocked: tv(
      'Ahora también puedes practicar solo, sin guía.',
      'Ahora también puede practicar solo, sin guía.',
    ),
    passport: 'Tu avance quedó guardado en Mis avances.',
    again: 'Practicar otra vez',
    workshop: 'Ver taller',
    home: 'Volver al inicio',
  },
  notFound: 'No encontramos esta práctica.',
  phoneHome: 'Pantalla de inicio del celular',
  practiceScreen: 'Pantalla de práctica',
}
