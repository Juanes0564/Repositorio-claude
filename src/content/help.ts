import { tv } from './treatment'

/** Pantalla 10: ayuda humana (solo diseño), preguntas frecuentes y guía de instalación. */
export const help = {
  title: 'Ayuda',
  human: {
    title: 'Ayuda de una persona',
    body: tv(
      'Muy pronto podrás hablar con una persona guía que te acompañe.',
      'Muy pronto podrá hablar con una persona guía que le acompañe.',
    ),
    video: 'Llamada por videollamada',
    chat: 'Chat en tiempo real',
    soon: 'Próximamente',
    soonMessage: tv(
      'Esta ayuda todavía no está disponible. Mientras tanto, el copiloto y los talleres te pueden ayudar.',
      'Esta ayuda todavía no está disponible. Mientras tanto, el copiloto y los talleres le pueden ayudar.',
    ),
    copilot: 'Hablar con el copiloto',
    workshops: 'Ver los talleres',
    whatsapp: 'Escribir por WhatsApp',
  },
  faqTitle: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Vínculo es gratis?',
      a: tv('Sí. No cuesta nada y no tienes que crear una cuenta.', 'Sí. No cuesta nada y no tiene que crear una cuenta.'),
    },
    {
      q: '¿Las prácticas usan mi dinero o mis datos?',
      a: tv(
        'No. Todo es de mentira. Nunca escribas datos reales: la app te dice qué escribir para practicar.',
        'No. Todo es de mentira. Nunca escriba datos reales: la app le dice qué escribir para practicar.',
      ),
    },
    {
      q: '¿Qué guarda Vínculo?',
      a: tv(
        'Solo tu nombre, tus ajustes y tus avances, y todo queda en este celular. Puedes borrarlo en Perfil.',
        'Solo su nombre, sus ajustes y sus avances, y todo queda en este celular. Puede borrarlo en Perfil.',
      ),
    },
    {
      q: '¿El copiloto puede ver mi pantalla o usar mis aplicaciones?',
      a: tv(
        'No. Te dice qué hacer, paso a paso, y tú lo haces. Así tú tienes el control.',
        'No. Le dice qué hacer, paso a paso, y usted lo hace. Así usted tiene el control.',
      ),
    },
    {
      q: '¿Funciona sin internet?',
      a: tv(
        'Sí, después de abrirla una vez. Lo único que necesita internet es hablarle con el micrófono.',
        'Sí, después de abrirla una vez. Lo único que necesita internet es hablarle con el micrófono.',
      ),
    },
    {
      q: 'No veo bien las letras. ¿Qué hago?',
      a: tv(
        'Activa el modo sencillo en Perfil. La letra y los botones se hacen más grandes.',
        'Active el modo sencillo en Perfil. La letra y los botones se hacen más grandes.',
      ),
    },
    {
      q: 'Me llegó un mensaje raro. ¿Qué hago?',
      a: tv(
        'No respondas ni abras enlaces. Abre el copiloto y toca "No entiendo un mensaje". Si dudas, llama al número que aparece en tu tarjeta.',
        'No responda ni abra enlaces. Abra el copiloto y toque "No entiendo un mensaje". Si duda, llame al número que aparece en su tarjeta.',
      ),
    },
  ],
  install: {
    title: tv('Cómo instalar Vínculo en tu celular', 'Cómo instalar Vínculo en su celular'),
    intro: tv(
      'Así queda en tu pantalla de inicio, como cualquier aplicación, y abre sin internet.',
      'Así queda en su pantalla de inicio, como cualquier aplicación, y abre sin internet.',
    ),
    now: 'Instalar ahora',
    installed: tv('Vínculo ya está instalado en este celular.', 'Vínculo ya está instalado en este celular.'),
    android: 'En Android (Chrome)',
    androidSteps: [
      tv('Abre Vínculo en Chrome.', 'Abra Vínculo en Chrome.'),
      tv('Toca los tres puntos de arriba a la derecha.', 'Toque los tres puntos de arriba a la derecha.'),
      tv('Toca "Instalar aplicación" o "Agregar a la pantalla principal".', 'Toque "Instalar aplicación" o "Agregar a la pantalla principal".'),
      tv('Toca "Instalar". Listo: busca el ícono de Vínculo.', 'Toque "Instalar". Listo: busque el ícono de Vínculo.'),
    ],
    iphone: 'En iPhone (Safari)',
    iphoneSteps: [
      tv('Abre Vínculo en Safari.', 'Abra Vínculo en Safari.'),
      tv('Toca el botón de compartir: un cuadro con una flecha hacia arriba.', 'Toque el botón de compartir: un cuadro con una flecha hacia arriba.'),
      tv('Baja y toca "Agregar a inicio".', 'Baje y toque "Agregar a inicio".'),
      tv('Toca "Agregar". Listo: busca el ícono de Vínculo.', 'Toque "Agregar". Listo: busque el ícono de Vínculo.'),
    ],
  },
}
