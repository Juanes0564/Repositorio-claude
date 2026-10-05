import type { SkillId } from '../lib/storage'
import type { Copy } from './types'
import { tv } from './treatment'

export interface GuideStep {
  /** Instrucción corta (máximo unas 12 palabras). */
  text: Copy
  /** Explicación más detallada para el botón "No entiendo". */
  detail: Copy
}

export interface Guide {
  skill: SkillId
  title: string
  intro: Copy
  steps: GuideStep[]
  /** A dónde lleva "Practicar esto en el simulador". */
  practicePath: string
  /** Contenido sensible: false hasta que una persona del equipo lo revise. */
  reviewed: boolean
}

/**
 * Guías para hacerlo en la vida real (sección 6 del brief).
 * Son pasos genéricos a propósito: las apps reales cambian, así que no se nombran botones exactos.
 */
export const guides: Guide[] = [
  {
    skill: 'transfers',
    title: 'Enviar dinero',
    intro: tv('Vamos paso a paso. Cuando termines cada paso, toca "Ya lo hice".', 'Vamos paso a paso. Cuando termine cada paso, toque "Ya lo hice".'),
    practicePath: '/practicar/bank/transfer-bank',
    reviewed: false,
    steps: [
      {
        text: tv('Abre la aplicación de tu banco, la que usas siempre.', 'Abra la aplicación de su banco, la que usa siempre.'),
        detail: tv(
          'Busca en tu celular el dibujo con el nombre de tu banco y tócalo. Si no la tienes instalada, pide ayuda a un familiar.',
          'Busque en su celular el dibujo con el nombre de su banco y tóquelo. Si no la tiene instalada, pida ayuda a un familiar.',
        ),
      },
      {
        text: tv('Entra con tu clave. No se la digas a nadie.', 'Entre con su clave. No se la diga a nadie.'),
        detail: tv(
          'La clave son los números o letras que tú elegiste. Escríbela tú solo, sin que nadie mire.',
          'La clave son los números o letras que usted eligió. Escríbala usted solo, sin que nadie mire.',
        ),
      },
      {
        text: tv('Busca el botón que dice Transferir o Enviar dinero.', 'Busque el botón que dice Transferir o Enviar dinero.'),
        detail: tv(
          'Suele estar en la pantalla principal. A veces tiene una flecha. Si no lo ves, busca la palabra "Pagar" o "Enviar".',
          'Suele estar en la pantalla principal. A veces tiene una flecha. Si no lo ve, busque la palabra "Pagar" o "Enviar".',
        ),
      },
      {
        text: tv('Elige a quién le vas a enviar.', 'Elija a quién le va a enviar.'),
        detail: tv(
          'Busca el nombre en tu lista. Si es la primera vez, el banco te pedirá el número de cuenta o de celular de esa persona.',
          'Busque el nombre en su lista. Si es la primera vez, el banco le pedirá el número de cuenta o de celular de esa persona.',
        ),
      },
      {
        text: tv('Escribe el valor con calma.', 'Escriba el valor con calma.'),
        detail: tv(
          'Escribe el número sin puntos. Mira bien cuántos ceros tiene antes de seguir.',
          'Escriba el número sin puntos. Mire bien cuántos ceros tiene antes de seguir.',
        ),
      },
      {
        text: tv('Revisa el nombre y el valor.', 'Revise el nombre y el valor.'),
        detail: tv(
          'Antes de confirmar, lee despacio el nombre de la persona y la cantidad. Si algo está mal, toca Volver o Corregir.',
          'Antes de confirmar, lea despacio el nombre de la persona y la cantidad. Si algo está mal, toque Volver o Corregir.',
        ),
      },
      {
        text: tv('Confirma. Si te piden un código, es solo para ti.', 'Confirme. Si le piden un código, es solo para usted.'),
        detail: tv(
          'A veces el banco te manda un código por mensaje para confirmar. Escríbelo tú. Nunca se lo digas a nadie que te llame.',
          'A veces el banco le manda un código por mensaje para confirmar. Escríbalo usted. Nunca se lo diga a nadie que le llame.',
        ),
      },
      {
        text: tv('Guarda el comprobante.', 'Guarde el comprobante.'),
        detail: tv(
          'El comprobante dice que el dinero se envió. Toca Guardar o Compartir, o toma una foto de la pantalla.',
          'El comprobante dice que el dinero se envió. Toque Guardar o Compartir, o tome una foto de la pantalla.',
        ),
      },
    ],
  },
  {
    skill: 'medical',
    title: 'Sacar una cita médica',
    intro: tv('Vamos paso a paso. Ten a mano tu documento.', 'Vamos paso a paso. Tenga a mano su documento.'),
    practicePath: '/practicar?categoria=salud',
    reviewed: false,
    steps: [
      {
        text: tv('Abre la aplicación o la página de tu EPS.', 'Abra la aplicación o la página de su EPS.'),
        detail: tv(
          'Si no la tienes, puedes pedir la cita llamando a tu EPS. Pide a un familiar que te ayude a instalar la aplicación.',
          'Si no la tiene, puede pedir la cita llamando a su EPS. Pida a un familiar que le ayude a instalar la aplicación.',
        ),
      },
      {
        text: tv('Entra con tu número de documento y tu clave.', 'Entre con su número de documento y su clave.'),
        detail: tv(
          'Si es la primera vez, la aplicación te pedirá crear una clave. Anótala en un lugar seguro de tu casa.',
          'Si es la primera vez, la aplicación le pedirá crear una clave. Anótela en un lugar seguro de su casa.',
        ),
      },
      {
        text: tv('Busca la opción Citas o Agendar cita.', 'Busque la opción Citas o Agendar cita.'),
        detail: 'Suele estar en la pantalla principal, con el dibujo de un calendario.',
      },
      {
        text: tv('Elige el tipo de cita. Por ejemplo, medicina general.', 'Elija el tipo de cita. Por ejemplo, medicina general.'),
        detail: tv(
          'Para un especialista a veces necesitas una orden de tu médico general.',
          'Para un especialista a veces necesita una orden de su médico general.',
        ),
      },
      {
        text: tv('Elige la sede que te quede más cerca.', 'Elija la sede que le quede más cerca.'),
        detail: tv(
          'La sede es el lugar donde te van a atender. Lee la dirección antes de elegir.',
          'La sede es el lugar donde le van a atender. Lea la dirección antes de elegir.',
        ),
      },
      {
        text: tv('Elige el día y la hora que te sirvan.', 'Elija el día y la hora que le sirvan.'),
        detail: tv(
          'Toca un día disponible y luego una hora. Si no hay, prueba otra sede u otro día.',
          'Toque un día disponible y luego una hora. Si no hay, pruebe otra sede u otro día.',
        ),
      },
      {
        text: tv('Confirma la cita.', 'Confirme la cita.'),
        detail: tv(
          'Revisa el día, la hora y la sede antes de tocar Confirmar.',
          'Revise el día, la hora y la sede antes de tocar Confirmar.',
        ),
      },
      {
        text: tv('Anota la fecha y lleva tu documento ese día.', 'Anote la fecha y lleve su documento ese día.'),
        detail: tv(
          'Escribe la cita en un papel o en el calendario. Llega unos minutos antes.',
          'Escriba la cita en un papel o en el calendario. Llegue unos minutos antes.',
        ),
      },
    ],
  },
  {
    skill: 'transport',
    title: 'Pedir un transporte',
    intro: tv('Vamos paso a paso. Antes de subir, siempre revisa la placa.', 'Vamos paso a paso. Antes de subir, siempre revise la placa.'),
    practicePath: '/practicar?categoria=transporte',
    reviewed: false,
    steps: [
      { text: tv('Abre la aplicación de transporte que usas.', 'Abra la aplicación de transporte que usa.'), detail: tv(
          'Es la aplicación para pedir un carro o un taxi. Si no tienes una, pide ayuda a un familiar.',
          'Es la aplicación para pedir un carro o un taxi. Si no tiene una, pida ayuda a un familiar.',
        ) },
      { text: tv('Escribe a dónde vas.', 'Escriba a dónde va.'), detail: tv(
          'Toca la caja que dice "¿A dónde vas?" y escribe la dirección o el nombre del lugar.',
          'Toque la caja que dice "¿A dónde vas?" y escriba la dirección o el nombre del lugar.',
        ) },
      { text: tv('Mira el precio antes de pedir.', 'Mire el precio antes de pedir.'), detail: tv(
          'La aplicación te muestra cuánto cuesta. Si te parece caro, puedes elegir otro tipo de viaje.',
          'La aplicación le muestra cuánto cuesta. Si le parece caro, puede elegir otro tipo de viaje.',
        ) },
      { text: tv('Elige el tipo de viaje y confirma.', 'Elija el tipo de viaje y confirme.'), detail: tv(
          'Hay opciones más baratas y más cómodas. Toca la que prefieras y luego Confirmar o Pedir.',
          'Hay opciones más baratas y más cómodas. Toque la que prefiera y luego Confirmar o Pedir.',
        ) },
      { text: tv('Mira el nombre del conductor y la placa.', 'Mire el nombre del conductor y la placa.'), detail: 'La placa son las letras y números del carro. Aparecen en la pantalla.' },
      { text: tv('Antes de subir, verifica que la placa coincida.', 'Antes de subir, verifique que la placa coincida.'), detail: tv(
          'Si la placa no es la misma, no subas. Cancela el viaje en la aplicación.',
          'Si la placa no es la misma, no suba. Cancele el viaje en la aplicación.',
        ) },
      { text: tv('Comparte tu viaje con un familiar.', 'Comparta su viaje con un familiar.'), detail: tv(
          'Busca el botón "Compartir viaje". Así tu familia sabe dónde vas.',
          'Busque el botón "Compartir viaje". Así su familia sabe dónde va.',
        ) },
      { text: tv('Al llegar, paga y califica el viaje.', 'Al llegar, pague y califique el viaje.'), detail: tv(
          'Paga como elegiste: en efectivo o con la aplicación. Luego toca las estrellas para calificar.',
          'Pague como eligió: en efectivo o con la aplicación. Luego toque las estrellas para calificar.',
        ) },
    ],
  },
  {
    skill: 'shopping',
    title: 'Comprar por internet',
    intro: tv('Vamos paso a paso. Compra solo en tiendas que conozcas.', 'Vamos paso a paso. Compre solo en tiendas que conozca.'),
    practicePath: '/practicar?categoria=compras',
    reviewed: false,
    steps: [
      { text: tv('Abre la aplicación de la tienda que conoces.', 'Abra la aplicación de la tienda que conoce.'), detail: tv(
          'Usa tiendas conocidas. Desconfía de precios demasiado baratos.',
          'Use tiendas conocidas. Desconfíe de precios demasiado baratos.',
        ) },
      { text: tv('Busca lo que quieres comprar.', 'Busque lo que quiere comprar.'), detail: tv(
          'Toca la lupa o la caja de búsqueda y escribe el nombre del producto.',
          'Toque la lupa o la caja de búsqueda y escriba el nombre del producto.',
        ) },
      { text: tv('Toca el producto y lee la descripción.', 'Toque el producto y lea la descripción.'), detail: tv(
          'Revisa el tamaño, el color y lo que opinan otras personas.',
          'Revise el tamaño, el color y lo que opinan otras personas.',
        ) },
      { text: tv('Agrégalo al carrito.', 'Agréguelo al carrito.'), detail: tv(
          'El carrito es la lista de lo que vas a comprar. Toca "Agregar al carrito".',
          'El carrito es la lista de lo que va a comprar. Toque "Agregar al carrito".',
        ) },
      { text: tv('Revisa el total, con el envío.', 'Revise el total, con el envío.'), detail: tv(
          'El total incluye el producto y lo que cuesta llevarlo a tu casa.',
          'El total incluye el producto y lo que cuesta llevarlo a su casa.',
        ) },
      { text: tv('Escribe tu dirección con cuidado.', 'Escriba su dirección con cuidado.'), detail: tv(
          'Revisa el número de la casa o del apartamento.',
          'Revise el número de la casa o del apartamento.',
        ) },
      { text: tv('Elige cómo pagar. Puedes pagar contra entrega.', 'Elija cómo pagar. Puede pagar contra entrega.'), detail: tv(
          'Pago contra entrega es pagar cuando te llega el producto, en efectivo.',
          'Pago contra entrega es pagar cuando le llega el producto, en efectivo.',
        ) },
      { text: tv('Confirma y revisa el seguimiento del pedido.', 'Confirme y revise el seguimiento del pedido.'), detail: tv(
          'El seguimiento te dice dónde va tu pedido y cuándo llega.',
          'El seguimiento le dice dónde va su pedido y cuándo llega.',
        ) },
    ],
  },
  {
    skill: 'whatsapp',
    title: 'Usar WhatsApp',
    intro: tv('Vamos paso a paso con lo más útil.', 'Vamos paso a paso con lo más útil.'),
    practicePath: '/practicar/chat',
    reviewed: false,
    steps: [
      { text: tv('Abre WhatsApp y toca el chat de la persona.', 'Abra WhatsApp y toque el chat de la persona.'), detail: tv(
          'Los chats son la lista de conversaciones. Toca el nombre de quien quieres hablar.',
          'Los chats son la lista de conversaciones. Toque el nombre de quien quiere hablar.',
        ) },
      { text: tv('Escribe tu mensaje en la caja de abajo.', 'Escriba su mensaje en la caja de abajo.'), detail: tv(
          'Toca la caja que dice "Mensaje". Aparece el teclado.',
          'Toque la caja que dice "Mensaje". Aparece el teclado.',
        ) },
      { text: tv('Toca la flecha para enviarlo.', 'Toque la flecha para enviarlo.'), detail: 'La flecha está a la derecha de la caja. Cuando aparece un chulito, ya se envió.' },
      { text: tv('Para un audio, mantén tocado el micrófono mientras hablas.', 'Para un audio, mantenga tocado el micrófono mientras habla.'), detail: tv(
          'Suelta el dedo cuando termines de hablar y el audio se envía.',
          'Suelte el dedo cuando termine de hablar y el audio se envía.',
        ) },
      { text: tv('Para una foto, toca la cámara.', 'Para una foto, toque la cámara.'), detail: tv(
          'Puedes tomar una foto nueva o elegir una que ya tengas.',
          'Puede tomar una foto nueva o elegir una que ya tenga.',
        ) },
      { text: tv('Para una videollamada, toca el dibujo de la cámara arriba.', 'Para una videollamada, toque el dibujo de la cámara arriba.'), detail: tv(
          'Está en la parte de arriba del chat. Para colgar, toca el botón rojo.',
          'Está en la parte de arriba del chat. Para colgar, toque el botón rojo.',
        ) },
      { text: tv('Para silenciar un grupo, toca su nombre arriba.', 'Para silenciar un grupo, toque su nombre arriba.'), detail: tv(
          'Busca "Silenciar notificaciones". Así no suena con cada mensaje.',
          'Busque "Silenciar notificaciones". Así no suena con cada mensaje.',
        ) },
    ],
  },
  {
    skill: 'phoneSettings',
    title: 'Configurar el celular',
    intro: tv('Vamos paso a paso. Todo está en Ajustes o Configuración.', 'Vamos paso a paso. Todo está en Ajustes o Configuración.'),
    practicePath: '/practicar/settings',
    reviewed: false,
    steps: [
      { text: tv('Abre Ajustes o Configuración. Tiene forma de engranaje.', 'Abra Ajustes o Configuración. Tiene forma de engranaje.'), detail: tv(
          'El engranaje es una rueda con dientes. Búscala en tus aplicaciones.',
          'El engranaje es una rueda con dientes. Búsquela en sus aplicaciones.',
        ) },
      { text: tv('Busca Pantalla para cambiar la letra y el brillo.', 'Busque Pantalla para cambiar la letra y el brillo.'), detail: tv(
          'Dentro de Pantalla hay "Tamaño de letra" y "Brillo". Mueve la barra hasta que te guste.',
          'Dentro de Pantalla hay "Tamaño de letra" y "Brillo". Mueva la barra hasta que le guste.',
        ) },
      { text: tv('Busca Sonido para cambiar el volumen.', 'Busque Sonido para cambiar el volumen.'), detail: tv(
          'También puedes usar los botones del costado del celular.',
          'También puede usar los botones del costado del celular.',
        ) },
      { text: tv('Busca Wifi para conectarte a internet de la casa.', 'Busque Wifi para conectarse a internet de la casa.'), detail: tv(
          'Toca el nombre de tu red y escribe la clave. Suele estar debajo del aparato de internet.',
          'Toque el nombre de su red y escriba la clave. Suele estar debajo del aparato de internet.',
        ) },
      { text: tv('Busca Actualización de software para actualizar.', 'Busque Actualización de software para actualizar.'), detail: tv(
          'Actualizar protege tu celular. Hazlo con el celular cargado y con wifi.',
          'Actualizar protege su celular. Hágalo con el celular cargado y con wifi.',
        ) },
      { text: tv('El modo avión apaga las llamadas. Revisa que esté apagado.', 'El modo avión apaga las llamadas. Revise que esté apagado.'), detail: tv(
          'Si no te entran llamadas, revisa que el dibujo del avión no esté encendido.',
          'Si no le entran llamadas, revise que el dibujo del avión no esté encendido.',
        ) },
    ],
  },
  {
    skill: 'security',
    title: 'Proteger tu celular y tus claves',
    intro: tv('Vamos paso a paso. Son cuidados sencillos.', 'Vamos paso a paso. Son cuidados sencillos.'),
    practicePath: '/practicar',
    reviewed: false,
    steps: [
      { text: tv('Usa una clave fácil de recordar para ti, difícil para otros.', 'Use una clave fácil de recordar para usted, difícil para otros.'), detail: tv(
          'No uses tu fecha de nacimiento ni 1234. Una frase corta que solo tú sepas es buena idea.',
          'No use su fecha de nacimiento ni 1234. Una frase corta que solo usted sepa es buena idea.',
        ) },
      { text: tv('No compartas tus claves ni códigos con nadie.', 'No comparta sus claves ni códigos con nadie.'), detail: tv(
          'Ni con alguien que dice ser del banco. Ningún banco pide claves por llamada.',
          'Ni con alguien que dice ser del banco. Ningún banco pide claves por llamada.',
        ) },
      { text: tv('Pon bloqueo de pantalla a tu celular.', 'Ponga bloqueo de pantalla a su celular.'), detail: tv(
          'En Ajustes, busca "Seguridad" o "Bloqueo de pantalla" y elige un PIN o tu huella.',
          'En Ajustes, busque "Seguridad" o "Bloqueo de pantalla" y elija un PIN o su huella.',
        ) },
      { text: tv('Actualiza el celular cuando te lo pida.', 'Actualice el celular cuando se lo pida.'), detail: 'Las actualizaciones arreglan problemas de seguridad.' },
      { text: tv('Revisa qué permisos tienen tus aplicaciones.', 'Revise qué permisos tienen sus aplicaciones.'), detail: tv(
          'En Ajustes, busca "Permisos". Quita el acceso a la cámara o al micrófono si una app no lo necesita.',
          'En Ajustes, busque "Permisos". Quite el acceso a la cámara o al micrófono si una app no lo necesita.',
        ) },
      { text: tv('Si dudas de algo, pregunta a un familiar antes de actuar.', 'Si duda de algo, pregunte a un familiar antes de actuar.'), detail: tv(
          'Tomarse un tiempo nunca es malo. Las estafas te apuran para que no pienses.',
          'Tomarse un tiempo nunca es malo. Las estafas le apuran para que no piense.',
        ) },
    ],
  },
]

export function getGuide(skill: SkillId): Guide | undefined {
  return guides.find((g) => g.skill === skill)
}
