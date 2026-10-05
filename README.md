# Vínculo

**Aprende, practica y hazlo tú.**

Vínculo es una app para que personas mayores en Colombia aprendan y practiquen trámites digitales (bancos, salud, transporte, compras, WhatsApp y seguridad) **sin riesgo**: todo es de práctica y nada es real.

- Es **gratis**: no usa servicios de pago ni pide claves de API.
- **No tiene cuentas**: lo poco que guarda (nombre, ajustes y avances) se queda en el celular.
- **No usa inteligencia artificial externa** ni rastrea a nadie.
- Se puede **instalar** en la pantalla de inicio del celular y funciona sin internet después de abrirla una vez.

> Proyecto universitario de estudiantes de comunicación. Versión de prueba.

---

## Estado actual

| Fase | Qué incluye | Estado |
|---|---|---|
| 1 | Base, diseño, bienvenida, menú principal, perfil | ✅ Lista |
| 2 | Simulador y transferencia bancaria | ✅ Lista |
| 3 | Copiloto de voz | ✅ Lista |
| 4 | Talleres | Pendiente |
| 5 | Simuladores: citas, transporte, compras, estafas | Pendiente |
| 6 | Simuladores: WhatsApp, celular, seguridad | Pendiente |
| 7 | Modo sencillo completo, Pasaporte, Ayuda | Pendiente |
| 8 | Pulido y publicación | Pendiente |

El plan completo está en [`docs/PLAN.md`](docs/PLAN.md) y las reglas del proyecto en [`docs/BRIEF.md`](docs/BRIEF.md).

---

## Cómo ver la app en tu computador (paso a paso)

### 1. Instalar lo necesario (solo la primera vez)

1. Entra a **https://nodejs.org** y descarga la versión que dice **LTS**.
2. Ábrela e instala con las opciones que trae (siguiente, siguiente, finalizar).
3. Para comprobar: abre la **Terminal** (en Mac: busca "Terminal"; en Windows: busca "Símbolo del sistema" o "PowerShell") y escribe:

   ```
   node -v
   ```

   Si aparece un número como `v22.x.x`, quedó bien instalado.

### 2. Descargar el proyecto

- Si lo tienes en GitHub: botón verde **Code** → **Download ZIP**, y descomprímelo.
- O si te pasaron la carpeta `vinculo`, úsala directamente.

### 3. Abrir la carpeta en la Terminal

Escribe `cd ` (con un espacio al final), **arrastra la carpeta del proyecto** a la ventana de la Terminal y presiona Enter.

### 4. Instalar las piezas del proyecto (solo la primera vez)

```
npm install
```

Tarda uno o dos minutos.

### 5. Abrir la app

```
npm run dev
```

Aparecerá algo como:

```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.20:5173/
```

Abre en tu navegador la dirección que dice **Local**. En el computador la verás dentro de un marco de teléfono.

Para cerrarla: en la Terminal presiona `Ctrl + C`.

### 6. Verla en tu celular

1. El celular y el computador deben estar conectados al **mismo wifi**.
2. Con `npm run dev` funcionando, abre en el navegador del celular la dirección que dice **Network** (por ejemplo `http://192.168.1.20:5173/`).
3. Si no abre, puede que el firewall del computador la esté bloqueando: acepta el permiso cuando el computador lo pregunte.

> Nota: la instalación en la pantalla de inicio y el trabajo sin conexión solo funcionan cuando la app está publicada (con `https`). Para probarlos, ve a "Publicarla gratis".

### Trucos

- Para ver la app **sin el marco de teléfono** en el computador, agrega `?frame=0` antes del `#` en la dirección: `http://localhost:5173/?frame=0#/`
- Para **empezar de cero**: Perfil → "Borrar mis datos".

---

## Publicarla gratis

La app es un sitio web "estático": no necesita servidor propio. Primero se prepara la versión final:

```
npm run build
```

Eso crea la carpeta **`dist`**. Esa carpeta es la app completa.

### Opción A — Netlify (la más sencilla)

1. Crea una cuenta gratis en **https://www.netlify.com** (no pide tarjeta).
2. Entra a **https://app.netlify.com/drop**.
3. Arrastra la carpeta `dist` a la página.
4. En unos segundos te da un enlace `https://…netlify.app`. Ese enlace se puede abrir en cualquier celular.

### Opción B — GitHub Pages

Se documentará paso a paso en la Fase 8.

---

## Para el equipo

| Comando | Qué hace |
|---|---|
| `npm run dev` | Abre la app para trabajar en ella |
| `npm run build` | Prepara la versión final en `dist` |
| `npm run preview` | Abre la versión final para probarla |
| `npm test` | Corre las pruebas automáticas |
| `npm run typecheck` | Revisa que el código no tenga errores de tipos |
| `npm run lint` | Revisa el estilo del código |
| `npm run icons` | Vuelve a generar los íconos de la app desde el logo |
| `npm run screenshots` | Toma capturas de todas las pantallas (con `npm run preview` abierto) |

### Documentos

- [`docs/BRIEF.md`](docs/BRIEF.md) — reglas y objetivos (fuente de verdad).
- [`docs/PLAN.md`](docs/PLAN.md) — las 8 fases con criterios de aceptación.
- [`docs/CONTENIDO.md`](docs/CONTENIDO.md) — cómo cambiar textos (y "tú" por "usted").
- [`docs/DECISIONES.md`](docs/DECISIONES.md) — por qué se hizo cada cosa así.
- [`docs/ASSETS.md`](docs/ASSETS.md) — imágenes provisionales que hay que reemplazar.
- [`docs/DEPENDENCIAS.md`](docs/DEPENDENCIAS.md) — librerías usadas y sus licencias.
- [`docs/PRUEBAS.md`](docs/PRUEBAS.md) — pruebas manuales.

### Dónde está cada cosa

- `src/content/` — **todos los textos** de la app.
- `src/screens/` — las pantallas.
- `src/components/` — piezas reutilizables (marco, navegación, logo…).
- `src/content/flows/` — las prácticas del simulador (una por archivo).
- `src/sim/` — el motor del simulador y las piezas de las pantallas simuladas.
- `src/copilot/` — el motor que entiende lo que la persona dice o escribe (sin internet ni IA externa).
- `src/config/progress.ts` — la regla del Pasaporte (50 % práctica + 50 % taller).
- `src/lib/storage.ts` — lo que se guarda en el celular.
- `src/styles/index.css` — colores, tamaños y estilos.
- `docs/referencia/` — imágenes de referencia del diseño.
