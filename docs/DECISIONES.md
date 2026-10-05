# Decisiones del proyecto

Registro de decisiones técnicas y de diseño. Lo más reciente va arriba dentro de cada fase.

## Fase 1

1. **Stack del brief, sin cambios.** React + Vite + TypeScript, `vite-plugin-pwa`, HashRouter, CSS propio con variables, `lucide-react`, Atkinson Hyperlegible vía `@fontsource`, Vitest.
2. **TypeScript 6.0 y no 7.** `typescript-eslint` (el lint) aún no soporta TypeScript 7.
3. **No había imagen de referencia en el repositorio.** `docs/referencia/` estaba vacía cuando se construyó la Fase 1, así que la paleta se definió a partir de lo que dice el brief (logo verde y amarillo, tono cálido). Paleta provisional:
   - Verde principal `#1D5C46` (texto/botones), verde logo `#2E8A63`, amarillo logo `#F2C14E`, fondo crema `#FBF7EE`, texto `#1C2629`.
   - Todos los textos tienen contraste ≥ 7:1 (ver `scripts/contrast.mjs`). En alto contraste: negro sobre blanco y verde muy oscuro.
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
