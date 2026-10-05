import { tv } from './treatment'

export const welcome = {
  start: 'Comenzar',
  intro: tv(
    'Practica trámites digitales sin miedo. Aquí nada es real y nada se daña.',
    'Practique trámites digitales sin miedo. Aquí nada es real y nada se daña.',
  ),
  nameStep: {
    title: tv('¿Cómo te llamas?', '¿Cómo se llama?'),
    body: tv(
      'Escribe tu nombre para saludarte. Si prefieres, déjalo en blanco.',
      'Escriba su nombre para saludarle. Si prefiere, déjelo en blanco.',
    ),
    label: tv('Tu nombre', 'Su nombre'),
    placeholder: 'Por ejemplo: Marta',
    privacy: tv(
      'Tu nombre solo se guarda en este celular.',
      'Su nombre solo se guarda en este celular.',
    ),
  },
  simpleStep: {
    title: tv('¿Quieres usar el modo sencillo?', '¿Quiere usar el modo sencillo?'),
    body: 'Pone la letra más grande, los botones más grandes y menos opciones en pantalla.',
    note: tv(
      'Puedes cambiarlo cuando quieras en Perfil.',
      'Puede cambiarlo cuando quiera en Perfil.',
    ),
    yes: 'Sí, activarlo',
    no: 'No, por ahora',
  },
  stepOf: (n: number, total: number) => `Paso ${n} de ${total}`,
}
