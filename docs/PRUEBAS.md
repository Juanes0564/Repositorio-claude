# Pruebas manuales

Lista para revisar la app a mano. Marca cada casilla cuando la pruebes.

## Fase 1 — Base

### Bienvenida
- [ ] La primera vez aparece la bienvenida con logo, "Vínculo", el lema y el botón "Comenzar".
- [ ] "Comenzar" lleva a "¿Cómo te llamas?". Se puede dejar el nombre en blanco.
- [ ] "Volver" funciona en los pasos 1 y 2.
- [ ] "Sí, activarlo" pone la letra grande y el alto contraste. "No, por ahora" deja todo normal.
- [ ] Después de la bienvenida aparece "¡Hola, (nombre)!". Si no hay nombre: "¡Hola!".
- [ ] Al cerrar y abrir de nuevo, ya no aparece la bienvenida.

### Menú principal
- [ ] Se ven el buscador, los botones "Buscar" y "Hablar", las 4 tarjetas grandes y los 4 accesos rápidos.
- [ ] Cada tarjeta y acceso rápido abre su sección (por ahora, "Estamos preparando esta sección").
- [ ] La navegación inferior (Inicio, Mis avances, Ayuda, Perfil) muestra cuál está activa con borde, fondo y subrayado (no solo color).

### Perfil
- [ ] Cambiar el nombre y tocar "Guardar" muestra "Guardado", y el saludo cambia.
- [ ] El interruptor de voz dice "Activado" o "Desactivado" con texto.
- [ ] La velocidad de la voz se puede elegir: Lenta o Normal.
- [ ] El interruptor de modo sencillo cambia la letra y el contraste al instante.
- [ ] "Borrar mis datos" pregunta antes. "No, conservarlos" no borra nada. "Sí, borrar todo" vuelve a la bienvenida.
- [ ] Privacidad y Acerca de se leen bien.

### Presentación
- [ ] En computador (ventana ancha) la app se ve dentro de un marco de teléfono con hora, señal y batería.
- [ ] Agregando `?frame=0` antes del `#` en la dirección, el marco desaparece.
- [ ] En el celular la app ocupa toda la pantalla, sin marco.

### Accesibilidad básica
- [ ] Con la tecla Tab se recorre todo y se ve un contorno grueso en el elemento activo.
- [ ] Con el zoom del navegador al 200 %, nada se sale por los lados.
- [ ] Con TalkBack (Android), cada botón dice su nombre.

### Sin conexión e instalación
- [ ] Abrir la app una vez, apagar internet y recargar: la app sigue abriendo.
- [ ] En Android (Chrome): menú ⋮ → "Instalar app" o "Agregar a la pantalla principal".

## Fase 2 — Simulador

### Selección de plataforma (pantalla 3)
- [ ] "Simular y practicar" abre la lista con filtros: Más usadas, Bancos, Salud, Transporte, Compras.
- [ ] El filtro activo se nota con fondo, color y una marca ✓.
- [ ] Los accesos rápidos del menú (Bancos, EPS/Salud…) abren la lista ya filtrada.
- [ ] Ninguna plataforma se parece a un banco, EPS o app real.
- [ ] Banco Ejemplo muestra "Enviar dinero a otra persona"; las demás dicen "Muy pronto".
- [ ] "Practicar solo" aparece bloqueado con candado y explicación hasta completar la práctica con guía.

### Simulador (pantalla 4)
- [ ] Siempre se ve la cinta "PRÁCTICA – no es real".
- [ ] Se ve "Paso X de 8" y la barra de progreso.
- [ ] Tocar lo correcto muestra "¡Bien!" con marca verde. Nada avanza solo.
- [ ] Tocar otra cosa muestra un mensaje amable. A la segunda, aparece un recuadro punteado con "Aquí".
- [ ] En la clave y el valor, el resaltado señala la tecla que sigue, o "Borrar" si hay un número de más.
- [ ] "Siguiente" antes de tiempo explica "Primero haz lo que dice el paso."
- [ ] "Volver" funciona en todos los pasos (en el paso 1 pregunta si quiere salir).
- [ ] "Salir" y "Reiniciar" piden confirmación.
- [ ] "Ayuda" muestra la pista y la lee en voz alta (si la voz está activada). "Detener voz" la calla.
- [ ] Al terminar: felicitación, lo aprendido, consejo de seguridad, "Practicar otra vez" y "Ver taller".
- [ ] Después del modo con guía, "Practicar solo" queda disponible y no muestra pistas hasta tocar "Ayuda".
- [ ] Con letra Muy grande, todo cabe y se puede usar.

## Fase 3 — Copiloto de voz

### Sin micrófono (siempre debe funcionar)
- [ ] El copiloto se ve oscuro, con el avatar, "Estoy aquí para ayudarte. ¿Qué quieres hacer?" y las 5 sugerencias.
- [ ] Escribir "quiero mandar plata" y tocar Enviar pregunta "¿Quieres hacer una transferencia?".
- [ ] "Sí" abre la guía paso a paso; "No, otra cosa" vuelve a preguntar.
- [ ] Escribir algo sin sentido ("el clima") muestra "No te entendí bien" con botones.
- [ ] En la guía funcionan: Ya lo hice, Repetir, Más despacio, No entiendo, Practicar esto, Paso anterior y Salir de la guía.
- [ ] "No entiendo un mensaje" pregunta qué pide el mensaje y da un consejo seguro.
- [ ] El buscador del menú principal lleva la pregunta al copiloto.

### Con micrófono (Chrome en Android)
- [ ] La primera vez, "Toca para hablar" muestra el aviso: "Tu navegador puede enviar tu voz a su proveedor…".
- [ ] "Usar voz" escucha y muestra en letra grande lo que va entendiendo.
- [ ] "Prefiero botones" esconde el micrófono. En Perfil se puede volver a activar.
- [ ] Si el micrófono está bloqueado, la app explica cómo activarlo y sigue funcionando con botones.
- [ ] Si no se dice nada, la app dice "No te escuché" con amabilidad.
- [ ] Sin internet, la app explica que la voz necesita internet y deja escribir.
- [ ] Probar con la app **instalada en la pantalla de inicio** (Android y iPhone).
- [ ] La voz del copiloto suena en español y se puede detener.
- [ ] En la bienvenida, "Decir mi nombre" escribe el nombre dicho.

### Frases para probar con personas mayores
Pídeles que digan con sus palabras: "enviar plata a un hijo", "pedir cita con el médico", "pedir un taxi", "me llegó un mensaje raro". Anota lo que el copiloto no entienda y agrégalo (ver `docs/CONTENIDO.md`).

## Fase 4 — Talleres

- [ ] "Tutoriales y talleres" muestra los 8 talleres con duración ("5 min") y nivel ("Básico").
- [ ] Los filtros Todos, Bancos, Salud, Seguridad y Más temas funcionan.
- [ ] Dentro de un taller se ve "Tarjeta X de Y", el dibujo, el título, el texto y el "Ojo".
- [ ] Anterior / Siguiente cambian de tarjeta. Nada avanza solo ni hay que deslizar.
- [ ] "Leer en voz alta" lee la tarjeta y "Detener voz" la calla.
- [ ] Al tocar "Terminar" aparece "¡Terminaste el taller!" y el taller sale como "Visto" en la lista.
- [ ] El mini repaso explica cada respuesta y no regaña.
- [ ] "Ver taller" al final de una práctica abre el taller correcto.
- [ ] (Cuando haya video) "Ver el video aquí" carga el video; sin tocarlo, no se carga nada.
- [ ] Una persona del equipo revisa los textos de los 8 talleres (todos están como borrador).

## Fase 5 — Más prácticas

- [ ] La app habla de "usted" en todas las pantallas (menos el lema "Aprende, practica y hazlo tú").
- [ ] **Citas médicas** (EPS Salud Ejemplo): clave 2468, Citas, medicina general, Sede Centro, jueves 9:30, confirmar y ver dónde cancelar.
- [ ] **Transporte** (Transporte Ejemplo): destino, precio, pedir, compartir viaje, comparar placas, pagar y calificar con 5 estrellas.
- [ ] **Compras** (Tienda Ejemplo): buscar, olla de presión, carrito con total y envío, dirección, pago contra entrega, confirmar y seguimiento.
- [ ] **Estafas** (Chat Ejemplo): 6 casos. Si se equivoca, el mensaje es amable. Al acertar aparece "Las señales".
- [ ] Hay 2 casos que **sí son seguros**. Preguntar a los participantes si los entienden.
- [ ] Desde el copiloto, "Practicar cómo identificar estafas" abre la práctica de estafas.
- [ ] Una persona del equipo revisa los textos de las estafas (borrador).

## Fase 6 — Últimas prácticas

- [ ] **Mensajes** (Chat Ejemplo): abrir el chat de Rosa, enviar el mensaje, un audio y una foto, videollamada, abrir el grupo Familia y silenciarlo (el interruptor pasa a "Sí").
- [ ] **Celular más cómodo** (Ajustes): letra Grande, subir brillo y volumen, wifi Casa Ejemplo, instalar actualización, apagar el modo avión (pasa a "No").
- [ ] **Seguridad** (Ajustes): 6 decisiones. Las opciones no delatan la respuesta. Al acertar aparece "Las señales".
- [ ] En "Simular y practicar", cada plataforma muestra cuántas prácticas tiene (Billetera y Domicilios: "Muy pronto").
- [ ] Desde el copiloto, "Practicar esto en el simulador" lleva a la práctica correcta en las 7 guías.

## Fase 7 — Modo sencillo, Pasaporte y Ayuda

- [ ] Inicio → "Ajustar mi modo sencillo": el interruptor general cambia todo al instante.
- [ ] Cada ajuste (letra, íconos, menos opciones, lenguaje sencillo, alto contraste, voz) cambia por separado.
- [ ] Con "menos opciones", el inicio tiene 4 botones enormes y abajo solo Inicio, Ayuda y Perfil.
- [ ] Cada botón enorme abre la guía paso a paso del copiloto.
- [ ] "Ver todas las opciones" muestra el menú completo.
- [ ] "Mis avances" dice cuántas habilidades lleva, el estado de cada una (con palabras, no solo colores) y el siguiente reto.
- [ ] Al completar las 8 (práctica con guía + taller), aparece "Ver mi certificado", con nombre y fecha. "Imprimir o guardar" abre la impresión.
- [ ] Ayuda: los botones de videollamada y chat dicen "Próximamente" y ofrecen el copiloto y los talleres. No dice "En línea" en ninguna parte.
- [ ] Preguntas frecuentes se abren y cierran tocándolas.
- [ ] La guía "Cómo instalar Vínculo" sirve en Android y en iPhone.
- [ ] Todo lo anterior también con modo sencillo y letra Muy grande.

## Fase 8 — Pruebas automáticas (ya corren solas)

- `npm test`: más de 340 pruebas de lógica, contenido y pantallas.
- `npm run test:e2e`: 30 pruebas en un navegador real (recorridos, accesibilidad con axe en modo normal y sencillo, teclado, sin conexión, zoom 200 %, sin pedidos a internet).

## Fase 8 — Pruebas manuales antes de entregar

- [ ] Publicar (README → "Publicarla gratis") y abrir el enlace en un **Android real de gama baja**.
- [ ] Instalarla en la pantalla de inicio (Android e iPhone) y abrirla **sin internet**.
- [ ] Probar el **micrófono** con la app publicada y también instalada: Copiloto → "Toque para hablar".
- [ ] Probar con **TalkBack** (Android): activar en Ajustes → Accesibilidad. Cada botón debe decir su nombre; la instrucción del paso se lee al cambiar de paso.
- [ ] Probar con la **letra del celular al máximo** (Ajustes del celular → Pantalla → Tamaño de letra).
- [ ] Imprimir o guardar como PDF el certificado (completar las 8 habilidades o usar datos de prueba).
- [ ] Una persona del equipo lee `docs/REVISION-CONTENIDO.md` y anota correcciones (sobre todo seguridad y estafas).

## Pruebas con personas (cuando el equipo pueda)

Con **2 o 3 personas mayores reales**, cada una por separado, unos 30 minutos:

- [ ] Explicar que es una práctica y que nada es real. Pedir que piensen en voz alta.
- [ ] **Observar sin ayudar** (solo intervenir si se frustran). Tareas sugeridas:
  1. Pasar la bienvenida y decir su nombre.
  2. "Practique enviar dinero a Rosa" (simulador con guía).
  3. "Pídale al copiloto ayuda para sacar una cita" (con voz y con botones).
  4. "Revise si este mensaje es una estafa" (práctica de estafas).
  5. "Ponga la letra más grande" (modo sencillo).
- [ ] Anotar: dónde dudan, qué palabras no entienden, si leen bien la letra, si encuentran los botones, qué frases le dicen al copiloto que no entiende (agregarlas según `docs/CONTENIDO.md`).
- [ ] Preguntar al final: ¿qué fue lo más fácil? ¿lo más difícil? ¿la usaría de nuevo? ¿prefiere "tú" o "usted"?
