import type { Flow } from '../../sim/types'
import { tv } from '../treatment'

/**
 * Compra por internet en Tienda Ejemplo (sección 13.4 del brief).
 * Productos, precios y dirección son de práctica.
 */
export const shoppingStore: Flow = {
  id: 'shopping-store',
  skill: 'shopping',
  platform: 'store',
  title: 'Comprar una olla por internet',
  summary: tv(
    'Practica una compra completa y paga contra entrega.',
    'Practique una compra completa y pague contra entrega.',
  ),
  minutes: 6,
  reviewed: false,
  steps: [
    {
      id: 'search',
      coach: tv('Vas a buscar una olla. Toca la caja de búsqueda.', 'Va a buscar una olla. Toque la caja de búsqueda.'),
      hint: tv('Toca donde dice "Buscar productos", arriba.', 'Toque donde dice "Buscar productos", arriba.'),
      wrong: tv(
        'Para buscar, toca la caja que dice Buscar productos.',
        'Para buscar, toque la caja que dice Buscar productos.',
      ),
      target: { kind: 'tap', id: 'search' },
      screen: {
        chrome: 'platform',
        title: 'Inicio',
        blocks: [
          { type: 'form', fields: [{ id: 'search', label: 'Buscar productos', placeholder: '¿Qué está buscando?' }] },
          {
            type: 'tiles',
            columns: 2,
            items: [
              { id: 'cat-home', label: 'Hogar', icon: 'home' },
              { id: 'cat-food', label: 'Mercado', icon: 'cart' },
              { id: 'cat-health', label: 'Salud', icon: 'check' },
              { id: 'cat-offers', label: 'Ofertas', icon: 'star' },
            ],
          },
        ],
      },
    },
    {
      id: 'results',
      coach: tv('Toca la olla de presión.', 'Toque la olla de presión.'),
      hint: tv('Toca "Olla de presión Ejemplo".', 'Toque "Olla de presión Ejemplo".'),
      wrong: tv(
        'Esa es otra olla. Busca la olla de presión.',
        'Esa es otra olla. Busque la olla de presión.',
      ),
      target: { kind: 'tap', id: 'pressure' },
      screen: {
        chrome: 'platform',
        title: 'Resultados para "olla"',
        blocks: [
          {
            type: 'list',
            items: [
              { id: 'rice', label: 'Olla arrocera Ejemplo', detail: '$ 120.000 · 4,2 estrellas', icon: 'bag' },
              { id: 'pressure', label: 'Olla de presión Ejemplo', detail: '$ 89.900 · 4,6 estrellas', icon: 'bag' },
              { id: 'set', label: 'Juego de ollas Ejemplo', detail: '$ 210.000 · 4,4 estrellas', icon: 'bag' },
            ],
          },
        ],
      },
    },
    {
      id: 'product',
      coach: tv('Lee la descripción. Luego agrégala al carrito.', 'Lea la descripción. Luego agréguela al carrito.'),
      hint: tv('Toca "Agregar al carrito".', 'Toque "Agregar al carrito".'),
      wrong: tv(
        'Para esta práctica, toca Agregar al carrito.',
        'Para esta práctica, toque Agregar al carrito.',
      ),
      target: { kind: 'tap', id: 'add' },
      screen: {
        chrome: 'platform',
        title: 'Olla de presión Ejemplo',
        blocks: [
          { type: 'balance', label: 'Precio', amount: '$ 89.900', note: '4 litros · Acero' },
          {
            type: 'notice',
            tone: 'info',
            text: 'Vendido por Tienda Ejemplo. Devoluciones gratis durante 30 días.',
          },
          {
            type: 'actions',
            items: [
              { id: 'add', label: 'Agregar al carrito', variant: 'primary' },
              { id: 'buy-now', label: 'Comprar ahora', variant: 'secondary' },
            ],
          },
        ],
      },
    },
    {
      id: 'cart',
      coach: tv('Revisa el total, con el envío. Luego continúa.', 'Revise el total, con el envío. Luego continúe.'),
      hint: tv(
        'El total es $ 97.900: la olla más el envío. Toca "Continuar compra".',
        'El total es $ 97.900: la olla más el envío. Toque "Continuar compra".',
      ),
      wrong: tv(
        'Para seguir con la compra, toca Continuar compra.',
        'Para seguir con la compra, toque Continuar compra.',
      ),
      target: { kind: 'tap', id: 'checkout' },
      screen: {
        chrome: 'platform',
        title: 'Mi carrito',
        blocks: [
          {
            type: 'summary',
            rows: [
              { label: 'Olla de presión Ejemplo', value: '$ 89.900' },
              { label: 'Envío', value: '$ 8.000' },
              { label: 'Total', value: '$ 97.900' },
            ],
          },
          {
            type: 'actions',
            items: [
              { id: 'checkout', label: 'Continuar compra', variant: 'primary' },
              { id: 'keep', label: 'Seguir comprando', variant: 'secondary' },
            ],
          },
        ],
      },
    },
    {
      id: 'address',
      coach: tv('Revisa la dirección de práctica y úsala.', 'Revise la dirección de práctica y úsela.'),
      hint: tv('Toca "Usar esta dirección".', 'Toque "Usar esta dirección".'),
      target: { kind: 'tap', id: 'use-address' },
      screen: {
        chrome: 'platform',
        title: '¿A dónde lo enviamos?',
        blocks: [
          {
            type: 'form',
            fields: [
              { id: 'street', label: 'Dirección', value: 'Calle de práctica 1 # 2-3' },
              { id: 'city', label: 'Ciudad', value: 'Ciudad Ejemplo' },
              { id: 'notes', label: 'Indicaciones', value: 'Casa de reja verde' },
            ],
          },
          {
            type: 'actions',
            items: [
              { id: 'use-address', label: 'Usar esta dirección', variant: 'primary' },
              { id: 'new-address', label: 'Agregar otra dirección', variant: 'secondary' },
            ],
          },
        ],
      },
    },
    {
      id: 'payment',
      coach: tv('Elige pagar contra entrega.', 'Elija pagar contra entrega.'),
      hint: tv(
        'Contra entrega es pagar cuando le llegue el pedido. Toca esa opción.',
        'Contra entrega es pagar cuando le llegue el pedido. Toque esa opción.',
      ),
      wrong: tv(
        'Para esta práctica, elige pago contra entrega.',
        'Para esta práctica, elija pago contra entrega.',
      ),
      target: { kind: 'tap', id: 'cod' },
      screen: {
        chrome: 'platform',
        title: '¿Cómo quiere pagar?',
        blocks: [
          {
            type: 'list',
            items: [
              { id: 'card', label: 'Tarjeta', detail: 'Débito o crédito', icon: 'card' },
              { id: 'cod', label: 'Pago contra entrega', detail: 'En efectivo, cuando reciba el pedido', icon: 'home' },
              { id: 'bank', label: 'Desde la app del banco', detail: 'Pago en línea', icon: 'pay' },
            ],
          },
        ],
      },
    },
    {
      id: 'confirm',
      coach: tv('Revisa todo y confirma el pedido.', 'Revise todo y confirme el pedido.'),
      hint: tv('Toca "Confirmar pedido".', 'Toque "Confirmar pedido".'),
      wrong: tv(
        'En esta práctica los datos están bien. Toca Confirmar pedido.',
        'En esta práctica los datos están bien. Toque Confirmar pedido.',
      ),
      target: { kind: 'tap', id: 'confirm' },
      screen: {
        chrome: 'platform',
        title: 'Revise su pedido',
        blocks: [
          {
            type: 'summary',
            rows: [
              { label: 'Producto', value: 'Olla de presión Ejemplo' },
              { label: 'Envío a', value: 'Calle de práctica 1 # 2-3' },
              { label: 'Pago', value: 'Contra entrega' },
              { label: 'Total', value: '$ 97.900' },
            ],
          },
          {
            type: 'actions',
            items: [
              { id: 'confirm', label: 'Confirmar pedido', variant: 'primary' },
              { id: 'back-cart', label: 'Volver al carrito', variant: 'secondary' },
            ],
          },
        ],
      },
    },
    {
      id: 'tracking',
      coach: tv('¡Listo! Mira dónde va tu pedido.', '¡Listo! Mire dónde va su pedido.'),
      hint: tv('Toca "Ver seguimiento".', 'Toque "Ver seguimiento".'),
      wrong: tv('Busca el botón Ver seguimiento.', 'Busque el botón Ver seguimiento.'),
      target: { kind: 'tap', id: 'track' },
      screen: {
        chrome: 'platform',
        title: 'Pedido confirmado',
        blocks: [
          {
            type: 'receipt',
            title: 'Su pedido va en camino',
            status: 'Preparando el envío',
            rows: [
              { label: 'Llega', value: 'En 2 o 3 días' },
              { label: 'Pago', value: 'Contra entrega: $ 97.900' },
              { label: 'Número de pedido', value: 'PRUEBA-0003' },
            ],
          },
          {
            type: 'actions',
            items: [
              { id: 'track', label: 'Ver seguimiento', variant: 'primary' },
              { id: 'go-home', label: 'Seguir comprando', variant: 'link' },
            ],
          },
        ],
      },
    },
  ],
  finish: {
    learned: [
      'Buscar un producto y leer su descripción.',
      'Revisar el total con el envío.',
      'Elegir pago contra entrega.',
      'Confirmar y ver el seguimiento del pedido.',
    ],
    tip: tv(
      'Compra en tiendas conocidas. Desconfía de precios demasiado bajos y de quien solo acepta transferencias a una persona.',
      'Compre en tiendas conocidas. Desconfíe de precios demasiado bajos y de quien solo acepta transferencias a una persona.',
    ),
  },
}
