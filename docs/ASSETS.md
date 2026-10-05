# Imágenes y recursos gráficos

Todo lo gráfico es **provisional y original**, hecho como SVG simple. Ninguna imagen se descarga de internet.
Esta lista dice qué debe reemplazar el equipo cuando tenga las versiones finales.

| Recurso | Dónde está | Estado | Qué hacer |
|---|---|---|---|
| Logo (dos formas redondeadas verde y amarilla en "V") | `src/components/Logo.tsx` | Provisional | Reemplazar el SVG por el logo final (mantener `viewBox` cuadrado). |
| Ícono del navegador | `public/favicon.svg` | Provisional | Mismo logo sobre fondo crema. |
| Íconos de la app instalada | `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png`, `public/apple-touch-icon.png` | Provisional | Se generan con `npm run icons` desde el logo en `scripts/make-icons.mjs`. Si cambia el logo, actualizar ese archivo y volver a correr el comando. |
| Ilustración de bienvenida (celular con marca de "bien hecho") | `src/components/WelcomeIllustration.tsx` | Provisional | Reemplazar por ilustración final (SVG preferido, liviano). |
| Marcas de las plataformas ficticias | `src/components/PlatformMark.tsx` + colores en `src/content/platforms.ts` | Provisional | Cuadro de color con ícono genérico. Se pueden reemplazar por logos ficticios dibujados por el equipo (nunca parecidos a marcas reales). |
| Avatar del copiloto (cara amable con audífonos) | `src/components/CopilotAvatar.tsx` | Provisional | Reemplazar por el personaje final (SVG). |
| Íconos de la interfaz | Librería `lucide-react` | Definitivo | No requiere cambio. |
| Tipografía Atkinson Hyperlegible | `@fontsource/atkinson-hyperlegible` | Definitivo | Licencia OFL. |

Reglas para cualquier imagen nueva:
- Sin logos, colores ni nombres de bancos, EPS o apps reales.
- Sin emojis como íconos.
- Guardarla dentro del proyecto (nunca enlazarla desde internet).
- Si tiene texto, que ese texto también esté en `src/content/`.
