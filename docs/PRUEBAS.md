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

## Pruebas con personas (cuando el equipo pueda)

- [ ] Probar en un Android real de gama baja.
- [ ] Probar con 2 o 3 adultos mayores reales. Observar sin ayudar: ¿entienden la bienvenida? ¿encuentran "Simular y practicar"? ¿leen bien la letra?
- [ ] Anotar dudas, palabras que no entienden y dónde se equivocan.
