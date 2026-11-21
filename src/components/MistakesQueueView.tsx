import React from 'react';
import { RotateCcw, CheckCircle2, Trash2, Play } from 'lucide-react';
import { GENETICS_QUESTIONS } from '../data/geneticsQuestions';
import { QuestionAttempt } from './QuizStage';

interface MistakesQueueViewProps {
  repeatQueue: number[];
  attempts: Record<number, QuestionAttempt>;
  onStartMistakesDrill: () => void;
  onPracticeSingle: (questionId: number) => void;
  onRemoveFromQueue: (questionId: number) => void;
  onResetAllProgress: () => void;
}

export const MistakesQueueView: React.FC<MistakesQueueViewProps> = ({
  repeatQueue,
  attempts,
  onStartMistakesDrill,
  onPracticeSingle,
  onRemoveFromQueue,
  onResetAllProgress,
}) => {
  const queuedQuestions = GENETICS_QUESTIONS.filter((q) => repeatQueue.includes(q.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Mistakes Repetition Queue
          </h2>
          <p className="mt-1 font-arabic text-sm text-slate-600" dir="rtl">
            كل سؤال تخطئ فيه أو تضيفه يدوياً يُحفظ هنا لتكراره حتى تتقنه تماماً.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {queuedQuestions.length > 0 && (
            <button
              type="button"
              onClick={onStartMistakesDrill}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              <span>Start Mistakes Drill ({queuedQuestions.length})</span>
            </button>
          )}
          <button
            type="button"
            onClick={onResetAllProgress}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Trash2 className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {queuedQuestions.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
          <h3 className="mt-3 text-lg font-semibold text-slate-900">
            Your Mistakes Queue is Empty
          </h3>
          <p className="mt-1 font-arabic text-sm text-slate-600" dir="rtl">
            لا توجد حالياً مسائل خاطئة بانتظار التكرار. أي خطأ أثناء الحل سيُضاف هنا تلقائياً لتتمكن من إعادته.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {queuedQuestions.map((q) => {
            const att = attempts[q.id];
            return (
              <article
                key={q.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="space-y-1 flex-1 min-w-[260px]">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono-tabular font-semibold text-slate-900">
                      Q{q.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Section {q.section}: {q.sectionTitle}</span>
                    {att && att.wrongCount > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-arabic font-semibold text-rose-700">
                          عدد الأخطاء: {att.wrongCount}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {q.question}
                  </h3>
                  <p className="font-arabic text-xs text-slate-600" dir="rtl">
                    {q.memoryTipAr}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onRemoveFromQueue(q.id)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Mark Mastered
                  </button>
                  <button
                    type="button"
                    onClick={() => onPracticeSingle(q.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Repeat Now</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
