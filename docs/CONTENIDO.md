# Cómo editar el contenido

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
| `screens.ts` | Títulos de secciones. |

## Cambiar de "tú" a "usted"

1. Abre `src/content/treatment.ts`.
2. Cambia `export const TREATMENT: Treatment = 'tu'` por `'usted'`.
3. Guarda. Toda la app cambia.

Cuando escribas una frase nueva que hable a la persona, escríbela así:

```ts
tv('Escribe tu nombre', 'Escriba su nombre')
```

## Lenguaje sencillo

Si un texto necesita una versión más corta para el modo sencillo, escríbelo así:

```ts
{ text: 'Revisa el nombre y el valor antes de confirmar.', simple: 'Revisa nombre y valor.' }
```

## Reglas de redacción (resumen del brief)

- Frases cortas: máximo unas 12 palabras por instrucción.
- Una acción por paso. Voz activa. Sin tecnicismos.
- Si un término es inevitable ("clave dinámica", "enlace"), explícalo la primera vez.
- Refuerzo positivo sin infantilizar ("¡Muy bien!").
- Nunca números de teléfono ni enlaces reales de bancos o entidades. Di "el número que aparece en tu tarjeta".
- Textos de seguridad y estafas llevan `reviewed: false` hasta que una persona del equipo los revise.

## Próximamente en este documento

- Cómo agregar un simulador (Fase 2).
- Cómo agregar un taller y un video de YouTube (Fase 4).
