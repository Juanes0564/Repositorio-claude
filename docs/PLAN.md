# Plan de trabajo — 8 fases

Cada fase se cierra con: `npm run build`, `npm run typecheck`, `npm run lint` y `npm test` sin errores; capturas revisadas en 360×640 y 390×844; commit `feat(fase-N): ...`; informe corto.

## Fase 1 — Base y diseño ✅
Proyecto, PWA, sistema de diseño, marco de teléfono, navegación inferior, bienvenida (pantalla 1), menú principal (pantalla 2), Perfil, persistencia local y archivos de contenido.

Criterios de aceptación:
- [x] Proyecto React + Vite + TS con HashRouter; `vite-plugin-pwa` genera manifiesto y service worker.
- [x] Fuente Atkinson Hyperlegible autoalojada; ningún recurso remoto en tiempo de ejecución.
- [x] Variables de color/espaciado en CSS; tamaños en `rem`; escala de letra Normal (20 px) / Grande (×1,2) / Muy grande (×1,45) y alto contraste funcionando.
- [x] Marco de teléfono en ≥ 768 px con barra de estado `aria-hidden`; sin marco en celular; `?frame=0` lo apaga.
- [x] Navegación inferior: Inicio, Mis avances, Ayuda, Perfil (íconos con texto, ≥ 56 px).
- [x] Bienvenida con logo SVG, lema, "Comenzar", nombre opcional (por teclado; la voz llega en la Fase 3) y elección de modo sencillo; no vuelve a salir tras completarla.
- [x] Menú principal con saludo, buscador (marcador de posición), 4 tarjetas grandes y accesos rápidos.
- [x] Perfil: nombre, voz on/off y velocidad, acceso a modo sencillo, Borrar mis datos (con confirmación), Privacidad, Acerca de.
- [x] Persistencia `vinculo.v1` versionada con migración y pruebas unitarias.
- [x] Todo texto visible en `src/content/`.
- [x] Docs: README, DECISIONES, DEPENDENCIAS, ASSETS, CONTENIDO, PRUEBAS (iniciales).

## Fase 2 — Simulador ✅
Motor de flujos por datos, selección de plataforma (pantalla 3), simulador (pantalla 4), componentes de pantallas simuladas y flujo de transferencia bancaria.

Criterios:
- [x] Esquema tipado de flujo (pantalla, objetivo, coach, pista, error) en `src/content/flows/`.
- [x] Componentes reutilizables: encabezado, lista, formulario, teclado numérico, confirmación, comprobante, chat, SMS, ajustes.
- [x] Cinta "PRÁCTICA – no es real" en todas las pantallas.
- [x] "¡Bien!" + marca verde; error amable; tras 2 errores, contorno + flecha.
- [x] Ayuda siempre visible; Volver, Salir (con confirmación), Reiniciar.
- [x] Modo Guiado y Libre (Libre tras completar Guiado).
- [x] Pantalla final con aprendizaje, consejo, "Ver taller"/"Practicar otra vez"; progreso actualizado.
- [x] Flujo completo de transferencia en Banco Ejemplo; pruebas del motor.

## Fase 3 — Copiloto de voz ✅
Criterios:
- [x] Pantalla 5 oscura con avatar, sugerencias y "Toca para hablar".
- [x] `speechSynthesis` con orden de voces es-CO → es-419 → es-MX → es-US → es; velocidad 0,9/1; frases divididas; botón detener.
- [x] Reconocimiento `es-CO` solo al tocar; detección de soporte; aviso de privacidad previo; errores amables; todo funciona sin micrófono.
- [x] Motor de intención local (normalización, sinónimos colombianos, confianza alta/media/baja) con ≥ 60 frases de prueba.
- [x] Buscador del menú usa el motor.
- [x] Guías "en la vida real" con Ya lo hice / Repetir / Más despacio / No entiendo / Practicar esto; rama "No entiendo un mensaje".

## Fase 4 — Talleres ✅
Criterios:
- [x] Pantalla 6 con filtros (Todos, Bancos, Salud, Seguridad y más), duración y nivel.
- [x] Motor de tarjetas (4–6), "Ojo", ilustración SVG, "Leer en voz alta".
- [x] `videoUrl` opcional con `youtube-nocookie.com` + enlace.
- [x] 8 talleres completos con `reviewed: false`; incluye taller de accesibilidad del celular.
- [x] `docs/CONTENIDO.md` explica cómo agregar taller y video.

## Fase 5 — Simuladores 2 a 5
Criterios:
- [ ] Citas médicas, transporte, compras (con pago contra entrega) y estafas (decisiones "Es seguro"/"Es una estafa" con explicación de señales).
- [ ] Sin duplicar código; nuevos componentes reutilizables si hacen falta.

## Fase 6 — Simuladores 6 a 8
Criterios:
- [ ] WhatsApp (Chat Ejemplo), configuración del celular (Ajustes) y seguridad digital (decisiones + mini repaso).

## Fase 7 — Modo sencillo, Pasaporte, Ayuda y Perfil final
Criterios:
- [ ] Pantalla 7 con interruptor, letra, íconos, menos opciones, lenguaje sencillo (`simple`), alto contraste, velocidad de voz y vista previa en vivo.
- [ ] Pantalla 8: Inicio con 4 botones enormes y barra mínima.
- [ ] Pantalla 9: Pasaporte (regla 50/50 en un archivo de configuración), estados con sello, siguiente reto, certificado imprimible.
- [ ] Pantalla 10: ayuda humana "Próximamente", `HUMAN_HELP_ENABLED = false`, lugar para `wa.me`, preguntas frecuentes, guía de instalación Android/iPhone.
- [ ] Verificado en modo sencillo con letra Muy grande.

## Fase 8 — Pulido y entrega
Criterios:
- [ ] Trabajo sin conexión verificado.
- [ ] Lighthouse móvil: Accesibilidad ≥ 95, Rendimiento ≥ 85 (o explicación).
- [ ] Accesibilidad: teclado, foco, lector de pantalla básico, zoom 200 %.
- [ ] Prueba de humo con Playwright.
- [ ] Docs completas y guía de publicación gratuita paso a paso.
- [ ] Confirmación escrita: sin llamadas externas ni dependencias de pago.
