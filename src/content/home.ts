import { tv } from './treatment'

export const home = {
  greeting: (name: string) => (name ? `¡Hola, ${name}!` : '¡Hola!'),
  question: tv('¿Qué te gustaría hacer hoy?', '¿Qué le gustaría hacer hoy?'),
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
      body: tv('Practica sin riesgo, paso a paso.', 'Practique sin riesgo, paso a paso.'),
    },
    copilot: {
      title: 'Hacerlo con ayuda',
      badge: 'Copiloto',
      body: tv('Te guío con voz mientras lo haces.', 'Le guío con voz mientras lo hace.'),
    },
    workshops: {
      title: 'Tutoriales y talleres',
      body: tv('Aprende con explicaciones cortas.', 'Aprenda con explicaciones cortas.'),
    },
    simpleMode: {
      title: 'Ajustar mi modo sencillo',
      body: 'Letra grande y menos opciones.',
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
