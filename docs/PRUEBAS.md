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

## Pruebas con personas (cuando el equipo pueda)

- [ ] Probar en un Android real de gama baja.
- [ ] Probar con 2 o 3 adultos mayores reales. Observar sin ayudar: ¿entienden la bienvenida? ¿encuentran "Simular y practicar"? ¿leen bien la letra?
- [ ] Anotar dudas, palabras que no entienden y dónde se equivocan.
