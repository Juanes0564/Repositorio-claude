import type { Flow } from '../../sim/types'
import { tv } from '../treatment'

/**
 * Transferencia bancaria en Banco Ejemplo (sección 13.1 del brief).
 * Todos los nombres, cuentas, montos y códigos son de práctica.
 */
export const transferBank: Flow = {
  id: 'transfer-bank',
  skill: 'transfers',
  platform: 'bank',
  title: 'Enviar dinero a otra persona',
  summary: tv(
    'Practica una transferencia desde Banco Ejemplo.',
    'Practique una transferencia desde Banco Ejemplo.',
  ),
  minutes: 5,
  reviewed: false,
  steps: [
    {
      id: 'open-app',
      coach: tv('Abre la aplicación de tu banco.', 'Abra la aplicación de su banco.'),
      hint: tv('Toca el cuadro que dice "Banco Ejemplo".', 'Toque el cuadro que dice "Banco Ejemplo".'),
      wrong: tv(
        'Esa es otra aplicación. Busca la que dice Banco Ejemplo.',
        'Esa es otra aplicación. Busque la que dice Banco Ejemplo.',
      ),
      target: { kind: 'tap', id: 'app-bank' },
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
              { id: 'app-transport', label: 'Transporte Ejemplo', platform: 'transport' },
              { id: 'app-store', label: 'Tienda Ejemplo', platform: 'store' },
              { id: 'app-settings', label: 'Ajustes', platform: 'settings' },
            ],
          },
        ],
      },
    },
    {
      id: 'login',
      coach: tv('Entra con tu clave. Para practicar, escribe 1234.', 'Entre con su clave. Para practicar, escriba 1234.'),
      hint: tv(
        'Toca 1, 2, 3 y 4. Luego toca "Entrar".',
        'Toque 1, 2, 3 y 4. Luego toque "Entrar".',
      ),
      wrong: tv(
        'La clave de práctica es 1234. Si te equivocas, toca Borrar.',
        'La clave de práctica es 1234. Si se equivoca, toque Borrar.',
      ),
      target: { kind: 'input', keypadId: 'pin', expected: '1234' },
      screen: {
        chrome: 'platform',
        title: 'Ingresar',
        blocks: [
          {
            type: 'notice',
            tone: 'warning',
            text: tv(
              'En la vida real, nunca le digas tu clave a nadie.',
              'En la vida real, nunca le diga su clave a nadie.',
            ),
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
      id: 'choose-transfer',
      coach: tv('Busca el botón Transferir y tócalo.', 'Busque el botón Transferir y tóquelo.'),
      hint: tv(
        'Está debajo de tu saldo. Tiene una flecha.',
        'Está debajo de su saldo. Tiene una flecha.',
      ),
      target: { kind: 'tap', id: 'transfer' },
      screen: {
        chrome: 'platform',
        title: 'Hola, cliente de práctica',
        blocks: [
          { type: 'balance', label: 'Saldo disponible', amount: '$ 850.000', note: 'Cuenta de ahorros de práctica' },
          {
            type: 'tiles',
            columns: 2,
            items: [
              { id: 'transfer', label: 'Transferir', icon: 'send' },
              { id: 'pay', label: 'Pagar servicios', icon: 'pay' },
              { id: 'history', label: 'Movimientos', icon: 'history' },
              { id: 'support', label: 'Ayuda', icon: 'help' },
            ],
          },
        ],
      },
    },
    {
      id: 'choose-contact',
      coach: tv('Vas a enviarle dinero a Rosa. Toca su nombre.', 'Va a enviarle dinero a Rosa. Toque su nombre.'),
      hint: tv('Toca "Rosa Ejemplo".', 'Toque "Rosa Ejemplo".'),
      wrong: tv(
        'Esa no es Rosa. Lee los nombres con calma.',
        'Esa no es Rosa. Lea los nombres con calma.',
      ),
      target: { kind: 'tap', id: 'contact-rosa' },
      screen: {
        chrome: 'platform',
        title: tv('¿A quién le envías?', '¿A quién le envía?'),
        blocks: [
          {
            type: 'list',
            title: tv('Tus contactos de práctica', 'Sus contactos de práctica'),
            items: [
              { id: 'contact-carlos', label: 'Carlos Ejemplo', detail: 'Ahorros terminada en 1111', icon: 'user' },
              { id: 'contact-rosa', label: 'Rosa Ejemplo', detail: 'Ahorros terminada en 4321', icon: 'user' },
              { id: 'contact-store', label: 'Tienda Don Ejemplo', detail: 'Corriente terminada en 9090', icon: 'user' },
            ],
          },
          { type: 'actions', items: [{ id: 'new-contact', label: 'Agregar otra cuenta', variant: 'secondary' }] },
        ],
      },
    },
    {
      id: 'amount',
      coach: tv('Escribe el valor con calma: 50000.', 'Escriba el valor con calma: 50000.'),
      hint: tv(
        'Toca 5 y luego cuatro veces 0. Después, "Continuar".',
        'Toque 5 y luego cuatro veces 0. Después, "Continuar".',
      ),
      wrong: tv(
        'El valor debe ser 50.000. Toca Borrar para corregir.',
        'El valor debe ser 50.000. Toque Borrar para corregir.',
      ),
      target: { kind: 'input', keypadId: 'amount', expected: '50000' },
      screen: {
        chrome: 'platform',
        title: tv('¿Cuánto vas a enviar?', '¿Cuánto va a enviar?'),
        blocks: [
          { type: 'text', tone: 'muted', text: 'Para: Rosa Ejemplo' },
          {
            type: 'keypad',
            id: 'amount',
            label: 'Valor en pesos',
            display: 'money',
            maxLength: 7,
            submit: { id: 'amount-submit', label: 'Continuar' },
          },
        ],
      },
    },
    {
      id: 'review',
      coach: tv('Revisa el nombre y el valor. Luego toca Confirmar.', 'Revise el nombre y el valor. Luego toque Confirmar.'),
      hint: tv(
        'Debe decir Rosa Ejemplo y $ 50.000. Si está bien, toca "Confirmar".',
        'Debe decir Rosa Ejemplo y $ 50.000. Si está bien, toque "Confirmar".',
      ),
      wrong: tv(
        'En esta práctica los datos están bien. Toca Confirmar.',
        'En esta práctica los datos están bien. Toque Confirmar.',
      ),
      target: { kind: 'tap', id: 'confirm' },
      screen: {
        chrome: 'platform',
        title: tv('Revisa antes de enviar', 'Revise antes de enviar'),
        blocks: [
          {
            type: 'summary',
            rows: [
              { label: 'Para', value: 'Rosa Ejemplo' },
              { label: 'Cuenta', value: 'Ahorros terminada en 4321' },
              { label: 'Valor', value: '$ 50.000' },
              { label: 'Costo', value: '$ 0' },
            ],
          },
          {
            type: 'actions',
            items: [
              { id: 'confirm', label: 'Confirmar', variant: 'primary' },
              { id: 'edit', label: 'Corregir', variant: 'secondary' },
            ],
          },
        ],
      },
    },
    {
      id: 'code',
      coach: tv('Te llegó un código de práctica. Escribe 5678.', 'Le llegó un código de práctica. Escriba 5678.'),
      hint: tv(
        'El código está en el mensaje de Banco Ejemplo. Toca 5, 6, 7 y 8.',
        'El código está en el mensaje de Banco Ejemplo. Toque 5, 6, 7 y 8.',
      ),
      wrong: tv(
        'El código de práctica es 5678. Toca Borrar para corregir.',
        'El código de práctica es 5678. Toque Borrar para corregir.',
      ),
      target: { kind: 'input', keypadId: 'otp', expected: '5678' },
      screen: {
        chrome: 'platform',
        title: tv('Confirma con tu código', 'Confirme con su código'),
        blocks: [
          {
            type: 'sms',
            sender: 'Banco Ejemplo',
            time: 'Ahora',
            body: tv('Tu código de práctica es 5678. No lo compartas con nadie.', 'Su código de práctica es 5678. No lo comparta con nadie.'),
          },
          {
            type: 'notice',
            tone: 'warning',
            text: tv('Este código es solo para ti. El banco nunca te lo pide por llamada.', 'Este código es solo para usted. El banco nunca se lo pide por llamada.'),
          },
          {
            type: 'keypad',
            id: 'otp',
            label: 'Código de 4 números',
            display: 'plain',
            maxLength: 4,
            submit: { id: 'otp-submit', label: 'Enviar dinero' },
          },
        ],
      },
    },
    {
      id: 'receipt',
      coach: tv('¡Listo! Guarda el comprobante.', '¡Listo! Guarde el comprobante.'),
      hint: tv('Toca "Guardar comprobante".', 'Toque "Guardar comprobante".'),
      wrong: tv(
        'Primero guarda el comprobante. Toca Guardar comprobante.',
        'Primero guarde el comprobante. Toque Guardar comprobante.',
      ),
      target: { kind: 'tap', id: 'save-receipt' },
      screen: {
        chrome: 'platform',
        title: 'Comprobante',
        blocks: [
          {
            type: 'receipt',
            title: 'Transferencia exitosa',
            status: 'Enviada',
            rows: [
              { label: 'Para', value: 'Rosa Ejemplo' },
              { label: 'Valor', value: '$ 50.000' },
              { label: 'Número de comprobante', value: 'PRUEBA-0001' },
            ],
          },
          {
            type: 'actions',
            items: [
              { id: 'save-receipt', label: 'Guardar comprobante', variant: 'primary' },
              { id: 'go-home', label: 'Ir al inicio', variant: 'secondary' },
            ],
          },
        ],
      },
    },
  ],
  finish: {
    learned: [
      tv('Abrir la app del banco y entrar con tu clave.', 'Abrir la app del banco y entrar con su clave.'),
      'Elegir a quién enviar y escribir el valor.',
      'Revisar los datos y confirmar con el código.',
      'Guardar el comprobante.',
    ],
    tip: tv(
      'Confirma siempre el nombre antes de enviar. Nunca compartas tu clave ni tus códigos.',
      'Confirme siempre el nombre antes de enviar. Nunca comparta su clave ni sus códigos.',
    ),
  },
}
