# Vínculo — Brief del proyecto

> Fuente de verdad del proyecto. Copia completa (secciones 1 a 16) del prompt maestro. Reléelo cuando haya dudas.

## 1. Contexto y objetivo

* Qué es: una app para que adultos mayores en Colombia aprendan y practiquen trámites digitales (bancos, salud/EPS, transporte, compras, WhatsApp, seguridad) sin riesgo, acompañados por voz.
* Lema: "Aprende, practica y hazlo tú".
* Origen: proyecto universitario de un equipo de estudiantes de comunicación. El objetivo es una versión real que se pueda usar con adultos mayores, construida como prototipo funcional de calidad.
* Usuario principal: personas de 60 años o más, con poca experiencia digital, que pueden tener visión reducida, pulso menos firme, miedo a equivocarse y miedo a las estafas. Usan sobre todo Android de gama media o baja. Hablan español de Colombia.
* Usuarios secundarios: familiares y jóvenes "guías" que los acompañan.
* Idea central: una sola app que integra cuatro cosas: (1) un simulador donde practican sin consecuencias reales, (2) un copiloto de voz que los guía paso a paso, (3) talleres guiados y (4) un modo sencillo con la interfaz simplificada. Además, un Pasaporte Digital con su progreso y una sección de ayuda humana.

## 2. Reglas innegociables

1. 100 % gratis, para construir, publicar, usar y mantener. Prohibido: APIs de pago, claves de API, planes de prueba que expiren, servicios que pidan tarjeta de crédito. Toda dependencia debe ser de código abierto y gratuita (MIT, Apache, OFL o similar); anota cada una con su licencia en `docs/DEPENDENCIAS.md`.
2. Independiente de Claude y de cualquier IA externa. El código final debe funcionar sin Claude Code y sin llamar a ningún servicio de IA. Nada en la app consulta a Anthropic, OpenAI, Google AI ni similares.
3. Sin backend, sin cuentas, sin base de datos en la nube. Todo se guarda en el dispositivo (localStorage o IndexedDB).
4. Sin rastreo y sin recursos externos en tiempo de ejecución: nada de analytics, cookies de terceros, CDNs, fuentes o imágenes remotas. Todo va empaquetado en la app. Excepciones documentadas (solo dos): (a) el reconocimiento de voz del navegador (ver sección 6), que en Chrome envía el audio al proveedor del navegador; debe haber un aviso claro en lenguaje sencillo antes del primer uso del micrófono y una alternativa sin voz siempre disponible; (b) los videos de YouTube que el equipo agregue más adelante (sección 7), que solo cargan cuando existe un `videoUrl` y siempre con modo de privacidad ampliada.
5. Plataformas ficticias. Dentro del simulador nunca uses logos, nombres ni colores de bancos, EPS ni apps reales. Usa los nombres ficticios de la sección 5 y paletas propias que no imiten a ninguna marca colombiana conocida (evita, por ejemplo, el rojo de Davivienda, el amarillo de Bancolombia, el morado/rosa de Nequi, el negro de Uber, el naranja de Rappi o el amarillo de Mercado Libre). En los textos de los talleres sí se puede nombrar una app real (por ejemplo "WhatsApp") como referencia, pero sin reproducir sus logos.
6. Seguridad en las prácticas. El simulador nunca pide datos reales. Todas las pantallas de práctica llevan una cinta visible "PRÁCTICA – no es real". Las claves y códigos que se "escriben" son de práctica y se indica cuáles (por ejemplo, "escribe 1234").
7. Honestidad en la interfaz. Nada de indicadores falsos (como "guía en línea" o "3 personas conectadas"). La ayuda humana es solo diseño por ahora y se marca "Próximamente".
8. Los textos sensibles se revisan. El contenido sobre seguridad y estafas lo escribes tú como borrador, pero cada pieza lleva el campo `reviewed: false` hasta que una persona del equipo la revise. No incluyas números de teléfono ni enlaces reales de bancos o entidades (cambian y pueden quedar desactualizados); di "el número que aparece en tu tarjeta".

## 3. Decisiones técnicas

* Tipo de app: PWA (app web instalable) que se publica como sitio estático gratis (GitHub Pages, Netlify o Cloudflare Pages). Funciona en Android y iPhone desde un enlace y se puede "instalar" en la pantalla de inicio.
* Stack recomendado: React + Vite + TypeScript; `vite-plugin-pwa` para manifiesto y trabajo sin conexión; HashRouter (compatible con GitHub Pages); CSS propio con variables, sin frameworks pesados; íconos con `lucide-react` (se empaqueta local); tipografía legible autoalojada (por ejemplo Atkinson Hyperlegible vía `@fontsource`, con `system-ui` de respaldo); `Fuse.js` opcional para coincidencia aproximada en el copiloto; Vitest para pruebas. Si propones otra cosa, justifícalo en `docs/DECISIONES.md`.
* Textos fuera de los componentes: todo texto visible va en archivos de contenido (`src/content/`), nunca incrustado en los componentes, para que el equipo pueda editarlo sin tocar el código. Idioma de la interfaz: español de Colombia. Código y nombres de archivos en inglés.
* Persistencia local: una sola clave versionada (por ejemplo `vinculo.v1`) con: perfil (nombre), ajustes (modo sencillo, tamaño de letra, alto contraste, voz activada, velocidad de voz), progreso por habilidad y si ya vio la bienvenida. Incluye un campo de versión para poder migrar datos más adelante. Botón "Borrar mis datos" en Perfil.
* Presentación como prototipo en celular: en pantallas anchas (≥ 768 px) la app se muestra centrada dentro de un marco de teléfono (aprox. 390 × 844 px) con barra de estado decorativa (hora, señal, batería, marcada `aria-hidden`). En pantallas angostas (celular real) ocupa toda la pantalla sin marco. Un parámetro de URL (`?frame=0`) apaga el marco.
* Imágenes: no tienes fotos ni ilustraciones finales. Crea logo e ilustraciones simples y originales como SVG (por ejemplo, un logo de dos formas redondeadas verde y amarilla inspirado en el de la referencia, sin copiarlo literalmente) y deja una lista de lo que el equipo debe reemplazar en `docs/ASSETS.md`. No uses emojis como íconos.
* Diseño responsivo basado en `rem` desde el primer día, para que el tamaño de letra del modo sencillo escale toda la interfaz.

## 4. Pantallas (según el recorrido de 10 pantallas)

La navegación inferior tiene cuatro pestañas: Inicio, Mis avances, Ayuda, Perfil. Tomando la imagen como guía visual:

1. Inicio / bienvenida. Logo, lema "Aprende, practica y hazlo tú", botón grande "Comenzar". La primera vez pide solo el nombre de pila (opcional, con voz o teclado) y si prefiere activar el modo sencillo.
2. Menú principal. Saludo con el nombre ("¡Hola, Marta!"), buscador "Pregúntame lo que necesites…" con micrófono (usa el motor del copiloto), cuatro tarjetas grandes (Simular y practicar, Hacerlo con ayuda (Copiloto), Tutoriales y talleres, Ajustar mi modo sencillo) y accesos rápidos (Bancos, EPS/Salud, Transporte, Compras).
3. Selección de plataforma. Lista con filtros (Más usadas, Bancos, Salud, Transporte, Compras) de las plataformas ficticias de la sección 5.
4. Simulador paso a paso. Barra de progreso ("Paso 2 de 6"), la pantalla simulada de la plataforma, una nota del coach con la instrucción actual (con el número del paso) y botones "Volver" y "Siguiente".
5. Copiloto en tiempo real. Pantalla oscura con un avatar amigable, mensaje "Estoy aquí para ayudarte. ¿Qué quieres hacer?", botones de sugerencia ("Quiero hacer una transferencia", "Necesito sacar una cita médica", "Quiero pedir un transporte", "No entiendo un mensaje", "Háblame más despacio") y botón grande "Toca para hablar".
6. Tutoriales y talleres. Lista filtrable (Todos, Bancos, Salud, Seguridad y más) de talleres con duración y nivel.
7. Configurar modo sencillo. Interruptor general más ajustes: tamaño de letra, tamaño de íconos, menos opciones, lenguaje sencillo, alto contraste, velocidad de la voz.
8. Interfaz simplificada (vista de ejemplo). Inicio reducido a cuatro botones enormes: Enviar dinero, Sacar cita médica, Pedir un transporte, Comprar por internet, con barra inferior mínima (Inicio, Ayuda, Perfil).
9. Pasaporte digital. Insignia "Mi Pasaporte Digital – X de 8 habilidades completadas" y lista de las 8 habilidades con estado (completa, en progreso, sin empezar).
10. Ayuda humana (solo diseño). Pantalla como la de la referencia, pero sin indicador "En línea" y con los botones "Llamada por videollamada" y "Chat en tiempo real" mostrando "Próximamente" al tocarlos, junto con un mensaje amable que redirige al copiloto y a los talleres. Deja una constante de configuración (`HUMAN_HELP_ENABLED = false`) y un lugar claro en el código para conectar después un enlace de WhatsApp (`wa.me`) cuando haya guías disponibles. Incluye en esta pestaña preguntas frecuentes y la guía "Cómo instalar Vínculo en tu celular" (pasos para Android e iPhone).

Perfil: nombre, voz (activar/desactivar, velocidad lenta/normal), acceso al modo sencillo, "Borrar mis datos" (con confirmación), "Privacidad" en lenguaje sencillo (qué se guarda, que todo queda en el celular y la nota sobre la voz), "Acerca de" (versión, "Esta es una versión de prueba").

## 5. Simulador (basado en datos)

Plataformas ficticias (cada una con su propia identidad visual simple y original):

* Bancos: Banco Ejemplo y Billetera Ejemplo
* Salud: EPS Salud Ejemplo
* Transporte: Transporte Ejemplo y Domicilios Ejemplo
* Compras: Tienda Ejemplo
* Mensajería: Chat Ejemplo
* Celular: Ajustes (una pantalla de configuración genérica, sin copiar la de ningún fabricante)

Motor: cada práctica es un flujo definido en archivos de datos tipados (por ejemplo `src/content/flows/*.ts`), no código a mano por pantalla. Diseña un esquema que describa, por paso: la pantalla simulada (componentes reutilizables: encabezado, lista, formulario, teclado numérico, confirmación, comprobante, chat, mensaje SMS, ajustes), el elemento que se debe tocar o el dato que se debe escribir, el texto del coach, la pista y el mensaje cuando se equivoca.

Comportamiento:

* Toca el elemento correcto y aparece un "¡Bien!" con marca verde; el botón grande "Siguiente" se habilita. Nada avanza solo ni tiene límite de tiempo.
* Si toca algo equivocado: mensaje amable ("No pasa nada. Intentemos de nuevo.") sin castigar. Tras dos errores seguidos, resalta el elemento correcto con contorno y flecha (no solo con color).
* Botón "Ayuda" siempre visible: repite la instrucción y la lee en voz alta.
* Dos modos: Guiado (con resaltado y pistas) y Libre (sin resaltado, pistas solo a pedido), que se desbloquea después de completar el guiado una vez.
* "Volver" funciona en todos los pasos; "Salir de la práctica" pide confirmación; "Reiniciar práctica" disponible.
* Al terminar: pantalla de felicitación sencilla, qué aprendió, un consejo de seguridad y botón "Ver taller" o "Practicar otra vez". Se actualiza el Pasaporte.
* Los datos de práctica (nombres, cuentas, montos) son claramente ficticios.

## 6. Copiloto de voz (sin IA de pago)

Es el "Siri para adultos mayores" de Vínculo: un asistente propio de la app. No se integra con el Siri de Apple ni con el Asistente de Google, y no puede ver la pantalla de otras apps. Guía diciendo qué hacer y el usuario confirma cada paso con un botón.

Voz de salida (hablar):

* Usa `speechSynthesis` del navegador. Elige voz en este orden: `es-CO`, `es-419`, `es-MX`, `es-US`, cualquier `es`. Espera el evento `voiceschanged`.
* Velocidad por defecto algo lenta (0,9) y ajustable (lenta/normal). Divide los textos largos en frases para evitar cortes. Botón de detener siempre visible.

Voz de entrada (escuchar):

* Usa `SpeechRecognition` / `webkitSpeechRecognition` con idioma `es-CO`, solo al tocar el botón ("Toca para hablar"), mostrando en letra grande lo que se está entendiendo.
* Detecta si el navegador lo soporta. Si no, oculta el micrófono y deja funcionar el copiloto con botones y texto. Si el navegador permite procesamiento local, úsalo; si no, usa el estándar con el aviso de privacidad.
* Maneja los errores con mensajes amables y botones de respaldo: micrófono bloqueado (explica cómo activarlo), no escuchó nada, sin internet.
* Antes del primer uso muestra un aviso en lenguaje sencillo: "Tu navegador puede enviar tu voz a su proveedor para entenderla. Si prefieres no usar la voz, puedes tocar los botones". Con dos opciones: "Usar voz" y "Prefiero botones".
* Prueba también que funcione cuando la app está instalada en la pantalla de inicio. Si en algún sistema no funciona, el respaldo sin voz debe sentirse completo, no roto.

Motor de intención (local, sin IA externa):

* Normaliza el texto (minúsculas, sin tildes, sin puntuación), quita palabras vacías y compara contra una lista de intenciones con sinónimos y expresiones colombianas. Ejemplos: "mandar/pasar/girar/consignar plata", "turno/cita con el doctor", "pedir un carro/taxi", "domicilio", "wasap/guasap", "me llamaron del banco", "me pidieron la clave", "me llegó un link", "me ganó un premio", "letra más grande".
* Intenciones iniciales: transferencia, cita médica, transporte, compras, WhatsApp, configurar el celular, mensaje sospechoso o estafa, claves y seguridad, abrir ayuda humana, repetir, más despacio, atrás, inicio, practicar, modo sencillo, ver mis avances.
* Según la confianza: alta → pide confirmar ("¿Quieres hacer una transferencia?" Sí / No, otra cosa); media → ofrece 2 o 3 opciones; baja → "No te entendí bien. ¿Quieres hacer alguna de estas cosas?" con botones.
* Escribe pruebas con Vitest que cubran al menos 60 frases coloquiales distintas.

Guía para hacerlo en la vida real: por cada tarea, una secuencia corta de pasos genéricos (porque las apps reales cambian), por ejemplo para transferir: "Abre la aplicación de tu banco, la que usas siempre", "Entra con tu clave. No se la digas a nadie", "Busca el botón que dice Transferir o Enviar dinero", "Elige a quién le vas a enviar", "Escribe el valor con calma", "Revisa el nombre y el valor", "Confirma", "Guarda el comprobante". En cada paso: botones grandes Ya lo hice, Repetir, Más despacio, No entiendo y Practicar esto en el simulador.

Rama "No entiendo un mensaje": como no puede ver la pantalla, pregunta qué le piden con opciones ("Me pide una clave", "Me pide un código que me llegó por mensaje", "Dice que mi cuenta está bloqueada", "Me pide dinero") y responde con orientación segura (ver sección 13, Estafas).

## 7. Talleres (tarjetas ahora, video después)

* Cada taller es una secuencia de 4 a 6 tarjetas: título corto, una o dos frases, un consejo opcional "Ojo", una ilustración SVG sencilla y un botón "Leer en voz alta". Muestra duración (por ejemplo "5 min") y nivel ("Básico").
* Filtros: Todos, Bancos, Salud, Seguridad y más.
* Deja preparado un campo opcional `videoUrl` por taller. Si existe, muestra el video incrustado con el modo de privacidad ampliada de YouTube (`youtube-nocookie.com`) más un enlace; si no existe, muestra solo las tarjetas. Documenta en `docs/CONTENIDO.md` cómo agregar un video después.
* Un "Mini repaso" de 3 preguntas por taller es deseable pero opcional; si no entra en el tiempo, déjalo para después.

## 8. Modo sencillo

Es un ajuste dentro de Vínculo (no cambia el sistema del celular). Al activarlo, se aplica al instante a toda la app:

* Tamaño de letra: Normal / Grande / Muy grande (la escala parte de 20 px base; Grande ≈ ×1,2; Muy grande ≈ ×1,45).
* Íconos y botones más grandes (objetivo táctil mínimo 56 px; 64 px en modo sencillo).
* Menos opciones: el Inicio muestra solo los cuatro botones grandes de la pantalla 8.
* Lenguaje sencillo: versiones alternativas más cortas de los textos clave (campo `simple` en los archivos de contenido).
* Alto contraste (≥ 7:1) y voz más lenta.
* Una vista previa en vivo en la pantalla de ajustes.
* Además, un taller que explica cómo activar las funciones de accesibilidad del propio celular (letra grande, brillo, volumen).

## 9. Pasaporte digital

Ocho habilidades: transferencias bancarias, citas médicas, transporte, compras por internet, seguridad digital, WhatsApp, configuración del celular, identificar estafas.

* El avance de cada habilidad vale 50 % por completar el simulador (modo guiado) y 50 % por ver el taller completo. Define esa regla en un solo archivo de configuración para poder cambiarla.
* Estados: sin empezar, en progreso, completa (con "sello").
* Mensajes de ánimo suaves, nunca presión ni rachas.
* Muestra "Siguiente reto sugerido".
* Cuando las ocho estén completas, muestra un certificado sencillo con el nombre y la fecha, que se pueda imprimir o guardar desde el navegador.

## 10. Accesibilidad y diseño (checklist obligatorio)

* Letra base 20 px; contraste mínimo 4,5:1 (7:1 en modo sencillo y alto contraste); nunca comunicar algo solo con color.
* Objetivos táctiles mínimos de 56 × 56 px, con buen espacio entre ellos.
* Sin gestos obligatorios (deslizar, arrastrar, mantener pulsado), sin elementos que solo funcionen al pasar el cursor, sin límites de tiempo, sin avances automáticos, sin carruseles.
* Una sola acción principal por pantalla, botón "Volver" siempre visible, navegación inferior consistente.
* Íconos siempre acompañados de texto.
* HTML semántico, etiquetas ARIA donde corresponda, `aria-live` para los mensajes del copiloto, foco visible, compatibilidad básica con TalkBack.
* Respetar `prefers-reduced-motion`.
* Mensajes de error amables que nunca culpan al usuario.
* Acciones "irreversibles" (aunque sean simuladas) piden confirmación con botones grandes.

## 11. Cómo debe sonar la app

* Español de Colombia, cálido y respetuoso. La referencia usa "tú" ("¿Qué te gustaría hacer hoy?"); mantén ese trato y centraliza el tratamiento en el archivo de contenido para poder cambiarlo a "usted" fácilmente si el equipo lo decide.
* Frases cortas (máximo unas 12 palabras por instrucción), una acción por paso, voz activa, sin tecnicismos. Si un término es inevitable ("clave dinámica", "enlace"), explícalo la primera vez con una frase simple.
* Refuerzo positivo ("¡Muy bien!", "Lo estás haciendo bien") sin infantilizar.

## 12. Calidad y verificación

* Antes de dar una fase por terminada: `npm run build` sin errores, verificación de tipos y lint sin errores, pruebas pasando.
* Pruebas unitarias del motor de intención y de la lógica de progreso. Si es razonable, una prueba automática de humo (Playwright) de los flujos principales.
* Revisa la interfaz en 360 × 640 y 390 × 844 px, con texto al 200 % y en modo sencillo. Toma capturas y revísalas tú mismo antes de reportar.
* Lighthouse en modo móvil: Accesibilidad ≥ 95 y Rendimiento ≥ 85 como meta (si no se llega, explica por qué).
* Funciona sin conexión después de la primera carga (excepto el reconocimiento de voz).
* Crea `docs/PRUEBAS.md` con una lista de pruebas manuales, incluyendo probar en un Android real de gama baja y con 2 o 3 adultos mayores reales cuando el equipo pueda.

## 13. Contenido: las 8 habilidades (todo es borrador a revisar)

Cada habilidad tiene un simulador (6 a 8 pasos) y un taller (4 a 6 tarjetas). Escribe el contenido completo en español sencillo.

1. Transferencias bancarias (Banco Ejemplo y Billetera Ejemplo). Abrir la app → ingresar con clave de práctica → Transferir → elegir cuenta destino (contactos ficticios) → escribir valor con teclado numérico → revisar nombre y valor → confirmar con código de práctica → ver y guardar comprobante. Consejo: confirma siempre el nombre antes de enviar.
2. Citas médicas (EPS Salud Ejemplo). Ingresar → Citas → elegir tipo (medicina general) → elegir sede → elegir fecha y hora → confirmar → ver comprobante → cómo cancelar o cambiar. Consejo: anota la fecha y lleva tu documento.
3. Transporte (Transporte Ejemplo). Escribir destino → ver precio → elegir tipo de viaje → confirmar → ver al conductor y la placa → verificar que coincida antes de subir → pagar y calificar. Consejo de seguridad: comparte tu viaje con un familiar.
4. Compras por internet (Tienda Ejemplo y Domicilios Ejemplo). Buscar → ver producto → agregar al carrito → revisar total → dirección → método de pago (incluye pago contra entrega) → confirmar → seguimiento. Señales de una tienda confiable.
5. Seguridad digital. Claves fuertes y fáciles de recordar, no compartir códigos con nadie, bloquear la pantalla, actualizar el celular, revisar permisos. Práctica en formato de decisiones y mini repaso.
6. WhatsApp (Chat Ejemplo). Abrir un chat → escribir y enviar → enviar un audio → enviar una foto → hacer una videollamada → silenciar o salir de un grupo.
7. Configuración del celular (Ajustes). Cambiar tamaño de letra → brillo → volumen → conectarse a una red wifi → actualizar → activar el modo avión y cómo desactivarlo.
8. Identificar estafas. Práctica con mensajes y llamadas simuladas (SMS con enlace sospechoso, falsa llamada del banco que pide un código, "premio" inesperado, familiar "en apuros" que pide dinero urgente). El usuario decide "Es seguro" o "Es una estafa" y recibe explicación de las señales. Ideas clave: ningún banco pide claves ni códigos por llamada o mensaje; no abras enlaces que no esperabas; si dudas, cuelga y llama al número que aparece en tu tarjeta; no hagas pagos por presión o urgencia; consulta con un familiar antes de actuar.

## 14. Qué NO hacer

* No agregues funciones que no estén en este brief sin preguntarme.
* No uses servicios externos, claves de API ni dependencias de pago.
* No copies logos, colores ni nombres de marcas reales en el simulador.
* No inventes datos ni números de contacto reales.
* No marques una fase como terminada si no corriste el build y las pruebas.
* Si la imagen de referencia y este brief se contradicen, gana el brief (la imagen es una guía visual y usa marcas reales que debes reemplazar).

## 15. Cómo trabajar conmigo

* No soy programador/a. Explica en español sencillo, sin jerga. La primera vez, dime paso a paso cómo instalar lo necesario, cómo abrir la app en mi computador y cómo verla en mi celular.
* Al empezar cada fase, escribe un plan de 5 a 8 líneas y continúa; solo detente a preguntar si hay una decisión que cambie las reglas del brief.
* Haz un commit al terminar cada fase con mensajes claros (`feat(fase-N): ...`).
* Al terminar cada fase, entrégame un informe corto: qué se hizo, cómo verlo, qué debo revisar, qué falta y qué límites hay.
* Mantén actualizados `README.md` (en español, para personas no técnicas: cómo correr, cómo publicar gratis en GitHub Pages o Netlify), `docs/DECISIONES.md`, `docs/CONTENIDO.md` (cómo agregar un simulador, un taller o un video) y `docs/ASSETS.md`.

## 16. Plan en 8 fases

1. Base y diseño: proyecto, PWA, sistema de diseño (colores de la referencia, tipografía, escala de letra que ya soporte los tres tamaños), marco de teléfono, navegación inferior, bienvenida (pantalla 1), menú principal (pantalla 2), Perfil, persistencia local y archivos de contenido.
2. Simulador: motor de flujos, selección de plataforma (pantalla 3), simulador (pantalla 4), componentes de pantallas simuladas y el primer flujo completo (transferencia bancaria).
3. Copiloto de voz: pantalla 5, voz de salida y entrada, aviso de privacidad, motor de intención con pruebas, buscador del menú y guías para hacerlo en la vida real.
4. Talleres: pantalla 6, motor de tarjetas, lectura en voz alta, espacio para video y los 8 talleres.
5. Simuladores 2 a 5: citas médicas, transporte, compras por internet e identificar estafas.
6. Simuladores 6 a 8: WhatsApp, configuración del celular y seguridad digital.
7. Modo sencillo, Pasaporte, Ayuda y Perfil final: pantallas 7, 8, 9 y 10, aplicando el modo sencillo a toda la app.
8. Pulido y entrega: trabajo sin conexión, accesibilidad, rendimiento, pruebas, documentación y guía de publicación gratuita.
