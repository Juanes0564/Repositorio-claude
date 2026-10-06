# Cómo editar el contenido

> Para **revisar** todos los textos sin abrir código, use `docs/REVISION-CONTENIDO.md` (se actualiza con `npm run content:export`).

Todos los textos que se ven en la app están en la carpeta `src/content/`. **No hace falta tocar los componentes** para cambiar una frase.

## Archivos

| Archivo | Qué contiene |
|---|---|
| `treatment.ts` | Si la app trata de "tú" o de "usted". |
| `common.ts` | Nombre, lema, botones comunes, nombres de las pestañas. |
| `welcome.ts` | Bienvenida (pantalla 1). |
| `home.ts` | Menú principal (pantalla 2). |
| `profile.ts` | Perfil, privacidad, acerca de, borrar datos. |
| `skills.ts` | Nombres de las 8 habilidades del Pasaporte. |
| `platforms.ts` | Las plataformas ficticias (nombre, color, ícono). |
| `simulator.ts` | Textos de las pantallas 3 y 4 (botones, avisos, felicitación). |
| `flows/` | Una práctica por archivo (por ejemplo `transfer-bank.ts`). |
| `copilot.ts` | Textos de la pantalla del copiloto. |
| `intents.ts` | Lo que el copiloto entiende: frases y palabras de cada intención. |
| `guides.ts` | Guías "para hacerlo en la vida real" (paso a paso). |
| `messageHelp.ts` | Ayuda "No entiendo un mensaje" (seguridad). |
| `voice.ts` | Micrófono: aviso de privacidad y mensajes de error. |
| `workshops.ts` | Los 8 talleres: tarjetas, mini repaso y video opcional. |
| `workshopsUi.ts` | Textos de la pantalla de talleres (botones, filtros, repaso). |
| `simpleMode.ts` | Pantalla del modo sencillo y los 4 botones del inicio simplificado. |
| `passport.ts` | Pasaporte digital y certificado. |
| `help.ts` | Ayuda: ayuda humana, preguntas frecuentes y cómo instalar. |

## Cambiar de "tú" a "usted"

1. Abre `src/content/treatment.ts`.
2. Cambia `export const TREATMENT: Treatment = 'tu'` por `'usted'`.
3. Guarda. Toda la app cambia.

Cuando escribas una frase nueva que hable a la persona, escríbela así:

```ts
tv('Escribe tu nombre', 'Escriba su nombre')
```

## Lenguaje sencillo

Si un texto necesita una versión más corta para el modo sencillo, escríbelo con `sv(textoNormal, textoSencillo)`:

```ts
question: sv(tv('¿Qué te gustaría hacer hoy?', '¿Qué le gustaría hacer hoy?'), tv('¿Qué quieres hacer?', '¿Qué quiere hacer?')),
```

En la pantalla, ese texto se muestra con `text(...)` (de `useCopy()`), que elige la versión según el ajuste "Lenguaje sencillo".

## Activar la ayuda humana

Ver las instrucciones al inicio de `src/config/humanHelp.ts` (cambiar `HUMAN_HELP_ENABLED` a `true` y escribir el número de WhatsApp del equipo).

## Reglas de redacción (resumen del brief)

- Frases cortas: máximo unas 12 palabras por instrucción.
- Una acción por paso. Voz activa. Sin tecnicismos.
- Si un término es inevitable ("clave dinámica", "enlace"), explícalo la primera vez.
- Refuerzo positivo sin infantilizar ("¡Muy bien!").
- Nunca números de teléfono ni enlaces reales de bancos o entidades. Di "el número que aparece en tu tarjeta".
- Textos de seguridad y estafas llevan `reviewed: false` hasta que una persona del equipo los revise.

## Cómo agregar una práctica al simulador

Prácticas actuales: `transfer-bank.ts` (Banco Ejemplo), `appointment-eps.ts` (EPS Salud Ejemplo), `ride-transport.ts` (Transporte Ejemplo), `shopping-store.ts` (Tienda Ejemplo), `scams-check.ts` (Chat Ejemplo, estafas), `chat-basics.ts` (Chat Ejemplo, mensajes), `phone-settings.ts` (Ajustes) y `security-check.ts` (Ajustes, seguridad).

Cada práctica es un archivo de datos en `src/content/flows/`. No hay que programar pantallas: el simulador arma cada pantalla con piezas que ya existen.

1. Copia `src/content/flows/transfer-bank.ts` con un nombre nuevo, por ejemplo `appointment-eps.ts`.
2. Cambia `id`, `skill` (una de las 8 habilidades), `platform` (una de `platforms.ts`), `title`, `summary` y `minutes`.
3. Escribe entre 6 y 8 pasos. Cada paso tiene:
   - `coach`: la instrucción (máximo unas 12 palabras).
   - `hint`: la pista (en modo Guiado se ve siempre; en modo Solo, al tocar Ayuda).
   - `wrong` (opcional): qué decir si toca otra cosa. Si no lo pones, dice "No pasa nada. Intentemos de nuevo."
   - `target`: lo que la persona debe hacer:
     - Tocar algo: `{ kind: 'tap', id: 'el-id-del-boton' }`
     - Escribir números: `{ kind: 'input', keypadId: 'el-id-del-teclado', expected: '1234' }`
   - `screen`: la pantalla simulada, hecha de piezas (`blocks`):

| Pieza (`type`) | Para qué sirve |
|---|---|
| `heading`, `text` | Título o texto dentro de la app ficticia |
| `notice` | Recuadro de aviso (`tone: 'warning'` para advertencias) |
| `balance` | Saldo de una cuenta |
| `tiles` | Cuadrícula de botones con ícono (apps del celular o menú de una app) |
| `list` | Lista de opciones (contactos, sedes, productos…) |
| `form` | Campos que se tocan ("¿A dónde vas?") |
| `actions` | Botones (`primary`, `secondary` o `link`) |
| `keypad` | Teclado numérico con visor (`masked` para claves, `money` para pesos, `plain`) |
| `summary` | Resumen para revisar antes de confirmar |
| `receipt` | Comprobante |
| `sms` | Mensaje de texto recibido (puede tener un enlace que se toca) |
| `chat` | Conversación con botones para escribir, enviar audio, foto… |
| `settings` | Filas de ajustes con interruptor o flecha |
| `decision` | Botones grandes para decidir ("Es seguro" / "Es una estafa"). `tone`: `safe`, `danger` o `neutral`. En preguntas tipo examen usa `neutral` en todas para no delatar la respuesta |
| `call` | Llamada entrante: quién llama y lo que dice |
| `plate` | Placa de un carro |
| `rating` | Calificar con estrellas (el objetivo se escribe `'<id>.star.5'`) |

   - `explain` (opcional): "Las señales". Aparece después de acertar. Úsalo en las decisiones para explicar por qué.
   - `success` (opcional): qué decir al acertar (por ejemplo "¡Muy bien! Es una estafa.").

4. Escribe `finish.learned` (qué aprendió) y `finish.tip` (consejo de seguridad).
5. Deja `reviewed: false` hasta que una persona del equipo revise el contenido.
6. Agrega la práctica a la lista en `src/content/flows/index.ts`.
7. Corre `npm test`. Las pruebas revisan automáticamente que cada paso tenga su botón objetivo, que haya entre 6 y 8 pasos, que las instrucciones sean cortas y que no aparezcan nombres de marcas reales.

**Ojo:** dentro de las prácticas no se escriben nombres de apps reales ("WhatsApp", nombres de bancos…). Una prueba lo revisa.

**Reglas del simulador:** solo nombres ficticios ("Banco Ejemplo"…); claves y códigos siempre de práctica y dichos en voz alta en la instrucción ("escribe 1234"); nombres y cuentas claramente inventados ("Rosa Ejemplo", "terminada en 4321").

**Nota sobre el trato:** los textos *dentro* de la app ficticia (por ejemplo "¿Olvidaste tu clave?") imitan cómo hablan las apps reales y no cambian con `TREATMENT`. Los textos del coach y de Vínculo sí usan `tv()`.

## Enseñarle al copiloto una forma nueva de decir algo

Si en las pruebas con personas alguien dice algo que el copiloto no entiende:

1. Abre `src/content/intents.ts` y busca la intención correcta (por ejemplo `transfer`).
2. Agrega la frase completa en `phrases` (sin preocuparte por tildes ni mayúsculas), por ejemplo `'mandarle unos pesos'`.
3. O agrega una palabra clave en `keywords` con su peso (1 = poco, 4 = mucho). Si terminas la palabra con `*`, acepta cualquier final: `'consign*'` sirve para consignar, consignación, consigné.
4. Agrega la frase a la lista de pruebas en `src/copilot/intentEngine.test.ts` y corre `npm test`.

## Guías "para hacerlo en la vida real"

En `src/content/guides.ts`. Cada paso tiene `text` (la instrucción, máximo 12 palabras) y `detail` (la explicación para "No entiendo"). `practicePath` es a dónde lleva "Practicar esto en el simulador". Deben ser pasos genéricos: no nombres botones exactos de apps reales.

## Cómo cambiar o agregar un taller

Los talleres están en `src/content/workshops.ts`. Cada taller tiene:

| Campo | Qué es |
|---|---|
| `id` | Nombre corto sin espacios ni tildes (aparece en la dirección: `#/talleres/estafas`). |
| `skill` | La habilidad del Pasaporte a la que suma (una de las 8). |
| `category` | El filtro donde aparece: `banks` (Bancos), `health` (Salud), `security` (Seguridad) o `more` (Más temas). |
| `title`, `summary` | Título y una frase que lo resume. |
| `minutes`, `level` | Duración ("5 min") y nivel (`basic` = Básico, `intermediate` = Intermedio). |
| `cards` | De 4 a 6 tarjetas. Cada una con `illustration`, `title`, `body` (1 o 2 frases) y `tip` (el "Ojo", opcional). |
| `quiz` | "Mini repaso" opcional: 3 preguntas con `options`, `answer` (posición de la correcta, empezando en 0) y `explanation`. |
| `videoUrl` | Video opcional (ver abajo). |
| `reviewed` | `false` hasta que una persona del equipo lo revise. |

Ilustraciones disponibles para `illustration`: `bank`, `phone`, `check`, `code`, `receipt`, `calendar`, `clinic`, `car`, `plate`, `map`, `cart`, `shop`, `warning`, `lock`, `shield`, `update`, `chat`, `mic`, `photo`, `video`, `group`, `settings`, `text`, `sun`, `volume`, `wifi`, `plane`, `hurry`, `link`, `gift`, `family`, `hangup`. (Están en `src/components/Illustration.tsx`.)

Para agregar un taller nuevo, copia uno existente dentro de la lista, cámbialo y corre `npm test`: las pruebas revisan que tenga entre 4 y 6 tarjetas, frases cortas y un mini repaso válido.

## Cómo agregar un video de YouTube a un taller

1. Sube el video a YouTube (puede ser "No listado").
2. En YouTube toca **Compartir** y copia el enlace (por ejemplo `https://youtu.be/AbCdEfGhIjK`).
3. En `src/content/workshops.ts`, dentro del taller, agrega una línea:

   ```ts
   videoUrl: 'https://youtu.be/AbCdEfGhIjK',
   ```

4. Corre `npm test` (revisa que el enlace sea de YouTube y válido) y `npm run build`.

Cómo se ve: al inicio del taller aparece "Ver el video aquí". El video **solo se carga si la persona toca ese botón**, y siempre con el modo de privacidad ampliada de YouTube (`youtube-nocookie.com`). También hay un enlace "Abrir el video en YouTube". Si el taller no tiene `videoUrl`, solo se ven las tarjetas y no se conecta nada con YouTube.

Nota: el video necesita internet; las tarjetas funcionan sin conexión.
