import type { SkillStatus } from '../config/progress'
import { tv } from './treatment'
import { sv } from './types'

/** Pantalla 9: Pasaporte digital y certificado. */
export const passport = {
  title: 'Mis avances',
  badgeTitle: 'Mi Pasaporte Digital',
  badgeCount: (done: number, total: number) => `${done} de ${total} habilidades completadas`,
  /** Mensajes de ánimo suaves: sin rachas ni presión. */
  encourage: (done: number, total: number) =>
    done === 0
      ? sv(
          tv('Empieza cuando quieras, a tu ritmo.', 'Empiece cuando quiera, a su ritmo.'),
          tv('Empieza cuando quieras.', 'Empiece cuando quiera.'),
        )
      : done === total
        ? sv(tv('¡Completaste todas! Lo hiciste muy bien.', '¡Completó todas! Lo hizo muy bien.'), '¡Muy bien!')
        : sv(
            tv('Lo estás haciendo muy bien. Sigue a tu ritmo.', 'Lo está haciendo muy bien. Siga a su ritmo.'),
            tv('Vas muy bien.', 'Va muy bien.'),
          ),
  howTitle: tv('¿Cómo se completa una habilidad?', '¿Cómo se completa una habilidad?'),
  how: tv(
    'Cada habilidad tiene dos partes: hacer la práctica con guía y ver el taller completo.',
    'Cada habilidad tiene dos partes: hacer la práctica con guía y ver el taller completo.',
  ),
  status: {
    notStarted: 'Sin empezar',
    inProgress: 'En progreso',
    complete: 'Completa',
  } satisfies Record<SkillStatus, string>,
  stamp: 'Sello',
  percent: (n: number) => `${n} %`,
  practice: 'Práctica',
  workshop: 'Taller',
  doneMark: 'Hecho',
  pendingMark: 'Pendiente',
  doPractice: 'Hacer la práctica',
  doWorkshop: 'Ver el taller',
  nextTitle: 'Siguiente reto sugerido',
  nextPractice: (skill: string) => tv(`Practica: ${skill}`, `Practique: ${skill}`),
  nextWorkshop: (skill: string) => tv(`Mira el taller: ${skill}`, `Vea el taller: ${skill}`),
  start: 'Empezar',
  listTitle: 'Las 8 habilidades',
  certificate: {
    ready: tv('¡Ya puedes ver tu certificado!', '¡Ya puede ver su certificado!'),
    open: 'Ver mi certificado',
    title: 'Certificado',
    heading: 'Pasaporte Digital Vínculo',
    certifies: 'Vínculo reconoce que',
    noName: 'Esta persona',
    completed: 'completó las 8 habilidades digitales:',
    date: (d: string) => `Fecha: ${d}`,
    print: 'Imprimir o guardar',
    printHelp: tv(
      'Se abre la ventana de impresión del navegador. Ahí también puedes elegir "Guardar como PDF".',
      'Se abre la ventana de impresión del navegador. Ahí también puede elegir "Guardar como PDF".',
    ),
    addName: tv('Agrega tu nombre en Perfil para que aparezca aquí.', 'Agregue su nombre en Perfil para que aparezca aquí.'),
    goProfile: 'Ir a Perfil',
    note: 'Certificado de práctica. Proyecto universitario, versión de prueba.',
    notYet: tv(
      'El certificado aparece cuando completes las 8 habilidades.',
      'El certificado aparece cuando complete las 8 habilidades.',
    ),
  },
}
