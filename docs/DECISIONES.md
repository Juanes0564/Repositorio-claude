# Decisiones del proyecto

Registro de decisiones técnicas y de diseño.

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
