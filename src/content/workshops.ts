import type { IllustrationName } from '../components/Illustration'
import type { SkillId } from '../lib/storage'
import type { Copy } from './types'
import { tv } from './treatment'

export type WorkshopCategory = 'banks' | 'health' | 'security' | 'more'

export interface WorkshopCard {
  illustration: IllustrationName
  title: Copy
  /** Una o dos frases. */
  body: Copy
  /** Consejo opcional "Ojo". */
  tip?: Copy
}

export interface QuizQuestion {
  question: Copy
  options: Copy[]
  /** Posición de la respuesta correcta (0 = la primera). */
  answer: number
  explanation: Copy
}

export interface Workshop {
  id: string
  skill: SkillId
  category: WorkshopCategory
  title: Copy
  summary: Copy
  minutes: number
  level: 'basic' | 'intermediate'
  cards: WorkshopCard[]
  /**
   * Video opcional de YouTube. Pega aquí el enlace normal del video (el de "Compartir").
   * La app lo muestra con el modo de privacidad ampliada (youtube-nocookie.com). Ver docs/CONTENIDO.md.
   */
  videoUrl?: string
  /** "Mini repaso" opcional de 3 preguntas. */
  quiz?: QuizQuestion[]
  /** Contenido revisado por una persona del equipo. false = borrador. */
  reviewed: boolean
}

/** Los 8 talleres (secciones 7 y 13 del brief). Todo es borrador hasta que el equipo lo revise. */
export const workshops: Workshop[] = [
  {
    id: 'transferencias',
    skill: 'transfers',
    category: 'banks',
    title: 'Enviar dinero sin miedo',
    summary: tv(
      'Cómo hacer una transferencia desde la app de tu banco.',
      'Cómo hacer una transferencia desde la app de su banco.',
    ),
    minutes: 5,
    level: 'basic',
    reviewed: false,
    cards: [
      {
        illustration: 'bank',
        title: 'Qué es una transferencia',
        body: tv(
          'Es enviar dinero desde tu cuenta a la de otra persona. Se hace con la aplicación de tu banco, sin ir a la oficina.',
          'Es enviar dinero desde su cuenta a la de otra persona. Se hace con la aplicación de su banco, sin ir a la oficina.',
        ),
      },
      {
        illustration: 'phone',
        title: tv(
          'Lo que necesitas',
          'Lo que necesita',
        ),
        body: tv(
          'La aplicación de tu banco, tu clave y los datos de quien recibe el dinero.',
          'La aplicación de su banco, su clave y los datos de quien recibe el dinero.',
        ),
        tip: tv(
          'Tu clave es solo tuya. No se la digas a nadie.',
          'Su clave es solo suya. No se la diga a nadie.',
        ),
      },
      {
        illustration: 'check',
        title: tv(
          'Revisa dos veces',
          'Revise dos veces',
        ),
        body: tv(
          'Antes de confirmar, lee el nombre de la persona y el valor. Mira bien los ceros.',
          'Antes de confirmar, lea el nombre de la persona y el valor. Mire bien los ceros.',
        ),
        tip: 'Una transferencia enviada es difícil de devolver.',
      },
      {
        illustration: 'code',
        title: 'El código de confirmación',
        body: tv(
          'A veces el banco te manda un código por mensaje. Escríbelo tú en la aplicación.',
          'A veces el banco le manda un código por mensaje. Escríbalo usted en la aplicación.',
        ),
        tip: tv(
          'Nadie del banco te pedirá ese código por llamada.',
          'Nadie del banco le pedirá ese código por llamada.',
        ),
      },
      {
        illustration: 'receipt',
        title: tv(
          'Guarda el comprobante',
          'Guarde el comprobante',
        ),
        body: tv(
          'El comprobante dice que el dinero se envió. Guárdalo o tómale una foto a la pantalla.',
          'El comprobante dice que el dinero se envió. Guárdelo o tómele una foto a la pantalla.',
        ),
      },
    ],
    quiz: [
      {
        question: tv(
          '¿Qué revisas antes de confirmar?',
          '¿Qué revisa antes de confirmar?',
        ),
        options: ['El nombre y el valor', 'El color de la pantalla', 'La hora'],
        answer: 0,
        explanation: 'El nombre y el valor. Así el dinero llega a quien es y por lo que es.',
      },
      {
        question: tv(
          'Alguien llama, dice ser del banco y pide tu código. ¿Qué haces?',
          'Alguien llama, dice ser del banco y pide su código. ¿Qué hace?',
        ),
        options: ['Se lo digo', 'Cuelgo y no se lo digo'],
        answer: 1,
        explanation: tv(
          'Cuelga. El banco nunca te pide códigos por llamada.',
          'Cuelgue. El banco nunca le pide códigos por llamada.',
        ),
      },
      {
        question: '¿Para qué sirve el comprobante?',
        options: ['Para cambiar mi clave', 'Para saber que el dinero se envió'],
        answer: 1,
        explanation: tv(
          'El comprobante prueba que hiciste la transferencia.',
          'El comprobante prueba que hizo la transferencia.',
        ),
      },
    ],
  },
  {
    id: 'citas-medicas',
    skill: 'medical',
    category: 'health',
    title: 'Sacar una cita médica',
    summary: tv(
      'Pide tu cita en la EPS desde el celular, sin hacer fila.',
      'Pida su cita en la EPS desde el celular, sin hacer fila.',
    ),
    minutes: 5,
    level: 'basic',
    reviewed: false,
    cards: [
      {
        illustration: 'clinic',
        title: tv(
          'Tu EPS en el celular',
          'Su EPS en el celular',
        ),
        body: tv(
          'Muchas EPS tienen aplicación o página para pedir citas. Así no tienes que hacer fila.',
          'Muchas EPS tienen aplicación o página para pedir citas. Así no tiene que hacer fila.',
        ),
      },
      {
        illustration: 'lock',
        title: tv(
          'Ten a mano tu documento',
          'Tenga a mano su documento',
        ),
        body: tv(
          'Para entrar te piden tu número de documento y una clave.',
          'Para entrar le piden su número de documento y una clave.',
        ),
        tip: tv(
          'Si olvidas la clave, la aplicación tiene una opción para crear otra.',
          'Si olvida la clave, la aplicación tiene una opción para crear otra.',
        ),
      },
      {
        illustration: 'calendar',
        title: tv(
          'Elige con calma',
          'Elija con calma',
        ),
        body: tv(
          'Escoge el tipo de cita, la sede, el día y la hora. Puedes mirar varias opciones antes de decidir.',
          'Escoja el tipo de cita, la sede, el día y la hora. Puede mirar varias opciones antes de decidir.',
        ),
      },
      {
        illustration: 'check',
        title: tv(
          'Confirma y anota',
          'Confirme y anote',
        ),
        body: tv(
          'Al confirmar, la aplicación te muestra un resumen. Anota la fecha, la hora y la sede.',
          'Al confirmar, la aplicación le muestra un resumen. Anote la fecha, la hora y la sede.',
        ),
        tip: tv(
          'Llega unos minutos antes y lleva tu documento.',
          'Llegue unos minutos antes y lleve su documento.',
        ),
      },
      {
        illustration: 'hangup',
        title: tv(
          'Si no puedes ir',
          'Si no puede ir',
        ),
        body: tv(
          'Cancela la cita en la misma aplicación. Así otra persona puede usar ese turno.',
          'Cancele la cita en la misma aplicación. Así otra persona puede usar ese turno.',
        ),
      },
    ],
    quiz: [
      {
        question: tv(
          '¿Qué necesitas para entrar a la aplicación de tu EPS?',
          '¿Qué necesita para entrar a la aplicación de su EPS?',
        ),
        options: ['Mi documento y mi clave', 'Una foto'],
        answer: 0,
        explanation: tv(
          'Con tu documento y tu clave puedes entrar.',
          'Con su documento y su clave puede entrar.',
        ),
      },
      {
        question: tv(
          'Ya sacaste la cita. ¿Qué haces ahora?',
          'Ya sacó la cita. ¿Qué hace ahora?',
        ),
        options: ['Nada más', 'Anoto la fecha y la hora'],
        answer: 1,
        explanation: tv(
          'Anotarla te ayuda a no olvidarla.',
          'Anotarla le ayuda a no olvidarla.',
        ),
      },
      {
        question: tv(
          'No puedes ir a la cita. ¿Qué es lo mejor?',
          'No puede ir a la cita. ¿Qué es lo mejor?',
        ),
        options: ['Cancelarla en la aplicación', 'No ir y ya'],
        answer: 0,
        explanation: 'Al cancelarla, otra persona puede usar ese turno.',
      },
    ],
  },
  {
    id: 'transporte',
    skill: 'transport',
    category: 'more',
    title: 'Pedir un transporte seguro',
    summary: tv(
      'Pide un carro desde el celular y viaja tranquilo.',
      'Pida un carro desde el celular y viaje tranquilo.',
    ),
    minutes: 5,
    level: 'basic',
    reviewed: false,
    cards: [
      {
        illustration: 'map',
        title: 'Cómo funciona',
        body: tv(
          'Escribes a dónde vas, ves el precio y un conductor viene por ti.',
          'Usted escribe a dónde va, ve el precio y un conductor viene por usted.',
        ),
      },
      {
        illustration: 'car',
        title: tv(
          'Mira el precio antes',
          'Mire el precio antes',
        ),
        body: tv(
          'La aplicación te dice cuánto cuesta antes de pedir. Puedes elegir otro tipo de viaje.',
          'La aplicación le dice cuánto cuesta antes de pedir. Puede elegir otro tipo de viaje.',
        ),
      },
      {
        illustration: 'plate',
        title: tv(
          'Revisa la placa',
          'Revise la placa',
        ),
        body: tv(
          'Antes de subir, compara la placa y el nombre del conductor con los de la aplicación.',
          'Antes de subir, compare la placa y el nombre del conductor con los de la aplicación.',
        ),
        tip: tv(
          'Si no coinciden, no subas. Cancela el viaje.',
          'Si no coinciden, no suba. Cancele el viaje.',
        ),
      },
      {
        illustration: 'family',
        title: tv(
          'Comparte tu viaje',
          'Comparta su viaje',
        ),
        body: tv(
          'Usa la opción "Compartir viaje". Así un familiar sabe por dónde vas.',
          'Use la opción "Compartir viaje". Así un familiar sabe por dónde va.',
        ),
      },
      {
        illustration: 'check',
        title: 'Al llegar',
        body: tv(
          'Paga como elegiste y califica el viaje con estrellas.',
          'Pague como eligió y califique el viaje con estrellas.',
        ),
      },
    ],
    quiz: [
      {
        question: tv(
          '¿Qué revisas antes de subir al carro?',
          '¿Qué revisa antes de subir al carro?',
        ),
        options: ['La placa y el nombre del conductor', 'El color de los asientos'],
        answer: 0,
        explanation: tv(
          'Si la placa coincide, es el carro que pediste.',
          'Si la placa coincide, es el carro que pidió.',
        ),
      },
      {
        question: tv(
          'La placa no coincide. ¿Qué haces?',
          'La placa no coincide. ¿Qué hace?',
        ),
        options: ['Subo igual', 'No subo y cancelo el viaje'],
        answer: 1,
        explanation: tv(
          'Nunca subas a un carro que no coincide con la aplicación.',
          'Nunca suba a un carro que no coincide con la aplicación.',
        ),
      },
      {
        question: '¿Para qué sirve "Compartir viaje"?',
        options: ['Para que un familiar sepa por dónde voy', 'Para pagar menos'],
        answer: 0,
        explanation: tv(
          'Tu familia puede seguir tu viaje y saber que llegaste bien.',
          'Su familia puede seguir su viaje y saber que llegó bien.',
        ),
      },
    ],
  },
  {
    id: 'compras',
    skill: 'shopping',
    category: 'more',
    title: 'Comprar por internet',
    summary: tv(
      'Compra sin salir de casa y reconoce una tienda confiable.',
      'Compre sin salir de casa y reconozca una tienda confiable.',
    ),
    minutes: 6,
    level: 'basic',
    reviewed: false,
    cards: [
      {
        illustration: 'shop',
        title: 'Tiendas confiables',
        body: tv(
          'Compra en tiendas conocidas. Desconfía de precios demasiado bajos.',
          'Compre en tiendas conocidas. Desconfíe de precios demasiado bajos.',
        ),
      },
      {
        illustration: 'cart',
        title: 'El carrito',
        body: tv(
          'El carrito es la lista de lo que vas a comprar. Puedes quitar cosas antes de pagar.',
          'El carrito es la lista de lo que va a comprar. Puede quitar cosas antes de pagar.',
        ),
      },
      {
        illustration: 'receipt',
        title: tv(
          'Revisa el total',
          'Revise el total',
        ),
        body: tv(
          'El total suma el producto y el envío. Léelo con calma antes de seguir.',
          'El total suma el producto y el envío. Léalo con calma antes de seguir.',
        ),
      },
      {
        illustration: 'check',
        title: tv(
          'Paga con cuidado',
          'Pague con cuidado',
        ),
        body: tv(
          'Puedes pagar contra entrega: pagas cuando recibes el producto.',
          'Puede pagar contra entrega: paga cuando recibe el producto.',
        ),
        tip: tv(
          'Nunca pagues con transferencia a una persona que no conoces.',
          'Nunca pague con transferencia a una persona que no conoce.',
        ),
      },
      {
        illustration: 'warning',
        title: 'Señales de alerta',
        body: tv(
          'Desconfía si la tienda no tiene datos de contacto, solo acepta transferencias o te apura.',
          'Desconfíe si la tienda no tiene datos de contacto, solo acepta transferencias o le apura.',
        ),
      },
    ],
    quiz: [
      {
        question: '¿Qué es pagar contra entrega?',
        options: ['Pagar cuando recibo el producto', 'Pagar antes de elegir'],
        answer: 0,
        explanation: tv(
          'Pagas cuando el producto llega a tus manos.',
          'Paga cuando el producto llega a sus manos.',
        ),
      },
      {
        question: tv(
          'Un precio es demasiado bajo. ¿Qué piensas?',
          'Un precio es demasiado bajo. ¿Qué piensa?',
        ),
        options: ['Que es una ganga segura', 'Que puede ser una estafa'],
        answer: 1,
        explanation: 'Los precios demasiado bajos son una señal de alerta.',
      },
      {
        question: '¿Qué incluye el total?',
        options: ['Solo el producto', 'El producto y el envío'],
        answer: 1,
        explanation: 'El total suma el producto y lo que cuesta llevarlo.',
      },
    ],
  },
  {
    id: 'seguridad',
    skill: 'security',
    category: 'security',
    title: tv(
      'Cuida tus claves y tu celular',
      'Cuide sus claves y su celular',
    ),
    summary: tv(
      'Cuidados sencillos para proteger tu celular y tus cuentas.',
      'Cuidados sencillos para proteger su celular y sus cuentas.',
    ),
    minutes: 6,
    level: 'basic',
    reviewed: false,
    cards: [
      {
        illustration: 'lock',
        title: tv(
          'Una clave fácil para ti',
          'Una clave fácil para usted',
        ),
        body: tv(
          'Usa una frase corta que solo tú conozcas. Evita 1234 y tu fecha de nacimiento.',
          'Use una frase corta que solo usted conozca. Evite 1234 y su fecha de nacimiento.',
        ),
      },
      {
        illustration: 'code',
        title: 'Los códigos son secretos',
        body: tv(
          'Los códigos que llegan por mensaje son solo para ti. No los compartas con nadie.',
          'Los códigos que llegan por mensaje son solo para usted. No los comparta con nadie.',
        ),
        tip: 'Ni con alguien que dice ser del banco.',
      },
      {
        illustration: 'phone',
        title: tv(
          'Bloquea tu pantalla',
          'Bloquee su pantalla',
        ),
        body: tv(
          'Pon un PIN o tu huella. Si pierdes el celular, nadie podrá abrirlo.',
          'Ponga un PIN o su huella. Si pierde el celular, nadie podrá abrirlo.',
        ),
      },
      {
        illustration: 'update',
        title: tv(
          'Actualiza el celular',
          'Actualice el celular',
        ),
        body: tv(
          'Las actualizaciones arreglan problemas de seguridad. Hazlo con wifi y batería.',
          'Las actualizaciones arreglan problemas de seguridad. Hágalo con wifi y batería.',
        ),
      },
      {
        illustration: 'shield',
        title: tv(
          'Revisa los permisos',
          'Revise los permisos',
        ),
        body: tv(
          'Si una aplicación no necesita tu cámara o tu micrófono, quítale ese permiso en Ajustes.',
          'Si una aplicación no necesita su cámara o su micrófono, quítele ese permiso en Ajustes.',
        ),
      },
    ],
    quiz: [
      {
        question: '¿Cuál es una mejor clave?',
        options: ['1234', 'Una frase corta que solo yo sé'],
        answer: 1,
        explanation: tv(
          'Una frase que solo tú conoces es difícil de adivinar.',
          'Una frase que solo usted conoce es difícil de adivinar.',
        ),
      },
      {
        question: tv(
          'Te llega un código por mensaje. ¿A quién se lo das?',
          'Le llega un código por mensaje. ¿A quién se lo da?',
        ),
        options: ['A nadie', 'Al que me llame'],
        answer: 0,
        explanation: tv(
          'Los códigos son solo para ti.',
          'Los códigos son solo para usted.',
        ),
      },
      {
        question: '¿Para qué sirve bloquear la pantalla?',
        options: ['Para que nadie abra mi celular', 'Para ahorrar batería'],
        answer: 0,
        explanation: tv(
          'Si pierdes el celular, nadie podrá abrirlo.',
          'Si pierde el celular, nadie podrá abrirlo.',
        ),
      },
    ],
  },
  {
    id: 'whatsapp',
    skill: 'whatsapp',
    category: 'more',
    title: 'WhatsApp paso a paso',
    summary: tv(
      'Escribe, manda audios y fotos, y haz videollamadas.',
      'Escriba, mande audios y fotos, y haga videollamadas.',
    ),
    minutes: 6,
    level: 'basic',
    reviewed: false,
    cards: [
      {
        illustration: 'chat',
        title: 'Los chats',
        body: tv(
          'Al abrir WhatsApp ves tus conversaciones. Toca un nombre para hablar con esa persona.',
          'Al abrir WhatsApp ve sus conversaciones. Toque un nombre para hablar con esa persona.',
        ),
      },
      {
        illustration: 'chat',
        title: 'Escribir y enviar',
        body: tv(
          'Escribe en la caja de abajo y toca la flecha. Un chulito quiere decir que se envió.',
          'Escriba en la caja de abajo y toque la flecha. Un chulito quiere decir que se envió.',
        ),
      },
      {
        illustration: 'mic',
        title: 'Mandar un audio',
        body: tv(
          'Mantén tocado el micrófono mientras hablas. Suelta el dedo para enviarlo.',
          'Mantenga tocado el micrófono mientras habla. Suelte el dedo para enviarlo.',
        ),
        tip: tv(
          'Si te equivocas, desliza hacia la izquierda para borrarlo.',
          'Si se equivoca, deslice hacia la izquierda para borrarlo.',
        ),
      },
      {
        illustration: 'photo',
        title: 'Mandar una foto',
        body: tv(
          'Toca la cámara. Puedes tomar una foto nueva o elegir una que ya tienes.',
          'Toque la cámara. Puede tomar una foto nueva o elegir una que ya tiene.',
        ),
      },
      {
        illustration: 'video',
        title: 'Videollamadas',
        body: tv(
          'Toca el dibujo de la cámara arriba del chat. Para colgar, toca el botón rojo.',
          'Toque el dibujo de la cámara arriba del chat. Para colgar, toque el botón rojo.',
        ),
      },
      {
        illustration: 'group',
        title: 'Los grupos',
        body: tv(
          'Si un grupo suena mucho, toca su nombre y elige "Silenciar notificaciones".',
          'Si un grupo suena mucho, toque su nombre y elija "Silenciar notificaciones".',
        ),
      },
    ],
    quiz: [
      {
        question: tv(
          '¿Cómo mandas un audio?',
          '¿Cómo manda un audio?',
        ),
        options: ['Mantengo tocado el micrófono mientras hablo', 'Toco la cámara'],
        answer: 0,
        explanation: tv(
          'Mantén tocado el micrófono y suelta para enviar.',
          'Mantenga tocado el micrófono y suelte para enviar.',
        ),
      },
      {
        question: '¿Qué hago si un grupo suena mucho?',
        options: ['Lo silencio', 'Apago el celular'],
        answer: 0,
        explanation: tv(
          'Silenciar el grupo quita el sonido sin salirte.',
          'Silenciar el grupo quita el sonido sin salirse.',
        ),
      },
      {
        question: tv(
          '¿Cómo cuelgas una videollamada?',
          '¿Cómo cuelga una videollamada?',
        ),
        options: ['Con el botón rojo', 'Apagando la pantalla'],
        answer: 0,
        explanation: 'El botón rojo termina la llamada.',
      },
    ],
  },
  {
    id: 'celular-comodo',
    skill: 'phoneSettings',
    category: 'more',
    title: tv(
      'Tu celular más cómodo',
      'Su celular más cómodo',
    ),
    summary: tv(
      'Letra más grande, brillo, volumen y más, en los ajustes de tu celular.',
      'Letra más grande, brillo, volumen y más, en los ajustes de su celular.',
    ),
    minutes: 5,
    level: 'basic',
    reviewed: false,
    cards: [
      {
        illustration: 'settings',
        title: 'Los ajustes',
        body: 'Todo se cambia en Ajustes o Configuración. Tiene el dibujo de un engranaje.',
        tip: 'Vínculo tiene su propio modo sencillo, en Perfil.',
      },
      {
        illustration: 'text',
        title: 'Letra más grande',
        body: tv(
          'En Ajustes, busca "Pantalla" y luego "Tamaño de letra". Mueve la barra hasta leer cómodo.',
          'En Ajustes, busque "Pantalla" y luego "Tamaño de letra". Mueva la barra hasta leer cómodo.',
        ),
      },
      {
        illustration: 'sun',
        title: 'El brillo',
        body: tv(
          'En "Pantalla" está el brillo. Súbelo si ves la pantalla muy oscura.',
          'En "Pantalla" está el brillo. Súbalo si ve la pantalla muy oscura.',
        ),
      },
      {
        illustration: 'volume',
        title: 'El volumen',
        body: tv(
          'Usa los botones del costado del celular. También está en "Sonido".',
          'Use los botones del costado del celular. También está en "Sonido".',
        ),
      },
      {
        illustration: 'wifi',
        title: 'El wifi de la casa',
        body: tv(
          'En "Wifi", toca el nombre de tu red y escribe su clave.',
          'En "Wifi", toque el nombre de su red y escriba su clave.',
        ),
      },
      {
        illustration: 'plane',
        title: 'El modo avión',
        body: tv(
          'Este modo apaga las llamadas e internet. Si no te entran llamadas, revisa que esté apagado.',
          'Este modo apaga las llamadas e internet. Si no le entran llamadas, revise que esté apagado.',
        ),
      },
    ],
    quiz: [
      {
        question: tv(
          '¿Dónde cambias el tamaño de la letra?',
          '¿Dónde cambia el tamaño de la letra?',
        ),
        options: ['En Ajustes, en Pantalla', 'En la cámara'],
        answer: 0,
        explanation: 'Está en Ajustes, dentro de Pantalla.',
      },
      {
        question: tv(
          'No te entran llamadas. ¿Qué revisas?',
          'No le entran llamadas. ¿Qué revisa?',
        ),
        options: ['Que el modo avión esté apagado', 'El color del fondo'],
        answer: 0,
        explanation: 'Con el modo avión encendido no entran llamadas.',
      },
      {
        question: '¿Qué dibujo tiene Ajustes?',
        options: ['Un engranaje', 'Una estrella'],
        answer: 0,
        explanation: 'Ajustes tiene la forma de una rueda con dientes.',
      },
    ],
  },
  {
    id: 'estafas',
    skill: 'scams',
    category: 'security',
    title: 'Reconocer estafas',
    summary: tv(
      'Señales para darte cuenta a tiempo y qué hacer si dudas.',
      'Señales para darse cuenta a tiempo y qué hacer si duda.',
    ),
    minutes: 6,
    level: 'basic',
    reviewed: false,
    cards: [
      {
        illustration: 'hurry',
        title: tv(
          'Te apuran',
          'Le apuran',
        ),
        body: tv(
          'Las estafas te apuran para que no pienses. Si alguien te presiona, para y respira.',
          'Las estafas le apuran para que no piense. Si alguien le presiona, pare y respire.',
        ),
      },
      {
        illustration: 'lock',
        title: 'Claves y códigos, nunca',
        body: 'Ningún banco pide claves ni códigos por llamada o por mensaje.',
      },
      {
        illustration: 'link',
        title: tv(
          'Enlaces que no esperabas',
          'Enlaces que no esperaba',
        ),
        body: tv(
          'No abras enlaces de mensajes que no esperabas, aunque digan que son del banco.',
          'No abra enlaces de mensajes que no esperaba, aunque digan que son del banco.',
        ),
      },
      {
        illustration: 'gift',
        title: 'Premios inesperados',
        body: tv(
          'Si no participaste en nada, no ganaste nada. No pagues para recibir un premio.',
          'Si no participó en nada, no ganó nada. No pague para recibir un premio.',
        ),
      },
      {
        illustration: 'family',
        title: 'El familiar en apuros',
        body: tv(
          'Si alguien dice ser tu familiar y pide plata urgente, cuelga. Llámalo tú a su número de siempre.',
          'Si alguien dice ser su familiar y pide plata urgente, cuelgue. Llámelo usted a su número de siempre.',
        ),
      },
      {
        illustration: 'hangup',
        title: tv(
          'Si dudas, cuelga',
          'Si duda, cuelgue',
        ),
        body: tv(
          'Llama al número que aparece en tu tarjeta. Consulta con un familiar antes de actuar.',
          'Llame al número que aparece en su tarjeta. Consulte con un familiar antes de actuar.',
        ),
      },
    ],
    quiz: [
      {
        question: tv(
          'Te llaman del "banco" y piden tu clave. ¿Es seguro?',
          'Le llaman del "banco" y piden su clave. ¿Es seguro?',
        ),
        options: ['Es seguro', 'Es una estafa'],
        answer: 1,
        explanation: 'Ningún banco pide claves por llamada.',
      },
      {
        question: tv(
          'Te llega un mensaje: "Ganaste un premio, paga el envío". ¿Qué haces?',
          'Le llega un mensaje: "Ganaste un premio, paga el envío". ¿Qué hace?',
        ),
        options: ['Pago el envío', 'Borro el mensaje'],
        answer: 1,
        explanation: tv(
          'Si no participaste, no ganaste. Es una estafa.',
          'Si no participó, no ganó. Es una estafa.',
        ),
      },
      {
        question: tv(
          'Alguien dice ser tu nieto y pide plata urgente. ¿Qué haces?',
          'Alguien dice ser su nieto y pide plata urgente. ¿Qué hace?',
        ),
        options: ['Cuelgo y lo llamo a su número de siempre', 'Envío la plata rápido'],
        answer: 0,
        explanation: tv(
          'Llamarlo tú a su número de siempre te protege.',
          'Llamarlo usted a su número de siempre le protege.',
        ),
      },
    ],
  },
]

export function getWorkshop(id: string): Workshop | undefined {
  return workshops.find((w) => w.id === id)
}

export function workshopForSkill(skill: SkillId): Workshop | undefined {
  return workshops.find((w) => w.skill === skill)
}
