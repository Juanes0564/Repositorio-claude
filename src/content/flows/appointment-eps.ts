import type { Flow } from '../../sim/types'
import { tv } from '../treatment'

/**
 * Cita médica en EPS Salud Ejemplo (sección 13.2 del brief).
 * Documento, clave, sedes y horarios son de práctica.
 */
export const appointmentEps: Flow = {
  id: 'appointment-eps',
  skill: 'medical',
  platform: 'eps',
  title: 'Sacar una cita médica',
  summary: tv(
    'Practica cómo pedir una cita de medicina general.',
    'Practique cómo pedir una cita de medicina general.',
  ),
  minutes: 5,
  reviewed: false,
  steps: [
    {
      id: 'open-app',
      coach: tv('Abre la aplicación de tu EPS.', 'Abra la aplicación de su EPS.'),
      hint: tv('Toca el cuadro que dice "EPS Salud Ejemplo".', 'Toque el cuadro que dice "EPS Salud Ejemplo".'),
      wrong: tv(
        'Esa es otra aplicación. Busca la que dice EPS Salud Ejemplo.',
        'Esa es otra aplicación. Busque la que dice EPS Salud Ejemplo.',
      ),
      target: { kind: 'tap', id: 'app-eps' },
      screen: {
        chrome: 'phone',
        blocks: [
          {
            type: 'tiles',
            columns: 3,
            items: [
              { id: 'app-bank', label: 'Banco Ejemplo', platform: 'bank' },
              { id: 'app-chat', label: 'Chat Ejemplo', platform: 'chat' },
              { id: 'app-transport', label: 'Transporte Ejemplo', platform: 'transport' },
              { id: 'app-eps', label: 'EPS Salud Ejemplo', platform: 'eps' },
              { id: 'app-store', label: 'Tienda Ejemplo', platform: 'store' },
              { id: 'app-settings', label: 'Ajustes', platform: 'settings' },
            ],
          },
        ],
      },
    },
    {
      id: 'login',
      coach: tv('Entra con tu clave. Para practicar, escribe 2468.', 'Entre con su clave. Para practicar, escriba 2468.'),
      hint: tv('Toca 2, 4, 6 y 8. Luego toca "Entrar".', 'Toque 2, 4, 6 y 8. Luego toque "Entrar".'),
      wrong: tv(
        'La clave de práctica es 2468. Si te equivocas, toca Borrar.',
        'La clave de práctica es 2468. Si se equivoca, toque Borrar.',
      ),
      target: { kind: 'input', keypadId: 'pin', expected: '2468' },
      screen: {
        chrome: 'platform',
        title: 'Ingresar',
        blocks: [
          {
            type: 'summary',
            rows: [{ label: 'Documento de práctica', value: '10 20 30 40' }],
          },
          {
            type: 'keypad',
            id: 'pin',
            label: 'Clave de 4 números',
            display: 'masked',
            maxLength: 4,
            submit: { id: 'login-submit', label: 'Entrar' },
          },
          { type: 'actions', items: [{ id: 'forgot', label: tv('¿Olvidaste tu clave?', '¿Olvidó su clave?'), variant: 'link' }] },
        ],
      },
    },
    {
      id: 'appointments',
      coach: tv('Busca la opción Citas y tócala.', 'Busque la opción Citas y tóquela.'),
      hint: tv('Tiene el dibujo de un calendario.', 'Tiene el dibujo de un calendario.'),
      target: { kind: 'tap', id: 'citas' },
      screen: {
        chrome: 'platform',
        title: tv('Hola, afiliado de práctica', 'Hola, afiliado de práctica'),
        blocks: [
          {
            type: 'tiles',
            columns: 2,
            items: [
              { id: 'results', label: 'Resultados', icon: 'download' },
              { id: 'citas', label: 'Citas', icon: 'calendar' },
              { id: 'orders', label: 'Autorizaciones', icon: 'check' },
              { id: 'my-info', label: 'Mis datos', icon: 'user' },
            ],
          },
        ],
      },
    },
    {
      id: 'type',
      coach: tv('Elige el tipo de cita: medicina general.', 'Elija el tipo de cita: medicina general.'),
      hint: tv('Toca "Medicina general".', 'Toque "Medicina general".'),
      wrong: tv(
        'Para esta práctica, elige medicina general.',
        'Para esta práctica, elija medicina general.',
      ),
      target: { kind: 'tap', id: 'general' },
      screen: {
        chrome: 'platform',
        title: '¿Qué cita necesita?',
        blocks: [
          {
            type: 'list',
            items: [
              { id: 'general', label: 'Medicina general', icon: 'user' },
              { id: 'dentist', label: 'Odontología', icon: 'user' },
              { id: 'specialist', label: 'Especialista', detail: 'Necesita orden médica', icon: 'user' },
            ],
          },
        ],
      },
    },
    {
      id: 'place',
      coach: tv('Elige la sede Centro, la que te queda cerca.', 'Elija la sede Centro, la que le queda cerca.'),
      hint: tv('Toca "Sede Centro Ejemplo".', 'Toque "Sede Centro Ejemplo".'),
      wrong: tv(
        'Esa sede queda lejos. Busca la Sede Centro Ejemplo.',
        'Esa sede queda lejos. Busque la Sede Centro Ejemplo.',
      ),
      target: { kind: 'tap', id: 'center' },
      screen: {
        chrome: 'platform',
        title: 'Elija la sede',
        blocks: [
          {
            type: 'list',
            items: [
              { id: 'north', label: 'Sede Norte Ejemplo', detail: 'Calle de práctica 100', icon: 'pin' },
              { id: 'center', label: 'Sede Centro Ejemplo', detail: 'Carrera de práctica 10', icon: 'pin' },
              { id: 'south', label: 'Sede Sur Ejemplo', detail: 'Avenida de práctica 5', icon: 'pin' },
            ],
          },
        ],
      },
    },
    {
      id: 'slot',
      coach: tv('Elige el jueves a las 9:30 de la mañana.', 'Elija el jueves a las 9:30 de la mañana.'),
      hint: tv('Toca "Jueves, 9:30 a. m.".', 'Toque "Jueves, 9:30 a. m.".'),
      wrong: tv(
        'Lee con calma el día y la hora. Busca jueves, 9:30.',
        'Lea con calma el día y la hora. Busque jueves, 9:30.',
      ),
      target: { kind: 'tap', id: 'thu-930' },
      screen: {
        chrome: 'platform',
        title: 'Elija día y hora',
        blocks: [
          { type: 'text', tone: 'muted', text: 'Medicina general · Sede Centro Ejemplo' },
          {
            type: 'list',
            items: [
              { id: 'tue-800', label: 'Martes, 8:00 a. m.', icon: 'calendar' },
              { id: 'wed-300', label: 'Miércoles, 3:00 p. m.', icon: 'calendar' },
              { id: 'thu-930', label: 'Jueves, 9:30 a. m.', icon: 'calendar' },
              { id: 'fri-1100', label: 'Viernes, 11:00 a. m.', icon: 'calendar' },
            ],
          },
        ],
      },
    },
    {
      id: 'confirm',
      coach: tv('Revisa los datos de la cita y confírmala.', 'Revise los datos de la cita y confírmela.'),
      hint: tv(
        'Debe decir medicina general, Sede Centro y jueves 9:30. Toca "Confirmar cita".',
        'Debe decir medicina general, Sede Centro y jueves 9:30. Toque "Confirmar cita".',
      ),
      wrong: tv(
        'En esta práctica los datos están bien. Toca Confirmar cita.',
        'En esta práctica los datos están bien. Toque Confirmar cita.',
      ),
      target: { kind: 'tap', id: 'confirm' },
      screen: {
        chrome: 'platform',
        title: 'Revise su cita',
        blocks: [
          {
            type: 'summary',
            rows: [
              { label: 'Tipo', value: 'Medicina general' },
              { label: 'Sede', value: 'Sede Centro Ejemplo' },
              { label: 'Día y hora', value: 'Jueves, 9:30 a. m.' },
              { label: 'Médico', value: 'Doctora Ejemplo' },
            ],
          },
          {
            type: 'actions',
            items: [
              { id: 'confirm', label: 'Confirmar cita', variant: 'primary' },
              { id: 'change', label: 'Cambiar', variant: 'secondary' },
            ],
          },
        ],
      },
    },
    {
      id: 'receipt',
      coach: tv('¡Listo! Mira dónde se cambia o cancela la cita.', '¡Listo! Mire dónde se cambia o cancela la cita.'),
      hint: tv(
        'Si un día no puedes ir, usa "Cambiar o cancelar". Tócalo.',
        'Si un día no puede ir, use "Cambiar o cancelar". Tóquelo.',
      ),
      wrong: tv(
        'Busca el botón "Cambiar o cancelar la cita".',
        'Busque el botón "Cambiar o cancelar la cita".',
      ),
      target: { kind: 'tap', id: 'cancel' },
      screen: {
        chrome: 'platform',
        title: 'Cita confirmada',
        blocks: [
          {
            type: 'receipt',
            title: 'Su cita quedó lista',
            status: 'Confirmada',
            rows: [
              { label: 'Día y hora', value: 'Jueves, 9:30 a. m.' },
              { label: 'Sede', value: 'Sede Centro Ejemplo' },
              { label: 'Lleve', value: 'Su documento' },
              { label: 'Número de cita', value: 'PRUEBA-0002' },
            ],
          },
          {
            type: 'actions',
            items: [
              { id: 'cancel', label: 'Cambiar o cancelar la cita', variant: 'secondary' },
              { id: 'go-home', label: 'Ir al inicio', variant: 'link' },
            ],
          },
        ],
      },
    },
  ],
  finish: {
    learned: [
      tv('Entrar a la aplicación de tu EPS.', 'Entrar a la aplicación de su EPS.'),
      'Elegir el tipo de cita, la sede, el día y la hora.',
      'Revisar los datos y confirmar.',
      'Dónde cambiar o cancelar la cita.',
    ],
    tip: tv(
      'Anota la fecha y la hora en un papel. Ese día, lleva tu documento y llega unos minutos antes.',
      'Anote la fecha y la hora en un papel. Ese día, lleve su documento y llegue unos minutos antes.',
    ),
  },
}
