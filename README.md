# Vínculo

**Aprende, practica y hazlo tú.**

Vínculo es una app para que personas mayores en Colombia aprendan y practiquen trámites digitales (bancos, citas médicas, transporte, compras, WhatsApp y seguridad) **sin riesgo**: todo es de práctica y nada es real.

- **Gratis** para construir, publicar y usar. No usa servicios de pago ni claves de API.
- **Sin cuentas.** Lo poco que guarda (nombre, ajustes y avances) se queda en el celular.
- **Sin inteligencia artificial externa y sin rastreo.** No se conecta a ningún servicio (ver "Privacidad").
- **Se instala** en la pantalla de inicio del celular y **funciona sin internet** después de abrirla una vez.

> Proyecto universitario de estudiantes de comunicación. Versión de prueba.

---

## Qué tiene

| Parte | Qué hace |
|---|---|
| **Simular y practicar** | 8 prácticas paso a paso en apps ficticias (Banco Ejemplo, EPS Salud Ejemplo, Transporte Ejemplo, Tienda Ejemplo, Chat Ejemplo y Ajustes), con pistas y ayuda si se equivoca. |
| **Copiloto** | Entiende lo que la persona dice o escribe ("quiero mandar plata") y la guía paso a paso para hacerlo en la vida real. Funciona con micrófono o con botones. |
| **Tutoriales y talleres** | 8 talleres de tarjetas cortas, que se pueden escuchar, con un mini repaso. |
| **Modo sencillo** | Letra y botones más grandes, alto contraste, menos opciones y textos más cortos. |
| **Mis avances** | Pasaporte Digital con las 8 habilidades y un certificado al completarlas. |
| **Ayuda** | Preguntas frecuentes y cómo instalar la app. (La ayuda de una persona dice "Próximamente".) |

Todas las fases del plan están terminadas. Ver [`docs/PLAN.md`](docs/PLAN.md).

---

## Ver la app en su computador (paso a paso)

### 1. Instalar lo necesario (solo la primera vez)

1. Entre a **https://nodejs.org** y descargue la versión que dice **LTS**.
2. Ábrala e instale con las opciones que trae (siguiente, siguiente, finalizar).
3. Abra la **Terminal** (en Mac: busque "Terminal"; en Windows: busque "PowerShell") y escriba:

   ```
   node -v
   ```

   Si aparece un número como `v22.x.x`, quedó bien.

### 2. Descargar el proyecto

En GitHub: botón verde **Code** → **Download ZIP**, y descomprímalo.

### 3. Abrir la carpeta en la Terminal

Escriba `cd ` (con un espacio al final), **arrastre la carpeta del proyecto** a la ventana de la Terminal y presione Enter.

### 4. Instalar las piezas del proyecto (solo la primera vez)

```
npm install
```

### 5. Abrir la app

```
npm run dev
```

Abra en el navegador la dirección que dice **Local** (por ejemplo `http://localhost:5173/`). En el computador la verá dentro de un marco de teléfono. Para cerrarla: `Ctrl + C` en la Terminal.

### 6. Verla en su celular (misma red wifi)

Con `npm run dev` funcionando, abra en el celular la dirección que dice **Network** (por ejemplo `http://192.168.1.20:5173/`). El celular y el computador deben estar en el mismo wifi.

> **Ojo:** de esta forma el **micrófono no funciona** y la app no se puede instalar, porque los navegadores solo lo permiten en páginas con `https` (el candadito). Para probar eso, publíquela (abajo).

### Trucos

- Ver la app **sin el marco de teléfono** en el computador: agregue `?frame=0` antes del `#`, así: `http://localhost:5173/?frame=0#/`
- **Empezar de cero:** Perfil → "Borrar mis datos".

---

## Publicarla gratis

La app es un sitio web "estático": no necesita servidor propio ni pagar nada.

### Opción A — GitHub Pages (recomendada: se actualiza sola)

El proyecto ya trae todo listo (archivo `.github/workflows/publicar.yml`). Solo hay que activarlo **una vez**:

1. Entre al repositorio en **github.com**.
2. Toque **Settings** (Configuración), arriba a la derecha.
3. En el menú de la izquierda, toque **Pages**.
4. En **Source** (Fuente), elija **GitHub Actions**.
5. Asegúrese de que los cambios estén en la rama **main**. Si están en otra rama, abra un *pull request* y únalo a main.
6. Espere 2 o 3 minutos. En la pestaña **Actions** verá "Publicar en GitHub Pages" con un chulito verde.
7. Su enlace queda así: `https://SU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/` (también aparece en Settings → Pages).

Desde entonces, **cada cambio que se una a main se publica solo**. Antes de publicar, el proceso corre las pruebas: si algo falla, no publica.

> Si el repositorio es privado, GitHub Pages gratis puede no estar disponible según el tipo de cuenta. En ese caso use la opción B.

### Opción B — Netlify (arrastrar y soltar)

1. En la Terminal, dentro de la carpeta del proyecto, escriba:

   ```
   npm run build
   ```

   Eso crea la carpeta **`dist`**: es la app completa.
2. Cree una cuenta gratis en **https://www.netlify.com** (no pide tarjeta).
3. Entre a **https://app.netlify.com/drop** y **arrastre la carpeta `dist`** a la página.
4. En segundos le da un enlace `https://….netlify.app` que se abre en cualquier celular.

Para actualizarla, repita los pasos 1 y 3.

### Después de publicar

- Abra el enlace en el celular y pruebe el micrófono (Copiloto → "Toque para hablar").
- Instálela: en Android, menú ⋮ → "Instalar aplicación"; en iPhone, botón compartir → "Agregar a inicio". La guía también está dentro de la app, en **Ayuda**.

---

## Privacidad (confirmación)

Revisado en la Fase 8 (ver [`docs/DECISIONES.md`](docs/DECISIONES.md)):

- **No hay llamadas a servicios externos.** El código no usa `fetch` ni envía datos a ningún servidor. Una prueba automática abre la app y confirma que **no sale ningún pedido a internet**.
- **No hay analítica, cookies de terceros, fuentes ni imágenes remotas.** Todo viene dentro de la app.
- **No hay inteligencia artificial externa.** El copiloto entiende con un motor propio que funciona dentro del celular.
- **No hay dependencias de pago.** Todas las librerías son libres y gratuitas ([`docs/DEPENDENCIAS.md`](docs/DEPENDENCIAS.md)).
- **Las dos únicas excepciones, ambas avisadas en la app:**
  1. **Hablarle con el micrófono:** el navegador puede enviar la voz a su proveedor (Google en Chrome) para entenderla. Antes del primer uso aparece un aviso, y siempre se puede usar con botones.
  2. **Videos de los talleres:** si el equipo agrega un video, se carga desde YouTube (modo de privacidad ampliada) **solo si la persona toca "Ver el video aquí"**. Hoy no hay ningún video.
- La ayuda humana (WhatsApp) está **apagada**. Si se activa, abriría WhatsApp solo cuando la persona toque el botón.

---

## Para el equipo

### Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Abre la app para trabajar en ella |
| `npm run build` | Prepara la versión final en `dist` |
| `npm run preview` | Abre la versión final para probarla |
| `npm test` | Corre las pruebas automáticas (más de 340) |
| `npm run test:e2e` | Prueba de humo en un navegador real: recorridos, accesibilidad, sin conexión, teclado y zoom |
| `npm run typecheck` | Revisa que el código no tenga errores de tipos |
| `npm run lint` | Revisa el estilo del código |
| `npm run screenshots` | Toma capturas de todas las pantallas (con `npm run preview` abierto) |
| `npm run content:export` | Actualiza `docs/REVISION-CONTENIDO.md` con todos los textos para revisar |
| `npm run icons` | Vuelve a generar los íconos de la app desde el logo |

### Documentos

- [`docs/BRIEF.md`](docs/BRIEF.md): reglas y objetivos (fuente de verdad).
- [`docs/PLAN.md`](docs/PLAN.md): las 8 fases con criterios de aceptación.
- [`docs/REVISION-CONTENIDO.md`](docs/REVISION-CONTENIDO.md): **todos los textos de prácticas, guías y talleres en un solo documento, para que una persona los revise** (sin saber programar).
- [`docs/CONTENIDO.md`](docs/CONTENIDO.md): cómo cambiar textos, agregar prácticas, talleres o videos, pasar de "usted" a "tú" y activar la ayuda humana.
- [`docs/PRUEBAS.md`](docs/PRUEBAS.md): pruebas manuales, incluidas las pruebas con personas mayores.
- [`docs/DECISIONES.md`](docs/DECISIONES.md): por qué se hizo cada cosa así.
- [`docs/ASSETS.md`](docs/ASSETS.md): imágenes provisionales que se pueden reemplazar.
- [`docs/DEPENDENCIAS.md`](docs/DEPENDENCIAS.md): librerías usadas y sus licencias.

### Dónde está cada cosa

- `src/content/`: **todos los textos** de la app (prácticas en `flows/`, talleres, copiloto, ayuda…).
- `src/screens/`: las pantallas.
- `src/components/`: piezas reutilizables (marco, navegación, logo, ilustraciones…).
- `src/sim/`: el motor del simulador y las piezas de las pantallas simuladas.
- `src/copilot/`: el motor que entiende lo que la persona dice o escribe (sin internet ni IA externa).
- `src/config/progress.ts`: la regla del Pasaporte (50 % práctica + 50 % taller).
- `src/config/humanHelp.ts`: interruptor de la ayuda humana (WhatsApp).
- `src/lib/storage.ts`: lo que se guarda en el celular.
- `src/styles/`: colores, tamaños y estilos.
- `e2e/`: pruebas de punta a punta en navegador.
