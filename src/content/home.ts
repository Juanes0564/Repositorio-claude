import { sv } from './types'
import { tv } from './treatment'

export const home = {
  greeting: (name: string) => (name ? `¡Hola, ${name}!` : '¡Hola!'),
  question: sv(tv('¿Qué te gustaría hacer hoy?', '¿Qué le gustaría hacer hoy?'), tv('¿Qué quieres hacer?', '¿Qué quiere hacer?')),
  search: {
    label: tv('Pregúntame lo que necesites…', 'Pregúnteme lo que necesite…'),
    placeholder: tv('Escribe aquí…', 'Escriba aquí…'),
    submit: 'Buscar',
    mic: 'Hablar',
  },
  cardsLabel: 'Opciones principales',
  cards: {
    simulate: {
      title: 'Simular y practicar',
      body: sv(tv('Practica sin riesgo, paso a paso.', 'Practique sin riesgo, paso a paso.'), 'Practicar sin miedo.'),
    },
    copilot: {
      title: 'Hacerlo con ayuda',
      badge: 'Copiloto',
      body: sv(tv('Te guío con voz mientras lo haces.', 'Le guío con voz mientras lo hace.'), 'Ayuda paso a paso.'),
    },
    workshops: {
      title: 'Tutoriales y talleres',
      body: sv(tv('Aprende con explicaciones cortas.', 'Aprenda con explicaciones cortas.'), 'Aprender con tarjetas.'),
    },
    simpleMode: {
      title: 'Ajustar mi modo sencillo',
      body: sv('Letra grande y menos opciones.', 'Letra grande.'),
    },
  },
  quickTitle: 'Accesos rápidos',
  quick: {
    banks: 'Bancos',
    health: 'EPS / Salud',
    transport: 'Transporte',
    shopping: 'Compras',
  },
}
