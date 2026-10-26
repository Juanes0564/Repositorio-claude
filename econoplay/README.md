# Econoplay

Aplicación educativa e interactiva sobre la **escuela neoclásica** y la **escuela austriaca**. Es la pieza comunicativa del trabajo de Historia del Pensamiento Económico II (UNAB).

Todo el contenido sale de la *Ficha de investigación y registro de fuentes* del equipo, que se basa en Ekelund y Hébert (1992).

## Qué trae

- **4 módulos y 8 niveles.** Cada nivel tiene de 3 a 4 tarjetas cortas y 8 preguntas. Los tipos son selección múltiple, verdadero o falso, relacionar, completar y contrarreloj.
- **7 cromos de autores**, que se desbloquean respondiendo bien en el nivel 6.
- **Simulador de decisiones** sobre la desigualdad en Colombia, con la mirada neoclásica, la austriaca y la marxista.
- **Reto final.** Al terminar muestra qué conceptos dominas y cuáles repasar, y cierra con la idea central de la ficha.
- **Modo competencia** por equipos en un mismo dispositivo, pensado para proyectar en clase.
- **Recompensas:** puntos, monedas (sirven para pedir pistas), insignias y barra de progreso.
- **Guardado:** el progreso queda en el navegador. No usa servidor ni base de datos.

## Cómo corregir el texto

Todo el contenido está en un solo archivo: **`src/data/contenido.json`**. Allí están las lecciones, las preguntas, las respuestas, las explicaciones, las fuentes, los cromos, el simulador y el reto.

- Cambia solo el texto que va entre comillas.
- Por ejemplo, en una pregunta `"correcta": 0` significa que la opción correcta es la primera de la lista.
- Después de editar, ejecuta `npm test`. Las pruebas avisan si falta una fuente, si una pregunta quedó mal armada o si se cita una página que no está en la ficha.

## Cómo ejecutarla en tu computador

Necesitas tener instalado [Node.js](https://nodejs.org) (versión 20 o más reciente). Luego, dentro de la carpeta `econoplay`:

```bash
npm install      # solo la primera vez
npm run dev      # abre la app en http://localhost:5173
```

Otros comandos útiles:

```bash
npm test         # revisa el contenido y la lógica del juego
npm run build    # crea la versión para publicar en la carpeta dist
```

## Cómo publicarla con un link (gratis)

### Versión publicada

Ya está publicada en **https://claude.ai/artifact/37wAd6bfknLNnhgsbfEVvU**. Para que otras personas la abran, compártela desde el menú *Compartir* de esa página.

### Un solo archivo

Ejecuta `npm run build:single`. Esto crea `dist-single/econoplay.html`, un único archivo con todo incluido. Puedes abrirlo con doble clic en cualquier computador, sin internet, o subirlo a cualquier hosting.

### Opción A — Netlify Drop (la más rápida, unos 5 minutos)

1. Ejecuta `npm run build`. Se crea la carpeta `econoplay/dist`.
2. Entra a **https://app.netlify.com/drop**. Puedes crear una cuenta gratis sin tarjeta.
3. Arrastra la carpeta **`dist`** a la página.
4. En segundos te da un link como `https://nombre-al-azar.netlify.app`. En *Site settings* puedes cambiarle el nombre, por ejemplo `econoplay-unab`.
5. Comparte ese link en clase. Funciona en celulares y computadores.

Para publicar una versión corregida, repite los pasos 1 y 3 en la sección *Deploys* del mismo sitio.

### Opción B — Vercel o GitHub Pages

La carpeta `dist` funciona en cualquier hosting estático, porque la app usa rutas relativas y rutas con `#`. Basta con subir el contenido de `dist`.

## Para la exposición

- Por ahora **todos los niveles están abiertos** para todos. Para volver a abrirlos uno por uno, cambia `ALL_LEVELS_OPEN` a `false` en `src/lib/progress.ts`. Así aparece de nuevo el **Modo presentador** en Progreso → Opciones.
- En **Competir**, elige de 2 a 6 equipos y el número de rondas.
- En cada turno, un equipo responde en 20 segundos. Gana 500 puntos por acertar y hasta 500 más por rapidez.

## Tecnología

Está hecha con React, Vite y TypeScript, con íconos `lucide-react` y la fuente Nunito (`@fontsource`). Todo es software libre (licencias MIT y OFL) y funciona sin conexión a servicios externos.
