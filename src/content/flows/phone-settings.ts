import type { Flow } from '../../sim/types'
import { tv } from '../treatment'

/**
 * Configuración del celular en "Ajustes" (sección 13.7 del brief).
 * Pantalla de ajustes genérica: no copia la de ningún fabricante.
 */
export const phoneSettings: Flow = {
  id: 'phone-settings',
  skill: 'phoneSettings',
  platform: 'settings',
  title: 'Poner el celular más cómodo',
  summary: tv(
    'Practica cómo cambiar la letra, el brillo, el volumen y más.',
    'Practique cómo cambiar la letra, el brillo, el volumen y más.',
  ),
  minutes: 5,
  reviewed: false,
  steps: [
    {
      id: 'open-settings',
      coach: tv('Abre los Ajustes del celular.', 'Abra los Ajustes del celular.'),
      hint: tv('Toca el cuadro que dice "Ajustes".', 'Toque el cuadro que dice "Ajustes".'),
      wrong: tv('Esa es otra aplicación. Busca la que dice Ajustes.', 'Esa es otra aplicación. Busque la que dice Ajustes.'),
      target: { kind: 'tap', id: 'app-settings' },
      screen: {
        chrome: 'phone',
        blocks: [
          {
            type: 'tiles',
            columns: 3,
            items: [
              { id: 'app-bank', label: 'Banco Ejemplo', platform: 'bank' },
              { id: 'app-settings', label: 'Ajustes', platform: 'settings' },
              { id: 'app-chat', label: 'Chat Ejemplo', platform: 'chat' },
              { id: 'app-eps', label: 'EPS Salud Ejemplo', platform: 'eps' },
              { id: 'app-transport', label: 'Transporte Ejemplo', platform: 'transport' },
              { id: 'app-store', label: 'Tienda Ejemplo', platform: 'store' },
            ],
          },
        ],
      },
    },
    {
      id: 'text-size',
      coach: tv('Busca la opción para cambiar el tamaño de letra.', 'Busque la opción para cambiar el tamaño de letra.'),
      hint: tv('Toca "Tamaño de letra".', 'Toque "Tamaño de letra".'),
      wrong: tv('Esa es otra opción. Busca Tamaño de letra.', 'Esa es otra opción. Busque Tamaño de letra.'),
      target: { kind: 'tap', id: 'text-size' },
      screen: {
        chrome: 'platform',
        blocks: [
          {
            type: 'settings',
            rows: [
              { id: 'wifi', label: 'Wifi', value: 'Desconectado', icon: 'wifi', control: 'chevron' },
              { id: 'text-size', label: 'Tamaño de letra', value: 'Mediano', icon: 'text', control: 'chevron' },
              { id: 'brightness', label: 'Brillo', value: '40 %', icon: 'sun', control: 'chevron' },
              { id: 'sound', label: 'Sonido y volumen', icon: 'volume', control: 'chevron' },
              { id: 'update', label: 'Actualización', icon: 'download', control: 'chevron' },
              { id: 'plane', label: 'Modo avión', icon: 'plane', control: 'toggle', on: false },
            ],
          },
        ],
      },
    },
    {
      id: 'text-large',
      coach: tv('Elige la letra Grande.', 'Elija la letra Grande.'),
      hint: tv('Toca "Grande".', 'Toque "Grande".'),
      wrong: tv('Para esta práctica, elige Grande.', 'Para esta práctica, elija Grande.'),
      target: { kind: 'tap', id: 'size-large' },
      screen: {
        chrome: 'platform',
        title: 'Tamaño de letra',
        blocks: [
          { type: 'text', text: 'Así se verán las letras del celular.' },
          {
            type: 'list',
            items: [
              { id: 'size-small', label: 'Pequeño', icon: 'text' },
              { id: 'size-medium', label: 'Mediano (actual)', icon: 'text' },
              { id: 'size-large', label: 'Grande', icon: 'text' },
              { id: 'size-xlarge', label: 'Muy grande', icon: 'text' },
            ],
          },
        ],
      },
    },
    {
      id: 'brightness',
      coach: tv('La pantalla está muy oscura. Sube el brillo.', 'La pantalla está muy oscura. Suba el brillo.'),
      hint: tv('Toca "Subir brillo".', 'Toque "Subir brillo".'),
      wrong: tv('Para ver mejor, toca Subir brillo.', 'Para ver mejor, toque Subir brillo.'),
      target: { kind: 'tap', id: 'bright-up' },
      screen: {
        chrome: 'platform',
        title: 'Brillo',
        blocks: [
          { type: 'balance', label: 'Brillo de la pantalla', amount: '40 %' },
          {
            type: 'actions',
            items: [
              { id: 'bright-up', label: 'Subir brillo', variant: 'primary' },
              { id: 'bright-down', label: 'Bajar brillo', variant: 'secondary' },
            ],
          },
        ],
      },
    },
    {
      id: 'volume',
      coach: tv('No escuchas bien las llamadas. Sube el volumen.', 'No escucha bien las llamadas. Suba el volumen.'),
      hint: tv(
        'Toca "Subir volumen". También sirven los botones del costado del celular.',
        'Toque "Subir volumen". También sirven los botones del costado del celular.',
      ),
      wrong: tv('Para escuchar mejor, toca Subir volumen.', 'Para escuchar mejor, toque Subir volumen.'),
      target: { kind: 'tap', id: 'vol-up' },
      screen: {
        chrome: 'platform',
        title: 'Sonido y volumen',
        blocks: [
          { type: 'balance', label: 'Volumen de llamadas', amount: '30 %' },
          {
            type: 'actions',
            items: [
              { id: 'vol-up', label: 'Subir volumen', variant: 'primary' },
              { id: 'vol-down', label: 'Bajar volumen', variant: 'secondary' },
            ],
          },
        ],
      },
    },
    {
      id: 'wifi',
      coach: tv('Conéctate al wifi de tu casa.', 'Conéctese al wifi de su casa.'),
      hint: tv('Toca "Casa Ejemplo". Ya tiene la clave guardada.', 'Toque "Casa Ejemplo". Ya tiene la clave guardada.'),
      wrong: tv(
        'Ese no es el wifi de tu casa. Busca Casa Ejemplo.',
        'Ese no es el wifi de su casa. Busque Casa Ejemplo.',
      ),
      explain: tv(
        'La clave del wifi suele estar en una etiqueta del aparato de internet. Evita usar wifi público para el banco.',
        'La clave del wifi suele estar en una etiqueta del aparato de internet. Evite usar wifi público para el banco.',
      ),
      target: { kind: 'tap', id: 'net-home' },
      screen: {
        chrome: 'platform',
        title: 'Wifi',
        blocks: [
          {
            type: 'list',
            title: 'Redes cerca',
            items: [
              { id: 'net-public', label: 'Wifi gratis del parque', detail: 'Abierta, sin clave', icon: 'wifi' },
              { id: 'net-home', label: 'Casa Ejemplo', detail: 'Guardada', icon: 'wifi' },
              { id: 'net-neighbor', label: 'Vecino Ejemplo', detail: 'Con clave', icon: 'lock' },
            ],
          },
        ],
      },
    },
    {
      id: 'update',
      coach: tv('Hay una actualización. Instálala.', 'Hay una actualización. Instálela.'),
      hint: tv('Toca "Instalar ahora".', 'Toque "Instalar ahora".'),
      wrong: tv('Actualizar protege el celular. Toca Instalar ahora.', 'Actualizar protege el celular. Toque Instalar ahora.'),
      target: { kind: 'tap', id: 'install' },
      screen: {
        chrome: 'platform',
        title: 'Actualización',
        blocks: [
          { type: 'notice', tone: 'info', text: 'Hay una actualización de seguridad disponible.' },
          {
            type: 'summary',
            rows: [
              { label: 'Conectado a', value: 'Wifi Casa Ejemplo' },
              { label: 'Batería', value: '80 %' },
            ],
          },
          {
            type: 'actions',
            items: [
              { id: 'install', label: 'Instalar ahora', variant: 'primary' },
              { id: 'later', label: 'Recordar más tarde', variant: 'secondary' },
            ],
          },
        ],
      },
    },
    {
      id: 'airplane-off',
      coach: tv('No te entran llamadas. Apaga el modo avión.', 'No le entran llamadas. Apague el modo avión.'),
      hint: tv(
        'El modo avión está en "Sí". Toca esa fila para apagarlo.',
        'El modo avión está en "Sí". Toque esa fila para apagarlo.',
      ),
      wrong: tv('Busca la fila Modo avión y tócala.', 'Busque la fila Modo avión y tóquela.'),
      explain: tv(
        'Con el modo avión encendido no entran llamadas ni internet. Se enciende y se apaga tocando esa misma fila. Úsalo en un avión o cuando no quieras interrupciones.',
        'Con el modo avión encendido no entran llamadas ni internet. Se enciende y se apaga tocando esa misma fila. Úselo en un avión o cuando no quiera interrupciones.',
      ),
      target: { kind: 'tap', id: 'plane' },
      screen: {
        chrome: 'platform',
        blocks: [
          { type: 'notice', tone: 'warning', text: 'Modo avión encendido: sin llamadas ni internet.' },
          {
            type: 'settings',
            rows: [
              { id: 'wifi', label: 'Wifi', value: 'Casa Ejemplo', icon: 'wifi', control: 'chevron' },
              { id: 'text-size', label: 'Tamaño de letra', value: 'Grande', icon: 'text', control: 'chevron' },
              { id: 'plane', label: 'Modo avión', icon: 'plane', control: 'toggle', on: true },
            ],
          },
        ],
      },
    },
  ],
  finish: {
    learned: [
      'Poner la letra más grande.',
      'Subir el brillo y el volumen.',
      'Conectarse al wifi de la casa y actualizar.',
      'Encender y apagar el modo avión.',
    ],
    tip: tv(
      'Actualiza el celular cuando lo pida, con wifi y batería. Para el banco, evita el wifi público.',
      'Actualice el celular cuando lo pida, con wifi y batería. Para el banco, evite el wifi público.',
    ),
  },
}
