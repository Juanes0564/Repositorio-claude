# Dependencias y licencias

Todas son de código abierto y gratuitas. Ninguna pide claves, cuentas ni pagos.
Se instalan con `npm install` y quedan **empaquetadas dentro de la app**: la app publicada no descarga nada de internet.

## Las que viajan dentro de la app (producción)

| Paquete | Versión | Licencia | Para qué sirve |
|---|---|---|---|
| react | 19.3 | MIT | Construir la interfaz |
| react-dom | 19.3 | MIT | Mostrar la interfaz en el navegador |
| react-router-dom | 7.18 | MIT | Pasar de una pantalla a otra (HashRouter) |
| lucide-react | 1.52 | ISC | Íconos (se empaquetan; no se descargan) |
| @fontsource/atkinson-hyperlegible | 5.3 | OFL-1.1 | Tipografía legible, autoalojada |
| workbox-window (vía vite-plugin-pwa) | 7.4 | MIT | Funcionar sin conexión |

## Las que solo se usan para construir y probar (desarrollo)

| Paquete | Versión | Licencia | Para qué sirve |
|---|---|---|---|
| vite | 8.3 | MIT | Servidor de desarrollo y empaquetado |
| @vitejs/plugin-react | 6.1 | MIT | Soporte de React en Vite |
| vite-plugin-pwa | 2.0 | MIT | Manifiesto e instalación como app (PWA) |
| typescript | 6.0 | Apache-2.0 | Verificación de tipos |
| vitest | 5.0 | MIT | Pruebas automáticas |
| jsdom | 29.1 | MIT | Navegador simulado para las pruebas |
| @testing-library/react, @testing-library/dom | 16.3 / 10.4 | MIT | Pruebas de pantallas |
| eslint, @eslint/js, typescript-eslint, eslint-plugin-react-hooks, globals | 10.12 / 10.0 / 8.71 / 7.1 / 17.13 | MIT | Revisión de estilo del código (lint) |
| @types/node, @types/react, @types/react-dom | — | MIT | Tipos para TypeScript |
| @playwright/test | 1.56 | Apache-2.0 | Capturas de pantalla, íconos y pruebas de humo |
| @axe-core/playwright, axe-core | 4.13 | MPL-2.0 | Revisión automática de accesibilidad en las pruebas de humo |

## Resumen de licencias (revisado en la Fase 8)

- **Lo que viaja dentro de la app:** 12 paquetes, todos libres: MIT (9), ISC (1, `lucide-react`), OFL-1.1 (1, la tipografía). El paquete "UNLICENSED" es Vínculo mismo (proyecto privado).
- **Todo lo que se usa para construir y probar** (unos 500 paquetes contando los internos): MIT, Apache-2.0, ISC, BSD, BlueOak, MPL-2.0, CC0 y CC-BY. Todas son licencias libres y gratuitas.
- **Ninguna dependencia es de pago**, pide clave de API ni requiere cuenta o tarjeta.

Para revisarlo de nuevo: `npx license-checker-rseidelsohn --summary` (todo) o agregando `--production` (solo lo que viaja en la app).

Nota: no se usó Fuse.js; el copiloto usa un motor de coincidencia propio, sin dependencias.

Nota: TypeScript se fijó en la serie 6.0 porque `typescript-eslint` todavía no es compatible con TypeScript 7.
