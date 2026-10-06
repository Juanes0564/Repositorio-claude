import { tv } from './treatment'

/** Pantalla 7 (configurar modo sencillo) y pantalla 8 (inicio simplificado). */
export const simpleModeUi = {
  title: 'Modo sencillo',
  intro: tv(
    'Ajusta Vínculo para verlo y usarlo más fácil. Los cambios se ven al instante.',
    'Ajuste Vínculo para verlo y usarlo más fácil. Los cambios se ven al instante.',
  ),
  master: 'Usar modo sencillo',
  masterHelp: 'Enciende todo lo de abajo de una vez.',
  fontSize: 'Tamaño de letra',
  fontSizes: { normal: 'Normal', large: 'Grande', xlarge: 'Muy grande' },
  icons: 'Tamaño de íconos',
  iconSizes: { normal: 'Normal', large: 'Grandes' },
  fewerOptions: 'Menos opciones',
  fewerOptionsHelp: 'El inicio muestra solo 4 botones grandes.',
  simpleLanguage: 'Lenguaje sencillo',
  simpleLanguageHelp: 'Textos más cortos.',
  highContrast: 'Alto contraste',
  highContrastHelp: 'Negro sobre blanco, más fácil de leer.',
  voiceRate: 'Velocidad de la voz',
  voiceRates: { slow: 'Lenta', normal: 'Normal' },
  previewTitle: 'Vista previa',
  previewText: tv('Así se verá Vínculo.', 'Así se verá Vínculo.'),
  previewButton: 'Botón de ejemplo',
  phoneTitle: tv('¿Y la letra de todo el celular?', '¿Y la letra de todo el celular?'),
  phoneBody: tv(
    'Estos ajustes solo cambian Vínculo. Para cambiar la letra, el brillo y el volumen de todo tu celular, mira el taller.',
    'Estos ajustes solo cambian Vínculo. Para cambiar la letra, el brillo y el volumen de todo su celular, mire el taller.',
  ),
  phoneLink: tv('Ver el taller "Tu celular más cómodo"', 'Ver el taller "Su celular más cómodo"'),
  /** Pantalla 8: los 4 botones enormes del inicio simplificado. */
  home: {
    label: 'Opciones principales',
    buttons: {
      transfers: 'Enviar dinero',
      medical: 'Sacar cita médica',
      transport: 'Pedir un transporte',
      shopping: 'Comprar por internet',
    },
    more: 'Ver todas las opciones',
    less: 'Volver al inicio sencillo',
  },
}
