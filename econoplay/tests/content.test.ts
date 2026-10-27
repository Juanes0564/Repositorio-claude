import { describe, expect, it } from 'vitest';
import { content, levels } from '../src/data';
import type { Question } from '../src/data/types';

const questions: Question[] = levels.flatMap((l) => l.preguntas);

// Páginas que la ficha cita de Ekelund y Hébert (1992). Ninguna cita puede salirse de aquí.
const PAGES_IN_DOCUMENT = new Set([
  381, 410, 457, 570, 582, 594, 597, 598, 600, 601, 602, 604, 605, 607, 608, 609, 611, 612, 613, 614,
]);

function allSources(): string[] {
  return [
    ...levels.flatMap((l) => l.tarjetas.map((t) => t.fuente)),
    ...questions.map((q) => q.fuente),
    ...content.cromos.map((c) => c.fuente),
    ...content.simulador.situaciones.flatMap((s) => Object.values(s.analisis).map((a) => a.fuente)),
    content.simulador.controversia.fuente,
    content.simulador.cierre.fuente,
    content.retoFinal.cierre.fuente,
  ];
}

describe('contenido', () => {
  it('tiene 8 niveles en 4 módulos', () => {
    expect(content.modulos).toHaveLength(4);
    expect(levels).toHaveLength(8);
    expect(levels.map((l) => l.numero)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it.each(levels.map((l) => [l.id, l] as const))('%s: máximo 4 tarjetas y mínimo 6 preguntas', (_, level) => {
    expect(level.tarjetas.length).toBeGreaterThan(0);
    expect(level.tarjetas.length).toBeLessThanOrEqual(4);
    expect(level.preguntas.length).toBeGreaterThanOrEqual(6);
  });

  it('cada nivel tiene al menos una pregunta contrarreloj y varios tipos', () => {
    for (const l of levels) {
      expect(l.preguntas.some((q) => q.contrarreloj)).toBe(true);
      expect(new Set(l.preguntas.map((q) => q.tipo)).size).toBeGreaterThanOrEqual(3);
    }
  });

  it('los ids de preguntas no se repiten', () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(questions.map((q) => [q.id, q] as const))('%s está bien formada', (_, q) => {
    expect(q.explicacion.trim()).not.toBe('');
    expect(q.fuente.trim()).not.toBe('');
    expect(q.concepto.trim()).not.toBe('');
    if (q.tipo === 'seleccion' || q.tipo === 'completar') {
      expect(q.opciones.length).toBeGreaterThanOrEqual(3);
      expect(new Set(q.opciones).size).toBe(q.opciones.length);
      expect(q.correcta).toBeGreaterThanOrEqual(0);
      expect(q.correcta).toBeLessThan(q.opciones.length);
    }
    if (q.tipo === 'completar') {
      expect(q.frase.split('___')).toHaveLength(2);
    }
    if (q.tipo === 'relacionar') {
      expect(q.pares.length).toBeGreaterThanOrEqual(3);
      expect(new Set(q.pares.map((p) => p.izquierda)).size).toBe(q.pares.length);
    }
  });

  it('toda fuente cita la ficha o a Ekelund y Hébert (1992)', () => {
    for (const s of allSources()) {
      expect(s).toMatch(/Ekelund y Hébert \(1992|Ficha del equipo/);
    }
  });

  it('solo cita páginas que aparecen en la ficha', () => {
    for (const s of allSources()) {
      const cites = s.match(/Ekelund y Hébert \(1992, ([^)]*)\)/g) ?? [];
      for (const cite of cites) {
        const pages = cite.match(/\d+/g)!.map(Number).filter((n) => n !== 1992);
        for (const page of pages) expect(PAGES_IN_DOCUMENT.has(page), `${page} en «${s}»`).toBe(true);
      }
    }
  });

  it('cada cromo se puede desbloquear y cada desbloqueo existe', () => {
    const ids = new Set(content.cromos.map((c) => c.id));
    const unlockable = new Set(questions.flatMap((q) => q.desbloquea ?? []));
    for (const id of unlockable) expect(ids.has(id)).toBe(true);
    for (const id of ids) expect(unlockable.has(id)).toBe(true);
  });

  it('el simulador presenta las tres escuelas en cada situación', () => {
    for (const s of content.simulador.situaciones) {
      expect(s.opciones.map((o) => o.escuela).sort()).toEqual(['austriaca', 'marxista', 'neoclasica']);
      for (const a of Object.values(s.analisis)) {
        expect(a.texto.trim()).not.toBe('');
      }
    }
  });
});
