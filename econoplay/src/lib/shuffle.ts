/** Devuelve una copia mezclada (Fisher–Yates). */
export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Toma `count` elementos al azar sin repetir. */
export function sample<T>(items: readonly T[], count: number, rng: () => number = Math.random): T[] {
  return shuffle(items, rng).slice(0, count);
}
