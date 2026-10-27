import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { QuestionCard } from '../src/components/QuestionCard';
import { levels } from '../src/data';
import { prepareQuestion } from '../src/lib/quiz';

afterEach(cleanup);

describe('QuestionCard', () => {
  it('muestra correcto, la explicación y la fuente', () => {
    const q = levels[0].preguntas.find((x) => x.id === 'n1-p2')!;
    const onAnswered = vi.fn();
    render(<QuestionCard prepared={prepareQuestion(q)} onAnswered={onAnswered} onContinue={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Verdadero/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Comprobar' }));
    expect(onAnswered).toHaveBeenCalledWith(true, undefined);
    expect(screen.getByText('¡Correcto!')).toBeTruthy();
    expect(screen.getByText(q.explicacion)).toBeTruthy();
    expect(screen.getByText(`Fuente: ${q.fuente}`)).toBeTruthy();
  });

  it('en contrarreloj, al acabarse el tiempo cuenta como incorrecta', () => {
    vi.useFakeTimers();
    const q = levels[0].preguntas.find((x) => x.id === 'n1-p8')!;
    const onAnswered = vi.fn();
    render(<QuestionCard prepared={prepareQuestion(q)} timeLimit={2} onAnswered={onAnswered} onContinue={() => {}} />);
    vi.advanceTimersByTime(2500);
    vi.useRealTimers();
    expect(onAnswered).toHaveBeenCalledWith(false, 0);
  });
});
