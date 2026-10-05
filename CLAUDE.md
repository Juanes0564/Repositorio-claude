# Vínculo — Reglas operativas (resumen)

Fuente de verdad: `docs/BRIEF.md`. Plan: `docs/PLAN.md`. Si hay duda, relee el brief; si el brief y la imagen de referencia chocan, gana el brief.

## Reglas innegociables (§2)
- 100 % gratis: sin APIs de pago, claves de API, pruebas que expiran ni tarjetas. Solo dependencias libres (MIT/Apache/OFL…), anotadas en `docs/DEPENDENCIAS.md`.
- Sin IA externa: nada llama a Anthropic/OpenAI/Google AI. Funciona sin Claude.
- Sin backend, cuentas ni nube. Todo en el dispositivo (clave `vinculo.v1` en localStorage).
- Sin rastreo ni recursos remotos (CDN, fuentes, imágenes). Únicas excepciones: reconocimiento de voz del navegador (con aviso previo y alternativa sin voz) y videos `youtube-nocookie.com` solo si hay `videoUrl`.
- Plataformas ficticias (Banco Ejemplo, Billetera Ejemplo, EPS Salud Ejemplo, Transporte Ejemplo, Domicilios Ejemplo, Tienda Ejemplo, Chat Ejemplo, Ajustes). Nunca logos, nombres ni colores de marcas reales.
- Toda pantalla de práctica lleva la cinta "PRÁCTICA – no es real"; claves/códigos de práctica indicados ("escribe 1234"). Nunca pedir datos reales.
- Honestidad: sin indicadores falsos ("en línea"). Ayuda humana = "Próximamente", `HUMAN_HELP_ENABLED = false`.
- Contenido de seguridad/estafas lleva `reviewed: false`. Sin teléfonos ni enlaces reales: "el número que aparece en tu tarjeta".

## Técnica (§3)
- PWA estática: React + Vite + TypeScript, `vite-plugin-pwa`, HashRouter, CSS propio con variables, `lucide-react`, Atkinson Hyperlegible vía `@fontsource`, Vitest.
- Todo texto visible en `src/content/` (nunca en componentes). Interfaz en español de Colombia; código y archivos en inglés.
- Tamaños en `rem` para que la escala de letra afecte todo.
- Marco de teléfono (~390×844) en pantallas ≥ 768 px; `?frame=0` lo apaga.
- Logo e ilustraciones: SVG originales; lista de reemplazos en `docs/ASSETS.md`. Sin emojis como íconos.

## Accesibilidad (§10)
- Letra base 20 px; contraste ≥ 4,5:1 (≥ 7:1 en alto contraste/modo sencillo); nunca solo color.
- Objetivos táctiles ≥ 56 px (64 px en modo sencillo).
- Sin gestos obligatorios, hover, límites de tiempo, avance automático ni carruseles.
- Una acción principal por pantalla; "Volver" visible; navegación inferior consistente; íconos con texto.
- HTML semántico, ARIA, `aria-live` en el copiloto, foco visible, `prefers-reduced-motion`.
- Errores amables; acciones "irreversibles" piden confirmación.

## Tono (§11)
- Cálido, respetuoso, trato "tú" centralizado (cambiable a "usted"). Frases ≤ 12 palabras, una acción por paso, sin tecnicismos. Refuerzo positivo sin infantilizar.

## Calidad (§12)
- Antes de cerrar fase: `npm run build`, `npm run typecheck`, `npm run lint`, `npm test` sin errores.
- Revisar capturas en 360×640 y 390×844, texto 200 % y modo sencillo.
- Meta Lighthouse móvil: Accesibilidad ≥ 95, Rendimiento ≥ 85. Funciona sin conexión.

## Forma de trabajo (§15)
- La persona no es programadora: explicar en español sencillo, sin jerga.
- No pedirle que revise código ni archivos. Revisar todo uno mismo (pruebas + capturas) y decidir con el brief. Si hace falta su opinión, mostrar capturas o preguntar en lenguaje sencillo ("¿te gusta así o así?").
- Plan de 5–8 líneas al iniciar cada fase; preguntar solo si cambia reglas del brief.
- Commit por fase: `feat(fase-N): ...`. Informe corto al terminar.
- Mantener `README.md`, `docs/DECISIONES.md`, `docs/CONTENIDO.md`, `docs/ASSETS.md`.
- No agregar funciones fuera del brief sin preguntar.
