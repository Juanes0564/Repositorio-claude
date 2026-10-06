import { tv } from './treatment'

export const profile = {
  title: 'Mi perfil',
  name: {
    heading: 'Nombre',
    label: tv('Tu nombre', 'Su nombre'),
    help: tv('Lo usamos solo para saludarte.', 'Lo usamos solo para saludarle.'),
    empty: 'Sin nombre',
  },
  voice: {
    heading: 'Voz',
    toggle: 'Leer en voz alta',
    toggleHelp: tv(
      'Vínculo puede leerte las instrucciones.',
      'Vínculo puede leerle las instrucciones.',
    ),
    rate: 'Velocidad de la voz',
    slow: 'Lenta',
    normal: 'Normal',
  },
  passport: {
    heading: 'Mis avances',
    link: 'Ver mi Pasaporte Digital',
  },
  simple: {
    heading: 'Modo sencillo',
    toggle: 'Usar modo sencillo',
    toggleHelp: 'Letra y botones más grandes, más contraste y menos opciones.',
    more: 'Más ajustes del modo sencillo',
  },
  privacy: {
    heading: 'Privacidad',
    items: [
      tv(
        'Vínculo guarda solo tu nombre, tus ajustes y tus avances.',
        'Vínculo guarda solo su nombre, sus ajustes y sus avances.',
      ),
      'Todo queda guardado en este celular. No se envía a ninguna parte.',
      tv('No tienes que crear una cuenta ni dar tu correo.', 'No tiene que crear una cuenta ni dar su correo.'),
      tv(
        'Si usas la voz para hablarle a Vínculo, tu navegador puede enviar tu voz a su proveedor para entenderla. Siempre puedes usar los botones.',
        'Si usa la voz para hablarle a Vínculo, su navegador puede enviar su voz a su proveedor para entenderla. Siempre puede usar los botones.',
      ),
      'Las prácticas nunca piden datos reales.',
    ],
  },
  about: {
    heading: 'Acerca de',
    version: (v: string) => `Versión ${v}`,
    beta: 'Esta es una versión de prueba.',
    origin: 'Proyecto universitario de estudiantes de comunicación.',
  },
  erase: {
    heading: 'Borrar mis datos',
    button: 'Borrar mis datos',
    help: tv(
      'Borra tu nombre, tus ajustes y tus avances de este celular.',
      'Borra su nombre, sus ajustes y sus avances de este celular.',
    ),
    confirmTitle: tv('¿Seguro que quieres borrar tus datos?', '¿Seguro que quiere borrar sus datos?'),
    confirmBody: tv(
      'Se borrarán tu nombre, tus ajustes y tus avances. No se puede deshacer.',
      'Se borrarán su nombre, sus ajustes y sus avances. No se puede deshacer.',
    ),
    confirmYes: 'Sí, borrar todo',
    confirmNo: 'No, conservarlos',
  },
}
