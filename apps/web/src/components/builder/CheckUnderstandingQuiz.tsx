import { useState } from 'react';
import { CheckCircle, XCircle, ArrowClockwise, Target } from '@phosphor-icons/react';

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

interface CheckUnderstandingQuizProps {
  questions: QuizQuestion[];
  onPassed: () => void;
  isCompleted?: boolean;
}

export function CheckUnderstandingQuiz({ questions, onPassed, isCompleted = false }: CheckUnderstandingQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(() => {
    if (isCompleted && questions.length > 0) {
      const initial: Record<number, number> = {};
      questions.forEach((q, i) => {
        initial[i] = q.answerIndex;
      });
      return initial;
    }
    return {};
  });
  const [isSubmitted, setIsSubmitted] = useState(isCompleted);

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const allAnswered = questions.length > 0 && questions.every((_, i) => selectedAnswers[i] !== undefined);
  const correctCount = questions.filter((q, i) => selectedAnswers[i] === q.answerIndex).length;
  const isPerfect = questions.length > 0 && correctCount === questions.length;

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (isPerfect) {
      onPassed();
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  if (!questions || questions.length === 0) return null;

  return (
    <div data-testid="check-understanding-quiz" className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)]/50 p-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
        <div className="flex items-center gap-2">
          <Target size={15} className="text-[var(--color-accent)]" />
          <span className="font-bold text-[var(--color-text-primary)] text-sm tracking-tight">
            Check Your Understanding ({questions.length} Question{questions.length === 1 ? '' : 's'})
          </span>
        </div>
        {isSubmitted && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isPerfect ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {correctCount} / {questions.length} Correct
          </span>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const selected = selectedAnswers[qIdx];
          const isCorrect = selected === q.answerIndex;

          return (
            <div key={qIdx} className="space-y-2 rounded-lg bg-[var(--color-primary)]/40 p-3 border border-[var(--color-border)]/60">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--color-secondary)] flex items-center justify-center font-bold text-[10px] text-[var(--color-accent)] shrink-0 border border-[var(--color-border)]">
                  {qIdx + 1}
                </span>
                <p className="font-semibold text-[11px] text-[var(--color-text-primary)] leading-relaxed">
                  {q.question}
                </p>
              </div>

              <div className="space-y-1.5 pl-7">
                {q.options.map((opt, oIdx) => {
                  const isThisSelected = selected === oIdx;
                  let borderClass = 'border-[var(--color-border)]';
                  let bgClass = 'hover:bg-[var(--color-secondary)]';

                  if (isSubmitted) {
                    if (oIdx === q.answerIndex) {
                      borderClass = 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10';
                    } else if (isThisSelected && !isCorrect) {
                      borderClass = 'border-rose-500/50 text-rose-400 bg-rose-500/10';
                    }
                  } else if (isThisSelected) {
                    borderClass = 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelect(qIdx, oIdx)}
                      disabled={isSubmitted}
                      data-testid={`quiz-option-${qIdx}-${oIdx}`}
                      aria-pressed={isThisSelected}
                      aria-label={`Option ${oIdx + 1}: ${opt}`}
                      className={`w-full text-left p-2.5 min-h-[40px] rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${borderClass} ${bgClass}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && oIdx === q.answerIndex && (
                        <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                      )}
                      {isSubmitted && isThisSelected && !isCorrect && (
                        <XCircle size={14} className="text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}

                {isSubmitted && (
                  <p aria-live="polite" className="text-[10px] text-[var(--color-text-secondary)] italic pt-1 leading-normal">
                    {q.explanation}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        {isSubmitted ? (
          <button
            type="button"
            onClick={handleReset}
            aria-label={isPerfect ? 'Retake quiz for practice' : 'Try quiz again'}
            className="flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] transition-all cursor-pointer"
          >
            <ArrowClockwise size={13} />
            <span>{isPerfect ? 'Retake Quiz' : 'Try Again'}</span>
          </button>
        ) : <div />}

        {!isSubmitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            data-testid="submit-quiz-btn"
            aria-label="Check quiz answers"
            className={`px-4 py-2 min-h-[40px] rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
              allAnswered
                ? 'bg-[var(--color-accent)] hover:brightness-110 text-white cursor-pointer active:scale-95 shadow-sm'
                : 'bg-[var(--color-border)] text-[var(--color-text-secondary)]/50 cursor-not-allowed'
            }`}
          >
            <span>Check Answers</span>
          </button>
        ) : isPerfect ? (
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
            <CheckCircle size={15} />
            <span>Mastery Verified!</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
