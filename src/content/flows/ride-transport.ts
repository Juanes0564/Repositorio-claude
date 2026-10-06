import type { Flow } from '../../sim/types'
import { tv } from '../treatment'

/**
 * Pedir un transporte en Transporte Ejemplo (sección 13.3 del brief).
 * Lugares, conductor, placa y precios son de práctica.
 */
export const rideTransport: Flow = {
  id: 'ride-transport',
  skill: 'transport',
  platform: 'transport',
  title: 'Pedir un carro',
  summary: tv(
    'Practica cómo pedir un viaje y revisar la placa antes de subir.',
    'Practique cómo pedir un viaje y revisar la placa antes de subir.',
  ),
  minutes: 5,
  reviewed: false,
  steps: [
    {
      id: 'open-app',
      coach: tv('Abre la aplicación de transporte.', 'Abra la aplicación de transporte.'),
      hint: tv('Toca el cuadro que dice "Transporte Ejemplo".', 'Toque el cuadro que dice "Transporte Ejemplo".'),
      wrong: tv(
        'Esa es otra aplicación. Busca la que dice Transporte Ejemplo.',
        'Esa es otra aplicación. Busque la que dice Transporte Ejemplo.',
      ),
      target: { kind: 'tap', id: 'app-transport' },
      screen: {
        chrome: 'phone',
        blocks: [
          {
            type: 'tiles',
            columns: 3,
            items: [
              { id: 'app-chat', label: 'Chat Ejemplo', platform: 'chat' },
              { id: 'app-bank', label: 'Banco Ejemplo', platform: 'bank' },
              { id: 'app-eps', label: 'EPS Salud Ejemplo', platform: 'eps' },
              { id: 'app-store', label: 'Tienda Ejemplo', platform: 'store' },
              { id: 'app-transport', label: 'Transporte Ejemplo', platform: 'transport' },
              { id: 'app-settings', label: 'Ajustes', platform: 'settings' },
            ],
          },
        ],
      },
    },
    {
      id: 'destination',
      coach: tv('Vas al centro de salud. Elígelo como destino.', 'Va al centro de salud. Elíjalo como destino.'),
      hint: tv(
        'Toca "Centro de salud Ejemplo" en la lista de lugares.',
        'Toque "Centro de salud Ejemplo" en la lista de lugares.',
      ),
      wrong: tv(
        'Ese no es el destino. Busca Centro de salud Ejemplo.',
        'Ese no es el destino. Busque Centro de salud Ejemplo.',
      ),
      target: { kind: 'tap', id: 'place-health' },
      screen: {
        chrome: 'platform',
        title: tv('¿A dónde vas?', '¿A dónde va?'),
        blocks: [
          { type: 'form', fields: [{ id: 'origin', label: 'Desde', value: 'Mi ubicación (de práctica)' }] },
          {
            type: 'list',
            title: 'Lugares guardados',
            items: [
              { id: 'place-home', label: 'Casa', detail: 'Calle de práctica 1', icon: 'home' },
              { id: 'place-health', label: 'Centro de salud Ejemplo', detail: 'Carrera de práctica 10', icon: 'pin' },
              { id: 'place-family', label: 'Casa de la familia', detail: 'Avenida de práctica 20', icon: 'pin' },
            ],
          },
        ],
      },
    },
    {
      id: 'trip-type',
      coach: tv('Mira los precios. Elige el viaje Económico.', 'Mire los precios. Elija el viaje Económico.'),
      hint: tv('Toca "Económico". Cuesta $ 12.000.', 'Toque "Económico". Cuesta $ 12.000.'),
      wrong: tv(
        'Ese cuesta más. Para esta práctica, elige Económico.',
        'Ese cuesta más. Para esta práctica, elija Económico.',
      ),
      target: { kind: 'tap', id: 'economy' },
      screen: {
        chrome: 'platform',
        title: 'Elija su viaje',
        blocks: [
          { type: 'text', tone: 'muted', text: 'Hacia: Centro de salud Ejemplo' },
          {
            type: 'list',
            items: [
              { id: 'economy', label: 'Económico', detail: '$ 12.000 · llega en 5 min', icon: 'car' },
              { id: 'comfort', label: 'Cómodo', detail: '$ 15.000 · llega en 4 min', icon: 'car' },
              { id: 'big', label: 'Con más espacio', detail: '$ 18.000 · llega en 8 min', icon: 'car' },
            ],
          },
        ],
      },
    },
    {
      id: 'request',
      coach: tv('Revisa el viaje y tócalo para pedirlo.', 'Revise el viaje y tóquelo para pedirlo.'),
      hint: tv('Toca "Pedir viaje".', 'Toque "Pedir viaje".'),
      wrong: tv(
        'En esta práctica los datos están bien. Toca Pedir viaje.',
        'En esta práctica los datos están bien. Toque Pedir viaje.',
      ),
      target: { kind: 'tap', id: 'request' },
      screen: {
        chrome: 'platform',
        title: 'Confirme su viaje',
        blocks: [
          {
            type: 'summary',
            rows: [
              { label: 'Hacia', value: 'Centro de salud Ejemplo' },
              { label: 'Viaje', value: 'Económico' },
              { label: 'Precio', value: '$ 12.000' },
              { label: 'Pago', value: 'Efectivo' },
            ],
          },
          {
            type: 'actions',
            items: [
              { id: 'request', label: 'Pedir viaje', variant: 'primary' },
              { id: 'change', label: 'Cambiar', variant: 'secondary' },
            ],
          },
        ],
      },
    },
    {
      id: 'share',
      coach: tv('Ya viene un conductor. Comparte tu viaje con un familiar.', 'Ya viene un conductor. Comparta su viaje con un familiar.'),
      hint: tv('Toca "Compartir viaje".', 'Toque "Compartir viaje".'),
      wrong: tv(
        'Primero comparte tu viaje. Toca Compartir viaje.',
        'Primero comparta su viaje. Toque Compartir viaje.',
      ),
      target: { kind: 'tap', id: 'share' },
      screen: {
        chrome: 'platform',
        title: 'Su conductor viene',
        blocks: [
          {
            type: 'summary',
            rows: [
              { label: 'Conductor', value: 'Pedro Ejemplo' },
              { label: 'Carro', value: 'Gris, pequeño' },
              { label: 'Llega en', value: '3 minutos' },
            ],
          },
          { type: 'plate', label: 'Placa en la aplicación', plate: 'ABC 123' },
          {
            type: 'actions',
            items: [
              { id: 'share', label: 'Compartir viaje', variant: 'primary' },
              { id: 'call-driver', label: 'Llamar al conductor', variant: 'secondary' },
              { id: 'cancel', label: 'Cancelar viaje', variant: 'link' },
            ],
          },
        ],
      },
    },
    {
      id: 'check-plate',
      coach: tv('Llegó un carro. Compara la placa antes de subir.', 'Llegó un carro. Compare la placa antes de subir.'),
      hint: tv(
        'La aplicación dice ABC 123. El carro que llegó también. Toca "Coinciden, me subo".',
        'La aplicación dice ABC 123. El carro que llegó también. Toque "Coinciden, me subo".',
      ),
      wrong: tv(
        'Mira otra vez: las dos placas dicen ABC 123. Sí coinciden.',
        'Mire otra vez: las dos placas dicen ABC 123. Sí coinciden.',
      ),
      explain: tv(
        'Siempre compara la placa y el nombre del conductor. Si no coinciden, no subas y cancela el viaje.',
        'Siempre compare la placa y el nombre del conductor. Si no coinciden, no suba y cancele el viaje.',
      ),
      target: { kind: 'tap', id: 'match' },
      screen: {
        chrome: 'platform',
        title: 'Su carro llegó',
        blocks: [
          { type: 'plate', label: 'Placa en la aplicación', plate: 'ABC 123' },
          { type: 'plate', label: 'Placa del carro que llegó', plate: 'ABC 123', detail: 'Carro gris, pequeño' },
          {
            type: 'decision',
            prompt: '¿Las placas coinciden?',
            options: [
              { id: 'match', label: 'Coinciden, me subo', tone: 'safe' },
              { id: 'no-match', label: 'No coinciden, no me subo', tone: 'danger' },
            ],
          },
        ],
      },
    },
    {
      id: 'pay',
      coach: tv('Llegaste. Paga en efectivo y termina el viaje.', 'Llegó. Pague en efectivo y termine el viaje.'),
      hint: tv('Toca "Pagué en efectivo".', 'Toque "Pagué en efectivo".'),
      target: { kind: 'tap', id: 'paid' },
      screen: {
        chrome: 'platform',
        title: 'Llegó a su destino',
        blocks: [
          { type: 'balance', label: 'Total del viaje', amount: '$ 12.000', note: 'Pago en efectivo al conductor' },
          {
            type: 'actions',
            items: [
              { id: 'paid', label: 'Pagué en efectivo', variant: 'primary' },
              { id: 'problem', label: 'Reportar un problema', variant: 'link' },
            ],
          },
        ],
      },
    },
    {
      id: 'rate',
      coach: tv('Califica el viaje. Toca la quinta estrella.', 'Califique el viaje. Toque la quinta estrella.'),
      hint: tv('Toca la estrella del número 5, la última.', 'Toque la estrella del número 5, la última.'),
      wrong: tv(
        'Para esta práctica, toca la última estrella, la del 5.',
        'Para esta práctica, toque la última estrella, la del 5.',
      ),
      target: { kind: 'tap', id: 'stars.star.5' },
      screen: {
        chrome: 'platform',
        title: '¿Cómo le fue?',
        blocks: [{ type: 'rating', id: 'stars', label: 'Califique a Pedro Ejemplo' }],
      },
    },
  ],
  finish: {
    learned: [
      'Elegir el destino y mirar el precio antes de pedir.',
      'Compartir el viaje con un familiar.',
      'Comparar la placa antes de subir.',
      'Pagar y calificar el viaje.',
    ],
    tip: tv(
      'Si la placa o el conductor no coinciden con la aplicación, no subas. Cancela el viaje.',
      'Si la placa o el conductor no coinciden con la aplicación, no suba. Cancele el viaje.',
    ),
  },
}
