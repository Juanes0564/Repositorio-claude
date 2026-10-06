# Decisiones del proyecto

Registro de decisiones técnicas y de diseño.

## Fase 4

1. **Una tarjeta a la vez con botones Anterior / Siguiente** (fijos abajo), sin deslizar ni avanzar solos: así no es un carrusel (prohibido en el brief). "Anterior" en la primera tarjeta vuelve a la lista.
2. **El taller cuenta como visto al tocar "Terminar" en la última tarjeta.** Ahí suma su 50 % al Pasaporte. El mini repaso es opcional y no afecta el avance.
3. **Mini repaso en los 8 talleres** (3 preguntas cada uno). Al responder muestra la respuesta correcta con ícono, borde y texto ("Respuesta correcta" / "Tu respuesta"), no solo con color, y explica por qué. El resultado es suave ("Acertaste 2 de 3. Repasar ayuda a recordar."), sin rachas ni presión.
4. **Video solo al tocar.** Aunque el brief permite incrustar el video, se muestra primero un botón "Ver el video aquí": nada de YouTube se carga hasta que la persona lo pide (más privacidad y menos datos). Siempre `youtube-nocookie.com`, más un enlace para abrirlo en YouTube. Solo se aceptan enlaces de YouTube (`src/lib/video.ts`).
5. **Filtros:** Todos, Bancos, Salud, Seguridad y "Más temas" (transporte, compras, WhatsApp y celular).
6. **El taller de accesibilidad del celular** (sección 8 del brief) es "Tu celular más cómodo": letra grande, brillo, volumen, wifi y modo avión.
7. **"Ver taller" desde el simulador** abre directamente el taller de esa habilidad.
8. **Ilustraciones** SVG simples y originales (`src/components/Illustration.tsx`), con los colores del tema para que funcionen en alto contraste.
9. **Textos en "tú" y "usted":** se escribieron en "tú" y la versión "usted" se generó y revisó frase por frase.
10. **Con letra Grande o Muy grande**, los botones Anterior/Siguiente quitan la flecha para que quepan las palabras.

## Fase 3

1. **Motor de intención propio, sin Fuse.js.** Es pequeño (`src/copilot/intentEngine.ts`): normaliza el texto, quita palabras vacías, suma puntos por frases completas (pesan mucho) y por palabras clave con peso. Tolera un error de escritura o de dictado en palabras clave de 6 letras o más ("trasferencia", "jaqueen"). En claves cortas no, porque un error cambia el sentido ("estar" no es "estafa"). No se agregó ninguna dependencia.
2. **Confianza:** alta (≥ 2,5 puntos y 1,5 de ventaja sobre la segunda) → "¿Quieres…?" Sí / No, otra cosa. Media → 2 o 3 opciones + "Ninguna de estas". Baja → "No te entendí bien" con botones de las tareas principales.
3. **Órdenes directas:** repetir, más despacio, atrás e inicio se cumplen sin preguntar (preguntar "¿Quieres que repita?" estorba).
4. **Procesamiento de voz en el celular APAGADO.** El brief pide usarlo si el navegador lo permite. Al probarlo, en Chromium tanto `SpeechRecognition.available({ processLocally: true })` como `processLocally = true` **cerraron la pestaña** cuando el modelo local no está instalado. Se dejó apagado con el interruptor `TRY_LOCAL_PROCESSING` en `src/lib/recognition.ts` y se usa el reconocimiento estándar, siempre con el aviso de privacidad antes del primer uso. Revisar cuando el navegador lo tenga estable y probar en un Android real.
5. **Permiso del micrófono guardado:** `settings.voiceInput` (`unknown` / `granted` / `declined`). "Prefiero botones" esconde el micrófono en toda la app; se puede cambiar en Perfil. Si el navegador no tiene reconocimiento de voz, el micrófono no aparece y Perfil lo explica.
6. **El botón "Detener voz" aparece mientras la app habla** (no tiene sentido mostrarlo callado).
7. **"Más despacio"** lee con velocidad 0,75 y deja la voz en "Lenta" (0,9) de ahí en adelante.
8. **La voz del copiloto solo suena después de que la persona toca algo** (los navegadores bloquean el sonido automático al abrir una página).
9. **"Toca para hablar" va justo debajo del mensaje del copiloto** y antes de las sugerencias, para que siempre se vea sin desplazarse. El cuadro para escribir va al final.
10. **Guías "en la vida real"** (`src/content/guides.ts`): pasos genéricos (las apps reales cambian). Siete guías: transferencias, citas, transporte, compras, WhatsApp, configuración del celular y seguridad. Las estafas se atienden con la rama "No entiendo un mensaje". Todo marcado `reviewed: false`.
11. **"No entiendo un mensaje"** (`src/content/messageHelp.ts`): como el copiloto no ve la pantalla, pregunta qué pide el mensaje (clave, código, cuenta bloqueada, dinero, premio, otra cosa) y orienta. Sin teléfonos ni enlaces: "el número que aparece en tu tarjeta".
12. **Pruebas de seguridad del contenido:** una prueba revisa que ningún archivo de contenido tenga enlaces web ni números de teléfono, y que guías, prácticas y ayuda con mensajes estén marcadas para revisión.
13. **El nombre en la bienvenida se puede decir en voz alta** ("me llamo Marta Lucía" → "Marta").
14. **Pantalla del copiloto oscura** con colores propios (contraste ≥ 7:1); en alto contraste, negro con amarillo claro.

## Fase 2

1. **Motor separado de la pantalla.** `src/sim/engine.ts` es lógica pura (tocar, escribir, siguiente, volver, reiniciar, ayuda) y se prueba sin navegador. Las pantallas simuladas se arman con piezas reutilizables en `src/sim/blocks/`. Cada práctica es solo datos (`src/content/flows/`).
2. **Teclado numérico:** las teclas nunca cuentan como error; solo se revisa al tocar el botón final ("Entrar", "Continuar"). Tras dos errores, el resaltado señala la siguiente tecla correcta, "Borrar" si sobra un número, o el botón final.
3. **Resaltado:** contorno grueso discontinuo + etiqueta con flecha y la palabra "Aquí" (no depende solo del color). Solo en modo Guiado.
4. **"Siguiente" nunca está apagado del todo:** si se toca antes de tiempo, explica "Primero haz lo que dice el paso." (un botón desactivado no dice por qué). Se ve con borde punteado mientras espera.
5. **Orden de la pantalla 4 (se mantiene):** progreso → nota del coach → pantalla simulada → barra fija con el aviso y Volver/Siguiente. La referencia pone el coach debajo de la pantalla simulada; lo subimos para que la instrucción siempre se vea sin desplazarse. "¡Bien!" y los avisos salen en la barra fija, junto a "Siguiente".
6. **Sin navegación inferior dentro de la práctica** para evitar salidas accidentales. Se sale con "Salir" (pide confirmación). "Volver" en el paso 1 también pregunta si quiere salir.
7. **Modo Libre por habilidad:** se desbloquea al completar el Guiado de cualquier práctica de esa habilidad (el progreso se guarda por habilidad, como pide el Pasaporte). Si alguien abre el modo Libre bloqueado desde la dirección, se abre en Guiado.
8. **Regla del Pasaporte en un solo archivo:** `src/config/progress.ts` (50 % simulador guiado + 50 % taller).
9. **Voz de "Ayuda":** se agregó una versión básica de lectura en voz alta (`src/lib/speech.ts`) con el orden de voces del brief y botón "Detener voz". La Fase 3 la completa (copiloto y reconocimiento de voz).
10. **Identidad de las plataformas ficticias:** cuadro redondeado de un color propio con un ícono genérico. Colores elegidos lejos de las marcas colombianas conocidas, todos con contraste ≥ 7:1 con texto blanco:
    Banco Ejemplo `#0F5C5C` (verde petróleo), EPS Salud Ejemplo `#1E5675`, Chat Ejemplo `#3E4C6B`, Transporte Ejemplo `#1F4E79`, Billetera Ejemplo `#6B4813` (café), Tienda Ejemplo `#8B3A3A` (ladrillo), Domicilios Ejemplo `#48551A` (oliva), Ajustes `#4A4F55` (gris).
11. **Prueba automática anti-marcas:** `src/content/brands.test.ts` falla si aparece el nombre de un banco, EPS o app real en las plataformas o prácticas.
12. **"Más usadas"** muestra todas las plataformas ordenadas por uso; los demás filtros las reducen. Las plataformas sin prácticas dicen "Muy pronto".
13. **Capturas automáticas:** `npm run screenshots` toma capturas de todas las pantallas en varios tamaños y avisa si algo se sale de la pantalla o si hay pedidos a internet.
14. **Texto al 200 %:** en pantallas muy angostas la barra Volver/Siguiente deja de estar fija para no tapar la práctica.

## Fase 1

1. **Stack del brief, sin cambios.** React + Vite + TypeScript, `vite-plugin-pwa`, HashRouter, CSS propio con variables, `lucide-react`, Atkinson Hyperlegible vía `@fontsource`, Vitest.
2. **TypeScript 6.0 y no 7.** `typescript-eslint` (el lint) aún no soporta TypeScript 7.
3. **No había imagen de referencia en el repositorio.** `docs/referencia/` estaba vacía cuando se construyó la Fase 1, así que la paleta se definió a partir de lo que dice el brief (logo verde y amarillo, tono cálido). Paleta provisional:
   - Verde principal `#1D5C46` (texto/botones), verde logo `#2E8A63`, amarillo logo `#F2C14E`, fondo crema `#FBF7EE`, texto `#1C2629`.
   - Todos los textos tienen contraste ≥ 7:1 (ver `scripts/contrast.mjs`). En alto contraste: negro sobre blanco y verde muy oscuro.
   - **Aprobada por el equipo (provisional)** tras revisar la Fase 1, junto con el menú principal.
   - **Pendiente:** cuando el equipo agregue `docs/referencia/recorrido-usuario.png`, ajustar los tonos en `src/styles/index.css` (sección "Tokens").
4. **Escala de letra con el tamaño raíz.** La letra base es 20 px (`font-size: 125%` en `<html>`). Grande = 24 px (×1,2), Muy grande = 29 px (×1,45). Como todo se mide en `rem`, la interfaz completa crece con la letra.
5. **Objetivos táctiles** con `max(56px, 2.8rem)`; en modo sencillo `max(64px, 3.2rem)`.
6. **El modo sencillo es un interruptor general** que enciende letra Grande, íconos grandes, menos opciones, lenguaje sencillo, alto contraste y voz lenta. Cada ajuste se podrá cambiar por separado en la pantalla 7 (Fase 7). En la Fase 1 ya se aplican letra, íconos y contraste; "menos opciones" y "lenguaje sencillo" se guardan y se aplican en la Fase 7.
7. **Trato "tú" / "usted" centralizado** en `src/content/treatment.ts`. Cada frase que cambia según el trato se escribe con `tv('tú', 'usted')`. Cambiar una línea cambia toda la app.
8. **Lenguaje sencillo**: los textos pueden ser `{ text, simple }` (tipo `Copy` en `src/content/types.ts`); el gancho `useCopy()` elige según el ajuste.
9. **Persistencia**: una sola clave `vinculo.v1` en `localStorage` con `version`. La función `migrate()` repara datos dañados o incompletos y es el lugar para migrar a futuras versiones. Si el navegador no deja guardar, la app sigue funcionando sin recordar.
10. **Marco de teléfono solo con CSS** (`@media (min-width: 768px)`), así en un celular real nunca aparece. `?frame=0` lo apaga (sirve antes o después del `#`).
11. **Secciones de fases futuras** muestran una pantalla honesta: "Estamos preparando esta sección", con "Volver" e "Ir al inicio". Nada finge funcionar.
12. **Buscador del menú**: con etiqueta visible "Pregúntame lo que necesites…" encima de la caja (el texto largo dentro de la caja se cortaba en pantallas pequeñas). En la Fase 1 lleva la pregunta a la sección del copiloto; el motor de intención llega en la Fase 3.
13. **Nombre "con voz o teclado" en la bienvenida**: en la Fase 1 es solo con teclado. El dictado por voz se agrega en la Fase 3, junto con el aviso de privacidad del micrófono.
14. **Texto al 200 % / pantallas muy angostas (< 300 px de ancho efectivo)**: la navegación inferior pasa a 2 × 2 y se ocultan adornos (logo del saludo, íconos de tarjetas) para que nada se salga de la pantalla.
15. **Íconos de la app instalada (PNG)** generados desde el logo con `npm run icons` (usa Chromium de Playwright solo en desarrollo).
