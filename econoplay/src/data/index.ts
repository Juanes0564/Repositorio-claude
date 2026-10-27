import raw from './contenido.json';
import type { Content, Level, Module, Question, SchoolId } from './types';

export const content = raw as Content;

export const modules: Module[] = content.modulos;

export const levels: Level[] = modules.flatMap((m) => m.niveles);

export function findLevel(id: string): { level: Level; module: Module; index: number } | undefined {
  const index = levels.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  const level = levels[index];
  const module = modules.find((m) => m.niveles.includes(level))!;
  return { level, module, index };
}

export function schoolName(id: SchoolId, short = false): string {
  const s = content.escuelas[id];
  return short ? s.corto : s.nombre;
}

/** Texto principal de una pregunta, sea cual sea su tipo. */
export function questionPrompt(q: Question): string {
  switch (q.tipo) {
    case 'seleccion':
    case 'relacionar':
      return q.enunciado;
    case 'completar':
      return q.frase;
    case 'vf':
      return q.afirmacion;
  }
}

/** Nivel al que pertenece cada pregunta (para el reto final y el repaso). */
export const levelOfQuestion: Record<string, string> = Object.fromEntries(
  levels.flatMap((l) => l.preguntas.map((q) => [q.id, l.id])),
);
