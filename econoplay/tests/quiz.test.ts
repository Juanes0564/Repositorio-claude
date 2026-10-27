import { describe, expect, it } from 'vitest';
import { levels } from '../src/data';
import { correctAnswerText, isMatchCorrect, prepareQuestion } from '../src/lib/quiz';

const all = levels.flatMap((l) => l.preguntas);

describe('preparar preguntas', () => {
  it('siempre hay exactamente una opción correcta', () => {
    for (const q of all) {
      const p = prepareQuestion(q);
      if (p.kind === 'choice') expect(p.choices.filter((c) => c.correct)).toHaveLength(1);
    }
  });

  it('la opción correcta sigue siendo la del archivo tras mezclar', () => {
    const q = all.find((x) => x.tipo === 'seleccion')!;
    if (q.tipo !== 'seleccion') throw new Error();
    for (let i = 0; i < 20; i++) {
      expect(correctAnswerText(prepareQuestion(q))).toBe(q.opciones[q.correcta]);
    }
  });

  it('verdadero o falso respeta la respuesta', () => {
    const q = all.find((x) => x.tipo === 'vf' && !x.respuesta)!;
    expect(correctAnswerText(prepareQuestion(q))).toBe('Falso');
  });

  it('distingue emparejar de clasificar y valida las parejas', () => {
    const match = all.find((x) => x.id === 'n6-p8')!;
    const classify = all.find((x) => x.id === 'n2-p4')!;
    const pm = prepareQuestion(match);
    const pc = prepareQuestion(classify);
    if (pm.kind !== 'match' || pc.kind !== 'match') throw new Error();
    expect(pm.oneToOne).toBe(true);
    expect(pc.oneToOne).toBe(false);
    expect(pc.options).toEqual(['Neoclásica', 'Austriaca']);
    expect(isMatchCorrect(pm.answers, pm.answers)).toBe(true);
    expect(isMatchCorrect(pm.answers, [...pm.answers].reverse())).toBe(false);
  });
});
