import React from 'react';
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { GENETICS_QUESTIONS, SECTIONS } from '../data/geneticsQuestions';
import { QuestionAttempt } from './QuizStage';

interface SectionsOverviewProps {
  attempts: Record<number, QuestionAttempt>;
  repeatQueue: number[];
  onStartSection: (sectionId: 1 | 2 | 3 | 4) => void;
}

export const SectionsOverview: React.FC<SectionsOverviewProps> = ({
  attempts,
  repeatQueue,
  onStartSection,
}) => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          GENETICS (1).pptx — Lecture Sections
        </h2>
        <p className="mt-1 font-arabic text-sm text-slate-600" dir="rtl">
          مراجعة شاملة لأقسام المحاضرة الأربعة (40 سؤالاً) مع متابعة نسبة الإتقان وعدد الأخطاء في كل قسم.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SECTIONS.map((sec) => {
          const sectionQuestions = GENETICS_QUESTIONS.filter((q) => q.section === sec.id);
          const answered = sectionQuestions.filter((q) => Boolean(attempts[q.id])).length;
          const correct = sectionQuestions.filter((q) => attempts[q.id]?.isCorrect).length;
          const queued = sectionQuestions.filter((q) => repeatQueue.includes(q.id)).length;
          const pct = Math.round((correct / sectionQuestions.length) * 100);

          return (
            <article
              key={sec.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-mono-tabular font-semibold text-sky-700">
                    Section 0{sec.id}
                  </span>
                  <span className="font-mono-tabular">{sec.range} · 10 Questions</span>
                </div>

                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {sec.title}
                </h3>
                <p className="mt-1 font-arabic text-sm font-medium text-slate-800" dir="rtl">
                  {sec.titleAr}
                </p>
                <p className="mt-2 font-arabic text-xs leading-relaxed text-slate-600" dir="rtl">
                  {sec.summaryAr}
                </p>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    <span className="font-mono-tabular font-semibold text-slate-900">
                      {correct}/{sectionQuestions.length}
                    </span>
                    <span>mastered ({pct}%)</span>
                  </span>

                  {queued > 0 ? (
                    <span className="inline-flex items-center gap-1 font-arabic font-medium text-amber-700">
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{queued} للتكرار</span>
                    </span>
                  ) : (
                    <span className="font-mono-tabular text-slate-400">
                      {answered}/10 attempted
                    </span>
                  )}
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 mb-4">
                  <div
                    className="h-full bg-sky-600 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onStartSection(sec.id)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Practice Section {sec.id}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
